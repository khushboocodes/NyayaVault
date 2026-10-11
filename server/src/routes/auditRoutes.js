import express from 'express';
import { AuditController } from '../controllers/auditController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', AuditController.getAuditTrail);
router.post('/log', authenticate, AuditController.createAuditLog);

export default router;
