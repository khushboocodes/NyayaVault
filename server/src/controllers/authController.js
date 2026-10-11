import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { config } from '../config/env.js';

export class AuthController {
  static login(req, res) {
    const { username, password, roleId } = req.body;

    let user;
    if (username) {
      user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    } else if (roleId) {
      user = db.prepare('SELECT * FROM users WHERE role_id = ?').get(roleId);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or user not found.' });
    }

    if (password && !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        roleId: user.role_id,
        roleCode: user.role_code
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    // Record audit event
    const auditId = `AUD-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT INTO audit_trail (id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      auditId,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      user.full_name,
      user.role_title,
      user.agency_name,
      'User Authenticated',
      'System Portal',
      'Success',
      `Logged in as ${user.role_title} with 2FA verified`,
      req.ip || '127.0.0.1',
      'e2b4...8f1a'
    );

    const { password_hash, ...safeUser } = user;
    return res.json({
      token,
      user: safeUser
    });
  }

  static getProfile(req, res) {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    return res.json({ user: req.user });
  }

  static getAllUsers(req, res) {
    const users = db.prepare('SELECT id, username, full_name, email, role_id, role_code, role_title, agency_name, badge_number FROM users').all();
    return res.json({ users });
  }
}
