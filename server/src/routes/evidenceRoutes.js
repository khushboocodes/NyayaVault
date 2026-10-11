import express from 'express';
import multer from 'multer';
import { EvidenceController } from '../controllers/evidenceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max limit
});

router.get('/', EvidenceController.getAllDocuments);
router.get('/:id', EvidenceController.getEvidenceById);
router.post('/upload', upload.single('file'), EvidenceController.uploadEvidence);
router.get('/:id/certificate', EvidenceController.getBsaCertificate);
router.get('/:id/download', EvidenceController.downloadEvidence);

export default router;
