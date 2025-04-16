import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.AWS_BUCKET_NAME || '';
const ALLOWED_DOMAINS = (process.env.ALLOWED_DOMAINS || '').split(',');

// Function to optimize image before upload
export async function optimizeImage(buffer: Buffer, width: number = 800): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, null, { withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer();
}

// Function to upload file to S3
export async function uploadToS3(
  file: Buffer,
  key: string,
  contentType: string,
  optimize: boolean = true
): Promise<string> {
  try {
    // Optimize image if it's an image and optimization is requested
    let processedFile = file;
    if (optimize && contentType.startsWith('image/')) {
      processedFile = await optimizeImage(file);
    }

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: processedFile,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000',
      Metadata: {
        'Access-Control-Allow-Origin': ALLOWED_DOMAINS.join(','),
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
      ServerSideEncryption: 'AES256',
    });

    await s3Client.send(command);

    return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
}
