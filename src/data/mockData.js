// Comprehensive mock data for NyayaVault Indian Criminal Justice System
import { MASTER_CASES, MASTER_DOCUMENTS } from './evidenceDataset';

export const INITIAL_CASES = MASTER_CASES;
export const INITIAL_DOCUMENTS = MASTER_DOCUMENTS;

export const INITIAL_AUDIT_TRAIL = [
  {
    id: "AUD-991",
    timestamp: "28 Sep 2026, 16:12 IST",
    user: "Justice S. Iyer",
    userRole: "District Judge",
    organization: "Sessions Court Raipur",
    action: "Document Verified",
    document: "DOC-2026-00104",
    result: "Success",
    details: "Checked SHA-256 against ledger before bail hearing."
  },
  {
    id: "AUD-990",
    timestamp: "28 Sep 2026, 09:45 IST",
    user: "R. Varma",
    userRole: "Public Prosecutor",
    organization: "Directorate of Prosecution",
    action: "Document Accessed",
    document: "DOC-2026-00104",
    result: "Success",
    details: "Exported redacted case copy for committal."
  },
  {
    id: "AUD-989",
    timestamp: "27 Sep 2026, 11:20 IST",
    user: "Dr. Meera Singh",
    userRole: "Forensic Analyst",
    organization: "State Forensic Science Lab",
    action: "Document Accessed",
    document: "DOC-2026-00103",
    result: "Success",
    details: "Cross-referenced witness timeline with ballistic timings."
  },
  {
    id: "AUD-988",
    timestamp: "25 Sep 2026, 15:30 IST",
    user: "System (Fabric Peer #1)",
    userRole: "Blockchain Peer",
    organization: "Hyperledger Consortium",
    action: "Archived to Blockchain",
    document: "DOC-2026-00101",
    result: "Success",
    details: "Block #129381 committed across 3 endorsement organizations."
  },
  {
    id: "AUD-987",
    timestamp: "25 Sep 2026, 14:35 IST",
    user: "SI Rajesh Kumar",
    userRole: "Investigating Officer",
    organization: "Chhattisgarh State Police",
    action: "Digitally Signed",
    document: "DOC-2026-00101",
    result: "Success",
    details: "Signed with Class 3 DSC Hardware Token."
  },
  {
    id: "AUD-986",
    timestamp: "25 Sep 2026, 14:32 IST",
    user: "SI Rajesh Kumar",
    userRole: "Investigating Officer",
    organization: "Chhattisgarh State Police",
    action: "Document Created",
    document: "DOC-2026-00101",
    result: "Success",
    details: "Ingested via NyayaVault Offline Field Client."
  }
];

export const INITIAL_CHAIN_OF_CUSTODY = [
  {
    stage: "Document Created",
    actor: "SI Rajesh Kumar (IO)",
    role: "Investigating Officer",
    organization: "Chhattisgarh State Police",
    timestamp: "25 Sep 2026, 14:32 IST",
    location: "Chhattisgarh Sadar Police Station",
    details: "Witness statement recorded under Section 180 BNSS. Computed pre-ingestion SHA-256 hash.",
    verified: true
  },
  {
    stage: "Digitally Signed",
    actor: "SI Rajesh Kumar",
    role: "Investigating Officer",
    organization: "Chhattisgarh State Police",
    timestamp: "25 Sep 2026, 14:32 IST",
    location: "Officer Terminal #4",
    details: "Signed with Class 3 Digital Signature Certificate. Non-repudiation key registered with NIC-CA.",
    verified: true
  },
  {
    stage: "Anchored on Blockchain",
    actor: "Hyperledger Fabric Consortium",
    role: "Consortium Endorsement Peer",
    organization: "NIC MeghRaj Cloud",
    timestamp: "25 Sep 2026, 14:35 IST",
    location: "Block #129381 (Tx: 0x8f13c2...789e)",
    details: "Consensus achieved across Police, Judicial, and Forensic nodes with Raft BFT ordering.",
    verified: true
  },
  {
    stage: "Accessed by FSL",
    actor: "Dr. Meera Singh",
    role: "Forensic Analyst",
    organization: "State Forensic Science Laboratory",
    timestamp: "27 Sep 2026, 11:20 IST",
    location: "Cyber Forensics Division, Raipur",
    details: "Decrypted using role-delegated private key for ballistic consistency examination.",
    verified: true
  },
  {
    stage: "Accessed by Prosecutor",
    actor: "R. Varma",
    role: "Public Prosecutor",
    organization: "Directorate of Prosecution",
    timestamp: "28 Sep 2026, 09:45 IST",
    location: "District Court Prosecution Office",
    details: "Generated trial dossier. Downloaded Section 72 BNS redacted derivative copy.",
    verified: true
  },
  {
    stage: "Viewed by Judge",
    actor: "Justice S. Iyer",
    role: "District & Sessions Judge",
    organization: "Sessions Court Room No. 3",
    timestamp: "28 Sep 2026, 16:12 IST",
    location: "Court Judicial Bench",
    details: "Instant in-court cryptographic hash verification. Section 63 BSA certificate admitted.",
    verified: true
  }
];

export const SENSITIVE_ENTITIES_DEMO = [
  { id: "e1", type: "Person Name", value: "Kalyani Devi", count: 3, checked: true, category: "Victim / Complainant Identity" },
  { id: "e2", type: "Phone Number", value: "+91 98765 43210", count: 2, checked: true, category: "Contact Details" },
  { id: "e3", type: "Address", value: "House 14, Ward 4, Rampur Village", count: 1, checked: true, category: "Residential Location" },
  { id: "e4", type: "Aadhaar Number", value: "XXXX-XXXX-8921", count: 1, checked: true, category: "National ID" },
  { id: "e5", type: "Vehicle Number", value: "CG 04 MB 7712", count: 1, checked: true, category: "Vehicle Registration" },
  { id: "e6", type: "Location", value: "Near Shanti Kunj Nala", count: 2, checked: true, category: "Incident Landmark" }
];
