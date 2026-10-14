import { db } from '../db/database.js';
import { isTursoConfigured, executeTurso } from '../db/turso.js';

export class AuditService {
  /**
   * Records an immutable audit log entry in the database.
   *
   * @param {Object} entry
   * @param {string} [entry.user] - Full name of the user performing the action
   * @param {string} [entry.userRole] - Role title (e.g. Investigating Officer, Judge)
   * @param {string} [entry.organization] - Agency/institution name
   * @param {string} entry.action - Standard action verb (e.g. Document Viewed, Document Downloaded)
   * @param {string} [entry.document] - Document ID, FIR number, or System entity
   * @param {string} [entry.result] - 'Success' | 'Alert' | 'Denied'
   * @param {string} [entry.details] - Detailed description of what occurred
   * @param {string} [entry.ipAddress] - Client IP or terminal address
   * @param {string} [entry.macHash] - Cryptographic hardware fingerprint
   * @returns {Object} The created audit record
   */
  static log({
    user = 'System Monitor',
    userRole = 'Authorized User',
    organization = 'NyayaVault Sovereign Network',
    action = 'Activity Recorded',
    document = 'System',
    result = 'Success',
    details = 'Activity executed.',
    ipAddress = '127.0.0.1',
    macHash = 'e2b4...8f1a'
  }) {
    try {
      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
      const id = `AUD-${Date.now().toString().slice(-5)}${Math.floor(Math.random() * 90 + 10)}`;

      db.prepare(`
        INSERT INTO audit_trail (
          id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        nowStr,
        user,
        userRole,
        organization,
        action,
        document,
        result,
        details,
        ipAddress,
        macHash
      );

      // Asynchronously mirror to Turso Cloud SQLite for permanent cloud persistence
      if (isTursoConfigured) {
        executeTurso(`
          INSERT INTO audit_trail (
            id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          nowStr,
          user,
          userRole,
          organization,
          action,
          document,
          result,
          details,
          ipAddress,
          macHash
        ]).catch(e => console.warn('Turso audit background sync notice:', e.message));
      }

      return {
        id,
        timestamp: nowStr,
        user,
        userRole,
        organization,
        action,
        document,
        result,
        details,
        ipAddress,
        macHash
      };
    } catch (err) {
      console.error('AuditService.log error:', err.message);
      return null;
    }
  }
}
