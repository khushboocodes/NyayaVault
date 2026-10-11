import { db } from '../db/database.js';
import { AuditService } from '../services/auditService.js';

export class CaseController {
  static getAllCases(req, res) {
    const cases = db.prepare('SELECT * FROM cases ORDER BY created_at DESC').all();

    // Attach documents count
    const casesWithCounts = cases.map(c => {
      const docCount = db.prepare('SELECT COUNT(*) as count FROM evidence_records WHERE case_id = ?').get(c.id);
      return {
        ...c,
        firNumber: c.fir_number,
        caseTitle: c.case_title,
        policeStation: c.police_station,
        crimeHead: c.crime_head,
        investigatingOfficer: c.investigating_officer,
        badgeNumber: c.badge_number,
        dateOfRegistration: c.date_of_registration,
        documentsCount: docCount.count || 0,
        timeline: [
          { step: 'FIR Registered', date: c.date_of_registration, status: 'completed' },
          { step: 'Evidence Collected', date: 'In Progress', status: 'completed' },
          { step: 'FSL Examination', date: 'Pending', status: c.status === 'Active' ? 'in_progress' : 'pending' },
          { step: 'Charge Sheet Filed', date: 'Pending', status: 'pending' }
        ]
      };
    });

    return res.json({ cases: casesWithCounts });
  }

  static getCaseById(req, res) {
    const { id } = req.params;
    const caseRecord = db.prepare('SELECT * FROM cases WHERE id = ? OR fir_number = ?').get(id, id);

    if (!caseRecord) {
      return res.status(404).json({ error: 'Case not found.' });
    }

    const documents = db.prepare('SELECT * FROM evidence_records WHERE case_id = ? ORDER BY created_at DESC').all(caseRecord.id);

    AuditService.log({
      user: req.user ? req.user.full_name : 'SI Rajesh Kumar',
      userRole: req.user ? req.user.role_title : 'Investigating Officer (IO)',
      organization: req.user ? req.user.agency_name : 'State Police Department',
      action: 'Case Dossier Accessed',
      document: `${caseRecord.fir_number} - ${caseRecord.case_title}`,
      result: 'Success',
      details: `Inspected case dossier for FIR '${caseRecord.fir_number}' (${caseRecord.case_title}) with ${documents.length} linked digital exhibits.`,
      ipAddress: req.ip || '127.0.0.1'
    });

    return res.json({
      caseItem: {
        ...caseRecord,
        firNumber: caseRecord.fir_number,
        caseTitle: caseRecord.case_title,
        policeStation: caseRecord.police_station,
        crimeHead: caseRecord.crime_head,
        investigatingOfficer: caseRecord.investigating_officer,
        badgeNumber: caseRecord.badge_number,
        dateOfRegistration: caseRecord.date_of_registration,
        documentsCount: documents.length
      },
      documents: documents.map(d => ({
        ...d,
        caseId: d.case_id,
        isSensitive: d.is_sensitive === 1,
        isRedacted: d.is_redacted === 1,
        sha256: d.master_sha256,
        txId: d.tx_id,
        blockNumber: d.block_number,
        uploadedOn: d.uploaded_on
      }))
    });
  }

  static createCase(req, res) {
    const {
      firNumber,
      caseTitle,
      policeStation,
      district,
      state,
      crimeHead,
      priority
    } = req.body;

    if (!firNumber || !caseTitle) {
      return res.status(400).json({ error: 'FIR Number and Case Title are required.' });
    }

    const id = firNumber;
    const nowStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST';
    const officer = req.user ? req.user.full_name : 'SI Rajesh Kumar';
    const badge = req.user ? req.user.badge_number : 'CG-8401';
    const org = req.user ? req.user.agency_name : 'State Police Department';

    try {
      db.prepare(`
        INSERT INTO cases (id, fir_number, case_title, police_station, district, state, crime_head, investigating_officer, badge_number, date_of_registration, status, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?)
      `).run(
        id,
        firNumber,
        caseTitle,
        policeStation || 'Chhattisgarh Sadar',
        district || 'Raipur',
        state || 'Chhattisgarh',
        crimeHead || 'Section 103 BNS (Sec 302 IPC)',
        officer,
        badge,
        nowStr,
        priority || 'Normal'
      );

      AuditService.log({
        user: officer,
        userRole: req.user ? req.user.role_title : 'Investigating Officer (IO)',
        organization: org,
        action: 'Case Registered',
        document: `${firNumber} - ${caseTitle}`,
        result: 'Success',
        details: `Registered new Case FIR '${firNumber}' (${caseTitle}) under ${crimeHead || 'BNS'}.`,
        ipAddress: req.ip || '127.0.0.1'
      });

      return res.status(201).json({
        message: 'Case FIR created successfully',
        caseId: id
      });
    } catch (err) {
      return res.status(400).json({ error: 'FIR Number already exists or database error.' });
    }
  }
}
