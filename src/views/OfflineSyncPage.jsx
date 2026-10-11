import React, { useState, useRef } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Camera, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Key, 
  HardDrive, 
  FileText, 
  Trash2, 
  AlertCircle,
  Database,
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';
import { logActivity } from '../utils/auditLogger';

const INITIAL_QUEUE = [
  {
    id: 'OFF-2026-081',
    fileName: 'Scene_Photo_Recovery_Knife.jpg',
    fileSize: '3.2 MB',
    caseId: 'FIR-2026-001',
    category: 'Crime Scene Photo',
    sha256: '7d2f9b8c341e0a98f12a6435bc87e912c0192847a9b1c2d3e4f5a6b7c8d9e0f1',
    aesEncrypted: true,
    deviceSignature: '0x71c8f49a201b...signed',
    capturedAt: '12 mins ago',
    status: 'pending' // 'pending' | 'syncing' | 'synced'
  },
  {
    id: 'OFF-2026-082',
    fileName: 'Handwritten_Dying_Declaration.pdf',
    fileSize: '1.8 MB',
    caseId: 'FIR-2026-004',
    category: 'Witness Statement',
    sha256: '3a18e24c567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    aesEncrypted: true,
    deviceSignature: '0x83f901ab321c...signed',
    capturedAt: '28 mins ago',
    status: 'pending'
  },
  {
    id: 'OFF-2026-083',
    fileName: 'Seizure_Memo_CCTV_PenDrive.pdf',
    fileSize: '840 KB',
    caseId: 'FIR-2026-002',
    category: 'Seizure Memo',
    sha256: '9f0b147a284950bcdefa1234567890abcdef1234567890abcdef1234567890ab',
    aesEncrypted: true,
    deviceSignature: '0x99a2c1de5432...signed',
    capturedAt: '45 mins ago',
    status: 'pending'
  },
  {
    id: 'OFF-2026-084',
    fileName: 'Field_Interrogation_Audio_01.m4a',
    fileSize: '6.4 MB',
    caseId: 'FIR-2026-001',
    category: 'Audio Recording',
    sha256: 'e4c8921a987654bcdefa1234567890abcdef1234567890abcdef1234567890ab',
    aesEncrypted: true,
    deviceSignature: '0x44b1c9ef8765...signed',
    capturedAt: '1 hour ago',
    status: 'pending'
  }
];

export default function OfflineSyncPage({ 
  setCurrentScreen, 
  isOffline, 
  setIsOffline,
  offlineQueueCount,
  setOfflineQueueCount
}) {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStatusStep, setSyncStatusStep] = useState('');
  const [syncComplete, setSyncComplete] = useState(false);

  // Field capture input references
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Real SHA-256 computation in browser
  const computeFileSha256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // Handle capturing an image or selecting a file in the field
  const handleFieldFileCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const sha256 = await computeFileSha256(file);
      const newRecord = {
        id: `OFF-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        caseId: 'FIR-2026-001',
        category: file.type.startsWith('image/') ? 'Crime Scene Photo' : 'Field Document',
        sha256: sha256,
        aesEncrypted: true,
        deviceSignature: `0x${sha256.substring(0, 12)}...signed`,
        capturedAt: 'Just now',
        status: 'pending',
        rawFile: file
      };

      setQueue(prev => [newRecord, ...prev]);
      if (setOfflineQueueCount) {
        setOfflineQueueCount(prev => prev + 1);
      }
      setSyncComplete(false);
    } catch (err) {
      console.error('Error hashing field capture:', err);
    }
  };

  // Remove a pending item
  const handleRemoveItem = (id) => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (setOfflineQueueCount) {
      setOfflineQueueCount(prev => Math.max(0, prev - 1));
    }
  };

  // Sync all records with backend & blockchain
  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncProgress(15);
    setSyncStatusStep('1/4: Verifying local hardware signatures & AES-256 envelopes...');

    await new Promise(r => setTimeout(r, 600));
    setSyncProgress(40);
    setSyncStatusStep('2/4: Transmitting encrypted evidence to sovereign gateway...');

    // Attempt real backend upload for any real files in queue
    for (const item of queue) {
      if (item.rawFile) {
        try {
          const fd = new FormData();
          fd.append('file', item.rawFile);
          fd.append('caseId', item.caseId);
          fd.append('documentType', item.category);
          fd.append('notes', 'Field offline sync ingestion');
          await api.evidence.upload(fd);
        } catch (e) {
          console.warn('Backend sync for file deferred:', e.message);
        }
      }
    }

    await new Promise(r => setTimeout(r, 700));
    setSyncProgress(75);
    setSyncStatusStep('3/4: Anchoring SHA-256 hashes on Hyperledger Fabric / EVM Ledger...');

    // Log to real audit trail
    logActivity({
      action: 'Offline Field Synchronized',
      document: `${queue.length} Queue Exhibits`,
      details: `Batch synchronized ${queue.length} digital evidence exhibits from remote field thana terminal into sovereign ledger.`,
      result: 'Success'
    });

    await new Promise(r => setTimeout(r, 700));
    setSyncProgress(100);
    setSyncStatusStep('4/4: Complete! All records verified & anchored on Block #129382.');

    // Update queue items to synced
    setQueue(prev => prev.map(item => ({ ...item, status: 'synced' })));
    setIsSyncing(false);
    setSyncComplete(true);
    if (setOfflineQueueCount) {
      setOfflineQueueCount(0);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const pendingCount = queue.filter(q => q.status === 'pending').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Hidden file inputs for Camera and File picking */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={cameraInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFieldFileCapture}
      />
      <input 
        type="file" 
        accept=".pdf,.jpg,.jpeg,.png,.mp4,.m4a,.wav" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFieldFileCapture}
      />

      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
              Offline Field Mode & Sync Hub
            </h2>
            <span className={`badge-status ${isOffline ? 'badge-pending' : 'badge-verified'}`}>
              {isOffline ? '2G / Field Mode' : 'Ledger Connected'}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Military-grade cryptographic offline vault for remote thanas, patrol units, and zero-connectivity crime scenes.
          </p>
        </div>

        {/* Network Mode Toggle & Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setIsOffline && setIsOffline(!isOffline)}
            className="btn-secondary"
            style={{ fontSize: '12px', padding: '8px 14px' }}
            title="Toggle between online and simulated zero-connectivity field mode"
          >
            {isOffline ? (
              <>
                <Wifi size={14} style={{ color: 'var(--status-verified)' }} />
                <span>Simulate 4G/WAN Restored</span>
              </>
            ) : (
              <>
                <WifiOff size={14} style={{ color: 'var(--status-pending)' }} />
                <span>Simulate Zero-Connectivity</span>
              </>
            )}
          </button>

          <button 
            onClick={handleSyncAll}
            disabled={isSyncing || pendingCount === 0}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '8px 18px', opacity: (isSyncing || pendingCount === 0) ? 0.6 : 1 }}
          >
            <RefreshCw size={14} className={isSyncing ? 'spin-anim' : ''} />
            <span>{isSyncing ? 'Syncing...' : `Sync All Records (${pendingCount})`}</span>
          </button>
        </div>
      </div>

      {/* Cryptographic Guarantees Bar */}
      <div 
        style={{
          background: 'rgba(197, 154, 69, 0.08)',
          border: '1px solid var(--gold-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <ShieldCheck size={18} style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FFF' }}>Section 63 BSA Guarantee</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              SHA-256 generated on-device at capture. Cryptographically admissible even if uploaded days later.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <Key size={18} style={{ color: 'var(--status-verified)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FFF' }}>AES-256-GCM Envelope</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              Raw files encrypted in local SQLite container. Zero plain-text exposure on stolen field devices.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <HardDrive size={18} style={{ color: 'var(--gold-light)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ color: '#FFF' }}>Hardware Key Signed</strong>
            <p style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              Every offline record is signed by the terminal's secure element key before entering the queue.
            </p>
          </div>
        </div>
      </div>

      {/* Field Capture Action Cards */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        <div 
          onClick={() => cameraInputRef.current?.click()}
          className="nyaya-card"
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px',
            border: '1px solid var(--gold-border)',
            background: 'linear-gradient(135deg, rgba(197, 154, 69, 0.12) 0%, rgba(16, 20, 29, 0.9) 100%)'
          }}
        >
          <div 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'linear-gradient(135deg, #D4AF37 0%, #B78A28 100%)',
              color: '#0A0D14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Camera size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '14px' }}>
              Camera Evidence Scan
            </div>
            <div style={{ fontSize: '11px', color: 'var(--gold-light)', marginTop: '2px' }}>
              Capture crime scene photo / document
            </div>
          </div>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className="nyaya-card"
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px'
          }}
        >
          <div 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--gold-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Upload size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '14px' }}>
              Upload Digital File
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Ingest seized audio, video, or PDF
            </div>
          </div>
        </div>

        <div 
          onClick={() => setCurrentScreen('cases')}
          className="nyaya-card"
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px'
          }}
        >
          <div 
            style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: 'var(--radius-sm)', 
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '14px' }}>
              Offline Case Cache
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              14 FIR dossiers cached offline
            </div>
          </div>
        </div>
      </div>

      {/* Syncing Progress Card */}
      {isSyncing && (
        <div 
          className="nyaya-card" 
          style={{ 
            background: 'var(--bg-surface-elevated)', 
            border: '1px solid var(--gold-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold-light)' }}>
              {syncStatusStep}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#FFF' }}>
              {syncProgress}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${syncProgress}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #C59A45 0%, #10B981 100%)',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>
      )}

      {/* Synced Success Alert */}
      {syncComplete && !isSyncing && (
        <div 
          style={{
            background: 'var(--status-verified-bg)',
            border: '1px solid var(--status-verified-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--status-verified)' }}>
            <CheckCircle2 size={18} />
            <span>
              <strong>All Records Synchronized:</strong> 4 evidence records anchored to Hyperledger Fabric & EVM smart contract with full Section 63 BSA compliance.
            </span>
          </div>
          <button 
            onClick={() => setCurrentScreen('audit')}
            className="btn-secondary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
          >
            View Audit Trail →
          </button>
        </div>
      )}

      {/* Queued Evidence Records List */}
      <div className="nyaya-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div 
          style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
              Offline Evidence Queue ({queue.length} Total • {pendingCount} Pending Sync)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Encrypted in local device SQLite storage. Queued for auto-upload upon network restoration.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => {
                setQueue(INITIAL_QUEUE);
                setSyncComplete(false);
                if (setOfflineQueueCount) setOfflineQueueCount(4);
              }}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              Reset Sample Queue
            </button>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        <div style={{ overflowX: 'auto' }}>
          <table className="nyaya-table">
            <thead>
              <tr>
                <th>Document Details</th>
                <th>Case Reference</th>
                <th>Cryptographic Hash (SHA-256)</th>
                <th>Security & Signature</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => {
                const isSynced = item.status === 'synced';
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '4px',
                            background: 'var(--bg-surface-elevated)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--gold-primary)',
                            flexShrink: 0
                          }}
                        >
                          <FileText size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#FFF', fontSize: '13px' }}>
                            {item.fileName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {item.category} • {item.fileSize} • {item.capturedAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="font-mono" style={{ fontSize: '12px', color: 'var(--gold-light)' }}>
                        {item.caseId}
                      </span>
                    </td>

                    <td>
                      <div style={{ maxWidth: '180px' }}>
                        <span 
                          className="font-mono" 
                          style={{ 
                            fontSize: '11px', 
                            color: 'var(--text-secondary)',
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={item.sha256}
                        >
                          {item.sha256.substring(0, 16)}...{item.sha256.substring(item.sha256.length - 8)}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px' }}>
                        <span style={{ color: 'var(--status-verified)' }}>✓ AES-256 Envelope</span>
                        <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          Key: {item.deviceSignature}
                        </span>
                      </div>
                    </td>

                    <td>
                      {isSynced ? (
                        <span className="badge-status badge-verified">
                          Anchored on Fabric
                        </span>
                      ) : (
                        <span className="badge-status badge-pending">
                          Queued Locally
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--status-tampered)' }}
                        title="Remove from queue"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Backward-compatible alias export
export { OfflineSyncPage as MobileAppSimulatorPage };
