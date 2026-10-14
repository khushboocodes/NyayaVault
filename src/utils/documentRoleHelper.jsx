import React from 'react';
import { Shield, Microscope, Scale, Landmark, FileText, CheckCircle2 } from 'lucide-react';

/**
 * Standard configuration for the 4 institutional roles in the Indian Criminal Justice System.
 */
export const ROLE_CONFIG = {
  io: {
    id: 'io',
    code: 'IO',
    name: 'Investigating Officer',
    shortLabel: 'Police (IO)',
    badgeLabel: 'Police Evidence',
    icon: Shield,
    iconEmoji: '👮',
    accentColor: '#3B82F6',
    bgColor: 'rgba(30, 58, 138, 0.22)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    textColor: '#93C5FD',
    uploadActionLabel: 'Ingest Police Evidence',
    uploadBadge: '👮 Investigating Officer (Police Air-Lock)',
    uploadHeading: 'Ingest Police Evidence & Case Exhibits',
    uploadDescription: 'Upload First Information Reports (FIR), seizure memos, Section 180 BNSS witness statements, and physical/digital recovery memos into the immutable sovereign vault.',
    categories: [
      'First Information Report (FIR)',
      'Witness Statement (Sec 180 BNSS / 161 CrPC)',
      'Seizure Memo / Panchnama',
      'Police Final Charge Sheet (Sec 193 BNSS)',
      'CCTV / Physical Evidence Seizure Exhibit'
    ],
    defaultPresetA: {
      name: 'Witness_Deposition_Statement.pdf',
      size: '2.4 MB',
      type: 'Witness Statement',
      isSensitive: true,
      desc: 'Sworn statement of eyewitness regarding suspect presence near crime scene. Section 72 BNS PII protection active.'
    },
    defaultPresetB: {
      name: 'Seizure_Memo_Recovery_Panchnama.pdf',
      size: '1.8 MB',
      type: 'Seizure Memo',
      isSensitive: false,
      desc: 'Official recovery panchnama of seized physical articles executed before two independent panch witnesses.'
    },
    certificates: [
      'Class 3 DSC - SI Rajesh Kumar (NIC-CA)',
      'Police Department Token #CG-POL-8401',
      'Aadhaar eSign (UIDAI Gateway)'
    ]
  },
  fsl: {
    id: 'fsl',
    code: 'FSL',
    name: 'Forensic Lab Analyst',
    shortLabel: 'Forensic Lab',
    badgeLabel: 'Forensic Report',
    icon: Microscope,
    iconEmoji: '🔬',
    accentColor: '#10B981',
    bgColor: 'rgba(5, 150, 105, 0.22)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    textColor: '#6EE7B7',
    uploadActionLabel: 'Submit Lab Report',
    uploadBadge: '🔬 Forensic Science Laboratory (FSL Gate)',
    uploadHeading: 'Submit Forensic Examination Report',
    uploadDescription: 'Upload scientific examination findings, ballistics striation matching, digital forensic triage dumps, toxicology chemical memos, and biological DNA reports.',
    categories: [
      'FSL Ballistics & Striation Examination Report',
      'Digital Forensic Extraction & Triage Dump',
      'Toxicology / Chemical Examination Memo',
      'DNA Profiling & Biological Serology Report',
      'Medico-Legal Autopsy / Post-Mortem Examination'
    ],
    defaultPresetA: {
      name: 'SFSL_DNA_Profiling_Victim_Comparison.pdf',
      size: '3.8 MB',
      type: 'DNA Profiling',
      isSensitive: true,
      desc: 'Short Tandem Repeat (STR) 24-loci autosomal DNA profile comparison with Section 72 BNS protected biological lineage.'
    },
    defaultPresetB: {
      name: 'FSL_Ballistics_Striation_Match.pdf',
      size: '5.1 MB',
      type: 'Forensic Report',
      isSensitive: false,
      desc: 'Comparison microscope striation pattern matching and propellant chemical residue analysis linking recovered fired casing.'
    },
    certificates: [
      'Class 3 DSC - Dr. Meera Singh (SFSL Raipur)',
      'State Forensic Science Lab Token #SFSL-BALL-402',
      'NABL Laboratory Digital Signature'
    ]
  },
  prosecutor: {
    id: 'prosecutor',
    code: 'PROS',
    name: 'Public Prosecutor',
    shortLabel: 'Prosecutor',
    badgeLabel: 'Prosecution Petition',
    icon: Scale,
    iconEmoji: '⚖️',
    accentColor: '#8B5CF6',
    bgColor: 'rgba(124, 58, 237, 0.22)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    textColor: '#C4B5FD',
    uploadActionLabel: 'File Legal Submission',
    uploadBadge: '⚖️ Directorate of Prosecution (Court Filing Portal)',
    uploadHeading: 'File Legal Submission & Prosecution Petition',
    uploadDescription: 'File official prosecution petitions, bail rebuttal objections under Sec 480 BNSS, written final arguments under Sec 352 BNSS, witness summon applications, and committal dossiers.',
    categories: [
      'Bail Rebuttal Memo (Sec 480 BNSS)',
      'Written Arguments & Case Citations (Sec 352 BNSS)',
      'Witness Summoning Application (Sec 254 BNSS)',
      'Supplementary Evidence Petition (Sec 349 BNSS)',
      'Committal Brief & Sec 72 BNS Compliance Memo'
    ],
    defaultPresetA: {
      name: 'Prosecution_Bail_Rebuttal_Sec480_BNSS.pdf',
      size: '2.1 MB',
      type: 'Petition',
      isSensitive: true,
      desc: 'Formal objection filed under Section 480 BNSS opposing regular bail on grounds of established ballistic match and witness intimidation risks.'
    },
    defaultPresetB: {
      name: 'Prosecution_Written_Final_Arguments_Sec352_BNSS.pdf',
      size: '3.4 MB',
      type: 'Legal Submission',
      isSensitive: false,
      desc: 'Comprehensive written closing arguments filed under Section 352 BNSS with authoritative Supreme Court precedents on digital evidence.'
    },
    certificates: [
      'Class 3 DSC - Public Prosecutor R. Varma (NIC-CA)',
      'Directorate of Prosecution Official Token #DOP-CG-901',
      'Bar Council Electronic Signature Gateway'
    ]
  },
  judge: {
    id: 'judge',
    code: 'JUDGE',
    name: 'District & Sessions Judge',
    shortLabel: 'Sessions Court',
    badgeLabel: 'Judicial Order',
    icon: Landmark,
    iconEmoji: '🏛️',
    accentColor: '#EF4444',
    bgColor: 'rgba(220, 38, 38, 0.22)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    textColor: '#FCA5A5',
    uploadActionLabel: 'Record Judicial Order',
    uploadBadge: '🏛️ Judicial Bench / Court Room No. 3',
    uploadHeading: 'Record Judicial Order & Court Judgment',
    uploadDescription: 'Record official judicial orders, daily court order sheets (Roznamcha), bail grant/rejection rulings under Sec 480 BNSS, formal framing of charges orders (Sec 251 BNSS), and final conviction/acquittal verdicts.',
    categories: [
      'Daily Court Order Sheet / Roznamcha',
      'Bail Order (Granted / Rejected)',
      'Framing of Charges Judicial Order (Sec 251 BNSS)',
      'Judicial Remand & Custody Order (Sec 187 BNSS)',
      'Final Judgment & Conviction/Acquittal Verdict (Sec 258/261 BNSS)'
    ],
    defaultPresetA: {
      name: 'Judicial_Order_Bail_Ruling_Roznamcha.pdf',
      size: '1.9 MB',
      type: 'Court Order',
      isSensitive: true,
      desc: 'In-camera judicial order rejecting regular bail under Section 480 BNSS following direct blockchain verification of ballistic striation report.'
    },
    defaultPresetB: {
      name: 'Judicial_Charges_Framing_Order_Sec251_BNSS.pdf',
      size: '2.7 MB',
      type: 'Court Order',
      isSensitive: false,
      desc: 'Formal judicial order framing trial charges under Section 251 BNSS for Section 103 BNS (Murder) and Section 25 Arms Act.'
    },
    certificates: [
      'Class 3 Judicial DSC - Justice S. Iyer (Sessions Court Raipur)',
      'High Court Certified Judicial Hardware Token #HC-J-014',
      'e-Courts Sovereign Digital Bench Certificate'
    ]
  }
};

/**
 * Classifies any document into one of the 4 sovereign roles: 'io', 'fsl', 'prosecutor', 'judge'.
 */
export function getDocumentRole(doc) {
  if (!doc) return 'io';
  if (doc.uploadedByRole && ROLE_CONFIG[doc.uploadedByRole]) return doc.uploadedByRole;
  if (doc.role && ROLE_CONFIG[doc.role]) return doc.role;

  const type = (doc.type || '').toLowerCase();
  const name = (doc.name || '').toLowerCase();
  const signer = (doc.signer || '').toLowerCase();
  const org = (doc.organization || '').toLowerCase();
  const desc = (doc.description || '').toLowerCase();

  // 1. Judge / Court Orders & Judgments
  if (
    type.includes('order') || type.includes('judgment') || type.includes('verdict') || 
    type.includes('remand') || type.includes('court') ||
    name.includes('order') || name.includes('judgment') || name.includes('verdict') || 
    name.includes('remand') || name.includes('roznamcha') || name.includes('bail_ruling') ||
    name.includes('bail_order') || name.includes('bail_rejection') ||
    signer.includes('judge') || signer.includes('justice') || signer.includes('magistrate') ||
    org.includes('court') || org.includes('sessions') || org.includes('bench')
  ) {
    return 'judge';
  }

  // 2. Forensic Science Laboratory (FSL) Reports
  if (
    type.includes('forensic') || type.includes('fsl') || type.includes('lab') ||
    name.includes('fsl') || name.includes('autopsy') || name.includes('ballistic') ||
    name.includes('cyber') || name.includes('dna') || name.includes('toxicology') ||
    name.includes('striation') || name.includes('post_mortem') || name.includes('trace') ||
    name.includes('chemical') || name.includes('extraction') ||
    signer.includes('fsl') || signer.includes('dr.') || signer.includes('forensic') ||
    signer.includes('analyst') || signer.includes('expert') ||
    org.includes('forensic') || org.includes('sfsl') || org.includes('cfsl') || org.includes('hospital')
  ) {
    return 'fsl';
  }

  // 3. Prosecution Submissions & Petitions
  if (
    type.includes('petition') || type.includes('submission') || type.includes('motion') || 
    type.includes('argument') || type.includes('brief') ||
    name.includes('prosecution') || name.includes('rebuttal') || name.includes('bail_objection') ||
    name.includes('arguments') || name.includes('petition') || name.includes('summon') ||
    name.includes('committal') || name.includes('affidavit') ||
    signer.includes('prosecutor') || signer.includes('adv.') || signer.includes('prosecution') ||
    org.includes('prosecution') || org.includes('directorate of prosecution')
  ) {
    return 'prosecutor';
  }

  // 4. Default: Investigating Officer (Police IO)
  return 'io';
}

/**
 * Returns a styled role badge JSX component.
 */
export function RoleBadge({ roleKey, doc, compact = false, showSigner = false, signerText = '' }) {
  const resolvedRole = roleKey || (doc ? getDocumentRole(doc) : 'io');
  const cfg = ROLE_CONFIG[resolvedRole] || ROLE_CONFIG.io;
  const signer = signerText || doc?.signer || doc?.organization || '';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '2px' }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: compact ? '2px 7px' : '3px 9px',
          fontSize: compact ? '10px' : '11px',
          fontWeight: 600,
          borderRadius: '4px',
          background: cfg.bgColor,
          border: `1px solid ${cfg.borderColor}`,
          color: cfg.textColor,
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em'
        }}
      >
        <span style={{ fontSize: compact ? '11px' : '12px' }}>{cfg.iconEmoji}</span>
        <span>{compact ? cfg.shortLabel : cfg.badgeLabel}</span>
      </span>

      {showSigner && signer && (
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', paddingLeft: '2px' }}>
          {signer.split('(')[0].trim()}
        </span>
      )}
    </div>
  );
}
