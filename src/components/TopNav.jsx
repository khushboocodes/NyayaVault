import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Bell, 
  ShieldCheck, 
  ChevronDown,
  Menu,
  RefreshCw
} from 'lucide-react';
import AshokaLogo from './AshokaLogo';

export default function TopNav({ 
  currentScreen, 
  setCurrentScreen, 
  userRole, 
  onLogout,
  isOffline, 
  setIsOffline,
  offlineQueueCount = 4,
  onOpenMobileDrawer
}) {
  return (
    <header className="app-topbar">
      
      {/* Mobile-Only Header Left: Menu Toggle + Brand */}
      <div className="mobile-header-brand">
        <button 
          onClick={onOpenMobileDrawer} 
          className="mobile-menu-toggle"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div 
          onClick={() => setCurrentScreen('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <AshokaLogo size="small" showSubtitle={false} />
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '15px', color: '#FFF' }}>
            NYAYAVAULT
          </span>
        </div>
      </div>

      {/* Desktop-Only Left: User greeting and jurisdiction */}
      <div className="desktop-header-info">
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Network & Offline Simulation Toggle */}
        <button
          onClick={() => setIsOffline(!isOffline)}
          className="network-status-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
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
              <span className="network-label-full">OFFLINE ({offlineQueueCount} Queued)</span>
              <span className="network-label-short">OFFLINE ({offlineQueueCount})</span>
            </>
          ) : (
            <>
              <Wifi size={13} />
              <span className="network-label-full">NETWORK ACTIVE (Fabric v2.5)</span>
              <span className="network-label-short">ONLINE</span>
            </>
          )}
        </button>

        {/* Desktop-Only Public Verifier Shortcut */}
        <button
          onClick={() => setCurrentScreen('verification')}
          className="btn-secondary desktop-only-btn"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--gold-primary)' }} />
          Verify Portal
        </button>

        {/* Desktop-Only Offline Sync Hub Shortcut */}
        <button
          onClick={() => setCurrentScreen('mobile-app')}
          className={`btn-secondary desktop-only-btn ${currentScreen === 'mobile-app' ? 'active' : ''}`}
          style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Open Offline Field Sync Console"
        >
          <RefreshCw size={13} style={{ color: 'var(--gold-primary)' }} />
          <span>Sync Hub</span>
          {offlineQueueCount > 0 && (
            <span 
              style={{ 
                background: 'var(--gold-primary)', 
                color: '#0A0D14', 
                fontSize: '10px', 
                fontWeight: 700, 
                padding: '1px 5px', 
                borderRadius: '10px' 
              }}
            >
              {offlineQueueCount}
            </span>
          )}
        </button>

        {/* Notifications (Desktop only) */}
        <div 
          className="desktop-only-btn"
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
            gap: '8px', 
            paddingLeft: '6px', 
            borderLeft: '1px solid var(--border-subtle)',
            cursor: 'pointer'
          }}
          onClick={onLogout}
          title="Click to logout session"
        >
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #C59A45 0%, #151A24 100%)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '11px',
              color: '#FFF'
            }}
          >
            {userRole?.code || 'NV'}
          </div>
          <ChevronDown size={14} className="desktop-only-btn" style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </header>
  );
}
