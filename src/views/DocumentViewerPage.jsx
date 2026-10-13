import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Download, 
  ShieldCheck, 
  ExternalLink, 
  EyeOff, 
  Clock, 
  Award, 
  ZoomIn, 
  ZoomOut, 
  Printer, 
  Share2 
} from 'lucide-react';
import { api } from '../api';
import { logActivity } from '../utils/auditLogger';

export default function DocumentViewerPage({ 
  selectedDoc, 
  setCurrentScreen 
}) {
  const [activeTab, setActiveTab] = useState('details');
  const [zoomLevel, setZoomLevel] = useState(100);

  const doc = selectedDoc || {
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
    txId: "0x8f13c2...789e",
    blockNumber: 129381,
    signer: "SI Rajesh Kumar (Badge #CG-8401)",
    organization: "Chhattisgarh State Police"
  };

  // Record audit log when document is viewed
  useEffect(() => {
    if (doc?.id) {
      logActivity({
        action: 'Document Viewed',
        document: `${doc.name} (${doc.id})`,
        details: `Viewed digital evidence document '${doc.name}' (${doc.id}) in sovereign viewer. Case docket: ${doc.caseId || 'Investigation'}. Sensitivity: ${doc.isSensitive ? 'Section 72 BNS Protected' : 'Standard'}.`
      });
    }
  }, [doc?.id]);

  const handleDownload = () => {
    logActivity({
      action: 'Document Downloaded',
      document: `${doc.name} (${doc.id})`,
      details: `Downloaded decrypted copy of '${doc.name}' (${doc.id}) with SHA-256 seal.`
    });
    window.open(api.evidence.getDownloadUrl(doc.id, 'master'), '_blank');
  };

  const handleGenerateBsa = () => {
    logActivity({
      action: 'BSA Certificate Requested',
      document: `${doc.name} (${doc.id})`,
      details: `Requested Section 63 BSA electronic record certificate for '${doc.name}' (${doc.id}).`
    });
    setCurrentScreen('certificates');
  };

  const handleVerify = () => {
    logActivity({
      action: 'Verification Gate Navigated',
      document: `${doc.name} (${doc.id})`,
      details: `Navigated to Verification Portal to verify SHA-256 integrity of '${doc.name}'.`
    });
    setCurrentScreen('verification');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header Matching Reference Image 2 Screen 13 */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={() => setCurrentScreen('documents')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Return to Documents Repository"
          >
            ← Back to Documents
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} style={{ color: 'var(--gold-primary)' }} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFF' }}>
                  {doc.name}
                </h2>
                <span className="badge-status badge-verified">
                  <CheckCircle2 size={12} /> Verified
                </span>
                {doc.isSensitive && (
                  <span className="badge-status badge-bns">
                    Section 72 BNS Protected
                  </span>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Case Docket: {doc.caseId} • Hyperledger Fabric Block #{doc.blockNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={handleVerify}
            className="btn-outline-gold"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <ShieldCheck size={14} />
            <span>Verify in Portal</span>
          </button>

          <button 
            onClick={handleGenerateBsa}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <Award size={14} />
            <span>Generate BSA Certificate</span>
          </button>

          <button 
            onClick={handleDownload}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <Download size={14} />
            <span>Download Decrypted File</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout Matching Screen 13 */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 1.5fr) minmax(300px, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}
        className="document-viewer-grid"
      >
        {/* Left: Document Canvas with Zoom Controls */}
        <div className="nyaya-card" style={{ padding: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Page 1 of {doc.pages || 4} • Displaying Verified Ledger Replica
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                {zoomLevel}%
              </span>
              <button 
                onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px' }}
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Authentic Document Viewer Paper with Dynamic Legal Type Content */}
          <div 
            className="parchment-document"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              minHeight: '440px'
            }}
          >
            {/* Dynamic Legal Document Content */}
            {(() => {
              const docType = (doc.type || '').toUpperCase();
              const isSensitive = doc.isSensitive;

              if (docType === 'FIR') {
                return (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px solid #DCD4C4', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                        STATE POLICE DEPARTMENT • STATE CRIME DOCKET
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--parchment-muted)' }}>
                        FORM NO. II — FIRST INFORMATION REPORT (UNDER SECTION 173 BNSS / 154 CrPC)
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '12px', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
                      <div><strong>FIR Number:</strong> {doc.caseId}</div>
                      <div><strong>Registration Date:</strong> {doc.uploadedOn || '12 Aug 2026, 14:48 IST'}</div>
                      <div><strong>Police Station:</strong> {doc.organization || 'State Police Thana'}</div>
                      <div><strong>Crime Classification:</strong> {doc.caseTitle || 'Special Offense'}</div>
                    </div>

                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>1. Act & Applicable Statutory Sections:</strong> Bharatiya Nyaya Sanhita (BNS 2023) / Bharatiya Nagarik Suraksha Sanhita (BNSS).
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>2. Occurrence of Offense:</strong> Reported within station territorial limits. General Diary Entry #88/26 certified and anchored.
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>3. Gist of First Information:</strong> {doc.description || 'Information lodged by authorized officer regarding cognizable offense. Immediate inquiry initiated with electronic chain of custody.'}
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>4. Action Taken:</strong> Case docket registered. Investigating Officer nominated with DSC digital signature and Hyperledger Fabric block anchoring.
                    </p>
                  </div>
                );
              }

              if (docType === 'REPORT') {
                return (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px solid #DCD4C4', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                        STATE FORENSIC SCIENCE LABORATORY (SFSL)
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--parchment-muted)' }}>
                        MEDICO-LEGAL & SCIENTIFIC EXAMINATION DOSSIER (SEC 39(1) BSA 2023)
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '12px', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
                      <div><strong>Exhibit Reference:</strong> {doc.id}</div>
                      <div><strong>Case Dossier:</strong> {doc.caseId}</div>
                      <div><strong>Laboratory Docket:</strong> FSL-BIO-EX-992</div>
                      <div><strong>Condition of Seals:</strong> Intact & Matches Police Seal Impress</div>
                    </div>

                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>1. Description of Received Parcells:</strong> Tamper-evident high-security evidence bag containing physical/digital exhibits submitted under official escort.
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>2. Scientific Methodology:</strong> {doc.description || 'Microscopic, chromatographic, and cryptographic hashing analysis performed in strict compliance with ISO/IEC 17025 forensic standards.'}
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>3. Analytical Results:</strong> Quantitative assays confirm exact specimen match. Digital checksum verified against distributed ledger state with zero bit-level tampering.
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>4. Forensic Expert Opinion:</strong> The examined exhibit provides conclusive evidentiary correlation with the crime docket under Section 39 BSA.
                    </p>
                  </div>
                );
              }

              if (docType === 'EVIDENCE') {
                return (
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px solid #DCD4C4', paddingBottom: '10px' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                        EVIDENCE SEIZURE MEMO & PANCHNAMA
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--parchment-muted)' }}>
                        INSPECTION & SEIZURE PROCEEDINGS UNDER SECTION 105 BNSS (SEC 102 CrPC)
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '12px', background: 'rgba(0,0,0,0.03)', padding: '10px', borderRadius: '4px' }}>
                      <div><strong>Seizure Memo No:</strong> {doc.id}</div>
                      <div><strong>Case FIR:</strong> {doc.caseId}</div>
                      <div><strong>Date & Time of Recovery:</strong> {doc.uploadedOn || '15 Aug 2026, 16:35 IST'}</div>
                      <div><strong>Panch Witnesses:</strong> 2 Independent Citizens Present</div>
                    </div>

                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>1. Place of Recovery:</strong> Spot inspection carried out in presence of panchas at the crime locus in jurisdiction of {doc.organization || 'District Police'}.
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>2. Inventory of Seized Articles:</strong> {doc.description || 'Exhibit #EX-1 securely seized, labeled, and marked in presence of independent witnesses with electronic barcode.'}
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>3. Electronic Signature & Sealing:</strong> Articles packed into barcoded tamper-evident evidence envelope. Specimen seal impress affixed and hash anchored on Hyperledger Fabric.
                    </p>
                    <p style={{ marginBottom: '10px', lineHeight: 1.6 }}>
                      <strong>4. Panchnama Attestation:</strong> Read over and admitted as correct by Panch-1 and Panch-2 before the undersigned Investigating Officer.
                    </p>
                  </div>
                );
              }

              // Default: Sworn Witness / Deposition Statement
              return (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px solid #DCD4C4', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                      POLICE DEPARTMENT • STATEMENT OF WITNESS
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--parchment-muted)' }}>
                      FORM NO. 14 — STATEMENT RECORDED UNDER SEC 180 BNSS (161 CrPC)
                    </div>
                  </div>

                  <p style={{ marginBottom: '12px' }}>
                    <strong>Police Station:</strong> Sadar Thana &nbsp;|&nbsp; <strong>Case Docket:</strong> {doc.caseId} &nbsp;|&nbsp; <strong>Exhibit:</strong> {doc.id}
                  </p>

                  <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
                    Statement of witness {isSensitive ? <span className="redaction-bar">Kalyani Devi</span> : 'Kalyani Devi'}, resident of {isSensitive ? <span className="redaction-bar">Ward 4, Rampur</span> : 'Ward 4, Rampur'}, recorded on {doc.uploadedOn || '24th September 2026'}.
                    &nbsp;{doc.description || 'The deponent states that on the night of the incident, she observed the incident unfold near the locus of the crime.'}
                  </p>

                  <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
                    The deponent identified crucial corroborating factors. Record encrypted with Section 72 BNS sensitive privacy redaction protocols.
                  </p>
                </div>
              );
            })()}

            <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px dashed #DCD4C4', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <div>
                <strong>Recorded By:</strong> {doc.signer}<br />
                <strong>NIC-CA Digital Certificate Verified</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Cryptographic Seal:</strong><br />
                Block #{doc.blockNumber}
              </div>
            </div>
          </div>

        </div>

        {/* Right: Document Details & Tabs Matching Screen 13 */}
        <div className="nyaya-card" style={{ padding: '20px' }}>
          
          {/* Tabs: Document, AI Analysis, Chain of Custody, Access Log */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '16px' }}>
            {['details', 'ai', 'custody', 'logs'].map((tab) => {
              const isActive = activeTab === tab;
              const label = tab === 'details' ? 'Document' :
                            tab === 'ai' ? 'AI Analysis' :
                            tab === 'custody' ? 'Chain of Custody' : 'Access Log';

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontSize: '12px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                    background: isActive ? 'var(--gold-subtle)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--gold-border)' : 'transparent'}`,
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px'
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Details */}
          {activeTab === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Case ID</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)', fontWeight: 600 }}>{doc.caseId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Type</span>
                <span className="badge-status badge-gold">{doc.type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Version</span>
                <span style={{ color: '#FFF' }}>1.0 (Master Immutable)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span className="badge-status badge-verified">Anchored (Fabric)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>SHA-256 Digest</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-light)', wordBreak: 'break-all' }}>
                  {doc.sha256}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFF' }}>{doc.txId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Uploaded</span>
                <span style={{ color: '#FFF' }}>{doc.uploadedOn}</span>
              </div>
            </div>
          )}

          {/* Tab 2: AI Analysis */}
          {activeTab === 'ai' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div style={{ padding: '10px', background: 'rgba(236, 72, 153, 0.08)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ fontWeight: 600, color: '#F472B6' }}>Section 72 BNS Compliance Verified</span>
                <div style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  6 sensitive entities identified and masked before public or defense dispatch.
                </div>
              </div>
              <div>• Person Names: 3 Masked (Kalyani Devi)</div>
              <div>• Contact Numbers: 2 Masked</div>
              <div>• Residential Coordinates: 1 Masked</div>
            </div>
          )}

          {/* Tab 3: Custody Snapshot */}
          {activeTab === 'custody' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ borderLeft: '2px solid var(--status-verified)', paddingLeft: '8px' }}>
                <div style={{ fontWeight: 600, color: '#FFF' }}>Document Anchored</div>
                <div style={{ color: 'var(--text-muted)' }}>Block #129381 • 25 Sep 2026, 14:35 IST</div>
              </div>
              <div style={{ borderLeft: '2px solid var(--gold-primary)', paddingLeft: '8px' }}>
                <div style={{ fontWeight: 600, color: '#FFF' }}>Digitally Signed</div>
                <div style={{ color: 'var(--text-muted)' }}>SI Rajesh Kumar (Class 3 DSC)</div>
              </div>
              <button 
                onClick={() => setCurrentScreen('custody')}
                className="btn-outline-gold"
                style={{ fontSize: '11px', marginTop: '10px' }}
              >
                View Complete Custody Graph →
              </button>
            </div>
          )}

          {/* Tab 4: Access Log */}
          {activeTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div>• 28 Sep 2026 16:12: Viewed by Justice S. Iyer in Court</div>
              <div>• 28 Sep 2026 09:45: Redacted copy downloaded by Prosecutor</div>
              <div>• 27 Sep 2026 11:20: Verified by Dr. Meera Singh (FSL)</div>
              <div>• 25 Sep 2026 14:32: Ingested by SI Rajesh Kumar</div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
