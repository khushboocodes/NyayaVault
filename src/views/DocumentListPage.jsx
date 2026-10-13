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
  Shield
} from 'lucide-react';
import { api } from '../api';
import { logActivity } from '../utils/auditLogger';

export default function DocumentListPage({
  documents = [],
  setSelectedDoc,
  setCurrentScreen
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCase, setSelectedCase] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [copiedHashId, setCopiedHashId] = useState(null);

  // Extract unique filter options
  const uniqueCases = Array.from(new Set(documents.map(d => d.caseId).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(documents.map(d => d.type).filter(Boolean)));

  // Filtered documents list
  const filteredDocs = documents.filter(doc => {
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
    const matchesCase = selectedCase === 'all' || doc.caseId === selectedCase;
    const matchesStatus = selectedStatus === 'all' || doc.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesType && matchesCase && matchesStatus;
  });

  // Copy SHA-256 hash helper
  const handleCopyHash = (doc, e) => {
    e.stopPropagation();
    if (doc.sha256 && navigator.clipboard) {
      navigator.clipboard.writeText(doc.sha256);
      setCopiedHashId(doc.id);
      setTimeout(() => setCopiedHashId(null), 2000);
    }
  };

  // 1. Primary Action: View Document (Direct to DocumentViewerPage + Audit Trail Log)
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

  // 2. Action: Generate / View BSA Certificate
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

  // 3. Action: Navigate to Verification Portal
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

  // 4. Action: Download Decrypted Evidence File
  const handleDownload = (doc, e) => {
    if (e) e.stopPropagation();
    logActivity({
      action: 'Document Downloaded',
      document: `${doc.name} (${doc.id})`,
      details: `Downloaded decrypted copy of '${doc.name}' (${doc.id}) with SHA-256 seal.`
    });
    window.open(api.evidence.getDownloadUrl(doc.id, 'master'), '_blank');
  };

  // Key Metrics
  const totalVerified = documents.filter(d => d.status === 'Verified').length;
  const totalSensitive = documents.filter(d => d.isSensitive).length;
  const totalCasesCount = uniqueCases.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
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
              Sovereign Vault ({documents.length})
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Section 63 BSA & Section 72 BNS verified electronic records anchored to Hyperledger Fabric
          </p>
        </div>

        <button 
          onClick={() => setCurrentScreen('upload')}
          className="btn-gold"
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <Upload size={15} />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* =========================================================================
          TOP METRICS SUMMARY BAR
          ========================================================================= */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
          gap: '14px' 
        }}
      >
        <div className="nyaya-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(197, 154, 69, 0.12)', border: '1px solid rgba(197, 154, 69, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Total Evidence Documents
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-mono)' }}>
              {documents.length}
            </div>
          </div>
        </div>

        <div className="nyaya-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-verified)' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tamper-Proof Verified
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--status-verified)', fontFamily: 'var(--font-mono)' }}>
              {totalVerified}
            </div>
          </div>
        </div>

        <div className="nyaya-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-bns)' }}>
            <Lock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sec 72 BNS Protected
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#F472B6', fontFamily: 'var(--font-mono)' }}>
              {totalSensitive}
            </div>
          </div>
        </div>

        <div className="nyaya-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38BDF8' }}>
            <Layers size={20} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Case Dockets Linked
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#38BDF8', fontFamily: 'var(--font-mono)' }}>
              {totalCasesCount}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SEARCH & FILTERS CONTROL BAR
          ========================================================================= */}
      <div className="nyaya-card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Real-time search */}
          <div style={{ position: 'relative', flex: '1 1 280px', minWidth: '220px' }}>
            <Search 
              size={15} 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by document name, FIR / Case ID, hash, or signer..."
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

            {/* Filter by Case */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Case:</span>
              <select 
                value={selectedCase}
                onChange={e => setSelectedCase(e.target.value)}
                className="nyaya-select"
                style={{ fontSize: '12px', padding: '6px 10px' }}
              >
                <option value="all">All Cases</option>
                {uniqueCases.map(c => (
                  <option key={c} value={c}>{c}</option>
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
            {(searchTerm || selectedType !== 'all' || selectedCase !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedCase('all');
                  setSelectedStatus('all');
                }}
                className="btn-secondary"
                style={{ fontSize: '11px', padding: '6px 10px' }}
              >
                Reset
              </button>
            )}

          </div>

        </div>
      </div>

      {/* =========================================================================
          DOCUMENTS DATA TABLE
          ========================================================================= */}
      <div className="nyaya-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Document Name & Metadata</th>
                <th style={{ width: '15%' }}>Case Dossier</th>
                <th style={{ width: '10%' }}>Type</th>
                <th style={{ width: '18%' }}>SHA-256 Fingerprint</th>
                <th style={{ width: '12%' }}>Fabric Lineage</th>
                <th style={{ width: '13%', textAlign: 'right' }}>Actions</th>
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
                      title="Click row to open sovereign document viewer"
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
                              <span>{doc.pages ? `${doc.pages} Pages` : 'Immutable Record'}</span>
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
                            {doc.caseTitle || 'General Docket'}
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
                          
                          {/* 1. View Document */}
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
                    <FileText size={36} style={{ color: 'rgba(255, 255, 255, 0.15)', marginBottom: '10px' }} />
                    <div style={{ fontSize: '15px', color: '#FFF', fontWeight: 600 }}>
                      No matching documents found
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      Try adjusting your search terms or filter selections.
                    </div>
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
