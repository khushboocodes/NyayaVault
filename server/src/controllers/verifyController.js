import { BlockchainService } from '../services/blockchainService.js';
import { CryptoService } from '../services/cryptoService.js';
import { db } from '../db/database.js';

export class VerifyController {
  /**
   * Verifies a 64-character SHA-256 hash against the sovereign blockchain ledger.
   */
  static async verifyHash(req, res) {
    const { hash } = req.params;
    const testHash = (hash || req.query.hash || req.body.hash || '').trim();

    if (!testHash || testHash.length < 10) {
      return res.status(400).json({ error: 'Valid SHA-256 hash is required for verification.' });
    }

    const verification = await BlockchainService.verifyHashIntegrity(testHash);

    // Record audit event
    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const auditId = `AUD-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT INTO audit_trail (
        id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      auditId,
      nowStr,
      req.user ? req.user.full_name : 'Public Verification Gate',
      req.user ? req.user.role_title : 'Judicial Public',
      req.user ? req.user.agency_name : 'National e-Courts Portal',
      'Integrity Verification Attempt',
      verification.evidence ? verification.evidence.id : testHash.slice(0, 16) + '...',
      verification.isVerified ? 'Success' : 'Alert',
      `Verdict: ${verification.verdict}. ${verification.message}`,
      req.ip || '127.0.0.1',
      'c1a9...7e2b'
    );

    return res.json(verification);
  }

  /**
   * Verifies an uploaded physical file by computing its SHA-256 in memory and querying the ledger.
   */
  static async verifyFile(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided for verification.' });
    }

    const fileBuffer = req.file.buffer;
    const computedSha256 = CryptoService.sha256(fileBuffer);

    const verification = await BlockchainService.verifyHashIntegrity(computedSha256);

    return res.json({
      fileName: req.file.originalname,
      fileSize: `${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`,
      computedSha256,
      ...verification
    });
  }
}
