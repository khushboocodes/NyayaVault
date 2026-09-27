import React, { useState } from 'react';
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
            onClick={() => setCurrentScreen('dashboard')}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            ← Back
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
            onClick={() => setCurrentScreen('verification')}
            className="btn-outline-gold"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <ShieldCheck size={14} />
            <span>Verify in Portal</span>
          </button>

          <button 
            onClick={() => setCurrentScreen('certificates')}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <Award size={14} />
            <span>Generate BSA Certificate</span>
          </button>

          <button 
            onClick={() => alert(`Downloading signed copy of ${doc.name}...`)}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            <Download size={14} />
            <span>Download</span>
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

          {/* Authentic Document Viewer Paper */}
          <div 
            className="parchment-document"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease',
              minHeight: '440px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px solid #DCD4C4', paddingBottom: '10px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.04em' }}>
                POLICE DEPARTMENT • STATE OF CHHATTISGARH
              </div>
              <div style={{ fontSize: '12px', color: 'var(--parchment-muted)' }}>
                FORM NO. 14 — STATEMENT OF WITNESS UNDER SEC 180 BNSS (161 CrPC)
              </div>
            </div>

            <p style={{ marginBottom: '12px' }}>
              <strong>Police Station:</strong> Sadar Thana &nbsp;|&nbsp; <strong>District:</strong> Raipur &nbsp;|&nbsp; <strong>FIR:</strong> {doc.caseId}
            </p>

            <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
              Statement of victim <span className="redaction-bar">Kalyani Devi</span>, resident of <span className="redaction-bar">House 14, Ward 4, Rampur</span>, recorded on 24th September 2026.
              The deponent states that on the night of the incident, she observed the accused near the entrance of the commercial complex.
            </p>

            <p style={{ marginBottom: '12px', lineHeight: 1.7 }}>
              The suspect fled on a two-wheeler registration <span className="redaction-bar">CG 04 MB 7712</span> after discarding an iron object into the adjoining ditch.
            </p>

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
