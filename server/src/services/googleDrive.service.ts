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
  // 1. Personal Google Drive (@gmail.com): OAuth2 with Refresh Token
  if (
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
    process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
    process.env.GOOGLE_OAUTH_REFRESH_TOKEN
  ) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    });
    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  // 2. Google Workspace Shared Drive: Service Account Credentials
  const email = process.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY ?? '';
  const privateKey = rawKey
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n');

  if (email && privateKey) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    return google.drive({ version: 'v3', auth });
  }

  throw new Error(
    'Google Drive credentials missing. Please set either OAuth2 credentials (GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN) for personal Drive, or Service Account credentials (GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY).'
  );
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
      supportsAllDrives: true,
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
      supportsAllDrives: true,
    });
  } catch (permErr: any) {
    // Non-fatal: file was uploaded; log and continue
    console.warn('[GoogleDrive] Failed to set public permissions on file', fileId, permErr.message);
  }

  // 3. Return the preview link
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
