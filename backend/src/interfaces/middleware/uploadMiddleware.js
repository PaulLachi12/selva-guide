import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Asegurar que el directorio existe (relativo al proyecto, no a src)
const raizProyecto = path.join(__dirname, '..', '..', '..');
const dirUploads = path.join(raizProyecto, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(dirUploads)) {
  fs.mkdirSync(dirUploads, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dirUploads),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const nombre = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nombre);
  }
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (permitidos.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export default upload;