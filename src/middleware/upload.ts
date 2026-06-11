import multer from 'multer';

// Ingest files into memory storage up to 50MB
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
  },
});
