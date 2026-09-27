import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Bell, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';

export default function TopNav({ 
  currentScreen, 
  setCurrentScreen, 
  userRole, 
  onLogout,
  isOffline, 
  setIsOffline,
  offlineQueueCount = 4
}) {
  return (
    <header className="app-topbar">
      {/* Left: User greeting and jurisdiction */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Authenticated Session
            </span>
            <span className="badge-status badge-gold">
              {userRole?.title || 'Investigating Officer'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            National ICJS II Network • Sovereign Consortium Node #1
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Network & Offline Simulation Toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-pill)',
            background: isOffline ? 'var(--status-pending-bg)' : 'var(--status-verified-bg)',
            border: `1px solid ${isOffline ? 'var(--status-pending-border)' : 'var(--status-verified-border)'}`,
            color: isOffline ? 'var(--status-pending)' : 'var(--status-verified)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          title="Click to toggle Network Simulation (Online vs Offline Field Mode)"
        >
          {isOffline ? (
            <>
              <WifiOff size={13} />
              <span>OFFLINE ({offlineQueueCount} Queued)</span>
            </>
          ) : (
            <>
              <Wifi size={13} />
              <span>NETWORK ACTIVE (Fabric v2.5)</span>
            </>
          )}
        </button>

        {/* Public Verifier Shortcut */}
        <button
          onClick={() => setCurrentScreen('verification')}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
          Verify Portal
        </button>

        {/* Field Mobile App View Shortcut */}
        <button
          onClick={() => setCurrentScreen('mobile-app')}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          Mobile Field App
        </button>

        {/* Notifications */}
        <div 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: 'var(--radius-sm)', 
            background: 'var(--bg-surface-elevated)', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <Bell size={16} />
          <span 
            style={{ 
              position: 'absolute', 
              top: '7px', 
              right: '7px', 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: 'var(--gold-primary)' 
            }} 
          />
        </div>

        {/* Profile Avatar */}
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            paddingLeft: '8px', 
            borderLeft: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
          onClick={onLogout}
          title="Click to logout session"
        >
          <div 
            style={{ 
              width: '34px', 
              height: '34px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #C59A45 0%, #151A24 100%)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: '#FFF'
            }}
          >
            {userRole?.code || 'NV'}
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
