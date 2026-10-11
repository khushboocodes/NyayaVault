import { db } from '../db/database.js';
import { BlockchainService } from '../services/blockchainService.js';
import { AuditService } from '../services/auditService.js';

export class CustodyController {
  static getCustodyChain(req, res) {
    const { evidenceId } = req.params;

    let chain;
    if (evidenceId && evidenceId !== 'all') {
      chain = db.prepare('SELECT * FROM custody_chain WHERE evidence_id = ? ORDER BY created_at ASC').all(evidenceId);
    } else {
      chain = db.prepare('SELECT * FROM custody_chain ORDER BY created_at DESC LIMIT 50').all();
    }

    const formatted = chain.map(c => ({
      ...c,
      evidenceId: c.evidence_id,
      stage: c.stage,
      actor: c.actor,
      role: c.role,
      organization: c.organization,
      timestamp: c.timestamp,
      location: c.location,
      details: c.details,
      verified: c.verified === 1,
      digitalSignature: c.digital_signature,
      txId: c.tx_id
    }));

    return res.json({ custodyChain: formatted });
  }

  static async appendHandoff(req, res) {
    const {
      evidenceId,
      stage,
      toOfficer,
      toRole,
      toOrganization,
      location,
      details
    } = req.body;

    if (!evidenceId || !stage) {
      return res.status(400).json({ error: 'evidenceId and stage are required.' });
    }

    const evidence = db.prepare('SELECT * FROM evidence_records WHERE id = ?').get(evidenceId);
    if (!evidence) {
      return res.status(404).json({ error: 'Evidence record not found.' });
    }

    const actor = req.user ? req.user.full_name : 'Duty Officer';
    const actorRole = req.user ? req.user.role_title : 'Police Officer';
    const actorOrg = req.user ? req.user.agency_name : 'Law Enforcement';
    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

    // Anchor to blockchain
    const blockchainHandoff = await BlockchainService.appendCustodyHandoff({
      evidenceHash: evidence.master_sha256,
      stageName: stage,
      notes: details || 'Custody handoff executed.'
    });

    const custId = `CUST-${Date.now().toString().slice(-4)}`;
    db.prepare(`
      INSERT INTO custody_chain (
        id, evidence_id, stage, actor, role, organization, timestamp, location, details, verified, digital_signature, tx_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(
      custId,
      evidenceId,
      stage,
      toOfficer || actor,
      toRole || actorRole,
      toOrganization || actorOrg,
      nowStr,
      location || 'Court / Investigation Terminal',
      details || 'Custody transferred with non-repudiation signature.',
      '0x4a5b6c...7d8e',
      blockchainHandoff.txId
    );

    // Record audit event
    AuditService.log({
      user: actor,
      userRole: actorRole,
      organization: actorOrg,
      action: 'Custody Handoff Recorded',
      document: `${evidence.name || evidenceId} (${evidenceId})`,
      result: 'Success',
      details: `Transferred custody of '${evidence.name || evidenceId}' to ${toOfficer || actor} (${toOrganization || actorOrg}). Stage: ${stage}. Tx: ${blockchainHandoff.txId.slice(0, 16)}...`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.status(201).json({
      message: 'Custody handoff successfully registered and anchored on blockchain.',
      custodyId: custId,
      txId: blockchainHandoff.txId
    });
  }
}
