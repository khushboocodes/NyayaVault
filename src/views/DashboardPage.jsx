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
  Clock,
  Microscope,
  GitBranch,
  Scale,
  Landmark,
  Award,
  RefreshCw
} from 'lucide-react';
import { getDocumentRole, RoleBadge, ROLE_CONFIG } from '../utils/documentRoleHelper';

export default function DashboardPage({ 
  setCurrentScreen, 
  cases, 
  documents, 
  setSelectedCase,
  setSelectedDoc,
  userRole
}) {
  const totalCasesCount = cases.length;
  const activeCasesCount = cases.filter(c => c.status === 'Active').length;
  const totalDocsCount = documents.length;
  const verifiedDocsCount = documents.filter(d => d.status === 'Verified').length;
  const pendingDocsCount = documents.filter(d => d.status === 'Pending').length;
  const highPriorityCases = cases.filter(c => c.priority === 'High');
  const highPriorityCount = highPriorityCases.length;
  const topPriorityCase = highPriorityCases[0] || cases[0];

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
              {activeCasesCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--status-verified)', marginTop: '2px' }}>
              ↑ Active out of {totalCasesCount} dockets
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
              {totalDocsCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gold-light)', marginTop: '2px' }}>
              {verifiedDocsCount} Anchored on Blockchain (100%)
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Sync (Police IO) vs Pending Analysis (FSL) */}
        {/* Metric 3: Role-Tailored Operational Metric */}
        {userRole?.id === 'fsl' ? (
          <div 
            className="nyaya-card" 
            onClick={() => setCurrentScreen('documents')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Analysis</span>
              <Microscope size={18} style={{ color: 'var(--gold-primary)' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--status-pending)', fontFamily: 'var(--font-mono)' }}>
                3
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Exhibits Under Examination
              </div>
            </div>
          </div>
        ) : userRole?.id === 'prosecutor' ? (
          <div 
            className="nyaya-card" 
            onClick={() => setCurrentScreen('documents')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Pending Petitions</span>
              <Scale size={18} style={{ color: '#C4B5FD' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#C4B5FD', fontFamily: 'var(--font-mono)' }}>
                2
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Bail Rebuttals & Arguments Due
              </div>
            </div>
          </div>
        ) : userRole?.id === 'judge' ? (
          <div 
            className="nyaya-card" 
            onClick={() => setCurrentScreen('documents')}
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cause List Today</span>
              <Landmark size={18} style={{ color: '#FCA5A5' }} />
            </div>
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '32px', fontWeight: 700, color: '#FCA5A5', fontFamily: 'var(--font-mono)' }}>
                4
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Sessions Remand & Bail Hearings
              </div>
            </div>
          </div>
        ) : (
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
                {pendingDocsCount}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Offline Field Queue Ready
              </div>
            </div>
          </div>
        )}

        {/* Metric 4: High Priority */}
        <div 
          className="nyaya-card" 
          onClick={() => setCurrentScreen('cases')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>High Priority</span>
            <AlertTriangle size={18} style={{ color: 'var(--status-tampered)' }} />
          </div>
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--status-tampered)', fontFamily: 'var(--font-mono)' }}>
              {highPriorityCount}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {topPriorityCase ? `${topPriorityCase.firNumber} (${topPriorityCase.crimeHead.split('(')[0].trim()})` : 'Critical Expedited'}
            </div>
          </div>
        </div>

        {/* Quick Actions Panel on Right (Role-Tailored) */}
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
            {/* Primary Action Button - Role Tailored */}
            <button
              onClick={() => setCurrentScreen('upload')}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
            >
              <Upload size={14} />
              <span>{ROLE_CONFIG[userRole?.id || 'io']?.uploadActionLabel || 'Upload Document'}</span>
            </button>

            {/* Role 1: Police IO Quick Actions */}
            {userRole?.id === 'io' && (
              <>
                <button
                  onClick={() => setCurrentScreen('cases')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <PlusCircle size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span>Create New Case / FIR</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('verification')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <ShieldCheck size={14} style={{ color: 'var(--status-verified)' }} />
                  <span>Verify Seized Exhibit Hash</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('mobile-app')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <RefreshCw size={14} style={{ color: 'var(--status-pending)' }} />
                  <span>Offline Field Sync Queue ({pendingDocsCount})</span>
                </button>
              </>
            )}

            {/* Role 2: Forensic Lab Analyst Quick Actions */}
            {userRole?.id === 'fsl' && (
              <>
                <button
                  onClick={() => setCurrentScreen('verification')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <ShieldCheck size={14} style={{ color: 'var(--status-verified)' }} />
                  <span>Verify Received Device Hash</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('custody')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <GitBranch size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span>Inspect Lab Evidence Custody</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('cases')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <FolderLock size={14} style={{ color: 'var(--gold-light)' }} />
                  <span>View Forensic Requisitions</span>
                </button>
              </>
            )}

            {/* Role 3: Public Prosecutor Quick Actions */}
            {userRole?.id === 'prosecutor' && (
              <>
                <button
                  onClick={() => setCurrentScreen('cases')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <FileText size={14} style={{ color: 'var(--gold-primary)' }} />
                  <span>Scrutinize Police Chargesheets</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('certificates')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <Award size={14} style={{ color: '#C4B5FD' }} />
                  <span>Export Sec 63 BSA Certificate</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('audit')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <ScrollText size={14} />
                  <span>Inspect Tamper Audit Trail</span>
                </button>
              </>
            )}

            {/* Role 4: District & Sessions Judge Quick Actions */}
            {userRole?.id === 'judge' && (
              <>
                <button
                  onClick={() => setCurrentScreen('cases')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <Landmark size={14} style={{ color: '#FCA5A5' }} />
                  <span>Inspect Today's Cause List</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('verification')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <ShieldCheck size={14} style={{ color: 'var(--status-verified)' }} />
                  <span>Verify Blockchain Proof</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('audit')}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 12px', fontSize: '12px' }}
                >
                  <ScrollText size={14} />
                  <span>Judicial Audit Trail (BSA Sec 63)</span>
                </button>
              </>
            )}
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
                <th>Uploaded By</th>
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
                      <RoleBadge doc={doc} showSigner={false} />
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
          {cases.slice(0, 4).map((item) => {
            const attachedCount = documents.filter(d => d.caseId === item.id || d.caseId === item.firNumber).length || item.documentsCount || 0;
            return (
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
                  <span>{attachedCount} Exhibits Attached</span>
                  <span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>Open Case →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
