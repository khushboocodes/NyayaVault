import React, { useState } from 'react';
import { 
  FolderLock, 
  Search, 
  Filter, 
  PlusCircle, 
  Eye, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function CaseManagementPage({ 
  cases, 
  setCurrentScreen, 
  setSelectedCase 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('30days');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);

  const filteredCases = cases.filter(c => {
    const term = searchTerm.toLowerCase();
    return (
      c.firNumber.toLowerCase().includes(term) ||
      c.caseTitle.toLowerCase().includes(term) ||
      c.policeStation.toLowerCase().includes(term) ||
      c.crimeHead.toLowerCase().includes(term)
    );
  });

  const handleRowClick = (caseItem) => {
    setSelectedCase(caseItem);
    setCurrentScreen('case-details');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header (Matching Reference Image 2 Screen 6) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
            Cases
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage and track digital investigation case dossiers across state police stations
          </p>
        </div>

        <button 
          onClick={() => setShowNewCaseModal(true)}
          className="btn-gold" 
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          <PlusCircle size={15} />
          <span>New Case</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div 
        className="nyaya-card" 
        style={{ 
          padding: '16px 20px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <input 
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by FIR number, case title, police station..."
            className="nyaya-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        </div>

        {/* Filter Period Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select 
            value={filterPeriod} 
            onChange={e => setFilterPeriod(e.target.value)}
            className="nyaya-select"
            style={{ width: '160px', height: '40px' }}
          >
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">Current Year (2026)</option>
            <option value="all">All Active Dockets</option>
          </select>
        </div>
      </div>

      {/* Cases Table (Exact Layout of Screen 6) */}
      <div className="nyaya-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table">
            <thead>
              <tr>
                <th style={{ width: '160px' }}>FIR Number</th>
                <th>Case Title</th>
                <th>Police Station</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '120px' }}>Documents</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item) => {
                const isActive = item.status === 'Active';

                return (
                  <tr 
                    key={item.id} 
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <span 
                        style={{ 
                          fontFamily: 'var(--font-mono)', 
                          fontWeight: 700, 
                          color: 'var(--gold-light)',
                          fontSize: '13px'
                        }}
                      >
                        {item.firNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#FFF' }}>{item.caseTitle}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.crimeHead}</div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {item.policeStation}
                    </td>
                    <td>
                      {isActive ? (
                        <span className="badge-status badge-verified">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      ) : (
                        <span className="badge-status badge-pending">
                          <Clock size={11} /> Pending
                        </span>
                      )}
                    </td>
                    <td>
                      <span 
                        style={{ 
                          padding: '2px 8px', 
                          background: 'rgba(255, 255, 255, 0.04)', 
                          borderRadius: 'var(--radius-pill)', 
                          fontFamily: 'var(--font-mono)', 
                          fontSize: '12px' 
                        }}
                      >
                        {item.documentsCount}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(item);
                        }}
                        className="btn-outline-gold"
                        style={{ padding: '5px 12px', fontSize: '11px' }}
                      >
                        <span>View</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Case Creation Modal */}
      {showNewCaseModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="nyaya-card-gold" 
            style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-surface-elevated)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#FFF', fontFamily: 'var(--font-serif)' }}>
                Register New Digital Case Docket
              </h3>
              <button 
                onClick={() => setShowNewCaseModal(false)}
                style={{ color: 'var(--text-muted)', fontSize: '18px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  FIR Number (e-CCTNS Generated)
                </label>
                <input type="text" defaultValue="FIR-2026-006" className="nyaya-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Case Title
                </label>
                <input type="text" placeholder="e.g. Armed Robbery at National Highway" className="nyaya-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Crime Head (Statutory Section)
                </label>
                <input type="text" defaultValue="Section 310 BNS (Robbery)" className="nyaya-input" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Police Station / Outpost
                </label>
                <input type="text" defaultValue="Chhattisgarh Sadar Police Station" className="nyaya-input" />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button 
                  onClick={() => setShowNewCaseModal(false)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowNewCaseModal(false);
                    alert("New Case Docket FIR-2026-006 registered on ledger!");
                  }} 
                  className="btn-gold"
                >
                  Create Docket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
