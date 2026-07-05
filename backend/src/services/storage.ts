import AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Determine storage backend from env
const STORAGE_BACKEND = (process.env.STORAGE_BACKEND || 'local') as 'local' | 's3' | 'r2';

let s3Client: AWS.S3 | null = null;

if (STORAGE_BACKEND !== 'local') {
  const config: AWS.S3.ClientConfiguration = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY,
  };

  if (STORAGE_BACKEND === 'r2') {
    // Cloudflare R2 endpoint
    config.endpoint = process.env.R2_ENDPOINT || 'https://your-account.r2.cloudflarestorage.com';
    config.region = 'auto';
  } else {
    // AWS S3
    config.region = process.env.AWS_REGION || 'us-east-1';
  }

  s3Client = new AWS.S3(config);
}

const BUCKET = process.env.S3_BUCKET || process.env.R2_BUCKET || 'cancer-progression-atlas';
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure local upload directory exists
if (STORAGE_BACKEND === 'local') {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

export interface StorageFile {
  path: string;  // s3://bucket/path or /uploads/filename
  backend: 'local' | 's3' | 'r2';
  key?: string;  // S3 key if applicable
}

export const storageService = {
  /**
   * Upload file to configured backend
   * Returns the storage path and presigned URL (for S3)
   */
  async uploadFile(
    filename: string,
    buffer: Buffer,
    mimetype: string
  ): Promise<StorageFile & { presignedUrl?: string }> {
    if (STORAGE_BACKEND === 'local') {
      const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
      fs.writeFileSync(filepath, buffer);
      return {
        path: `/uploads/${filename}`,
        backend: 'local',
      };
    }

    if (!s3Client) {
      throw new Error('S3 client not configured');
    }

    const key = `submissions/${Date.now()}_${filename}`;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'private',
    };

    try {
      await s3Client.putObject(params).promise();

      // Generate presigned URL (valid for 7 days)
      const presignedUrl = s3Client.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: key,
        Expires: 7 * 24 * 60 * 60, // 7 days
      });

      return {
        path: `${STORAGE_BACKEND}://${BUCKET}/${key}`,
        backend: STORAGE_BACKEND,
        key,
        presignedUrl,
      };
    } catch (err) {
      console.error('S3 upload error:', err);
      throw new Error('Failed to upload file to storage');
    }
  },

  /**
   * Generate presigned URL for downloading a file
   */
  async getPresignedUrl(storageKey: string): Promise<string> {
    if (STORAGE_BACKEND === 'local') {
      // Local files are served directly via /uploads/:filename
      return storageKey;
    }

    if (!s3Client) {
      throw new Error('S3 client not configured');
    }

    try {
      const presignedUrl = s3Client.getSignedUrl('getObject', {
        Bucket: BUCKET,
        Key: storageKey,
        Expires: 24 * 60 * 60, // 24 hours
      });

      return presignedUrl;
    } catch (err) {
      console.error('Failed to generate presigned URL:', err);
      throw new Error('Failed to generate download URL');
    }
  },

  /**
   * Delete a file from storage
   */
  async deleteFile(storageKey: string): Promise<void> {
    if (STORAGE_BACKEND === 'local') {
      const filepath = path.join(LOCAL_UPLOAD_DIR, path.basename(storageKey));
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      return;
    }

    if (!s3Client) {
      throw new Error('S3 client not configured');
    }

    try {
      await s3Client.deleteObject({
        Bucket: BUCKET,
        Key: storageKey,
      }).promise();
    } catch (err) {
      console.error('Failed to delete file:', err);
      throw new Error('Failed to delete file from storage');
    }
  },

  /**
   * Get storage backend info
   */
  getInfo() {
    return {
      backend: STORAGE_BACKEND,
      bucket: BUCKET,
      endpoint: STORAGE_BACKEND === 'r2' ? process.env.R2_ENDPOINT : 'AWS S3',
    };
  },
};
