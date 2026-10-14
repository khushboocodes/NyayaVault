import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEED_CASES, SEED_EVIDENCE } from './evidenceDataset.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('❌ Error: TURSO_DATABASE_URL is not set in environment or server/.env.');
  console.log('👉 Please create a free database on https://turso.tech and add your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
  process.exit(1);
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken
});

async function migrate() {
  console.log(`🚀 Connecting to Turso Cloud SQLite: ${tursoUrl}...`);

  // 1. Create Tables
  await client.execute(`
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

  await client.execute(`
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

  await client.execute(`
    CREATE TABLE IF NOT EXISTS evidence_records (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      name TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      size TEXT NOT NULL,
      file_size_bytes INTEGER,
      pages INTEGER DEFAULT 1,
      status TEXT NOT NULL DEFAULT 'Active',
      is_sensitive INTEGER NOT NULL DEFAULT 0,
      is_redacted INTEGER NOT NULL DEFAULT 0,
      master_sha256 TEXT NOT NULL,
      redacted_sha256 TEXT,
      merkle_root TEXT,
      tx_id TEXT,
      block_number INTEGER,
      signer TEXT,
      signing_certificate TEXT,
      organization TEXT,
      storage_path TEXT,
      encrypted_dek TEXT,
      iv TEXT,
      auth_tag TEXT,
      description TEXT,
      uploaded_on DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (case_id) REFERENCES cases(id)
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS custody_chain (
      id TEXT PRIMARY KEY,
      evidence_id TEXT NOT NULL,
      stage TEXT NOT NULL,
      actor TEXT NOT NULL,
      role TEXT NOT NULL,
      organization TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      location TEXT NOT NULL,
      details TEXT NOT NULL,
      verified INTEGER NOT NULL DEFAULT 1,
      digital_signature TEXT,
      tx_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evidence_id) REFERENCES evidence_records(id)
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS audit_trail (
      id TEXT PRIMARY KEY,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      user TEXT NOT NULL,
      user_role TEXT NOT NULL,
      organization TEXT NOT NULL,
      action TEXT NOT NULL,
      document TEXT,
      result TEXT NOT NULL,
      details TEXT,
      ip_address TEXT DEFAULT '127.0.0.1',
      mac_hash TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS offline_queue (
      id TEXT PRIMARY KEY,
      device_id TEXT NOT NULL,
      client_record_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      case_id TEXT NOT NULL,
      raw_payload TEXT,
      device_timestamp DATETIME NOT NULL,
      received_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      drift_seconds REAL DEFAULT 0,
      sync_flag TEXT DEFAULT 'NORMAL',
      status TEXT DEFAULT 'PENDING'
    );
  `);

  console.log('✅ Turso Schema verified and tables created!');

  // Check if users exist
  const res = await client.execute('SELECT COUNT(*) as count FROM users');
  const count = Number(res.rows[0].count);

  if (count === 0) {
    console.log('🌱 Seeding default institutional users into Turso...');
    const salt = bcrypt.genSaltSync(10);
    const passHash = bcrypt.hashSync('password123', salt);

    const users = [
      ['usr-001', 'police_io.nyayavault', 'Inspector Rajesh Sharma', 'io@police.cg.gov.in', passHash, 'io', 'IO', 'Investigating Officer', 'Chhattisgarh State Police - Sadar Thana', 'CG-8402', '0x71c8f49a201b1e948c5a271b849204859a12bcde'],
      ['usr-002', 'forensic_analyst.nyayavault', 'Dr. Sunita Deshmukh', 's.deshmukh@dfsl.gov.in', passHash, 'fsl', 'FSL', 'Senior Forensic Analyst', 'Central Forensic Science Laboratory (CFSL)', 'CFSL-9102', '0x83f901ab321c4e918c5a271b849204859a12bcab'],
      ['usr-003', 'prosecutor.nyayavault', 'Adv. Vikramaditya Verma', 'v.verma@prosecution.gov.in', passHash, 'prosecutor', 'PROSECUTOR', 'Chief Public Prosecutor', 'Directorate of Public Prosecution', 'BAR-DL-4921', '0x99a2c1de54321e918c5a271b849204859a12bccc'],
      ['usr-004', 'judge.nyayavault', 'Hon. Justice K. S. Radhakrishnan', 'chamber.judge@delhidistrictcourts.nic.in', passHash, 'judge', 'JUDGE', 'Principal District & Sessions Judge', 'Delhi Judicial Service • Rouse Avenue Court Complex', 'DJS-1092', '0x44b1c9ef87654e918c5a271b849204859a12baaa']
    ];

    for (const u of users) {
      await client.execute({
        sql: `INSERT INTO users (id, username, full_name, email, password_hash, role_id, role_code, role_title, agency_name, badge_number, public_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: u
      });
    }

    console.log('✅ Seeded 4 institutional users successfully!');
  }

  // Synchronize All 6 Master Cases
  console.log('🌱 Synchronizing all 6 master cases into Turso Cloud...');
  for (const c of SEED_CASES) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO cases (id, fir_number, case_title, police_station, district, state, crime_head, investigating_officer, badge_number, date_of_registration, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [c.id, c.fir_number, c.case_title, c.police_station, c.district, c.state, c.crime_head, c.investigating_officer, c.badge_number, c.date_of_registration, c.status, c.priority]
    });
  }
  console.log(`✅ Synchronized ${SEED_CASES.length} cases successfully in Turso!`);

  // Synchronize All 24 Forensic Evidence Records
  console.log('🌱 Synchronizing all 24 authentic forensic exhibits into Turso Cloud...');
  for (const e of SEED_EVIDENCE) {
    await client.execute({
      sql: `INSERT OR REPLACE INTO evidence_records (id, case_id, name, doc_type, size, file_size_bytes, pages, status, is_sensitive, is_redacted, master_sha256, redacted_sha256, merkle_root, tx_id, block_number, signer, signing_certificate, organization, storage_path, description, uploaded_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [e.id, e.case_id, e.name, e.doc_type, e.size, e.file_size_bytes, e.pages, e.status, e.is_sensitive, e.is_redacted, e.master_sha256, e.redacted_sha256, e.merkle_root, e.tx_id, e.block_number, e.signer, e.signing_certificate, e.organization, e.storage_path, e.description, e.uploaded_on]
    });
  }
  console.log(`✅ Synchronized ${SEED_EVIDENCE.length} forensic exhibits successfully in Turso!`);

  // Synchronize Baseline Custody Chain for DOC-2026-00104 if needed
  const custRes = await client.execute('SELECT COUNT(*) as count FROM custody_chain');
  if (Number(custRes.rows[0].count) === 0) {
    console.log('🌱 Seeding initial custody chain for DOC-2026-00104...');
    const seedCustody = [
      ['CUST-001', 'DOC-2026-00104', 'Document Created', 'SI Rajesh Kumar (IO)', 'Investigating Officer', 'Chhattisgarh State Police', '25 Sep 2026, 14:32 IST', 'Chhattisgarh Sadar Police Station', 'Witness statement recorded under Section 180 BNSS. Computed pre-ingestion SHA-256 hash.', 1, '0x3a4b5c...9a0b', '0x8f13c2...789e'],
      ['CUST-002', 'DOC-2026-00104', 'Digitally Signed', 'SI Rajesh Kumar', 'Investigating Officer', 'Chhattisgarh State Police', '25 Sep 2026, 14:32 IST', 'Officer Terminal #4', 'Signed with Class 3 Digital Signature Certificate. Non-repudiation key registered with NIC-CA.', 1, '0x4b5c6d...0b1c', '0x8f13c2...789e'],
      ['CUST-003', 'DOC-2026-00104', 'Anchored on Blockchain', 'Hyperledger Fabric Consortium', 'Consortium Endorsement Peer', 'NIC MeghRaj Cloud', '25 Sep 2026, 14:35 IST', 'Block #129381 (Tx: 0x8f13c2...789e)', 'Consensus achieved across Police, Judicial, and Forensic nodes with Raft BFT ordering.', 1, '0x5c6d7e...1c2d', '0x8f13c2...789e'],
      ['CUST-004', 'DOC-2026-00104', 'Accessed by FSL', 'Dr. Meera Singh', 'Forensic Analyst', 'State Forensic Science Laboratory', '27 Sep 2026, 11:20 IST', 'Cyber Forensics Division, Raipur', 'Decrypted using role-delegated private key for ballistic consistency examination.', 1, '0x6d7e8f...2d3e', '0x8f13c2...789e'],
      ['CUST-005', 'DOC-2026-00104', 'Accessed by Prosecutor', 'R. Varma', 'Public Prosecutor', 'Directorate of Prosecution', '28 Sep 2026, 09:45 IST', 'District Court Prosecution Office', 'Generated trial dossier. Downloaded Section 72 BNS redacted derivative copy.', 1, '0x7e8f9a...3e4f', '0x8f13c2...789e'],
      ['CUST-006', 'DOC-2026-00104', 'Viewed by Judge', 'Justice S. Iyer', 'District & Sessions Judge', 'Sessions Court Room No. 3', '28 Sep 2026, 16:12 IST', 'Court Judicial Bench', 'Instant in-court cryptographic hash verification. Section 63 BSA certificate admitted.', 1, '0x8f9a0b...4f5a', '0x8f13c2...789e']
    ];
    for (const c of seedCustody) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO custody_chain (id, evidence_id, stage, actor, role, organization, timestamp, location, details, verified, digital_signature, tx_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: c
      });
    }
  }

  console.log('🎉 Turso cloud database is 100% synchronized and ready for live production deployment!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
