import { S3Client } from '@aws-sdk/client-s3';

export function getR2Client() {
  const accountId = (process.env.R2_ACCOUNT_ID || '').trim();
  const accessKeyId = (process.env.R2_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.R2_SECRET_ACCESS_KEY || '').trim();

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export const getR2Bucket = () => (process.env.R2_BUCKET_NAME || 'sma68-media').trim();
export const getR2PublicUrl = () => (process.env.R2_PUBLIC_URL || '').trim().replace(/\/$/, '');

