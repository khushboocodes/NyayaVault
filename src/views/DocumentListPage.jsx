import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ShieldCheck, 
  Eye, 
  Download, 
  FileCheck2, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Lock, 
  ExternalLink,
  Layers,
  ArrowRight,
  Shield,
  FolderLock,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { api } from '../api';
import { logActivity } from '../utils/auditLogger';

export default function DocumentListPage({
  documents = [],
  cases = [],
  selectedCase,
  setSelectedCase,
  setSelectedDoc,
  setCurrentScreen
}) {
  // Active selected ongoing case (defaults to currently selected case or the first active case)
  const [activeCaseId, setActiveCaseId] = useState(() => {
    return selectedCase?.id || (cases.length > 0 ? cases[0].id : 'FIR-2026-001');
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [copiedHashId, setCopiedHashId] = useState(null);

  // Find the active case object
  const currentCaseObj = cases.find(c => c.id === activeCaseId) || cases[0] || null;

  // Handle case selection from the prominent ongoing cases dropdown
  const handleCaseChange = (caseId) => {
    setActiveCaseId(caseId);
    const matched = cases.find(c => c.id === caseId);
    if (matched && setSelectedCase) {
      setSelectedCase(matched);
    }
  };

  // Filter documents: First by selected ongoing case, then by search, type, and status
  const caseDocuments = activeCaseId === 'ALL'
    ? documents
    : documents.filter(d => d.caseId === activeCaseId);

  const filteredDocs = caseDocuments.filter(doc => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      doc.name?.toLowerCase().includes(term) ||
      doc.id?.toLowerCase().includes(term) ||
      doc.caseId?.toLowerCase().includes(term) ||
      doc.caseTitle?.toLowerCase().includes(term) ||
      doc.type?.toLowerCase().includes(term) ||
      doc.signer?.toLowerCase().includes(term) ||
      doc.sha256?.toLowerCase().includes(term)
    );

    const matchesType = selectedType === 'all' || doc.type?.toLowerCase() === selectedType.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || doc.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // Extract unique types for the filter
  const uniqueTypes = Array.from(new Set(caseDocuments.map(d => d.type).filter(Boolean)));

  // Copy SHA-256 hash helper
  const handleCopyHash = (doc, e) => {
    e.stopPropagation();
    if (doc.sha256 && navigator.clipboard) {
      navigator.clipboard.writeText(doc.sha256);
      setCopiedHashId(doc.id);
      setTimeout(() => setCopiedHashId(null), 2000);
    }
  };

  // Primary Action: View Document (Direct to DocumentViewerPage + Audit Trail Log)
  const handleViewDoc = (doc, e) => {
    if (e) e.stopPropagation();
    
    // Log audit trail event for document view
    logActivity({
      action: 'Document Viewed',
      document: `${doc.name} (${doc.id})`,
      details: `Viewed digital evidence document '${doc.name}' (${doc.id}) in sovereign viewer. Case docket: ${doc.caseId || 'Investigation'}. Sensitivity: ${doc.isSensitive ? 'Section 72 BNS Protected' : 'Standard'}.`
    });

    if (setSelectedDoc) {
      setSelectedDoc(doc);
    }
    setCurrentScreen('document-viewer');
  };

  // Action: Generate / View BSA Certificate
  const handleGenerateBsa = (doc, e) => {
    if (e) e.stopPropagation();
    logActivity({
      action: 'BSA Certificate Requested',
      document: `${doc.name} (${doc.id})`,
      details: `Requested Section 63 BSA electronic record certificate for '${doc.name}' (${doc.id}).`
    });
    if (setSelectedDoc) {
      setSelectedDoc(doc);
    }
    setCurrentScreen('certificates');
  };

  // Action: Navigate to Verification Portal
  const handleVerify = (doc, e) => {
    if (e) e.stopPropagation();
    logActivity({
      action: 'Verification Gate Navigated',
      document: `${doc.name} (${doc.id})`,
      details: `Navigated to Verification Portal to verify SHA-256 integrity of '${doc.name}' (${doc.id}).`
    });
    if (setSelectedDoc) {
      setSelectedDoc(doc);
    }
    setCurrentScreen('verification');
  };

  // Action: Download Decrypted Evidence File
  const handleDownload = (doc, e) => {
    if (e) e.stopPropagation();
    logActivity({
      action: 'Document Downloaded',
      document: `${doc.name} (${doc.id})`,
      details: `Downloaded decrypted copy of '${doc.name}' (${doc.id}) with SHA-256 seal.`
    });
    window.open(api.evidence.getDownloadUrl(doc.id, 'master'), '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* =========================================================================
          PAGE HEADER
          ========================================================================= */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
              Evidence Documents Repository
            </h2>
            <span className="badge-status badge-gold">
              Case-Classified Evidence
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Classify and access electronic exhibits, forensic reports, and FIRs linked to ongoing criminal cases
          </p>
        </div>

        <button 
          onClick={() => setCurrentScreen('upload')}
          className="btn-gold"
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <Upload size={15} />
          <span>Upload New Evidence</span>
        </button>
      </div>

      {/* =========================================================================
          PRIMARY ONGOING CASE SELECTOR (HIGHLIGHTED CASE CLASSIFIER)
          ========================================================================= */}
      <div 
        className="nyaya-card" 
        style={{ 
          padding: '18px 20px', 
          background: 'linear-gradient(135deg, rgba(16, 20, 29, 0.95) 0%, rgba(22, 28, 40, 0.95) 100%)',
          border: '1px solid rgba(197, 154, 69, 0.35)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderLock size={18} style={{ color: 'var(--gold-primary)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>
                SELECT ONGOING CASE DOSSIER TO VIEW CLASSIFIED DOCUMENTS:
              </span>
            </div>
            
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Showing {caseDocuments.length} exhibits for selected docket
            </div>
          </div>

          {/* Large Dropdown Selector */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 360px' }}>
              <select 
                value={activeCaseId}
                onChange={e => handleCaseChange(e.target.value)}
                className="nyaya-select"
                style={{ 
                  width: '100%', 
                  padding: '11px 16px', 
                  fontSize: '14px', 
                  fontWeight: 600,
                  color: '#FFF',
                  background: 'var(--bg-surface-elevated)',
                  border: '1.5px solid var(--gold-primary)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {cases.map((c) => {
                  const docCount = documents.filter(d => d.caseId === c.id).length;
                  return (
                    <option key={c.id} value={c.id}>
                      📁 {c.firNumber} — {c.caseTitle} ({c.district}, {c.state}) [{docCount} Documents]
                    </option>
                  );
                })}
                <option value="ALL">
                  🌐 ALL ONGOING CASES (Consolidated Sovereign View - {documents.length} Total Documents)
                </option>
              </select>
            </div>

            {currentCaseObj && activeCaseId !== 'ALL' && (
              <button
                type="button"
                onClick={() => {
                  if (setSelectedCase) setSelectedCase(currentCaseObj);
                  setCurrentScreen('case-details');
                }}
                className="btn-outline-gold"
                style={{ padding: '10px 16px', fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                <span>View Full Case Docket</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

        </div>

        {/* Selected Case Dossier Banner Overview */}
        {currentCaseObj && activeCaseId !== 'ALL' && (
          <div 
            style={{ 
              marginTop: '16px', 
              paddingTop: '16px', 
              borderTop: '1px solid rgba(197, 154, 69, 0.2)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              fontSize: '12px'
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>CRIME HEAD / SECTIONS:</span>
              <strong style={{ color: 'var(--gold-light)', fontSize: '13px' }}>{currentCaseObj.crimeHead}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>POLICE STATION:</span>
              <strong style={{ color: '#FFF' }}>{currentCaseObj.policeStation}</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>INVESTIGATING OFFICER:</span>
              <strong style={{ color: '#FFF' }}>{currentCaseObj.investigatingOfficer} ({currentCaseObj.badgeNumber})</strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>CASE STATUS:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className="badge-status badge-verified" style={{ fontSize: '10px' }}>
                  <CheckCircle2 size={10} /> {currentCaseObj.status}
                </span>
                <span className="badge-status badge-gold" style={{ fontSize: '10px' }}>
                  {currentCaseObj.priority} Priority
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          SEARCH & FILTERS CONTROL BAR
          ========================================================================= */}
      <div className="nyaya-card" style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Real-time search */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: '220px' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search within this case by document name, hash, type..."
              className="nyaya-input"
              style={{ width: '100%', paddingLeft: '36px', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filters group */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            
            {/* Filter by Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type:</span>
              <select 
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="nyaya-select"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status:</span>
              <select 
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="nyaya-select"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Clear filters button */}
            {(searchTerm || selectedType !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px' }}
              >
                Reset Filters
              </button>
            )}

          </div>

        </div>
      </div>

      {/* =========================================================================
          DOCUMENTS DATA TABLE (STRICTLY FOR THE SELECTED CASE)
          ========================================================================= */}
      <div className="nyaya-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '34%' }}>Document Name & Metadata</th>
                <th style={{ width: '13%' }}>Case Docket</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '17%' }}>SHA-256 Digest</th>
                <th style={{ width: '12%' }}>Fabric Block</th>
                <th style={{ width: '14%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => {
                  const isVerified = doc.status === 'Verified';
                  const isCopied = copiedHashId === doc.id;

                  return (
                    <tr 
                      key={doc.id}
                      onClick={(e) => handleViewDoc(doc, e)}
                      style={{ cursor: 'pointer', transition: 'background 0.15s ease' }}
                      title="Click to open this document in sovereign viewer"
                    >
                      {/* Document Details */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '6px', background: 'rgba(197, 154, 69, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ fontWeight: 600, color: '#FFF', fontSize: '14px' }}>
                                {doc.name}
                              </span>
                              {isVerified && (
                                <span className="badge-status badge-verified" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                  <CheckCircle2 size={10} /> Verified
                                </span>
                              )}
                              {doc.isSensitive && (
                                <span className="badge-status badge-bns" style={{ fontSize: '9px', padding: '1px 6px' }}>
                                  Sec 72 BNS Protected
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                              <span>{doc.id}</span>
                              <span style={{ margin: '0 6px' }}>•</span>
                              <span>{doc.size || '2.4 MB'}</span>
                              <span style={{ margin: '0 6px' }}>•</span>
                              <span>{doc.pages ? `${doc.pages} Pages` : 'Immutable Exhibit'}</span>
                              {doc.uploadedOn && (
                                <>
                                  <span style={{ margin: '0 6px' }}>•</span>
                                  <span>{doc.uploadedOn}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Associated Case */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--gold-light)', fontWeight: 600 }}>
                            {doc.caseId || 'UNASSIGNED'}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {doc.caseTitle || 'Case Docket'}
                          </span>
                        </div>
                      </td>

                      {/* Evidence Type */}
                      <td>
                        <span className="badge-status badge-gold" style={{ fontSize: '11px' }}>
                          {doc.type}
                        </span>
                      </td>

                      {/* SHA-256 Digest */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span 
                            style={{ 
                              fontFamily: 'var(--font-mono)', 
                              fontSize: '11px', 
                              color: 'var(--text-secondary)',
                              background: 'rgba(0, 0, 0, 0.3)',
                              padding: '3px 6px',
                              borderRadius: '3px',
                              border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}
                            title={doc.sha256}
                          >
                            {doc.sha256 ? `${doc.sha256.slice(0, 14)}...` : 'N/A'}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyHash(doc, e)}
                            className="btn-secondary"
                            style={{ padding: '3px 6px', fontSize: '10px' }}
                            title="Copy full SHA-256 hash"
                          >
                            {isCopied ? <Check size={11} style={{ color: 'var(--status-verified)' }} /> : <Copy size={11} />}
                          </button>
                        </div>
                      </td>

                      {/* Fabric Lineage */}
                      <td>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                          <div style={{ color: '#FFF', fontWeight: 600 }}>
                            Block #{doc.blockNumber || '129381'}
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '10.5px', marginTop: '1px' }}>
                            {doc.signer ? doc.signer.split('(')[0].trim() : 'Police SI'}
                          </div>
                        </div>
                      </td>

                      {/* Action Controls */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          
                          {/* 1. View Document Button */}
                          <button 
                            type="button"
                            onClick={(e) => handleViewDoc(doc, e)}
                            className="btn-gold"
                            style={{ padding: '5px 10px', fontSize: '11px', gap: '4px' }}
                            title="Open in Document Viewer"
                          >
                            <Eye size={12} />
                            <span>View</span>
                          </button>

                          {/* 2. Section 63 BSA Certificate */}
                          <button 
                            type="button"
                            onClick={(e) => handleGenerateBsa(doc, e)}
                            className="btn-outline-gold"
                            style={{ padding: '5px 8px', fontSize: '11px' }}
                            title="Generate Section 63 BSA Certificate"
                          >
                            <FileCheck2 size={12} />
                          </button>

                          {/* 3. Verify */}
                          <button 
                            type="button"
                            onClick={(e) => handleVerify(doc, e)}
                            className="btn-secondary"
                            style={{ padding: '5px 8px', fontSize: '11px' }}
                            title="Verify Hash against Fabric Ledger"
                          >
                            <ShieldCheck size={12} />
                          </button>

                          {/* 4. Download */}
                          <button 
                            type="button"
                            onClick={(e) => handleDownload(doc, e)}
                            className="btn-secondary"
                            style={{ padding: '5px 8px', fontSize: '11px' }}
                            title="Download decrypted file"
                          >
                            <Download size={12} />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
                    <FolderOpen size={36} style={{ color: 'rgba(255, 255, 255, 0.15)', marginBottom: '10px' }} />
                    <div style={{ fontSize: '15px', color: '#FFF', fontWeight: 600 }}>
                      No documents found for this case docket
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Try selecting another case from the dropdown or click Upload to attach a new exhibit.
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentScreen('upload')}
                      className="btn-gold"
                      style={{ marginTop: '16px', padding: '7px 16px', fontSize: '12px' }}
                    >
                      <Upload size={13} />
                      <span>Upload Evidence to {currentCaseObj ? currentCaseObj.firNumber : 'Case'}</span>
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
