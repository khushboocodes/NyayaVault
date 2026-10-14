import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

const client = (tursoUrl && tursoAuthToken)
  ? createClient({ url: tursoUrl, authToken: tursoAuthToken })
  : null;

const seedAuditIds = ['AUD-991', 'AUD-990', 'AUD-989', 'AUD-988', 'AUD-987', 'AUD-986'];

async function runCleanup() {
  const arg = process.argv[2];

  if (arg && arg.startsWith('AUD-')) {
    console.log(`🗑️ Deleting specific audit log: ${arg}...`);
    try {
      db.prepare('DELETE FROM audit_trail WHERE id = ?').run(arg);
    } catch (e) {}

    if (client) {
      await client.execute({ sql: 'DELETE FROM audit_trail WHERE id = ?', args: [arg] });
    }
    console.log(`✅ Log ${arg} successfully deleted from local and Turso Cloud!`);
    return;
  }

  if (arg === '--all') {
    console.log('⚠️ Clearing ALL audit logs...');
    try {
      db.prepare('DELETE FROM audit_trail').run();
    } catch (e) {}

    if (client) {
      await client.execute('DELETE FROM audit_trail');
    }
    console.log('✅ All audit logs wiped clean.');
    return;
  }

  // Default: Keep baseline seeds, delete ephemeral test logs
  console.log('🧹 Cleaning test logs and preserving baseline seed records (AUD-986 to AUD-991)...');
  const placeholders = seedAuditIds.map(() => '?').join(', ');

  try {
    db.prepare(`DELETE FROM audit_trail WHERE id NOT IN (${placeholders})`).run(...seedAuditIds);
  } catch (e) {}

  if (client) {
    await client.execute({
      sql: `DELETE FROM audit_trail WHERE id NOT IN (${placeholders})`,
      args: seedAuditIds
    });
  }

  console.log('✅ Audit trail cleanup complete! Only baseline records preserved.');
}

runCleanup()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
  });
