// Comprehensive mock data for NyayaVault Indian Criminal Justice System

export const INITIAL_CASES = [
  {
    id: "FIR-2026-001",
    firNumber: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    policeStation: "Chhattisgarh Sadar",
    district: "Raipur",
    state: "Chhattisgarh",
    crimeHead: "Section 103 BNS (Sec 302 IPC)",
    investigatingOfficer: "SI Rajesh Kumar",
    badgeNumber: "CG-8401",
    dateOfRegistration: "12 Aug 2026, 14:45 IST",
    status: "Active",
    documentsCount: 12,
    priority: "High",
    timeline: [
      { step: "FIR Registered", date: "12 Aug 2026, 14:45", status: "completed" },
      { step: "Evidence Collected", date: "15 Aug 2026, 16:30", status: "completed" },
      { step: "FSL Report Received", date: "21 Aug 2026, 11:45", status: "completed" },
      { step: "Charge Sheet Filed", date: "Pending", status: "pending" }
    ]
  },
  {
    id: "FIR-2026-002",
    firNumber: "FIR-2026-002",
    caseTitle: "Theft Case",
    policeStation: "Patna City",
    district: "Patna",
    state: "Bihar",
    crimeHead: "Section 303 BNS (Sec 379 IPC)",
    investigatingOfficer: "Insp. Vikramaditya",
    badgeNumber: "BR-2204",
    dateOfRegistration: "18 Aug 2026, 10:15 IST",
    status: "Active",
    documentsCount: 8,
    priority: "Normal"
  },
  {
    id: "FIR-2026-003",
    firNumber: "FIR-2026-003",
    caseTitle: "Cyber Fraud & Extortion",
    policeStation: "Gwalior Thana",
    district: "Gwalior",
    state: "Madhya Pradesh",
    crimeHead: "Section 66D IT Act / Sec 318 BNS",
    investigatingOfficer: "SI Neha Verma",
    badgeNumber: "MP-5512",
    dateOfRegistration: "25 Aug 2026, 16:20 IST",
    status: "Pending",
    documentsCount: 15,
    priority: "High"
  },
  {
    id: "FIR-2026-004",
    firNumber: "FIR-2026-004",
    caseTitle: "NDPS Seizure Operation",
    policeStation: "Gaya Kotwali",
    district: "Gaya",
    state: "Bihar",
    crimeHead: "Section 20 NDPS Act",
    investigatingOfficer: "SI Rajesh Kumar",
    badgeNumber: "CG-8401",
    dateOfRegistration: "02 Sep 2026, 09:30 IST",
    status: "Active",
    documentsCount: 9,
    priority: "Normal"
  },
  {
    id: "FIR-2026-005",
    firNumber: "FIR-2026-005",
    caseTitle: "Illegal Arms Recovery",
    policeStation: "Ranchi Sadar",
    district: "Ranchi",
    state: "Jharkhand",
    crimeHead: "Section 25 Arms Act",
    investigatingOfficer: "Insp. S. Soren",
    badgeNumber: "JH-9011",
    dateOfRegistration: "10 Sep 2026, 12:00 IST",
    status: "Active",
    documentsCount: 7,
    priority: "Normal"
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: "DOC-2026-00123",
    name: "Witness_Statement.pdf",
    caseId: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    type: "Statement",
    size: "2.4 MB",
    pages: 4,
    status: "Verified",
    isSensitive: true,
    isRedacted: true,
    uploadedOn: "24 Sep 2026, 14:32:11 IST",
    sha256: "a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be",
    masterSha256: "a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be",
    redactedSha256: "8f4e2b01c9a7d34e65f12980145be8a3f5e7c9b2d4e6f8a2c41893341b8a9f31",
    txId: "0x8f13c2...789e",
    blockNumber: 129381,
    signer: "SI Rajesh Kumar (Badge #CG-8401)",
    signingCertificate: "Class 3 DSC - Rajesh Kumar (e-Mudhra CA)",
    organization: "Chhattisgarh State Police",
    storagePath: "minio://nyayavault-vault/cases/FIR-2026-001/Witness_Statement.enc",
    description: "Sworn eye-witness testimony recorded under Section 180 BNSS (161 CrPC)."
  },
  {
    id: "DOC-2026-00120",
    name: "FIR_2026_001.pdf",
    caseId: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    type: "FIR",
    size: "1.8 MB",
    pages: 3,
    status: "Verified",
    isSensitive: false,
    uploadedOn: "12 Aug 2026, 14:48:00 IST",
    sha256: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    txId: "0x1a2b3c...4d5e",
    blockNumber: 128940,
    signer: "Duty Officer SI M. Sinha",
    organization: "Chhattisgarh State Police",
    description: "Initial First Information Report lodged at Station."
  },
  {
    id: "DOC-2026-00122",
    name: "Forensic_Report.pdf",
    caseId: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    type: "Report",
    size: "5.1 MB",
    pages: 12,
    status: "Pending",
    isSensitive: false,
    uploadedOn: "21 Aug 2026, 11:50:22 IST",
    sha256: "f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2d3c4b5a6f1e2",
    txId: "0x7e8f9a...0b1c",
    blockNumber: 129105,
    signer: "Dr. Meera Singh (FSL Raipur)",
    organization: "State Forensic Science Laboratory",
    description: "Ballistics and chemical analysis report."
  },
  {
    id: "DOC-2026-00121",
    name: "Seizure_Memo.pdf",
    caseId: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    type: "Evidence",
    size: "3.2 MB",
    pages: 2,
    status: "Verified",
    isSensitive: false,
    uploadedOn: "15 Aug 2026, 16:35:10 IST",
    sha256: "e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3",
    txId: "0x5a4b3c...2d1e",
    blockNumber: 129012,
    signer: "SI Rajesh Kumar",
    organization: "Chhattisgarh State Police",
    description: "Recovery of physical exhibit #EX-1 from crime scene."
  }
];

export const INITIAL_AUDIT_TRAIL = [
  {
    id: "AUD-991",
    timestamp: "28 Sep 2026, 16:12 IST",
    user: "Justice S. Iyer",
    userRole: "District Judge",
    organization: "Sessions Court Raipur",
    action: "Document Verified",
    document: "DOC-2026-00123",
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
    document: "DOC-2026-00123",
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
    document: "DOC-2026-00123",
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
    document: "DOC-2026-00123",
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
    document: "DOC-2026-00123",
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
    document: "DOC-2026-00123",
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
    location: "Chhatisgarh Sadar Police Station",
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
