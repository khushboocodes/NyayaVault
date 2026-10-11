import express from 'express';
import { CustodyController } from '../controllers/custodyController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:evidenceId', CustodyController.getCustodyChain);
router.post('/handoff', authenticate, CustodyController.appendHandoff);

export default router;
