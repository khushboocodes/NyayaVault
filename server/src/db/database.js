import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

// Ensure storage directories exist
const storageDir = path.dirname(config.databasePath);
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}
if (!fs.existsSync(config.storageDir)) {
  fs.mkdirSync(config.storageDir, { recursive: true });
}

// Initialize native SQLite database
export const db = new DatabaseSync(config.databasePath);

// Enable WAL mode and foreign keys for high-performance ACID operations
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
`);

export function initDatabase() {
  // 1. Users & RBAC
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      password_hash TEXT NOT NULL,
      role_id TEXT NOT NULL,
      role_code TEXT NOT NULL,
      role_title TEXT NOT NULL,
      agency_name TEXT NOT NULL,
      badge_number TEXT,
      public_key TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Cases / FIRs
  db.exec(`
    CREATE TABLE IF NOT EXISTS cases (
      id TEXT PRIMARY KEY,
      fir_number TEXT UNIQUE NOT NULL,
      case_title TEXT NOT NULL,
      police_station TEXT NOT NULL,
      district TEXT NOT NULL,
      state TEXT NOT NULL,
      crime_head TEXT NOT NULL,
      investigating_officer TEXT NOT NULL,
      badge_number TEXT NOT NULL,
      date_of_registration TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Active',
      priority TEXT NOT NULL DEFAULT 'Normal',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Evidence Records
  db.exec(`
    CREATE TABLE IF NOT EXISTS evidence_records (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      name TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      size TEXT NOT NULL,
      file_size_bytes INTEGER NOT NULL DEFAULT 0,
      pages INTEGER NOT NULL DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'Verified',
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      is_redacted INTEGER NOT NULL DEFAULT 0,
      master_sha256 TEXT UNIQUE NOT NULL,
      redacted_sha256 TEXT,
      merkle_root TEXT,
      tx_id TEXT,
      block_number INTEGER DEFAULT 0,
      signer TEXT,
      signing_certificate TEXT,
      organization TEXT NOT NULL,
      storage_path TEXT,
      encrypted_dek TEXT,
      iv TEXT,
      auth_tag TEXT,
      description TEXT,
      created_by_id TEXT,
      uploaded_on TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
    );
  `);

  // 4. Custody Chain Events
  db.exec(`
    CREATE TABLE IF NOT EXISTS custody_chain (
      id TEXT PRIMARY KEY,
      evidence_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      organization TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      location TEXT NOT NULL,
      details TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 1,
      digital_signature TEXT,
      tx_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evidence_id) REFERENCES evidence_records(id) ON DELETE CASCADE
    );
  `);

  // 5. Immutable Consortium Audit Trail
  db.exec(`
    CREATE TABLE IF NOT EXISTS audit_trail (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      user TEXT NOT NULL,
      user_role TEXT NOT NULL,
      organization TEXT NOT NULL,
      action TEXT NOT NULL,
      document TEXT NOT NULL,
      result TEXT NOT NULL,
      details TEXT NOT NULL,
      ip_address TEXT,
      mac_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Offline Field Sync Queue
  db.exec(`
    CREATE TABLE IF NOT EXISTS offline_queue (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      client_record_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      case_id TEXT NOT NULL,
      raw_payload TEXT,
      device_timestamp TEXT NOT NULL,
      received_timestamp TEXT NOT NULL,
      drift_seconds REAL NOT NULL,
      sync_flag TEXT NOT NULL DEFAULT 'NORMAL',
      status TEXT NOT NULL DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedDefaultData();
}

function seedDefaultData() {
  // Check if users already seeded
  const userCheck = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCheck.count > 0) return;

  const defaultPassword = 'password123';
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  // 1. Seed 4 Institutional Personas
  const seedUsers = [
    {
      id: 'usr-io-001',
      username: 'io_officer.nyayavault',
      full_name: 'SI Rajesh Kumar',
      email: 'rajesh.kumar@cgpolice.gov.in',
      password_hash: hashedPassword,
      role_id: 'io',
      role_code: 'IO',
      role_title: 'Investigating Officer (IO)',
      agency_name: 'Chhattisgarh State Police',
      badge_number: 'CG-8401',
      public_key: '0x04a91b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be'
    },
    {
      id: 'usr-fsl-002',
      username: 'forensic_analyst.nyayavault',
      full_name: 'Dr. Meera Singh',
      email: 'meera.singh@fsl.gov.in',
      password_hash: hashedPassword,
      role_id: 'fsl',
      role_code: 'FSL',
      role_title: 'Forensic Lab Analyst',
      agency_name: 'State Forensic Science Laboratory, Raipur',
      badge_number: 'FSL-2910',
      public_key: '0x04b82c3d5f7b725772b95043aa21def5c6f90213982245f23d9b02c3d5f783cf'
    },
    {
      id: 'usr-pros-003',
      username: 'prosecutor.nyayavault',
      full_name: 'Adv. R. Varma',
      email: 'r.varma@prosecution.gov.in',
      password_hash: hashedPassword,
      role_id: 'prosecutor',
      role_code: 'PROSECUTOR',
      role_title: 'Public Prosecutor',
      agency_name: 'Directorate of Prosecution, Raipur',
      badge_number: 'PP-4401',
      public_key: '0x04c93d4e6a8c836883ca6154bb32ef06d7a01324a93356a34e0c13d4e6a894da'
    },
    {
      id: 'usr-judge-004',
      username: 'judge.nyayavault',
      full_name: 'Justice S. Iyer',
      email: 's.iyer@ecourts.gov.in',
      password_hash: hashedPassword,
      role_id: 'judge',
      role_code: 'JUDGE',
      role_title: 'District & Sessions Judge',
      agency_name: 'District & Sessions Court Room No. 3, Raipur',
      badge_number: 'JUD-1002',
      public_key: '0x04d04e5f7b9d947994db7265cc43f017e8b12435ba4467b45f1d24e5f7b905eb'
    }
  ];

  const insertUser = db.prepare(`
    INSERT INTO users (id, username, full_name, email, password_hash, role_id, role_code, role_title, agency_name, badge_number, public_key)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const u of seedUsers) {
    insertUser.run(u.id, u.username, u.full_name, u.email, u.password_hash, u.role_id, u.role_code, u.role_title, u.agency_name, u.badge_number, u.public_key);
  }

  // 2. Seed Default Cases
  const seedCases = [
    {
      id: "FIR-2026-001",
      fir_number: "FIR-2026-001",
      case_title: "Murder Investigation",
      police_station: "Chhattisgarh Sadar",
      district: "Raipur",
      state: "Chhattisgarh",
      crime_head: "Section 103 BNS (Sec 302 IPC)",
      investigating_officer: "SI Rajesh Kumar",
      badge_number: "CG-8401",
      date_of_registration: "12 Aug 2026, 14:45 IST",
      status: "Active",
      priority: "High"
    },
    {
      id: "FIR-2026-002",
      fir_number: "FIR-2026-002",
      case_title: "Theft Case",
      police_station: "Patna City",
      district: "Patna",
      state: "Bihar",
      crime_head: "Section 303 BNS (Sec 379 IPC)",
      investigating_officer: "Insp. Vikramaditya",
      badge_number: "BR-2204",
      date_of_registration: "18 Aug 2026, 10:15 IST",
      status: "Active",
      priority: "Normal"
    },
    {
      id: "FIR-2026-003",
      fir_number: "FIR-2026-003",
      case_title: "Cyber Fraud & Extortion",
      police_station: "Gwalior Thana",
      district: "Gwalior",
      state: "Madhya Pradesh",
      crime_head: "Section 66D IT Act / Sec 318 BNS",
      investigating_officer: "SI Neha Verma",
      badge_number: "MP-5512",
      date_of_registration: "25 Aug 2026, 16:20 IST",
      status: "Pending",
      priority: "High"
    },
    {
      id: "FIR-2026-004",
      fir_number: "FIR-2026-004",
      case_title: "NDPS Seizure Operation",
      police_station: "Gaya Kotwali",
      district: "Gaya",
      state: "Bihar",
      crime_head: "Section 20 NDPS Act",
      investigating_officer: "SI Rajesh Kumar",
      badge_number: "CG-8401",
      date_of_registration: "02 Sep 2026, 09:30 IST",
      status: "Active",
      priority: "Normal"
    },
    {
      id: "FIR-2026-005",
      fir_number: "FIR-2026-005",
      case_title: "Illegal Arms Recovery",
      police_station: "Ranchi Sadar",
      district: "Ranchi",
      state: "Jharkhand",
      crime_head: "Section 25 Arms Act",
      investigating_officer: "Insp. S. Soren",
      badge_number: "JH-9011",
      date_of_registration: "10 Sep 2026, 12:00 IST",
      status: "Active",
      priority: "Normal"
    }
  ];

  const insertCase = db.prepare(`
    INSERT INTO cases (id, fir_number, case_title, police_station, district, state, crime_head, investigating_officer, badge_number, date_of_registration, status, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of seedCases) {
    insertCase.run(c.id, c.fir_number, c.case_title, c.police_station, c.district, c.state, c.crime_head, c.investigating_officer, c.badge_number, c.date_of_registration, c.status, c.priority);
  }

  // 3. Seed Initial Evidence Records
  const seedEvidences = [
    {
      id: "DOC-2026-00123",
      case_id: "FIR-2026-001",
      name: "Witness_Statement.pdf",
      doc_type: "Statement",
      size: "2.4 MB",
      file_size_bytes: 2516582,
      pages: 4,
      status: "Verified",
      is_sensitive: 1,
      is_redacted: 1,
      master_sha256: "a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be",
      redacted_sha256: "8f4e2b01c9a7d34e65f12980145be8a3f5e7c9b2d4e6f8a2c41893341b8a9f31",
      merkle_root: "9e5c4a3b2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c",
      tx_id: "0x8f13c2d4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e6789e",
      block_number: 129381,
      signer: "SI Rajesh Kumar (Badge #CG-8401)",
      signing_certificate: "Class 3 DSC - Rajesh Kumar (e-Mudhra CA)",
      organization: "Chhattisgarh State Police",
      storage_path: "storage/vault/Witness_Statement.enc",
      description: "Sworn eye-witness testimony recorded under Section 180 BNSS (161 CrPC).",
      created_by_id: "usr-io-001",
      uploaded_on: "25 Sep 2026, 14:32:11 IST"
    },
    {
      id: "DOC-2026-00120",
      case_id: "FIR-2026-001",
      name: "FIR_2026_001.pdf",
      doc_type: "FIR",
      size: "1.8 MB",
      file_size_bytes: 1887436,
      pages: 3,
      status: "Verified",
      is_sensitive: 0,
      is_redacted: 0,
      master_sha256: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      redacted_sha256: null,
      merkle_root: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
      tx_id: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      block_number: 128940,
      signer: "Duty Officer SI M. Sinha",
      signing_certificate: "Class 3 DSC - M. Sinha (NIC-CA)",
      organization: "Chhattisgarh State Police",
      storage_path: "storage/vault/FIR_2026_001.enc",
      description: "Initial First Information Report lodged at Station.",
      created_by_id: "usr-io-001",
      uploaded_on: "12 Aug 2026, 14:48:00 IST"
    },
    {
      id: "DOC-2026-00122",
      case_id: "FIR-2026-001",
      name: "Forensic_Report.pdf",
      doc_type: "Report",
      size: "5.1 MB",
      file_size_bytes: 5347737,
      pages: 12,
      status: "Pending",
      is_sensitive: 0,
      is_redacted: 0,
      master_sha256: "f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2",
      redacted_sha256: null,
      merkle_root: "f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2",
      tx_id: "0x7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
      block_number: 129105,
      signer: "Dr. Meera Singh (FSL Raipur)",
      signing_certificate: "Class 3 DSC - Meera Singh (NIC-CA)",
      organization: "State Forensic Science Laboratory",
      storage_path: "storage/vault/Forensic_Report.enc",
      description: "Ballistics and chemical analysis report.",
      created_by_id: "usr-fsl-002",
      uploaded_on: "21 Aug 2026, 11:50:22 IST"
    },
    {
      id: "DOC-2026-00121",
      case_id: "FIR-2026-001",
      name: "Seizure_Memo.pdf",
      doc_type: "Evidence",
      size: "3.2 MB",
      file_size_bytes: 3355443,
      pages: 2,
      status: "Verified",
      is_sensitive: 0,
      is_redacted: 0,
      master_sha256: "e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3",
      redacted_sha256: null,
      merkle_root: "e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3",
      tx_id: "0x5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b",
      block_number: 129012,
      signer: "SI Rajesh Kumar",
      signing_certificate: "Class 3 DSC - Rajesh Kumar (e-Mudhra CA)",
      organization: "Chhattisgarh State Police",
      storage_path: "storage/vault/Seizure_Memo.enc",
      description: "Recovery of physical exhibit #EX-1 from crime scene.",
      created_by_id: "usr-io-001",
      uploaded_on: "15 Aug 2026, 16:35:10 IST"
    }
  ];

  const insertEvidence = db.prepare(`
    INSERT INTO evidence_records (id, case_id, name, doc_type, size, file_size_bytes, pages, status, is_sensitive, is_redacted, master_sha256, redacted_sha256, merkle_root, tx_id, block_number, signer, signing_certificate, organization, storage_path, description, created_by_id, uploaded_on)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const e of seedEvidences) {
    insertEvidence.run(e.id, e.case_id, e.name, e.doc_type, e.size, e.file_size_bytes, e.pages, e.status, e.is_sensitive, e.is_redacted, e.master_sha256, e.redacted_sha256, e.merkle_root, e.tx_id, e.block_number, e.signer, e.signing_certificate, e.organization, e.storage_path, e.description, e.created_by_id, e.uploaded_on);
  }

  // 4. Seed Initial Custody Chain Events
  const seedCustody = [
    {
      id: "CUST-001",
      evidence_id: "DOC-2026-00123",
      stage: "Document Created",
      actor: "SI Rajesh Kumar (IO)",
      role: "Investigating Officer",
      organization: "Chhattisgarh State Police",
      timestamp: "25 Sep 2026, 14:32 IST",
      location: "Chhattisgarh Sadar Police Station",
      details: "Witness statement recorded under Section 180 BNSS. Computed pre-ingestion SHA-256 hash.",
      verified: 1,
      digital_signature: "0x3a4b5c...9a0b",
      tx_id: "0x8f13c2...789e"
    },
    {
      id: "CUST-002",
      evidence_id: "DOC-2026-00123",
      stage: "Digitally Signed",
      actor: "SI Rajesh Kumar",
      role: "Investigating Officer",
      organization: "Chhattisgarh State Police",
      timestamp: "25 Sep 2026, 14:32 IST",
      location: "Officer Terminal #4",
      details: "Signed with Class 3 Digital Signature Certificate. Non-repudiation key registered with NIC-CA.",
      verified: 1,
      digital_signature: "0x4b5c6d...0b1c",
      tx_id: "0x8f13c2...789e"
    },
    {
      id: "CUST-003",
      evidence_id: "DOC-2026-00123",
      stage: "Anchored on Blockchain",
      actor: "Hyperledger Fabric Consortium",
      role: "Consortium Endorsement Peer",
      organization: "NIC MeghRaj Cloud",
      timestamp: "25 Sep 2026, 14:35 IST",
      location: "Block #129381 (Tx: 0x8f13c2...789e)",
      details: "Consensus achieved across Police, Judicial, and Forensic nodes with Raft BFT ordering.",
      verified: 1,
      digital_signature: "0x5c6d7e...1c2d",
      tx_id: "0x8f13c2...789e"
    },
    {
      id: "CUST-004",
      evidence_id: "DOC-2026-00123",
      stage: "Accessed by FSL",
      actor: "Dr. Meera Singh",
      role: "Forensic Analyst",
      organization: "State Forensic Science Laboratory",
      timestamp: "27 Sep 2026, 11:20 IST",
      location: "Cyber Forensics Division, Raipur",
      details: "Decrypted using role-delegated private key for ballistic consistency examination.",
      verified: 1,
      digital_signature: "0x6d7e8f...2d3e",
      tx_id: "0x8f13c2...789e"
    },
    {
      id: "CUST-005",
      evidence_id: "DOC-2026-00123",
      stage: "Accessed by Prosecutor",
      actor: "R. Varma",
      role: "Public Prosecutor",
      organization: "Directorate of Prosecution",
      timestamp: "28 Sep 2026, 09:45 IST",
      location: "District Court Prosecution Office",
      details: "Generated trial dossier. Downloaded Section 72 BNS redacted derivative copy.",
      verified: 1,
      digital_signature: "0x7e8f9a...3e4f",
      tx_id: "0x8f13c2...789e"
    },
    {
      id: "CUST-006",
      evidence_id: "DOC-2026-00123",
      stage: "Viewed by Judge",
      actor: "Justice S. Iyer",
      role: "District & Sessions Judge",
      organization: "Sessions Court Room No. 3",
      timestamp: "28 Sep 2026, 16:12 IST",
      location: "Court Judicial Bench",
      details: "Instant in-court cryptographic hash verification. Section 63 BSA certificate admitted.",
      verified: 1,
      digital_signature: "0x8f9a0b...4f5a",
      tx_id: "0x8f13c2...789e"
    }
  ];

  const insertCustody = db.prepare(`
    INSERT INTO custody_chain (id, evidence_id, stage, actor, role, organization, timestamp, location, details, verified, digital_signature, tx_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const c of seedCustody) {
    insertCustody.run(c.id, c.evidence_id, c.stage, c.actor, c.role, c.organization, c.timestamp, c.location, c.details, c.verified, c.digital_signature, c.tx_id);
  }

  // 5. Seed Initial Audit Trail Events
  const seedAudit = [
    {
      id: "AUD-991",
      timestamp: "28 Sep 2026, 16:12 IST",
      user: "Justice S. Iyer",
      user_role: "District Judge",
      organization: "Sessions Court Raipur",
      action: "Document Verified",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Checked SHA-256 against ledger before bail hearing.",
      ip_address: "10.14.82.11",
      mac_hash: "e2b4...8f1a"
    },
    {
      id: "AUD-990",
      timestamp: "28 Sep 2026, 09:45 IST",
      user: "R. Varma",
      user_role: "Public Prosecutor",
      organization: "Directorate of Prosecution",
      action: "Document Accessed",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Exported redacted case copy for committal.",
      ip_address: "10.14.82.45",
      mac_hash: "c1a9...7e2b"
    },
    {
      id: "AUD-989",
      timestamp: "27 Sep 2026, 11:20 IST",
      user: "Dr. Meera Singh",
      user_role: "Forensic Analyst",
      organization: "State Forensic Science Lab",
      action: "Document Accessed",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Cross-referenced witness timeline with ballistic timings.",
      ip_address: "10.12.44.19",
      mac_hash: "a4f8...3c9d"
    },
    {
      id: "AUD-988",
      timestamp: "25 Sep 2026, 15:30 IST",
      user: "System (Fabric Peer #1)",
      user_role: "Blockchain Peer",
      organization: "Hyperledger Consortium",
      action: "Archived to Blockchain",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Block #129381 committed across 3 endorsement organizations.",
      ip_address: "10.10.1.5",
      mac_hash: "d9e2...5b8c"
    },
    {
      id: "AUD-987",
      timestamp: "25 Sep 2026, 14:35 IST",
      user: "SI Rajesh Kumar",
      user_role: "Investigating Officer",
      organization: "Chhattisgarh State Police",
      action: "Digitally Signed",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Signed with Class 3 DSC Hardware Token.",
      ip_address: "192.168.1.104",
      mac_hash: "f8a1...4d6e"
    },
    {
      id: "AUD-986",
      timestamp: "25 Sep 2026, 14:32 IST",
      user: "SI Rajesh Kumar",
      user_role: "Investigating Officer",
      organization: "Chhattisgarh State Police",
      action: "Document Created",
      document: "DOC-2026-00123",
      result: "Success",
      details: "Ingested via NyayaVault Offline Field Client.",
      ip_address: "192.168.1.104",
      mac_hash: "f8a1...4d6e"
    }
  ];

  const insertAudit = db.prepare(`
    INSERT INTO audit_trail (id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const a of seedAudit) {
    insertAudit.run(a.id, a.timestamp, a.user, a.user_role, a.organization, a.action, a.document, a.result, a.details, a.ip_address, a.mac_hash);
  }

  console.log("Database initialized and seeded successfully.");
}
