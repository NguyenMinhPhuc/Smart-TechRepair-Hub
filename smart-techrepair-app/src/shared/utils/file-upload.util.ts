import { diskStorage } from 'multer';
import * as path from 'path';
import * as crypto from 'crypto';
import { Request } from 'express';

export const multerConfig = {
  storage: diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (err: Error | null, dest: string) => void) => {
      cb(null, path.join(process.cwd(), 'public', 'uploads'));
    },
    filename: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, name: string) => void) => {
      const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, accept: boolean) => void) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    cb(null, ok);
  },
};

export function getPhotoUrl(filename: string): string {
  return `/uploads/${filename}`;
}
