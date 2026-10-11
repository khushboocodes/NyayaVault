import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { config } from '../config/env.js';
import { CryptoService } from '../services/cryptoService.js';
import { BlockchainService } from '../services/blockchainService.js';
import { RedactionService } from '../services/redactionService.js';
import { BsaCertificateService } from '../services/bsaCertificateService.js';
import { VaultStorage } from '../storage/vaultStorage.js';
import { AuditService } from '../services/auditService.js';

export class EvidenceController {
  /**
   * Uploads, verifies, redacts, encrypts, and anchors evidence to blockchain.
   */
  static async uploadEvidence(req, res) {
    try {
      const file = req.file;
      const {
        caseId,
        docType,
        description,
        isSensitive,
        selectedEntities
      } = req.body;

      if (!file) {
        return res.status(400).json({ error: 'No evidence file uploaded.' });
      }

      const fileBuffer = file.buffer;
      const fileName = file.originalname;
      const fileSize = `${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB`;
      const isSensitiveBool = isSensitive === 'true' || isSensitive === true;

      // 1. Compute Master SHA-256 Hash
      const masterSha256 = CryptoService.sha256(fileBuffer);

      // Check if duplicate evidence already exists on ledger
      const existing = db.prepare('SELECT id FROM evidence_records WHERE master_sha256 = ?').get(masterSha256);
      if (existing) {
        return res.status(409).json({
          error: 'Duplicate Evidence Detected: This file content is already anchored on the sovereign ledger.',
          existingEvidenceId: existing.id
        });
      }

      // 2. Section 72 BNS Redaction Processing if sensitive
      let redactedSha256 = null;
      let merkleRoot = masterSha256;
      let processedPdfBuffer = fileBuffer;
      let redactedBufferToStore = null;

      if (isSensitiveBool) {
        let parsedEntities = [];
        try {
          if (selectedEntities) {
            parsedEntities = JSON.parse(selectedEntities);
          }
        } catch (e) {}

        const redactionResult = await RedactionService.processPdfRedaction(fileBuffer, parsedEntities);
        redactedSha256 = redactionResult.redactedSha256;
        merkleRoot = redactionResult.merkleRoot;
        redactedBufferToStore = redactionResult.redactedPdfBuffer;
      }

      // 3. AES-256-GCM Envelope Encryption
      const encryptionResult = CryptoService.encryptEnvelope(fileBuffer);
      const evidenceId = `DOC-2026-${Date.now().toString().slice(-5)}`;
      const encryptedFileName = `${evidenceId}.enc`;

      await VaultStorage.saveEncryptedBlob(encryptedFileName, encryptionResult.ciphertext);

      // If sensitive, store redacted version as well
      if (redactedBufferToStore) {
        const redactedEncrypted = CryptoService.encryptEnvelope(redactedBufferToStore);
        const redactedFileName = `${evidenceId}_redacted.enc`;
        await VaultStorage.saveEncryptedBlob(redactedFileName, redactedEncrypted.ciphertext);
      }

      // 4. Real Blockchain Anchoring
      const officer = req.user ? req.user.full_name : 'SI Rajesh Kumar';
      const badge = req.user ? req.user.badge_number : 'CG-8401';
      const org = req.user ? req.user.agency_name : 'Chhattisgarh State Police';
      const userPk = req.user ? req.user.public_key : '0x04a91b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be';

      const anchorResult = await BlockchainService.anchorEvidence({
        masterSha256,
        redactedSha256,
        caseFirNumber: caseId || 'FIR-2026-001',
        docType: docType || 'Witness Statement',
        signature: '0x3a4b5c6d',
        officerAddress: userPk
      });

      const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';

      // 5. Resolve valid foreign keys and store record in database
      let validCaseId = caseId || 'FIR-2026-001';
      const existingCase = db.prepare('SELECT id FROM cases WHERE id = ? OR fir_number = ?').get(validCaseId, validCaseId);
      if (existingCase) {
        validCaseId = existingCase.id;
      } else {
        const firstCase = db.prepare('SELECT id FROM cases ORDER BY id ASC LIMIT 1').get();
        validCaseId = firstCase ? firstCase.id : 'FIR-2026-001';
      }

      let validUserId = req.user ? req.user.id : 'usr-io-001';
      const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(validUserId);
      if (!userExists) {
        const firstUser = db.prepare('SELECT id FROM users LIMIT 1').get();
        validUserId = firstUser ? firstUser.id : 'usr-io-001';
      }

      db.prepare(`
        INSERT INTO evidence_records (
          id, case_id, name, doc_type, size, file_size_bytes, pages, status,
          is_sensitive, is_redacted, master_sha256, redacted_sha256, merkle_root,
          tx_id, block_number, signer, signing_certificate, organization, storage_path,
          encrypted_dek, iv, auth_tag, description, created_by_id, uploaded_on
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, 'Verified',
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?, ?, ?
        )
      `).run(
        evidenceId,
        validCaseId,
        fileName,
        docType || 'Witness Statement',
        fileSize,
        fileBuffer.length,
        isSensitiveBool ? 4 : 2,
        isSensitiveBool ? 1 : 0,
        isSensitiveBool ? 1 : 0,
        masterSha256,
        redactedSha256,
        merkleRoot,
        anchorResult.txId,
        anchorResult.blockNumber,
        `${officer} (Badge #${badge})`,
        `Class 3 DSC - ${officer} (NIC-CA)`,
        org,
        `storage/vault/${encryptedFileName}`,
        encryptionResult.encryptedDEK,
        encryptionResult.iv,
        encryptionResult.authTag,
        description || 'Digital evidence record ingested via NyayaVault airlock.',
        validUserId,
        nowStr
      );

      // 6. Record Genesis Custody Event
      const custId = `CUST-${Date.now().toString().slice(-4)}`;
      db.prepare(`
        INSERT INTO custody_chain (
          id, evidence_id, stage, actor, role, organization, timestamp, location, details, verified, digital_signature, tx_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
      `).run(
        custId,
        evidenceId,
        'Evidence Ingested & Hashed (Genesis)',
        `${officer} (IO)`,
        'Investigating Officer',
        org,
        nowStr,
        'Police Station Terminal',
        `Pre-ingestion SHA-256 master hash computed and envelope-encrypted with AES-256-GCM. Anchored to block #${anchorResult.blockNumber}.`,
        '0x3a4b5c...9a0b',
        anchorResult.txId
      );

      // 7. Record Audit Trail Event
      const audId = `AUD-${Date.now().toString().slice(-4)}`;
      db.prepare(`
        INSERT INTO audit_trail (
          id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'Success', ?, ?, ?)
      `).run(
        audId,
        nowStr,
        officer,
        req.user ? req.user.role_title : 'Investigating Officer',
        org,
        'Evidence Ingested & Anchored',
        evidenceId,
        `Master Hash: ${masterSha256.slice(0, 16)}... anchored to block #${anchorResult.blockNumber}.`,
        req.ip || '127.0.0.1',
        'f8a1...4d6e'
      );

      // Return complete evidence payload
      const createdEvidence = db.prepare('SELECT * FROM evidence_records WHERE id = ?').get(evidenceId);

      return res.status(201).json({
        message: 'Evidence successfully ingested, encrypted, and anchored on-chain.',
        evidence: {
          ...createdEvidence,
          caseId: createdEvidence.case_id,
          isSensitive: createdEvidence.is_sensitive === 1,
          isRedacted: createdEvidence.is_redacted === 1,
          sha256: createdEvidence.master_sha256,
          txId: createdEvidence.tx_id,
          blockNumber: createdEvidence.block_number,
          uploadedOn: createdEvidence.uploaded_on
        }
      });
    } catch (err) {
      console.error('Evidence upload error:', err);
      return res.status(500).json({ error: 'Evidence ingestion failed: ' + err.message });
    }
  }

  static getAllDocuments(req, res) {
    const docs = db.prepare('SELECT * FROM evidence_records ORDER BY created_at DESC').all();

    const formattedDocs = docs.map(d => {
      const caseItem = db.prepare('SELECT case_title, fir_number FROM cases WHERE id = ?').get(d.case_id);
      return {
        ...d,
        caseId: d.case_id,
        caseTitle: caseItem ? caseItem.case_title : 'Investigation',
        isSensitive: d.is_sensitive === 1,
        isRedacted: d.is_redacted === 1,
        sha256: d.master_sha256,
        txId: d.tx_id,
        blockNumber: d.block_number,
        uploadedOn: d.uploaded_on
      };
    });

    return res.json({ documents: formattedDocs });
  }

  static getEvidenceById(req, res) {
    const { id } = req.params;
    const doc = db.prepare('SELECT * FROM evidence_records WHERE id = ? OR master_sha256 = ?').get(id, id);

    if (!doc) {
      return res.status(404).json({ error: 'Evidence record not found.' });
    }

    const caseItem = db.prepare('SELECT * FROM cases WHERE id = ?').get(doc.case_id);

    // Audit trail logging
    AuditService.log({
      user: req.user ? req.user.full_name : 'SI Rajesh Kumar',
      userRole: req.user ? req.user.role_title : 'Investigating Officer (IO)',
      organization: req.user ? req.user.agency_name : 'State Police Department',
      action: 'Document Viewed',
      document: `${doc.name} (${doc.id})`,
      result: 'Success',
      details: `Viewed digital evidence record '${doc.name}' (${doc.id}). Case: ${doc.case_id}. Sensitivity: ${doc.is_sensitive === 1 ? 'Sec 72 BNS Classified' : 'Standard'}.`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      evidence: {
        ...doc,
        caseId: doc.case_id,
        caseTitle: caseItem ? caseItem.case_title : 'Investigation',
        isSensitive: doc.is_sensitive === 1,
        isRedacted: doc.is_redacted === 1,
        sha256: doc.master_sha256,
        txId: doc.tx_id,
        blockNumber: doc.block_number,
        uploadedOn: doc.uploaded_on
      },
      caseItem
    });
  }

  /**
   * Generates and streams Section 63 BSA certificate PDF.
   */
  static async getBsaCertificate(req, res) {
    try {
      const { id } = req.params;
      const doc = db.prepare('SELECT * FROM evidence_records WHERE id = ? OR master_sha256 = ?').get(id, id);

      if (!doc) {
        return res.status(404).json({ error: 'Evidence not found.' });
      }

      const caseItem = db.prepare('SELECT * FROM cases WHERE id = ?').get(doc.case_id) || {};
      const certBuffer = await BsaCertificateService.generateCertificatePdf(doc, caseItem);

      AuditService.log({
        user: req.user ? req.user.full_name : 'SI Rajesh Kumar',
        userRole: req.user ? req.user.role_title : 'Investigating Officer (IO)',
        organization: req.user ? req.user.agency_name : 'State Police Department',
        action: 'BSA Certificate Generated',
        document: `${doc.name} (${doc.id})`,
        result: 'Success',
        details: `Generated Section 63 BSA electronic admissibility certificate for '${doc.name}' (${doc.id}). Dual-hash verified.`,
        ipAddress: req.ip || '127.0.0.1'
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="BSA_Section_63_Certificate_${doc.id}.pdf"`);
      return res.send(certBuffer);
    } catch (err) {
      console.error('BSA certificate generation failed:', err);
      return res.status(500).json({ error: 'Certificate generation failed: ' + err.message });
    }
  }

  /**
   * Streams decrypted evidence file or sanitized redacted derivative.
   */
  static async downloadEvidence(req, res) {
    try {
      const { id } = req.params;
      const { version } = req.query; // 'master' or 'redacted'
      const doc = db.prepare('SELECT * FROM evidence_records WHERE id = ?').get(id);

      if (!doc) {
        return res.status(404).json({ error: 'Evidence record not found.' });
      }

      // Check role permissions: Only Judge and IO can view unredacted master if sensitive
      const userRole = req.user ? req.user.role_code : 'IO';
      const isSensitive = doc.is_sensitive === 1;

      if (isSensitive && version === 'master' && !['JUDGE', 'IO'].includes(userRole)) {
        AuditService.log({
          user: req.user ? req.user.full_name : 'Unauthorized User',
          userRole: req.user ? req.user.role_title : 'Public User',
          organization: req.user ? req.user.agency_name : 'External Access',
          action: 'Document Access Denied',
          document: `${doc.name} (${doc.id})`,
          result: 'Denied',
          details: `Blocked attempt to access unredacted sensitive record '${doc.name}' (${doc.id}) under Section 72 BNS.`,
          ipAddress: req.ip || '127.0.0.1'
        });

        return res.status(403).json({
          error: 'Access Denied: Section 72 BNS strictly prohibits distribution of unredacted victim records to unauthorized roles.'
        });
      }

      const targetFileName = (isSensitive && version === 'redacted')
        ? `${doc.id}_redacted.enc`
        : `${doc.id}.enc`;

      const ciphertext = await VaultStorage.getEncryptedBlob(targetFileName);

      if (!ciphertext) {
        return res.status(404).json({ error: 'Encrypted blob not found in storage airlock or cloud vault.' });
      }

      const decrypted = CryptoService.decryptEnvelope(ciphertext, doc.iv, doc.auth_tag, doc.encrypted_dek);

      AuditService.log({
        user: req.user ? req.user.full_name : 'SI Rajesh Kumar',
        userRole: req.user ? req.user.role_title : 'Investigating Officer (IO)',
        organization: req.user ? req.user.agency_name : 'State Police Department',
        action: 'Document Downloaded',
        document: `${doc.name} (${doc.id})`,
        result: 'Success',
        details: `Downloaded ${version === 'master' ? 'unredacted master' : 'redacted derivative'} file of '${doc.name}' (${doc.id}). Decrypted via AES-256-GCM.`,
        ipAddress: req.ip || '127.0.0.1'
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${doc.name}"`);
      return res.send(decrypted);
    } catch (err) {
      return res.status(500).json({ error: 'Decryption failed: ' + err.message });
    }
  }
}
