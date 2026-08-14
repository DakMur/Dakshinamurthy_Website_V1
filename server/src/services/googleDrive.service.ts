import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * Initializes the Google Drive API client using Service Account credentials.
 * Reads GOOGLE_CLIENT_EMAIL (primary) or GOOGLE_SERVICE_ACCOUNT_EMAIL (fallback)
 * and GOOGLE_PRIVATE_KEY from environment variables.
 * GOOGLE_PRIVATE_KEY supports literal '\n' escape sequences (common when setting
 * multiline values in Railway / Vercel environment dashboards).
 */
function getDriveService() {
  // Support both GOOGLE_CLIENT_EMAIL (Railway convention) and legacy GOOGLE_SERVICE_ACCOUNT_EMAIL
  const email = process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Replace literal '\\n' with actual newlines — required when the private key
  // is stored as a single-line string in Railway/Vercel env dashboards.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email) {
    throw new Error(
      'Google Drive credentials missing: set GOOGLE_CLIENT_EMAIL in your Railway/Vercel environment variables.'
    );
  }
  if (!privateKey) {
    throw new Error(
      'Google Drive credentials missing: set GOOGLE_PRIVATE_KEY in your Railway/Vercel environment variables.'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: email,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Uploads a file stream directly to Google Drive and sets public read permissions.
 *
 * @param fileStream The readable stream from busboy
 * @param filename The original filename / unique key
 * @param mimeType The file's MIME type
 * @returns The public preview URL
 */
export async function uploadToGoogleDrive(
  fileStream: NodeJS.ReadableStream,
  filename: string,
  mimeType: string
): Promise<string> {
  let drive;
  try {
    drive = getDriveService();
  } catch (initErr: any) {
    console.error('[GoogleDrive] Service initialization failed:', initErr.message);
    throw initErr;
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    const msg = 'GOOGLE_DRIVE_FOLDER_ID is not set. Please add this environment variable.';
    console.error('[GoogleDrive]', msg);
    throw new Error(msg);
  }

  // 1. Upload the file to the specified folder
  let response;
  try {
    response = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: fileStream,
      },
      fields: 'id, webViewLink',
    });
  } catch (uploadErr: any) {
    console.error('[GoogleDrive] drive.files.create failed:', {
      message: uploadErr.message,
      code: uploadErr.code,
      status: uploadErr.status,
      errors: uploadErr.errors,
    });
    throw new Error(`Google Drive file upload failed: ${uploadErr.message}`);
  }

  const fileId = response.data.id;
  if (!fileId) {
    throw new Error('[GoogleDrive] drive.files.create succeeded but returned no file ID.');
  }

  // 2. Set public reader permissions so anyone with the link can view it
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (permErr: any) {
    // Non-fatal: file was uploaded; log and continue
    console.warn('[GoogleDrive] Failed to set public permissions on file', fileId, permErr.message);
  }

  // 3. Return the preview link
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
