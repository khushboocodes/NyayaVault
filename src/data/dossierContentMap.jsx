import React from 'react';

/**
 * Returns distinct, authentic legal/forensic dossier JSX for each document.
 * Includes official government headers, scientific measurements, timestamps, and statutory seals.
 */
export function getDocumentDossierContent(doc) {
  if (!doc) return null;
  const docId = doc.id || '';
  const isSensitive = doc.isSensitive;

  // 1. Post-Mortem / Autopsy Report
  if (docId === 'DOC-2026-00102') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            DEPARTMENT OF FORENSIC MEDICINE & TOXICOLOGY
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            CIVIL HOSPITAL & POST-GRADUATE MEDICAL INSTITUTE, RAIPUR
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            POST-MORTEM EXAMINATION REPORT • FORM NO. 88 (SECTION 194 BNSS / 174 CrPC)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>PM Record No:</strong> PMR-2026-891/FSL</div>
          <div><strong>Police Station:</strong> Sadar Thana, Raipur</div>
          <div><strong>Corpse Identified By:</strong> Constable #CG-1902 & Relatives</div>
          <div><strong>Commencement of Autopsy:</strong> 13 Aug 2026, 08:30 IST</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. EXTERNAL EXAMINATION & ANTE-MORTEM INJURIES
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          1. <strong>Circular Penetrating Wound of Entry:</strong> Measuring 0.8 cm x 0.7 cm present over anterior left chest wall, 4 cm lateral to sternal margin in 4th intercostal space. Inverted margins with distinct collar of abrasion (1.2 cm diameter) and microscopic blackening/tattooing indicative of intermediate range discharge (&lt; 45 cm).
        </p>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          2. <strong>Wound of Exit:</strong> Measuring 1.4 cm x 1.1 cm over posterior thorax, 5 cm below left scapular inferior angle. Everted, irregular margins without scorching or soot residue.
        </p>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          II. INTERNAL FINDINGS & ORGAN PATHOLOGY
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          Thoracic cavity revealed 1400 ml of fluid hemothorax. Perforating laceration through anterior aspect of pericardium and left ventricle. Metallic metallic jacket fragment recovered from 5th rib cortex, preserved in sealed glass vial #EX-PM-1 for FSL Ballistics comparison.
        </p>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          III. FINAL FORENSIC OPINION AS TO CAUSE OF DEATH
        </h4>
        <div style={{ background: '#FEF3C7', borderLeft: '4px solid #D97706', padding: '10px', fontSize: '11px', lineHeight: 1.6 }}>
          <em>"In my opinion, death was caused by <strong>hemorrhagic and traumatic shock</strong> following perforated cardiac injury resulting from rifled projectile discharge. Death was instantaneous and ante-mortem in nature. Time since death: approximately 12 to 14 hours prior to post-mortem commencement."</em>
        </div>
      </div>
    );
  }

  // 2. FSL Ballistics Striation Report
  if (docId === 'DOC-2026-00103') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            STATE FORENSIC SCIENCE LABORATORY (SFSL)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            BALLISTICS & PHYSICAL SCIENCE DIVISION • RAIPUR
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            FORENSIC EXPERT REPORT UNDER SECTION 39(1) BHARATIYA SAKSHYA ADHINIYAM (BSA 2023)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>FSL Case File:</strong> SFSL/BAL/2026/0491</div>
          <div><strong>Examining Scientist:</strong> Dr. Meera Singh, Senior Scientific Officer</div>
          <div><strong>Exhibits Received:</strong> Sealed Parcels 1A & 1B</div>
          <div><strong>Chain of Custody Barcode:</strong> FSL-CG-771920-X</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. SPECIMEN DESCRIPTION
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '6px' }}>
          • <strong>Exhibit-1A (Firearm):</strong> One 7.65mm semi-automatic country-crafted pistol stamped with mark '#CG-P1'. Breechblock, extractor claw, and firing pin fully functional.
        </p>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          • <strong>Exhibit-1B (Fired Cartridge & Core):</strong> One fired 7.65mm brass cartridge case recovered from locus; one copper-jacketed spent bullet recovered during autopsy.
        </p>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          II. COMPARATIVE STRIATION ANALYSIS (LEICA FSC COMPARISON MICROSCOPE)
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          Test cartridges test-fired into water recovery tank using Exhibit-1A pistol. Microscopic superposition of land and groove engraved striations revealed <strong>18 consecutive matching striae lines</strong> on the bullet cylindrical bearing surface. Firing pin hemispherical indentation crater and breech-face micro-machining patterns match identical tool marks.
        </p>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          III. CONCLUSIVE BALLISTIC OPINION
        </h4>
        <div style={{ background: '#ECFDF5', borderLeft: '4px solid #10B981', padding: '10px', fontSize: '11px', lineHeight: 1.6 }}>
          <em>"The crime cartridge case and the bullet recovered from deceased thorax <strong>WERE FIRED EXCLUSIVELY through the 7.65mm pistol Exhibit-1A</strong> and could not have been fired through any other firearm. Gunshot residue on breech mechanism confirms weapon was fired shortly prior to seizure."</em>
        </div>
      </div>
    );
  }

  // 3. CCTV Vault DVR Hash Log
  if (docId === 'DOC-2026-00202') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            PATNA POLICE CYBER FORENSICS CELL
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            DIGITAL SURVEILLANCE & DVR FORENSIC EXTRACTION DOCKET
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            ELECTRONIC EVIDENCE AUDIT COMPLIANT WITH SECTION 63 BSA 2023
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Source Hardware:</strong> Hikvision DS-7208HQHI 8-Channel DVR</div>
          <div><strong>Hard Disk Storage:</strong> WD Purple 4TB (S/N: WCC4M7291044)</div>
          <div><strong>Camera ID:</strong> Cam-03 (Main Vault Access Corridor)</div>
          <div><strong>Acquisition Tool:</strong> Tableau TD2u Forensic Imager v21.4</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. CRYPTOGRAPHIC INTEGRITY AUDIT LEDGER
        </h4>
        <table style={{ width: '100%', fontSize: '10px', borderCollapse: 'collapse', marginBottom: '12px', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1' }}>
              <th style={{ padding: '6px' }}>Video Segment Timestamp</th>
              <th style={{ padding: '6px' }}>Frame Count</th>
              <th style={{ padding: '6px' }}>Calculated SHA-256 Digest</th>
              <th style={{ padding: '6px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px', fontFamily: 'monospace' }}>18/08/2026 02:14:00 - 02:15:00</td>
              <td style={{ padding: '6px' }}>1,800</td>
              <td style={{ padding: '6px', fontFamily: 'monospace', color: '#475569' }}>8f13b...a91e</td>
              <td style={{ padding: '6px', color: '#16A34A', fontWeight: 600 }}>MATCH (100%)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px', fontFamily: 'monospace' }}>18/08/2026 02:15:00 - 02:16:00</td>
              <td style={{ padding: '6px' }}>1,800</td>
              <td style={{ padding: '6px', fontFamily: 'monospace', color: '#475569' }}>3d4e5...6f7a</td>
              <td style={{ padding: '6px', color: '#16A34A', fontWeight: 600 }}>MATCH (100%)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td style={{ padding: '6px', fontFamily: 'monospace' }}>18/08/2026 02:16:00 - 02:17:00</td>
              <td style={{ padding: '6px' }}>1,800</td>
              <td style={{ padding: '6px', fontFamily: 'monospace', color: '#475569' }}>7c8d9...0e1f</td>
              <td style={{ padding: '6px', color: '#16A34A', fontWeight: 600 }}>MATCH (100%)</td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          II. OPTICAL EVENT SUMMARY & SUSPECT CORROBORATION
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          At timestamp 02:15:22 IST, two masked individuals wearing navy tactical jackets breached the vault secondary electronic latch using an unauthorized duplicator key. Digital video exhibits zero dropped frames or temporal splicing. Bitstream hash anchored directly to Hyperledger Fabric Block #129112.
        </p>
      </div>
    );
  }

  // 4. IP Trace & Cyber Log Audit
  if (docId === 'DOC-2026-00302') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            STATE CYBER FORENSIC LABORATORY, BHOPAL
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            NETWORK TELEMETRY & REVERSE PACKET TRACE DOSSIER
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            EXPERT TESTIMONY UNDER SECTION 63 & 65(3) BHARATIYA SAKSHYA ADHINIYAM (BSA 2023)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Case Crime No:</strong> FIR-2026-003 Cyber</div>
          <div><strong>Source IP Tracked:</strong> 103.21.244.18 (Airtel Broadband)</div>
          <div><strong>Reverse ASN:</strong> AS45609 (Bharti Airtel Ltd)</div>
          <div><strong>Command & Control Host:</strong> 185.220.101.44 (Tor Exit Node)</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. NETWORK FORENSIC ROUTING & PACKET DECRYPTION SUMMARY
        </h4>
        <div style={{ fontFamily: 'monospace', fontSize: '10px', background: '#0F172A', color: '#38BDF8', padding: '12px', borderRadius: '4px', lineHeight: 1.5, marginBottom: '10px' }}>
          [2026-08-25 15:42:11.092 UTC] SYN TCP 103.21.244.18:49210 -&gt; 198.51.100.22:443 [ESTABLISHED]<br/>
          [2026-08-25 15:42:11.201 UTC] TLSv1.3 Handshake ClientHello (SNI: secure-banking-auth.net)<br/>
          [2026-08-25 15:42:12.441 UTC] HTTP/2 POST /api/v1/auth/credential-drain [HTTP 200 OK]<br/>
          [2026-08-25 15:42:13.119 UTC] Payload Checksum: SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          II. SCIENTIFIC ATTRIBUTION & HARDWARE FINGERPRINT
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          Digital forensic analysis establishes the phishing server domain was registered using disposable crypto vouchers. Client terminal fingerprint reveals canvas hash <code>0x9f182c</code> matching the seizure of laptop Exhibit #L-1 from suspect residence.
        </p>
      </div>
    );
  }

  // 5. NDPS Chemical Examiner Report
  if (docId === 'DOC-2026-00403') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            CENTRAL FORENSIC SCIENCE LABORATORY (CFSL)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            NARCOTICS & TOXICOLOGY SCIENTIFIC EXAMINATION REPORT
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            UNDER SECTION 293 CrPC / SECTION 39(1) BHARATIYA SAKSHYA ADHINIYAM (BSA 2023)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Parcel Reference:</strong> CFSL/KOL/NDPS/8192</div>
          <div><strong>Submitting Authority:</strong> Special Court for NDPS, Gaya</div>
          <div><strong>Gross Weight Received:</strong> 4.250 kg in 12 Sealed Tins</div>
          <div><strong>Seals Condition:</strong> Intact & Verified with Magistrate Seal</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. QUALITATIVE & QUANTITATIVE CHROMATOGRAPHIC ASSAYS
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '6px' }}>
          • <strong>Color Test (Duquenois-Levine Test):</strong> Positive violet coloration transferred to chloroform layer, indicating active cannabinoids.
        </p>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '6px' }}>
          • <strong>Gas Chromatography-Mass Spectrometry (GC-MS):</strong> Chromatogram peaks at retention time 14.8 minutes match pure $\Delta^9$-Tetrahydrocannabinol (THC) standard.
        </p>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          • <strong>HPLC Assay:</strong> Quantitative concentration of active resinoid fraction determined to be <strong>18.4% w/w</strong>, confirming commercial grade Charas (Hashish).
        </p>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          II. CERTIFICATE OF CHEMICAL EXAMINER
        </h4>
        <div style={{ background: '#ECFDF5', borderLeft: '4px solid #10B981', padding: '10px', fontSize: '11px', lineHeight: 1.6 }}>
          <em>"The contents of the examined exhibit contain pure <strong>Charas (Cannabis Resin)</strong> falling within the statutory definition of commercial quantity under Section 2(iii)(a) and Section 20(b)(ii)(C) of the NDPS Act 1985."</em>
        </div>
      </div>
    );
  }

  // 6. Smart City Traffic CCTV Frame Digest
  if (docId === 'DOC-2026-00602') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            NEW DELHI SMART CITY INTEGRATED COMMAND & CONTROL CENTRE (ICCC)
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            TRAFFIC SURVEILLANCE & OPTICAL ANPR FRAME AUDIT MEMO
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            ELECTRONIC TRAFFIC RECORD ADMISSIBILITY CERTIFICATE (SECTION 63 BSA 2023)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Camera ID & Junction:</strong> NDMC-CAM-04 (Barakhamba Radial #2)</div>
          <div><strong>License Plate Lock (ANPR):</strong> DL-1C-AA-9081 (Black SUV)</div>
          <div><strong>Computed Speed at Impact:</strong> 88.4 km/h (Limit: 50 km/h)</div>
          <div><strong>Optical Sensor:</strong> Sony STARVIS 4K IP Camera @ 60 FPS</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. FRAME-BY-FRAME COLLISION TELEMETRY & DIGITAL CHECKSUM
        </h4>
        <div style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          Frame #1408 (Timestamp 23:14:52.401 IST): Suspect vehicle breaches red traffic signal at radial crossing.<br/>
          Frame #1412 (Timestamp 23:14:52.468 IST): Impact with cyclist occurred in pedestrian crossing zone.<br/>
          Frame #1418 (Timestamp 23:14:52.568 IST): Suspect vehicle accelerates without halting, fleeing towards Mandi House.
        </div>
        <p style={{ fontSize: '10px', fontFamily: 'monospace', color: '#64748B' }}>
          Digital Merkle Root: 0x0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d (Hyperledger Block #129386)
        </p>
      </div>
    );
  }

  // 7. MCA21 Shell Entities Forensic Audit (DOC-2026-00702)
  if (docId === 'DOC-2026-00702') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            SERIOUS FRAUD INVESTIGATION OFFICE (SFIO) • MINISTRY OF CORPORATE AFFAIRS
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            SPECIAL FINANCIAL FORENSIC AUDIT (SEC 447 COMPANIES ACT 2013 / SEC 318(4) BNS)
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            CASE DOCKET: FIR-2026-007 • EXHIBIT #DOC-2026-00702
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>MCA21 Registry Audit:</strong> 42 Front Shell Companies Identified</div>
          <div><strong>Circular Transaction Value:</strong> ₹184.65 Crore (INR)</div>
          <div><strong>Nodal Lead Agency:</strong> EOW Mumbai & SFIO Western Zone</div>
          <div><strong>Audit Signatory:</strong> CA Forensic Auditor R. K. Singhania</div>
        </div>

        <h4 style={{ fontSize: '12px', color: '#B45309', margin: '12px 0 6px 0', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
          I. SYNTHETIC INVOICING & INPUT TAX CREDIT (ITC) PASS-THROUGH
        </h4>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          1. <strong>Circular Routing:</strong> Goods and Services Tax Network (GSTN) telemetry confirmed zero physical logistics movement. E-Way bills matched fictitious vehicle registrations (motorcycles registered as heavy transport tankers).
        </p>
        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          2. <strong>Layering Structure:</strong> Funds systematically diverted via 3 layers of current accounts within 90 minutes of RTGS credit, terminating into bullion dealers in Zaveri Bazaar.
        </p>
      </div>
    );
  }

  // 8. Cellebrite UFED Mobile Extraction (DOC-2026-00902)
  if (docId === 'DOC-2026-00902') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            SPECIAL TASK FORCE (STF) • CYBER DIGITAL FORENSICS DIVISION
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            CELLEBRITE UFED 4PC LOGICAL & PHYSICAL EXTRACTION REPORT (SEC 63 BSA 2023)
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            EXHIBIT ID: DOC-2026-00902 • EXAM PAPER LEAK SYNDICATE
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Seized Hardware:</strong> OnePlus 11 5G (IMEI: 869012051928341)</div>
          <div><strong>Extraction Profile:</strong> Physical Chip-Off Bitstream (SHA-256 Verified)</div>
          <div><strong>Encrypted Channels Found:</strong> 3 Secret Telegram Channel Dumps</div>
          <div><strong>Watermark Matched:</strong> Code 'SET-B-8902' Leaked at 04:12 AM</div>
        </div>

        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          <strong>Analytical Conclusion:</strong> High-resolution photographs of Question Paper General Studies (Paper II) were circulated to 118 candidate devices prior to exam commencement. SQLite message databases recovered in intact state.
        </p>
      </div>
    );
  }

  // 9. Wildlife DNA & Camera Trap Stripe Analysis (DOC-2026-01002)
  if (docId === 'DOC-2026-01002') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            WILDLIFE INSTITUTE OF INDIA (WII) • MOLECULAR FORENSIC ECOLOGY
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            SPECIES GENETIC IDENTIFICATION & STRIPE MORPHOMETRY CERTIFICATE
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            SCHEDULE I PROTECTED SPECIES: PANTHERA TIGRIS • CASE FIR-2026-010
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Specimen Examined:</strong> Raw salted pelt & 18 keratin claws</div>
          <div><strong>DNA Marker Target:</strong> Cytochrome b (Cyt-b 358 bp) & 16S rRNA</div>
          <div><strong>Genetic Identity:</strong> 100% Homology with Panthera tigris tigris</div>
          <div><strong>Striping Database Match:</strong> National Tiger Database ID: T-84 (Male)</div>
        </div>

        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          <strong>Forensic Opinion:</strong> The recovered skin originated from wild adult male tiger T-84 last camera-trapped in Corbett Buffer Zone in June 2026. Microscopic hair follicle medullary index (0.64) confirms wild provenance under Wildlife Protection Act 1972.
        </p>
      </div>
    );
  }

  // 10. Anti-Corruption Phenolphthalein Trap Memo (DOC-2026-01102)
  if (docId === 'DOC-2026-01102') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            ANTI-CORRUPTION BUREAU (ACB) • GOVT OF KARNATAKA
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            ENTRAPMENT PANCHNAMA & CHEMICAL TRAP MEMO (SEC 7 PREVENTION OF CORRUPTION ACT)
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            PROCEEDINGS CONDUCTED UNDER SEC 105 BNSS 2023 • CASE FIR-2026-011
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Tainted Currency Sum:</strong> ₹25,00,000 (500x50 Bundle Notes)</div>
          <div><strong>Chemical Agent:</strong> Phenolphthalein Powder (C20H14O4)</div>
          <div><strong>Reaction Reagent:</strong> Sodium Carbonate Solution (Na2CO3)</div>
          <div><strong>Colorimetric Confirmation:</strong> Intense Characteristic Pink Wash</div>
        </div>

        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          <strong>Chemical Test Execution:</strong> Right and left hand finger washes of the public servant were tested in sterile glass beakers in the presence of independent gazetted shadow witnesses. Both washes turned instantly pink, sealed in amber vials #B-1 and #B-2 for CFSL examination.
        </p>
      </div>
    );
  }

  // 11. Currency Note Press Counterfeit Technical Audit (DOC-2026-01202)
  if (docId === 'DOC-2026-01202') {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            CURRENCY NOTE PRESS (SPMCIL) • NASHIK EXPERT LABORATORY
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            HIGH-QUALITY COUNTERFEIT CURRENCY (FICN) TECHNICAL EXAMINATION REPORT
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
            SECTION 39(1) BSA 2023 / SECTION 178 BNS • CASE FIR-2026-012
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Examined Denomination:</strong> Mahatma Gandhi (New) ₹500 Notes (800 Pcs)</div>
          <div><strong>Paper Base:</strong> Cotton rag paper pulp with artificial sizing</div>
          <div><strong>Micro-Lettering:</strong> 'RBI' micro-lettering blurred under 100x zoom</div>
          <div><strong>Security Thread:</strong> Metallic paint hot-stamped (Non-windowed)</div>
        </div>

        <p style={{ fontSize: '11px', lineHeight: 1.6, marginBottom: '8px' }}>
          <strong>Expert Opinion:</strong> The examined notes represent High Quality Counterfeit Indian Currency (FICN) manufactured using sophisticated offset intaglio equipment. Lacks optical variable ink color shift and genuine latent portrait watermark.
        </p>
      </div>
    );
  }

  // 7. General FIR Rendering (Dynamic for all FIR documents)
  if (doc.type === 'FIR' || doc.name?.includes('FIR')) {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            STATE POLICE DEPARTMENT • CRIMINAL INVESTIGATION BRANCH
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
            FORM NO. II — FIRST INFORMATION REPORT (UNDER SECTION 173 BNSS / 154 CrPC)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>FIR Number:</strong> {doc.caseId}</div>
          <div><strong>Registration Date:</strong> {doc.uploadedOn || 'Official Registration Date'}</div>
          <div><strong>Police Station:</strong> {doc.organization || 'Territorial Police Station'}</div>
          <div><strong>Statutory Crime Head:</strong> {doc.caseTitle || 'Cognizable Offense'}</div>
        </div>

        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>1. Applicable Statutory Sections:</strong> Bharatiya Nyaya Sanhita (BNS 2023) & Bharatiya Nagarik Suraksha Sanhita (BNSS 2023).
        </p>
        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>2. Occurrence of Offense:</strong> Reported within station territorial jurisdiction. General Diary entry authenticated with cryptographic timestamping.
        </p>
        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>3. Gist of Information:</strong> {doc.description || 'Cognizable criminal offense reported by informant. Preliminary investigation established sufficient cause for formal inquiry and evidence preservation.'}
        </p>
        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>4. Investigating Officer Assigned:</strong> {doc.signer || 'Authorized Investigating Officer'} with digital non-repudiation key and blockchain chain of custody ledger.
        </p>
      </div>
    );
  }

  // 8. General Evidence Seizure / Panchnama
  if (doc.type === 'Evidence' || doc.name?.includes('Seizure') || doc.name?.includes('Panch')) {
    return (
      <div className="dossier-body">
        <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
            POLICE DEPARTMENT • SEIZURE MEMO & PANCHNAMA
          </div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            INSPECTION & SEIZURE PROCEEDINGS UNDER SECTION 105 BNSS (SEC 102 CrPC)
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
          <div><strong>Seizure Memo No:</strong> {doc.id}</div>
          <div><strong>Case FIR Reference:</strong> {doc.caseId}</div>
          <div><strong>Recovery Timestamp:</strong> {doc.uploadedOn}</div>
          <div><strong>Independent Panch Witnesses:</strong> 2 Citizens Attested</div>
        </div>

        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>1. Place of Spot Inspection:</strong> Official search executed under jurisdiction of {doc.organization}.
        </p>
        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>2. Inventory of Recovered Articles:</strong> {doc.description}
        </p>
        <p style={{ fontSize: '11px', marginBottom: '10px', lineHeight: 1.6 }}>
          <strong>3. Sealing & Custody:</strong> Packed into tamper-evident barcoded container, impressed with brass seal, and digitally registered in NyayaVault ledger.
        </p>
      </div>
    );
  }

  // 9. Default: Sworn Witness / Deposition Statement
  return (
    <div className="dossier-body">
      <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '2px solid #8C7B68', paddingBottom: '10px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.05em', color: '#1E293B' }}>
          POLICE DEPARTMENT • SWORN DEPOSITION & TESTIMONY
        </div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>
          FORM NO. 14 — STATEMENT RECORDED UNDER SECTION 180 BNSS (161 CrPC)
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '4px', fontSize: '11px', marginBottom: '14px' }}>
        <div><strong>Docket Reference:</strong> {doc.caseId}</div>
        <div><strong>Exhibit Code:</strong> {doc.id}</div>
        <div><strong>Recording Date:</strong> {doc.uploadedOn}</div>
        <div><strong>Classified Privacy:</strong> {isSensitive ? 'Section 72 BNS Protected' : 'Public Record'}</div>
      </div>

      <p style={{ fontSize: '11px', marginBottom: '12px', lineHeight: 1.7 }}>
        Statement of deponent {isSensitive ? <span className="redaction-bar">Confidential Witness</span> : 'Authorized Deponent'}, recorded in accordance with BNSS procedures.
      </p>
      <p style={{ fontSize: '11px', marginBottom: '12px', lineHeight: 1.7, background: 'rgba(0,0,0,0.02)', padding: '10px', borderRadius: '4px' }}>
        <em>"{doc.description || 'The deponent presented vital firsthand testimony detailing key chronology, suspect identity, and corroborating evidentiary timeline.'}"</em>
      </p>
      <p style={{ fontSize: '11px', lineHeight: 1.7 }}>
        Deposition signed under digital oath before the Investigating Officer with digital hardware token certification.
      </p>
    </div>
  );
}
