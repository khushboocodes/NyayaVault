import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  FolderLock, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Clock, 
  Layers, 
  ShieldCheck, 
  Home, 
  FileText, 
  MoreHorizontal,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MobileAppSimulatorPage({ setCurrentScreen }) {
  const [isSimulatingSync, setIsSimulatingSync] = useState(false);
  const [syncPercentage, setSyncPercentage] = useState(68);
  const [syncState, setSyncState] = useState('offline'); // 'offline', 'syncing', 'synced'

  const handleSimulateSync = () => {
    setSyncState('syncing');
    setSyncPercentage(15);

    const interval = setInterval(() => {
      setSyncPercentage(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setSyncState('synced');
          try {
            confetti({
              particleCount: 40,
              spread: 50,
              origin: { y: 0.7 }
            });
          } catch (e) {}
          return 100;
        }
        return prev + 18;
      });
    }, 400);
  };

  const handleReset = () => {
    setSyncState('offline');
    setSyncPercentage(68);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
            Offline Field Mobile Client (PWA)
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Interactive simulation of the rugged mobile client deployed at remote police thanas with 2G or zero connectivity
          </p>
        </div>

        {/* Sync Simulation Controls */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {syncState === 'offline' && (
            <button 
              onClick={handleSimulateSync}
              className="btn-gold"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              <Wifi size={14} />
              <span>Simulate Network Restored → Auto-Sync</span>
            </button>
          )}

          {syncState !== 'offline' && (
            <button 
              onClick={handleReset}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '8px 16px' }}
            >
              <RotateCcwIcon size={14} />
              <span>Reset to Offline Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Explanation Banner */}
      <div 
        style={{
          background: 'rgba(197, 154, 69, 0.08)',
          border: '1px solid var(--gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 18px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <WifiOff size={18} style={{ color: 'var(--gold-primary)' }} />
          <span>
            <strong>Offline-First Guarantee:</strong> When in zero-connectivity areas, the officer captures documents via camera, 
            the mobile generates SHA-256 locally, signs with the hardware device key, and queues in encrypted SQLite until 4G/WAN returns.
          </span>
        </div>
        <span className="badge-status badge-gold">
          Zero Data Loss
        </span>
      </div>

      {/* Dual Phone Display (Matching Reference Image 2 Screen 18) */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          flexWrap: 'wrap',
          padding: '20px 0'
        }}
      >
        {/* =========================================================================
            PHONE 1: HOME & OFFLINE QUEUE (SCREEN 18 LEFT PHONE)
            ========================================================================= */}
        <div className="mobile-device-shell">
          <div className="mobile-notch" />
          
          <div className="mobile-screen">
            {/* Mobile Header */}
            <div 
              style={{
                height: '52px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '16px', color: '#FFF' }}>
                NyayaVault
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--status-pending)' }}>
                <WifiOff size={12} />
                <span>2G Field Mode</span>
              </div>
            </div>

            {/* Scrollable Mobile Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Offline Banner */}
              <div 
                style={{
                  background: 'var(--status-pending-bg)',
                  border: '1px solid var(--status-pending-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-pending)' }}>
                    OFFLINE MODE
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {syncState === 'synced' ? 'All records synchronized' : '4 records queued locally'}
                  </div>
                </div>
                <span className="badge-status badge-pending" style={{ fontSize: '9px' }}>
                  {syncState === 'synced' ? 'Online' : 'Pending Sync'}
                </span>
              </div>

              {/* Offline Cryptographic Checklist */}
              <div 
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '11px'
                }}
              >
                <div style={{ color: 'var(--status-verified)' }}>✓ File captured (Camera OCR)</div>
                <div style={{ color: 'var(--status-verified)' }}>✓ SHA-256 generated locally</div>
                <div style={{ color: 'var(--status-verified)' }}>✓ Encrypted (AES-256)</div>
                <div style={{ color: 'var(--status-verified)' }}>✓ Device signature created</div>
                <div style={{ color: syncState === 'synced' ? 'var(--status-verified)' : 'var(--gold-light)' }}>
                  {syncState === 'synced' ? '✓ Anchored on Fabric (Block #129382)' : '⏳ Waiting for network restoration'}
                </div>
              </div>

              {/* 4 Quick Actions (Screen 18) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button 
                  onClick={() => alert("Mobile Camera Scanning Activated (Auto-edge detection)")}
                  className="btn-gold" 
                  style={{ flexDirection: 'column', padding: '16px 8px', gap: '6px' }}
                >
                  <Camera size={20} />
                  <span style={{ fontSize: '11px' }}>Scan Document</span>
                </button>

                <button 
                  onClick={() => alert("Local Storage Browse")}
                  className="btn-secondary" 
                  style={{ flexDirection: 'column', padding: '16px 8px', gap: '6px' }}
                >
                  <Upload size={20} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontSize: '11px' }}>Upload File</span>
                </button>

                <button 
                  onClick={() => alert("Viewing 14 Local Cached Cases")}
                  className="btn-secondary" 
                  style={{ flexDirection: 'column', padding: '16px 8px', gap: '6px' }}
                >
                  <FolderLock size={20} />
                  <span style={{ fontSize: '11px' }}>View Cases</span>
                </button>

                <button 
                  onClick={handleSimulateSync}
                  className="btn-secondary" 
                  style={{ flexDirection: 'column', padding: '16px 8px', gap: '6px', border: '1px solid var(--gold-border)' }}
                >
                  <RefreshCw size={20} style={{ color: 'var(--gold-light)' }} />
                  <span style={{ fontSize: '11px', color: 'var(--gold-light)' }}>Sync Queue (4)</span>
                </button>
              </div>

            </div>

            {/* Mobile Bottom Navigation */}
            <div className="mobile-bottom-nav">
              <div className="mobile-nav-btn active">
                <Home size={18} />
                <span>Home</span>
              </div>
              <div className="mobile-nav-btn">
                <FolderLock size={18} />
                <span>Cases</span>
              </div>
              <div className="mobile-nav-btn" style={{ color: 'var(--gold-primary)' }}>
                <Camera size={22} />
                <span>Scan</span>
              </div>
              <div className="mobile-nav-btn">
                <RefreshCw size={18} />
                <span>Queue</span>
              </div>
              <div className="mobile-nav-btn">
                <MoreHorizontal size={18} />
                <span>More</span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            PHONE 2: PROCESSING & SYNC ANIMATION (SCREEN 18 RIGHT PHONE)
            ========================================================================= */}
        <div className="mobile-device-shell">
          <div className="mobile-notch" />
          
          <div className="mobile-screen" style={{ background: '#0E121A' }}>
            
            {/* Top Bar */}
            <div 
              style={{
                height: '52px',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold-light)' }}>
                {syncState === 'synced' ? 'Upload Complete' : 'Processing Evidence'}
              </span>
            </div>

            {/* Main Center Circular Progress (Screen 18 Right) */}
            <div 
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              {/* Circular Radial Gauge */}
              <div 
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '50%',
                  border: `4px solid ${syncState === 'synced' ? 'var(--status-verified)' : 'var(--gold-primary)'}`,
                  borderTopColor: 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(197, 154, 69, 0.25)',
                  marginBottom: '24px',
                  animation: syncState === 'syncing' ? 'spin 1.5s linear infinite' : 'none'
                }}
              >
                <span style={{ fontSize: '26px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#FFF' }}>
                  {syncState === 'synced' ? '100%' : `${syncPercentage}%`}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {syncState === 'synced' ? 'Anchored' : 'Syncing'}
                </span>
              </div>

              {/* Status Text Sequence */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', width: '100%', maxWidth: '200px', textAlign: 'left' }}>
                <div style={{ color: 'var(--status-verified)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} /> File Captured
                </div>
                <div style={{ color: 'var(--status-verified)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} /> Encrypted locally
                </div>
                <div style={{ color: syncPercentage >= 60 ? 'var(--status-verified)' : 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={13} /> {syncState === 'synced' ? 'Uploading complete' : 'Uploading to Fabric...'}
                </div>
              </div>

              {/* Button */}
              <button 
                onClick={handleReset}
                className="btn-secondary"
                style={{ marginTop: '32px', width: '140px', justifyContent: 'center', fontSize: '12px' }}
              >
                {syncState === 'synced' ? 'Done' : 'Cancel'}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}

function RotateCcwIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
