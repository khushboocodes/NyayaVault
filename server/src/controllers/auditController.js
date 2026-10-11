import { db } from '../db/database.js';
import { AuditService } from '../services/auditService.js';

export class AuditController {
  static getAuditTrail(req, res) {
    const logs = db.prepare('SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT 200').all();

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
    const { action, document, result, details, user: bodyUser, userRole: bodyUserRole, organization: bodyOrg } = req.body;

    const user = req.user ? req.user.full_name : (bodyUser || 'SI Rajesh Kumar');
    const userRole = req.user ? req.user.role_title : (bodyUserRole || 'Investigating Officer (IO)');
    const organization = req.user ? req.user.agency_name : (bodyOrg || 'Chhattisgarh State Police');

    const created = AuditService.log({
      user,
      userRole,
      organization,
      action: action || 'General Activity',
      document: document || 'System Portal',
      result: result || 'Success',
      details: details || 'Activity recorded in sovereign audit trail.',
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      macHash: 'e2b4...8f1a'
    });

    return res.status(201).json({
      message: 'Audit event recorded.',
      audit: created
    });
  }
}
