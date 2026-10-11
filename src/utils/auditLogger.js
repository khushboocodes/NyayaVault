import { api } from '../api';
import { ROLES, DEFAULT_ROLE } from '../data/rolesData';

// Map role IDs to realistic institutional personas
const PERSONA_MAP = {
  io: {
    user: 'SI Rajesh Kumar',
    userRole: 'Investigating Officer (IO)',
    organization: 'Chhattisgarh State Police'
  },
  fsl: {
    user: 'Dr. Meera Singh',
    userRole: 'Forensic Lab Analyst',
    organization: 'State Forensic Science Laboratory, Raipur'
  },
  prosecutor: {
    user: 'Adv. R. Varma',
    userRole: 'Public Prosecutor',
    organization: 'Directorate of Prosecution, Raipur'
  },
  judge: {
    user: 'Justice S. Iyer',
    userRole: 'District & Sessions Judge',
    organization: 'District & Sessions Court Room No. 3, Raipur'
  }
};

// Simple in-memory de-duplication cache to prevent re-render flood
const recentEvents = new Map();

/**
 * Global audit activity logging helper.
 * Records user interactions, views, downloads, uploads, and verifications in the sovereign ledger.
 *
 * @param {Object} params
 * @param {string} params.action - Verb (e.g. 'Document Viewed', 'Document Downloaded', 'BSA Certificate Generated')
 * @param {string} [params.document] - Target document name, ID, or FIR Number
 * @param {string} [params.details] - Detailed description of what the user did/saw
 * @param {string} [params.result] - 'Success' | 'Alert' | 'Denied'
 * @param {string} [params.user] - Override user full name
 * @param {string} [params.userRole] - Override user role title
 * @param {string} [params.organization] - Override user organization
 */
export async function logActivity({
  action,
  document = 'System Portal',
  details = 'Activity recorded.',
  result = 'Success',
  user,
  userRole,
  organization
}) {
  if (!action) return;

  // Deduplication check: ignore identical event within 3 seconds
  const dedupeKey = `${action}|${document}|${details}`;
  const now = Date.now();
  if (recentEvents.has(dedupeKey) && (now - recentEvents.get(dedupeKey)) < 3000) {
    return;
  }
  recentEvents.set(dedupeKey, now);

  // Clean old keys
  if (recentEvents.size > 100) {
    recentEvents.clear();
  }

  // Resolve active persona from sessionStorage
  const activeRoleId = typeof window !== 'undefined'
    ? (sessionStorage.getItem('nyayavault_role_id') || 'io')
    : 'io';
  
  const persona = PERSONA_MAP[activeRoleId] || PERSONA_MAP.io;

  const payload = {
    action,
    document,
    details,
    result,
    user: user || persona.user,
    userRole: userRole || persona.userRole,
    organization: organization || persona.organization
  };

  try {
    const res = await api.audit.log(payload);

    // Notify listeners (e.g. AuditTrailPage) to update live in real-time
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nyayavault_audit_logged', {
        detail: res?.audit || payload
      }));
    }
    return res;
  } catch (err) {
    console.warn('Audit activity logging warning:', err.message);
  }
}
