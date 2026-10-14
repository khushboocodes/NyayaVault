import { createClient } from '@libsql/client';
import { config } from '../config/env.js';

export const isTursoConfigured = Boolean(config.tursoUrl && config.tursoAuthToken);

export const tursoClient = isTursoConfigured
  ? createClient({
      url: config.tursoUrl,
      authToken: config.tursoAuthToken
    })
  : null;

if (isTursoConfigured) {
  console.log('📡 Turso Cloud SQLite integration initialized.');
} else {
  console.log('ℹ️ Turso Cloud credentials not detected, using local SQLite engine.');
}

/**
 * Execute a query on Turso Cloud SQLite returning rows.
 */
export async function queryTurso(sql, args = []) {
  if (!tursoClient) return null;
  try {
    const res = await tursoClient.execute({ sql, args });
    return res.rows;
  } catch (err) {
    console.warn('⚠️ Turso Query Warning:', err.message);
    return null;
  }
}

/**
 * Execute a mutation (INSERT/UPDATE/DELETE) on Turso Cloud SQLite.
 */
export async function executeTurso(sql, args = []) {
  if (!tursoClient) return null;
  try {
    const res = await tursoClient.execute({ sql, args });
    return res;
  } catch (err) {
    console.warn('⚠️ Turso Execute Warning:', err.message);
    return null;
  }
}

/**
 * Ensures baseline audit trail rows exist in Turso Cloud.
 */
export async function ensureTursoAuditSeeded(seedAuditList = []) {
  if (!tursoClient) return;
  try {
    const countRes = await tursoClient.execute('SELECT COUNT(*) as c FROM audit_trail');
    const count = Number(countRes.rows[0]?.c || 0);
    if (count === 0 && seedAuditList.length > 0) {
      console.log('🌱 Seeding baseline audit trail into Turso Cloud...');
      for (const a of seedAuditList) {
        await tursoClient.execute({
          sql: `INSERT INTO audit_trail (
            id, timestamp, user, user_role, organization, action, document, result, details, ip_address, mac_hash
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            a.id, a.timestamp, a.user, a.user_role, a.organization,
            a.action, a.document, a.result, a.details, a.ip_address, a.mac_hash
          ]
        });
      }
      console.log(`✅ Seeded ${seedAuditList.length} baseline audit records into Turso Cloud!`);
    }
  } catch (err) {
    console.warn('Turso audit seeding check notice:', err.message);
  }
}
