import express from 'express';
import multer from 'multer';
import { VerifyController } from '../controllers/verifyController.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }
});

router.get('/:hash', VerifyController.verifyHash);
router.post('/lookup', VerifyController.verifyHash);
router.post('/file', upload.single('file'), VerifyController.verifyFile);

export default router;
