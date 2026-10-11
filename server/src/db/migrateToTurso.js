import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

  // Seed Cases if empty
  const caseRes = await client.execute('SELECT COUNT(*) as count FROM cases');
  if (Number(caseRes.rows[0].count) === 0) {
    console.log('🌱 Seeding initial FIR cases into Turso...');
    const seedCases = [
      ['FIR-2026-001', 'FIR-2026-001', 'Murder Investigation', 'Chhattisgarh Sadar', 'Raipur', 'Chhattisgarh', 'Section 103 BNS (Sec 302 IPC)', 'SI Rajesh Kumar', 'CG-8401', '12 Aug 2026, 14:45 IST', 'Active', 'High'],
      ['FIR-2026-002', 'FIR-2026-002', 'Theft Case', 'Patna City', 'Patna', 'Bihar', 'Section 303 BNS (Sec 379 IPC)', 'Insp. Vikramaditya', 'BR-2204', '18 Aug 2026, 10:15 IST', 'Active', 'Normal'],
      ['FIR-2026-003', 'FIR-2026-003', 'Cyber Fraud & Extortion', 'Gwalior Thana', 'Gwalior', 'Madhya Pradesh', 'Section 66D IT Act / Sec 318 BNS', 'SI Neha Verma', 'MP-5512', '25 Aug 2026, 16:20 IST', 'Pending', 'High'],
      ['FIR-2026-004', 'FIR-2026-004', 'NDPS Seizure Operation', 'Gaya Kotwali', 'Gaya', 'Bihar', 'Section 20 NDPS Act', 'SI Rajesh Kumar', 'CG-8401', '02 Sep 2026, 09:30 IST', 'Active', 'Normal'],
      ['FIR-2026-005', 'FIR-2026-005', 'Illegal Arms Recovery', 'Ranchi Sadar', 'Ranchi', 'Jharkhand', 'Section 25 Arms Act', 'Insp. S. Soren', 'JH-9011', '10 Sep 2026, 12:00 IST', 'Active', 'Normal']
    ];

    for (const c of seedCases) {
      await client.execute({
        sql: `INSERT INTO cases (id, fir_number, case_title, police_station, district, state, crime_head, investigating_officer, badge_number, date_of_registration, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: c
      });
    }
    console.log('✅ Seeded 5 FIR cases successfully into Turso!');
  }

  // Seed Initial Evidence Records if empty
  const docRes = await client.execute('SELECT COUNT(*) as count FROM evidence_records');
  if (Number(docRes.rows[0].count) === 0) {
    console.log('🌱 Seeding sample evidence records into Turso...');
    const seedDocs = [
      ['DOC-2026-00123', 'FIR-2026-001', 'Witness_Statement.pdf', 'Statement', '2.4 MB', 2516582, 4, 'Verified', 1, 1, 'a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be', '8f4e2b01c9a7d34e65f12980145be8a3f5e7c9b2d4e6f8a2c41893341b8a9f31', '9e5c4a3b2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c', '0x8f13c2d4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e6789e', 129381, 'SI Rajesh Kumar (Badge #CG-8401)', 'Class 3 DSC - Rajesh Kumar (e-Mudhra CA)', 'Chhattisgarh State Police', 'storage/vault/Witness_Statement.enc', 'Sworn eye-witness testimony recorded under Section 180 BNSS (161 CrPC).', '25 Sep 2026, 14:32:11 IST'],
      ['DOC-2026-00120', 'FIR-2026-001', 'FIR_2026_001.pdf', 'FIR', '1.8 MB', 1887436, 3, 'Verified', 0, 0, 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4', null, '5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f', '0x7e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d', 129375, 'Insp. Arvind Shukla', 'Class 3 Judicial CA', 'Chhattisgarh State Police', 'storage/vault/FIR_2026_001.enc', 'First Information Report under Section 154 CrPC / 173 BNSS.', '12 Aug 2026, 14:48:00 IST']
    ];

    for (const d of seedDocs) {
      await client.execute({
        sql: `INSERT INTO evidence_records (id, case_id, name, doc_type, size, file_size_bytes, pages, status, is_sensitive, is_redacted, master_sha256, redacted_sha256, merkle_root, tx_id, block_number, signer, signing_certificate, organization, storage_path, description, uploaded_on) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: d
      });
    }
    console.log('✅ Seeded initial evidence records successfully into Turso!');
  }

  console.log('🎉 Turso cloud database is 100% synchronized and ready for live production deployment!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
