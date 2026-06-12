import { Request, Response, NextFunction } from 'express';
import { s3Client } from '../config/storage.js';
import { Upload } from '@aws-sdk/lib-storage';
import busboy from 'busboy';
import crypto from 'crypto';
import path from 'path';

declare global {
  namespace Express {
    interface Request {
      fileUrl?: string;
    }
  }
}

export function streamUploader(req: Request, res: Response, next: NextFunction) {
  const bb = busboy({ headers: req.headers, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB
  let isResponded = false;
  let fileProcessed = false;
  let uploadPromise: Promise<void> | null = null;

  bb.on('file', (name, file, info) => {
    fileProcessed = true;
    const { filename, mimeType } = info;
    const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.mp4'];
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      file.resume();
      if (!isResponded) {
        isResponded = true;
        res.status(400).json({ error: 'Invalid file type. Only PDF, PPT, PPTX, and MP4 are allowed.' });
      }
      return;
    }

    const uniqueKey = `${crypto.randomUUID()}${ext}`;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName) {
      file.resume();
      if (!isResponded) {
        isResponded = true;
        res.status(500).json({ error: 'R2_BUCKET_NAME is not configured' });
      }
      return;
    }

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
        Body: file,
        ContentType: mimeType,
      },
    });

    uploadPromise = upload.done().then(() => {
      req.fileUrl = `${process.env.R2_ENDPOINT_URL}/${bucketName}/${uniqueKey}`;
    }).catch((err) => {
      console.error('R2 upload stream error:', err);
      if (!isResponded) {
        isResponded = true;
        res.status(500).json({ error: 'File upload to storage failed' });
      }
    });
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
