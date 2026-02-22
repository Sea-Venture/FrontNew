/**
 * Dev upload server (TypeScript)
 * - No auth (dev only)
 * - Validates image/pdf MIME types
 * - 5MB file size limit
 * - Saves files under ./public/uploads/<folder>
 * - Returns JSON { success, url, filename }
 *
 * Run (dev):
 *   npm i -D ts-node typescript @types/express @types/multer @types/cors @types/node
 *   npx ts-node backend/upload-dev-server.ts
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer, { MulterError } from 'multer';
import cors from 'cors';

const app = express();
const PORT = Number(process.env.UPLOAD_PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const UPLOAD_DIR = path.join(PUBLIC_DIR, 'uploads');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    const folderRaw = (req.body?.folder || 'misc').toString();
    const folder = folderRaw.replace(/[^a-z0-9-_]/gi, '').slice(0, 40) || 'misc';
    const target = path.join(UPLOAD_DIR, folder);
    fs.mkdirSync(target, { recursive: true });
    cb(null, target);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname) || '';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: (err: Error | null, acceptFile?: boolean) => void) => {
  const allowed = ['image/', 'application/pdf'];
  if (allowed.some((p) => file.mimetype.startsWith(p))) return cb(null, true);
  cb(new Error('Only images and PDFs are allowed'));
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

app.post('/api/v1/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided' });
  try {
    const folder = (req.body?.folder || '').toString().replace(/[^a-z0-9-_]/gi, '').slice(0, 40) || '';
    const rel = path.posix.join('uploads', folder, req.file.filename).replace(/\\/g, '/');
    const url = `${req.protocol}://${req.get('host')}/${rel}`;
    return res.json({ success: true, url, filename: req.file.filename });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Upload error' });
  }
});

// friendly error handler for multer
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large' });
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
  return res.status(500).end();
});

app.listen(PORT, () => console.log(`Dev upload server listening on http://localhost:${PORT}`));
