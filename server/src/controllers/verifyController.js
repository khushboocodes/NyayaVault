import { BlockchainService } from '../services/blockchainService.js';
import { CryptoService } from '../services/cryptoService.js';
import { AuditService } from '../services/auditService.js';

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
    AuditService.log({
      user: req.user ? req.user.full_name : 'Forensic Verification Portal',
      userRole: req.user ? req.user.role_title : 'Judicial Public / Legal Officer',
      organization: req.user ? req.user.agency_name : 'National e-Courts Portal',
      action: 'Hash Integrity Verification',
      document: verification.evidence ? `${verification.evidence.name || verification.evidence.id}` : `${testHash.slice(0, 16)}...`,
      result: verification.isVerified ? 'Success' : 'Alert',
      details: `Verdict: ${verification.verdict}. ${verification.message}. Target Hash: ${testHash.slice(0, 24)}...`,
      ipAddress: req.ip || '127.0.0.1'
    });

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

    AuditService.log({
      user: req.user ? req.user.full_name : 'Forensic Verification Portal',
      userRole: req.user ? req.user.role_title : 'Judicial Public / Legal Officer',
      organization: req.user ? req.user.agency_name : 'National e-Courts Portal',
      action: 'File Integrity Inspected',
      document: req.file.originalname,
      result: verification.isVerified ? 'Success' : 'Alert',
      details: `Uploaded '${req.file.originalname}' (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB). Computed SHA-256: ${computedSha256.slice(0, 16)}... Verdict: ${verification.verdict}`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      fileName: req.file.originalname,
      fileSize: `${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`,
      computedSha256,
      ...verification
    });
  }
}
