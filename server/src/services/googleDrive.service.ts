import { google } from 'googleapis';
import { Readable } from 'stream';

/**
 * Initializes the Google Drive API client using Service Account credentials.
 */
function getDriveService() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Replace literal '\n' with actual newlines in case it's passed as a single line string
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    throw new Error('Google Drive service account credentials are not configured properly.');
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
 * @param filename The original filename
 * @param mimeType The file's MIME type
 * @returns The public preview URL
 */
export async function uploadToGoogleDrive(
  fileStream: NodeJS.ReadableStream,
  filename: string,
  mimeType: string
): Promise<string> {
  const drive = getDriveService();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('GOOGLE_DRIVE_FOLDER_ID is not configured.');
  }

  // 1. Upload the file to the specified folder
  const response = await drive.files.create({
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

  const fileId = response.data.id;

  if (!fileId) {
    throw new Error('Failed to retrieve file ID after uploading to Google Drive.');
  }

  // 2. Set public reader permissions so anyone with the link can view it
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  // 3. Return the webViewLink
  // Alternatively, generate the preview link explicitly: `https://drive.google.com/file/d/${fileId}/preview`
  return `https://drive.google.com/file/d/${fileId}/preview`;
}
