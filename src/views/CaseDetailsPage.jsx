import React, { useState } from 'react';
import { 
  FolderLock, 
  Upload, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  GitBranch, 
  Award, 
  ScrollText, 
  ChevronRight,
  Download
} from 'lucide-react';

export default function CaseDetailsPage({ 
  selectedCase, 
  documents, 
  setCurrentScreen, 
  setSelectedDoc 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const caseData = selectedCase || {
    id: "FIR-2026-001",
    firNumber: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    policeStation: "Chhattisgarh Sadar",
    crimeHead: "Section 103 BNS (Sec 302 IPC)",
    investigatingOfficer: "SI Rajesh Kumar",
    badgeNumber: "CG-8401",
    dateOfRegistration: "12 Aug 2026, 14:45 IST",
    status: "Active",
    timeline: [
      { step: "FIR Registered", date: "12 Aug 2026, 14:45", status: "completed" },
      { step: "Evidence Collected", date: "15 Aug 2026, 16:30", status: "completed" },
      { step: "FSL Report Received", date: "21 Aug 2026, 11:45", status: "completed" },
      { step: "Charge Sheet Filed", date: "Pending Committal", status: "pending" }
    ]
  };

  const caseDocs = documents.filter(d => d.caseId === caseData.firNumber);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header Matching Reference Image 2 Screen 7 */}
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
            onClick={() => setCurrentScreen('cases')}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            ← Back to Cases
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
                {caseData.firNumber} &nbsp;{caseData.caseTitle}
              </h2>
              <span className="badge-status badge-verified">{caseData.status}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {caseData.policeStation} • State Criminal Court Jurisdiction
            </div>
          </div>
        </div>

        <button 
          onClick={() => setCurrentScreen('upload')}
          className="btn-gold"
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <Upload size={15} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Tabs Row (Matching Screen 7) */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
        {['overview', 'documents', 'custody', 'audit', 'certificates'].map((tab) => {
          const isActive = activeTab === tab;
          const label = tab === 'overview' ? 'Overview' :
                        tab === 'documents' ? `Documents (${caseDocs.length})` :
                        tab === 'custody' ? 'Chain of Custody' :
                        tab === 'audit' ? 'Audit' : 'Certificates';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--gold-primary)' : '2px solid transparent',
                background: 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab: Overview (Default view of Screen 7) */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Card 1: Case Information */}
          <div className="nyaya-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '16px' }}>
              Case Information
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>FIR Number</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--gold-light)' }}>
                  {caseData.firNumber}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Police Station</span>
                <span style={{ color: '#FFF', fontWeight: 500 }}>{caseData.policeStation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Crime Head</span>
                <span style={{ color: 'var(--status-tampered)', fontWeight: 600 }}>{caseData.crimeHead}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Investigating Officer</span>
                <span style={{ color: '#FFF' }}>{caseData.investigatingOfficer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Date of Registration</span>
                <span style={{ color: '#FFF' }}>{caseData.dateOfRegistration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status</span>
                <span className="badge-status badge-verified">{caseData.status}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Case Timeline (Exact layout of Screen 7 right card) */}
          <div className="nyaya-card">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '16px' }}>
              Case Timeline
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '28px' }}>
              {/* Connecting vertical bar */}
              <div 
                style={{
                  position: 'absolute',
                  top: '12px',
                  bottom: '12px',
                  left: '8px',
                  width: '2px',
                  background: 'var(--border-subtle)'
                }} 
              />

              {caseData.timeline.map((step, idx) => {
                const isCompleted = step.status === 'completed';

                return (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Circle Node */}
                    <div 
                      style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--status-verified)' : 'var(--status-pending)',
                        border: '3px solid var(--bg-surface)',
                        boxShadow: isCompleted ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none'
                      }} 
                    />

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: isCompleted ? '#FFF' : 'var(--status-pending)' }}>
                        {step.step}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {step.date}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab: Documents List */}
      {(activeTab === 'documents' || activeTab === 'overview') && (
        <div className="nyaya-card" style={{ marginTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
              Attached Case Exhibits & Documents
            </h3>
            <button 
              onClick={() => setCurrentScreen('upload')}
              className="btn-outline-gold"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              + Ingest New Exhibit
            </button>
          </div>

          <table className="nyaya-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>SHA-256 Digest</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {caseDocs.map((doc) => (
                <tr key={doc.id} style={{ cursor: 'pointer' }}>
                  <td onClick={() => { setSelectedDoc(doc); setCurrentScreen('document-viewer'); }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} style={{ color: 'var(--gold-primary)' }} />
                      <span style={{ fontWeight: 600, color: '#FFF' }}>{doc.name}</span>
                      {doc.isSensitive && <span className="badge-status badge-bns">Sec 72 BNS</span>}
                    </div>
                  </td>
                  <td>
                    <span className="badge-status badge-gold">{doc.type}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {doc.sha256.slice(0, 18)}...
                  </td>
                  <td>
                    <span className="badge-status badge-verified">
                      <CheckCircle2 size={11} /> {doc.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => { setSelectedDoc(doc); setCurrentScreen('document-viewer'); }}
                      className="btn-outline-gold"
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Chain of Custody */}
      {activeTab === 'custody' && (
        <div className="nyaya-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
              Case Chain of Custody (Hyperledger Fabric Block Lineage)
            </h3>
            <button 
              onClick={() => setCurrentScreen('custody')}
              className="btn-gold" 
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Open Full Custody Graph
            </button>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every interaction with files in docket <strong>{caseData.firNumber}</strong> is permanently anchored.
            Click below to inspect full block headers, endorsing peers, and timestamp logs.
          </p>
        </div>
      )}

      {/* Tab: Certificates */}
      {activeTab === 'certificates' && (
        <div className="nyaya-card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '12px' }}>
            Section 63 BSA Admissibility Dossiers
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Generate and export official court-stamped Certificate of Electronic Evidence for FIR {caseData.firNumber}.
          </p>
          <button 
            onClick={() => setCurrentScreen('certificates')}
            className="btn-gold"
          >
            <Award size={15} />
            <span>Generate Official Section 63 BSA Certificate</span>
          </button>
        </div>
      )}

    </div>
  );
}
