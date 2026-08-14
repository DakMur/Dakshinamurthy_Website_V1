import { Request, Response, NextFunction } from 'express';
import { s3Client } from '../config/storage.js';
import { Upload } from '@aws-sdk/lib-storage';
import { uploadToGoogleDrive } from '../services/googleDrive.service.js';
import busboy from 'busboy';
import crypto from 'crypto';
import path from 'path';
import { Transform } from 'stream';

declare global {
  namespace Express {
    interface Request {
      fileUrl?: string;
    }
  }
}

/**
 * Creates a transform stream that enforces a maximum file size.
 * If the limit is exceeded, it emits an error.
 */
function createSizeLimitStream(maxBytes: number) {
  let size = 0;
  return new Transform({
    transform(chunk, encoding, callback) {
      size += chunk.length;
      if (size > maxBytes) {
        callback(new Error(`FILE_TOO_LARGE`));
      } else {
        callback(null, chunk);
      }
    }
  });
}

export function streamUploader(req: Request, res: Response, next: NextFunction) {
  // Global busboy limit protects against overall memory exhaustion DoS
  const bb = busboy({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB absolute max
  let isResponded = false;
  let fileProcessed = false;
  let uploadPromise: Promise<void> | null = null;

  bb.on('file', (name, file, info) => {
    fileProcessed = true;
    const { filename, mimeType } = info;
    const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.mp4', '.mov', '.mkv'];
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      file.resume();
      if (!isResponded) {
        isResponded = true;
        res.status(400).json({ error: 'Invalid file type. Only PDF, PPT, PPTX, and MP4/MOV/MKV are allowed.' });
      }
      return;
    }

    // Determine max size based on file type
    const isVideo = ['.mp4', '.mov', '.mkv'].includes(ext);
    const maxFileSize = isVideo ? 100 * 1024 * 1024 : 15 * 1024 * 1024; // 100MB for videos, 15MB for documents

    // Keep the original filename but sanitize it: strip unsafe characters, collapse spaces
    const baseName = path.basename(filename, ext)
      .replace(/[^a-zA-Z0-9._\- ]/g, '')  // strip non-safe chars
      .replace(/\s+/g, '_')               // spaces → underscores
      .slice(0, 200)                       // cap length
      || crypto.randomUUID();              // fallback if name becomes empty
    const uniqueKey = `${baseName}${ext}`;

    const limitStream = createSizeLimitStream(maxFileSize);
    file.pipe(limitStream);

    limitStream.on('error', (err) => {
      if (err.message === 'FILE_TOO_LARGE') {
        file.resume(); // Drain the file stream
        if (!isResponded) {
          isResponded = true;
          res.status(413).json({ error: `File size exceeds the limit of ${maxFileSize / (1024 * 1024)}MB for this file type.` });
        }
      }
    });

    // Accept OAuth2 Refresh Token (Personal Google Drive) or Service Account (Workspace Shared Drive)
    const hasOAuth =
      process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

    const hasServiceAccount =
      (process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) &&
      process.env.GOOGLE_PRIVATE_KEY;

    const hasGoogleCreds = (hasOAuth || hasServiceAccount) && process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (hasGoogleCreds) {
      // Primary: Google Drive Upload
      uploadPromise = uploadToGoogleDrive(limitStream, uniqueKey, mimeType)
        .then((url) => {
          req.fileUrl = url;
        })
        .catch((err) => {
          // Log the full error details so Railway/Vercel logs show the exact failure reason
          console.error('[streamUploader] Google Drive upload failed:', {
            message: err.message,
            stack: err.stack,
            code: err.code,
          });
          if (!isResponded) {
            isResponded = true;
            res.status(500).json({ error: `File upload to Google Drive failed: ${err.message}` });
          }
        });
    } else if (process.env.R2_BUCKET_NAME) {
      // Fallback: Cloudflare R2 Upload
      const bucketName = process.env.R2_BUCKET_NAME;

      if (process.env.R2_ENDPOINT_URL?.includes('PLACEHOLDER') || process.env.R2_ENDPOINT_URL?.includes('<account_id>')) {
        // Mock upload for local development without credentials
        file.resume(); // consume the stream
        req.fileUrl = process.env.R2_ENDPOINT_URL?.includes('PLACEHOLDER') 
          ? 'https://placeholder-assets.com/demo.pdf' 
          : `https://mock-storage.local/${bucketName}/${uniqueKey}`;
        uploadPromise = Promise.resolve();
        return;
      }

      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: uniqueKey,
          Body: limitStream,
          ContentType: mimeType,
        },
      });

      uploadPromise = upload.done().then(() => {
        req.fileUrl = `${process.env.R2_ENDPOINT_URL}/${bucketName}/${uniqueKey}`;
      }).catch((err) => {
        console.error('R2 upload stream error:', err);
        if (!isResponded) {
          isResponded = true;
          res.status(500).json({ error: 'File upload to R2 storage failed' });
        }
      });
    } else {
      file.resume();
      if (!isResponded) {
        isResponded = true;
        res.status(500).json({ error: 'No storage provider configured (Google Drive or R2).' });
      }
    }
  });

  bb.on('finish', () => {
    if (!fileProcessed && !isResponded) {
      isResponded = true;
      res.status(400).json({ error: 'No file uploaded in the request.' });
      return;
    }
    
    if (uploadPromise) {
      uploadPromise.then(() => {
        if (!isResponded && req.fileUrl) {
          isResponded = true;
          next();
        }
      });
    }
  });

  bb.on('error', (err) => {
    console.error('Busboy parsing error:', err);
    if (!isResponded) {
      isResponded = true;
      res.status(500).json({ error: 'Multipart request parsing failed' });
    }
  });

  req.pipe(bb);
}
