import express from 'express';
import jwt from 'jsonwebtoken';
import { AuditController } from '../controllers/auditController.js';
import { config } from '../config/env.js';
import { db } from '../db/database.js';

const router = express.Router();

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = db.prepare('SELECT id, username, full_name, email, role_id, role_code, role_title, agency_name, badge_number, public_key FROM users WHERE id = ?').get(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Continue without user
    }
  }
  next();
}

router.get('/', AuditController.getAuditTrail);
router.post('/log', optionalAuth, AuditController.createAuditLog);
router.delete('/:id', optionalAuth, AuditController.deleteAuditLog);

export default router;
