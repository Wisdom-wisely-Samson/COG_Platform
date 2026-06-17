import multer from 'multer';
import path   from 'path';
import fs     from 'fs';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, '../../uploads');

// Ensure uploads folder exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename:    (_req,  file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const ALLOWED = /\.(jpe?g|png|gif|webp|pdf|docx?|xlsx?|pptx?|txt|csv|zip|mp4|mp3|mov|webm)$/i;

export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB per file
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${path.extname(file.originalname)}`));
    }
  },
});
