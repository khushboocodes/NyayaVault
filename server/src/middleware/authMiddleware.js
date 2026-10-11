import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { db } from '../db/database.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = db.prepare('SELECT id, username, full_name, email, role_id, role_code, role_title, agency_name, badge_number, public_key FROM users WHERE id = ?').get(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const userRole = req.user.role_id.toLowerCase();
    const hasRole = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

    if (!hasRole) {
      return res.status(403).json({
        error: `Access Denied. Role '${req.user.role_title}' is not authorized for this operation.`
      });
    }

    next();
  };
}
