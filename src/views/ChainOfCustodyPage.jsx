import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Award, 
  Download,
  Building,
  Key
} from 'lucide-react';
import { INITIAL_CHAIN_OF_CUSTODY } from '../data/mockData';

export default function ChainOfCustodyPage({ setCurrentScreen }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header Matching Screen 15 */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
              Chain of Custody
            </h2>
            <span className="badge-status badge-verified">
              <CheckCircle2 size={12} /> 6 Verifiable Hops
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            FIR-2026-001 | Murder Investigation • Exhibit: Witness_Statement.pdf
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCurrentScreen('certificates')}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '8px 16px' }}
          >
            <Award size={14} />
            <span>Export Custody Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Timeline Card (Screen 15) */}
      <div className="nyaya-card" style={{ padding: '36px 40px' }}>
        
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Vertical Connecting Rule */}
          <div 
            style={{
              position: 'absolute',
              top: '16px',
              bottom: '16px',
              left: '15px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--gold-primary) 0%, var(--status-verified) 100%)',
              zIndex: 1
            }} 
          />

          {INITIAL_CHAIN_OF_CUSTODY.map((item, index) => (
            <div 
              key={index}
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '24px'
              }}
            >
              {/* Circular Node Icon */}
              <div 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-elevated)',
                  border: '2px solid var(--gold-primary)',
                  boxShadow: '0 0 12px rgba(197, 154, 69, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-light)',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={16} />
              </div>

              {/* Event Content Card */}
              <div 
                style={{
                  flex: 1,
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
                      {item.stage}
                    </span>
                    <span className="badge-status badge-gold">
                      {item.role}
                    </span>
                  </div>

                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--gold-light)' }}>
                    {item.timestamp}
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <strong>{item.actor}</strong> &nbsp;•&nbsp; {item.organization}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.details}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '11px', color: 'var(--status-verified)' }}>
                  <ShieldCheck size={13} />
                  <span>Hardware Endorsement Confirmed • Location: {item.location}</span>
                </div>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
