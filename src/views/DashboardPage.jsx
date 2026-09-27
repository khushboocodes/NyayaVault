import React from 'react';
import { 
  FolderLock, 
  FileText, 
  CloudOff, 
  AlertTriangle, 
  Upload, 
  PlusCircle, 
  ShieldCheck, 
  ScrollText, 
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardPage({ 
  setCurrentScreen, 
  cases, 
  documents, 
  setSelectedCase,
  setSelectedDoc 
}) {
  const activeCasesCount = cases.filter(c => c.status === 'Active').length || 14;
  const totalDocsCount = documents.length || 34;

  const handleOpenDoc = (doc) => {
    setSelectedDoc(doc);
    setCurrentScreen('document-viewer');
  };

  const handleOpenCase = (caseItem) => {
    setSelectedCase(caseItem);
    setCurrentScreen('case-details');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* =========================================================================
          TOP METRICS & QUICK ACTIONS ROW — MATCHING SCREEN 5
          ========================================================================= */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 280px', 
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="dashboard-metrics-grid"
      >
        {/* Metric 1: Active Cases */}
        <div 
          className="nyaya-card" 
          onClick={() => setCurrentScreen('cases')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Active Cases</span>
            <FolderLock size={18} style={{ color: 'var(--gold-primary)' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
              14
            </div>
            <div style={{ fontSize: '11px', color: 'var(--status-verified)', marginTop: '2px' }}>
              ↑ 2 Assigned this week
            </div>
          </div>
        </div>

        {/* Metric 2: Documents */}
        <div 
          className="nyaya-card" 
          onClick={() => setCurrentScreen('documents')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Documents</span>
            <FileText size={18} style={{ color: 'var(--gold-primary)' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
              34
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gold-light)', marginTop: '2px' }}>
              100% Cryptographically Anchored
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Sync */}
        <div 
          className="nyaya-card" 
          onClick={() => setCurrentScreen('mobile-app')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Sync</span>
            <CloudOff size={18} style={{ color: 'var(--status-pending)' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--status-pending)', fontFamily: 'var(--font-mono)' }}>
              5
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Offline Field Queue Ready
            </div>
          </div>
        </div>

        {/* Metric 4: High Priority */}
        <div 
          className="nyaya-card" 
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>High Priority</span>
            <AlertTriangle size={18} style={{ color: 'var(--status-tampered)' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--status-tampered)', fontFamily: 'var(--font-mono)' }}>
              1
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              FIR-2026-001 (Section 103 BNS)
            </div>
          </div>
        </div>

        {/* Quick Actions Panel on Right (Matching Image 2 Screen 5) */}
        <div 
          className="nyaya-card" 
          style={{ 
            background: 'linear-gradient(135deg, rgba(22, 28, 40, 0.9) 0%, rgba(16, 20, 29, 0.95) 100%)',
            border: '1px solid var(--gold-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Quick Actions
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={() => setCurrentScreen('upload')}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
            >
              <Upload size={14} />
              <span>Upload Document</span>
            </button>

            <button
              onClick={() => setCurrentScreen('cases')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
            >
              <PlusCircle size={14} style={{ color: 'var(--gold-primary)' }} />
              <span>Create New Case</span>
            </button>

            <button
              onClick={() => setCurrentScreen('verification')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--status-verified)' }} />
              <span>Verify Document</span>
            </button>

            <button
              onClick={() => setCurrentScreen('audit')}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
            >
              <ScrollText size={14} />
              <span>View Audit Trail</span>
            </button>
          </div>
        </div>

      </div>

      {/* =========================================================================
          RECENT DOCUMENTS TABLE (SCREEN 5)
          ========================================================================= */}
      <div className="nyaya-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
              Recent Documents
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Latest digital exhibits anchored to Hyperledger Fabric
            </p>
          </div>
          
          <button 
            onClick={() => setCurrentScreen('documents')}
            className="btn-secondary" 
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <span>View All</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Case ID</th>
                <th>Type</th>
                <th>Status</th>
                <th>Uploaded On</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.slice(0, 5).map((doc) => {
                const isVerified = doc.status === 'Verified';

                return (
                  <tr key={doc.id} style={{ cursor: 'pointer' }}>
                    <td onClick={() => handleOpenDoc(doc)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} style={{ color: 'var(--gold-primary)' }} />
                        <span style={{ fontWeight: 600, color: '#FFF' }}>{doc.name}</span>
                        {doc.isSensitive && (
                          <span className="badge-status badge-bns" style={{ fontSize: '9px' }}>
                            Sec 72 BNS
                          </span>
                        )}
                      </div>
                    </td>
                    <td onClick={() => handleOpenDoc(doc)} style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {doc.caseId}
                    </td>
                    <td onClick={() => handleOpenDoc(doc)}>
                      <span className="badge-status badge-gold">{doc.type}</span>
                    </td>
                    <td onClick={() => handleOpenDoc(doc)}>
                      {isVerified ? (
                        <span className="badge-status badge-verified">
                          <CheckCircle2 size={11} /> Verified
                        </span>
                      ) : (
                        <span className="badge-status badge-pending">
                          <Clock size={11} /> Pending
                        </span>
                      )}
                    </td>
                    <td onClick={() => handleOpenDoc(doc)} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {doc.uploadedOn}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleOpenDoc(doc)}
                        className="btn-outline-gold"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          ACTIVE INVESTIGATION CASES SUMMARY (QUICK ACCESS TO SCREEN 6 / 7)
          ========================================================================= */}
      <div className="nyaya-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
              Active Case Dockets
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Assigned to Thana Station House & Investigation Officers
            </p>
          </div>
          <button 
            onClick={() => setCurrentScreen('cases')}
            className="btn-secondary" 
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <span>Manage All Cases</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {cases.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => handleOpenCase(item)}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold-border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>
                  {item.firNumber}
                </span>
                <span className="badge-status badge-verified">{item.status}</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', marginTop: '6px' }}>
                {item.caseTitle}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {item.policeStation} • {item.crimeHead}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>{item.documentsCount} Documents Attached</span>
                <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>Open Case →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
