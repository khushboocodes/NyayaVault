import express from 'express';
import { CaseController } from '../controllers/caseController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', CaseController.getAllCases);
router.get('/:id', CaseController.getCaseById);
router.post('/', authenticate, CaseController.createCase);

export default router;
