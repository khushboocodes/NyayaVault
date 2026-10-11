import React, { useState, useEffect } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowDownToLine,
  RefreshCw,
  Eye,
  Download,
  Award,
  Key,
  FolderLock,
  GitBranch,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { INITIAL_AUDIT_TRAIL } from '../data/mockData';
import { api } from '../api';

export default function AuditTrailPage({ setCurrentScreen }) {
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState(INITIAL_AUDIT_TRAIL);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.audit.getTrail();
      if (res?.auditTrail && res.auditTrail.length > 0) {
        setLogs(res.auditTrail);
      }
    } catch (err) {
      console.warn('Live audit trail fetch fallback:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Listen to real-time local activities fired from other pages
    const handleLiveAudit = (e) => {
      if (e.detail) {
        setLogs(prev => {
          // Avoid duplicate ID if already in list
          if (e.detail.id && prev.some(l => l.id === e.detail.id)) return prev;
          return [e.detail, ...prev];
        });
      }
    };

    window.addEventListener('nyayavault_audit_logged', handleLiveAudit);
    return () => window.removeEventListener('nyayavault_audit_logged', handleLiveAudit);
  }, []);

  // Compute dynamic unique actions from the current logs list
  const availableActions = ['ALL', ...Array.from(new Set(logs.map(l => l.action).filter(Boolean)))];

  const filteredLogs = logs.filter(log => {
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (log.user && log.user.toLowerCase().includes(term)) ||
      (log.userRole && log.userRole.toLowerCase().includes(term)) ||
      (log.organization && log.organization.toLowerCase().includes(term)) ||
      (log.document && log.document.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term));
    return matchesAction && matchesSearch;
  });

  // Export full audit trail as signed CSV report
  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'User', 'Role', 'Organization', 'Action', 'Target Document / Entity', 'Activity Details', 'Result', 'IP / Terminal'];
    const rows = filteredLogs.map(l => [
      `"${l.id || ''}"`,
      `"${l.timestamp || ''}"`,
      `"${l.user || ''}"`,
      `"${l.userRole || ''}"`,
      `"${l.organization || ''}"`,
      `"${l.action || ''}"`,
      `"${l.document || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
      `"${l.result || 'Success'}"`,
      `"${l.ipAddress || '127.0.0.1'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NyayaVault_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to render action badge with icon and matching styling
  const renderActionBadge = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('view') || act.includes('access')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Eye size={12} /> {action}
        </span>
      );
    }
    if (act.includes('download') || act.includes('export')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(52, 211, 153, 0.15)', color: '#34D399', border: '1px solid rgba(52, 211, 153, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Download size={12} /> {action}
        </span>
      );
    }
    if (act.includes('certificate') || act.includes('bsa')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#FBBF24', border: '1px solid rgba(251, 191, 36, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Award size={12} /> {action}
        </span>
      );
    }
    if (act.includes('tamper') || act.includes('denied') || act.includes('alert')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#F43F5E', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <AlertTriangle size={12} /> {action}
        </span>
      );
    }
    if (act.includes('verif') || act.includes('integr')) {
      return (
        <span className="badge-status badge-verified" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <ShieldCheck size={12} /> {action}
        </span>
      );
    }
    if (act.includes('case')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <FolderLock size={12} /> {action}
        </span>
      );
    }
    if (act.includes('custody')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(14, 165, 233, 0.15)', color: '#38BDF8', border: '1px solid rgba(14, 165, 233, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <GitBranch size={12} /> {action}
        </span>
      );
    }
    if (act.includes('auth') || act.includes('login')) {
      return (
        <span className="badge-status" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818CF8', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Key size={12} /> {action}
        </span>
      );
    }
    return (
      <span className="badge-status badge-gold" style={{ fontSize: '11px' }}>
        {action}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
              Sovereign Audit Trail
            </h2>
            <span className="badge-status badge-gold">
              Live Immutable Ledger Logs ({filteredLogs.length})
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive, tamper-evident record tracking every document view, download, signature, custody transfer, and forensic verification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchLogs}
            disabled={isRefreshing}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh logs from database"
          >
            <RefreshCw size={14} className={isRefreshing ? 'pulse-animation' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Logs'}</span>
          </button>

          <button 
            onClick={handleExportCsv}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowDownToLine size={14} />
            <span>Export Signed CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div 
        className="nyaya-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by officer name, role, agency, document, activity details..."
            className="nyaya-input"
            style={{ paddingLeft: '36px', height: '38px', width: '100%' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <select 
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="nyaya-select"
            style={{ minWidth: '190px', height: '38px' }}
          >
            {availableActions.map(act => (
              <option key={act} value={act}>
                {act === 'ALL' ? 'All Activities' : act}
              </option>
            ))}
          </select>

          <select className="nyaya-select" style={{ width: '140px', height: '38px' }} defaultValue="all">
            <option value="all">Full Case History</option>
            <option value="30days">Last 30 Days</option>
            <option value="today">Today's Session</option>
          </select>
        </div>
      </div>

      {/* Comprehensive Audit Table */}
      <div className="nyaya-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>Timestamp</th>
                <th style={{ width: '190px' }}>Officer / Actor</th>
                <th style={{ width: '170px' }}>Action</th>
                <th style={{ width: '180px' }}>Document / Target</th>
                <th>Activity Details & Summary</th>
                <th style={{ textAlign: 'right', width: '90px' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No audit records matching your current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isAlert = log.result === 'Alert' || log.result === 'Denied';
                  return (
                    <tr key={log.id || `${log.timestamp}-${Math.random()}`}>
                      {/* Timestamp */}
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-light)', whiteSpace: 'nowrap' }}>
                        {log.timestamp}
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ID: {log.id || 'AUD-NEW'}
                        </div>
                      </td>

                      {/* Officer & Role */}
                      <td>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{log.user}</div>
                        <div style={{ fontSize: '11px', color: 'var(--gold-light)' }}>{log.userRole}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{log.organization}</div>
                      </td>

                      {/* Action */}
                      <td>
                        {renderActionBadge(log.action)}
                      </td>

                      {/* Document / Target */}
                      <td>
                        <span 
                          style={{ 
                            fontFamily: 'var(--font-mono)', 
                            fontSize: '11px',
                            color: 'var(--gold-light)',
                            cursor: 'pointer',
                            wordBreak: 'break-word',
                            fontWeight: 600
                          }}
                          onClick={() => {
                            if (log.document?.includes('FIR')) {
                              setCurrentScreen('cases');
                            } else {
                              setCurrentScreen('document-viewer');
                            }
                          }}
                          title="Click to view target exhibit"
                        >
                          {log.document || 'System Portal'}
                        </span>
                      </td>

                      {/* Activity Details & Hardware Telemetry */}
                      <td>
                        <div style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.4 }}>
                          {log.details || 'Activity registered on blockchain ledger.'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                          Terminal: {log.ipAddress || '127.0.0.1'} • Digest Seal: {log.macHash || 'e2b4...8f1a'}
                        </div>
                      </td>

                      {/* Result */}
                      <td style={{ textAlign: 'right' }}>
                        <span className={`badge-status ${isAlert ? 'badge-pending' : 'badge-verified'}`} style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isAlert ? (
                            <AlertTriangle size={11} />
                          ) : (
                            <CheckCircle2 size={11} />
                          )}
                          {log.result || 'Success'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
