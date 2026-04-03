import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

const ALLOWED_MIME_TYPES = new Set([
  'application/dicom',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/pdf',
  // DICOM files often come as octet-stream
  'application/octet-stream',
]);

const ALLOWED_EXTENSIONS = new Set([
  '.dcm', '.dicom', '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.pdf', '.nii',
]);

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB
    files: 50,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_MIME_TYPES.has(file.mimetype) || ALLOWED_EXTENSIONS.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype} (${ext})`));
    }
  },
});
