import { db } from '../db/database.js';

export class AuditController {
  static getAuditTrail(req, res) {
    const logs = db.prepare('SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT 100').all();

    const formatted = logs.map(l => ({
      id: l.id,
      timestamp: l.timestamp,
      user: l.user,
      userRole: l.user_role,
      organization: l.organization,
      action: l.action,
      document: l.document,
      result: l.result,
      details: l.details,
      ipAddress: l.ip_address,
      macHash: l.mac_hash
    }));

    return res.json({ auditTrail: formatted });
  }

  static createAuditLog(req, res) {
    const { action, document, result, details } = req.body;

    const user = req.user ? req.user.full_name : 'System Monitor';
    const userRole = req.user ? req.user.role_title : 'Auditor';
    const org = req.user ? req.user.agency_name : 'NyayaVault Consortium';
    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const id = `AUD-${Date.now().toString().slice(-4)}`;

    db.prepare(`
      INSERT INTO audit_trail (
        id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      nowStr,
      user,
      userRole,
      org,
      action || 'General Action',
      document || 'System',
      result || 'Success',
      details || 'Action captured.',
      req.ip || '127.0.0.1',
      'e2b4...8f1a'
    );

    return res.status(201).json({ id, message: 'Audit event recorded.' });
  }
}
