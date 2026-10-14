import { db } from '../db/database.js';
import { AuditService } from '../services/auditService.js';
import { isTursoConfigured, queryTurso } from '../db/turso.js';

export class AuditController {
  static async getAuditTrail(req, res) {
    let cloudLogs = [];

    // 1. Query Turso Cloud SQLite if configured
    if (isTursoConfigured) {
      try {
        const rows = await queryTurso('SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT 200');
        if (rows && rows.length > 0) {
          cloudLogs = rows;
        }
      } catch (err) {
        console.warn('Turso audit trail fetch fallback:', err.message);
      }
    }

    // 2. Query Local SQLite
    let localLogs = [];
    try {
      localLogs = db.prepare('SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT 200').all();
    } catch (e) {
      localLogs = [];
    }

    // 3. Merge Cloud + Local logs, deduplicated by ID (Cloud priority)
    const logMap = new Map();
    for (const l of cloudLogs) {
      if (l.id) logMap.set(l.id, l);
    }
    for (const l of localLogs) {
      if (l.id && !logMap.has(l.id)) {
        logMap.set(l.id, l);
      }
    }

    const merged = Array.from(logMap.values()).sort((a, b) => {
      const dateA = new Date(a.created_at || a.timestamp || 0).getTime();
      const dateB = new Date(b.created_at || b.timestamp || 0).getTime();
      return dateB - dateA;
    });

    const formatted = merged.map(l => ({
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

    return res.json({ auditTrail: formatted, source: isTursoConfigured ? 'turso_cloud' : 'local_sqlite' });
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

