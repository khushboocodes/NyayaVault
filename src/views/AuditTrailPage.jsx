import React, { useState } from 'react';
import { 
  ScrollText, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowDownToLine 
} from 'lucide-react';
import { INITIAL_AUDIT_TRAIL } from '../data/mockData';

export default function AuditTrailPage({ setCurrentScreen }) {
  const [selectedAction, setSelectedAction] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = INITIAL_AUDIT_TRAIL.filter(log => {
    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      log.user.toLowerCase().includes(term) ||
      log.organization.toLowerCase().includes(term) ||
      log.document.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term);
    return matchesAction && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Matching Screen 17 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
              Audit Trail
            </h2>
            <span className="badge-status badge-gold">
              Immutable Ledger Logs
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Append-only, tamper-evident record of every document creation, signature, access, and court verification
          </p>
        </div>

        <button 
          onClick={() => alert("Exporting signed CSV audit log...")}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '8px 14px' }}
        >
          <ArrowDownToLine size={14} />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter Bar Matching Screen 17 */}
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
            placeholder="Search by user, organization, document ID..."
            className="nyaya-input"
            style={{ paddingLeft: '36px', height: '38px' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="nyaya-select"
            style={{ width: '180px', height: '38px' }}
          >
            <option value="ALL">All Actions</option>
            <option value="Document Created">Document Created</option>
            <option value="Digitally Signed">Digitally Signed</option>
            <option value="Archived to Blockchain">Archived to Blockchain</option>
            <option value="Document Accessed">Document Accessed</option>
            <option value="Document Verified">Document Verified</option>
          </select>

          <select className="nyaya-select" style={{ width: '140px', height: '38px' }} defaultValue="30days">
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">Full Case History</option>
          </select>
        </div>
      </div>

      {/* Audit Table Matching Screen 17 */}
      <div className="nyaya-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table">
            <thead>
              <tr>
                <th style={{ width: '180px' }}>Timestamp</th>
                <th>User</th>
                <th>Organization</th>
                <th>Action</th>
                <th>Document</th>
                <th style={{ textAlign: 'right', width: '100px' }}>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-light)' }}>
                    {log.timestamp}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#FFF' }}>{log.user}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.userRole}</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {log.organization}
                  </td>
                  <td>
                    <span className="badge-status badge-gold" style={{ fontSize: '11px' }}>
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span 
                      style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '11px',
                        color: 'var(--gold-light)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentScreen('document-viewer')}
                    >
                      {log.document}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className="badge-status badge-verified">
                      <CheckCircle2 size={11} /> {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
