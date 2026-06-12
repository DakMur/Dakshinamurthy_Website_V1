import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

const r2EndpointUrl = process.env.R2_ENDPOINT_URL;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!r2EndpointUrl || !r2AccessKeyId || !r2SecretAccessKey) {
  throw new Error('Missing Cloudflare R2 environment variables (R2_ENDPOINT_URL, R2_ACCESS_KEY_ID, or R2_SECRET_ACCESS_KEY)');
}

export const s3Client = new S3Client({
  endpoint: r2EndpointUrl,
  credentials: {
    accessKeyId: r2AccessKeyId,
    secretAccessKey: r2SecretAccessKey,
  },
  region: 'auto',
});
