// =============================================================================
// NYAYAVAULT — ROLE-BASED ACCESS CONTROL (RBAC) SINGLE SOURCE OF TRUTH
// Contains EXACTLY 4 roles with generic prototype usernames, no personal names.
// =============================================================================

export const ROLES = [
  {
    id: 'io',
    code: 'IO',
    label: 'Investigating Officer (IO)',
    title: 'Investigating Officer',
    username: 'io_officer.nyayavault',
    defaultPassword: 'password123',
    desc: 'Primary evidence ingestion, FIR filing, seizure memos, hash generation, and field sync.',
    allowedScreens: [
      'dashboard',
      'cases',
      'case-details',
      'upload',
      'documents',
      'document-viewer',
      'custody',
      'mobile-app',
      'settings',
      'verification',
      'certificates',
      'audit'
    ],
    defaultScreen: 'dashboard'
  },
  {
    id: 'fsl',
    code: 'FSL',
    label: 'Forensic Lab Analyst',
    title: 'Forensic Lab Analyst',
    username: 'forensic_analyst.nyayavault',
    defaultPassword: 'password123',
    desc: 'Access seized electronic evidence, verify cryptographic hashes, and upload forensic examination reports.',
    allowedScreens: [
      'dashboard',
      'cases',
      'case-details',
      'upload',
      'documents',
      'document-viewer',
      'custody',
      'mobile-app',
      'settings',
      'verification',
      'certificates',
      'audit'
    ],
    defaultScreen: 'dashboard'
  },
  {
    id: 'prosecutor',
    code: 'PROSECUTOR',
    label: 'Public Prosecutor',
    title: 'Public Prosecutor',
    username: 'prosecutor.nyayavault',
    defaultPassword: 'password123',
    desc: 'Review police dossiers, inspect Section 72 BNS redactions, and export Section 63 BSA certificates.',
    allowedScreens: [
      'dashboard',
      'cases',
      'case-details',
      'upload',
      'documents',
      'document-viewer',
      'custody',
      'mobile-app',
      'settings',
      'verification',
      'certificates',
      'audit'
    ],
    defaultScreen: 'dashboard'
  },
  {
    id: 'judge',
    code: 'JUDGE',
    label: 'District & Sessions Judge',
    title: 'District & Sessions Judge',
    username: 'judge.nyayavault',
    defaultPassword: 'password123',
    desc: 'Examine sealed unredacted court records, verify real-time blockchain proof, and sign judicial orders.',
    allowedScreens: [
      'dashboard',
      'cases',
      'case-details',
      'upload',
      'documents',
      'document-viewer',
      'custody',
      'mobile-app',
      'settings',
      'verification',
      'certificates',
      'audit'
    ],
    defaultScreen: 'dashboard'
  }
];

export const DEFAULT_ROLE = ROLES[0]; // Investigating Officer (IO)
