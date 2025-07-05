import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import createError from 'http-errors';
import fs from 'fs/promises';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const TEMP_DIR = path.resolve(__dirname, '../tmp');


await fs.mkdir(TEMP_DIR, { recursive: true });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, TEMP_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(createError(400, 'Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2, // Max 2MB
  },
});

export default upload;
