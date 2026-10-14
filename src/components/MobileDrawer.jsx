import React from 'react';
import AshokaLogo from './AshokaLogo';
import { 
  X, 
  LayoutDashboard, 
  FolderLock, 
  FileText, 
  Upload, 
  GitBranch, 
  ShieldCheck, 
  FileCheck2, 
  ScrollText, 
  RefreshCw, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function MobileDrawer({ 
  isOpen, 
  onClose, 
  currentScreen, 
  setCurrentScreen, 
  userRole, 
  onLogout 
}) {
  if (!isOpen) return null;

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Dossiers', icon: FolderLock },
    { id: 'documents', label: 'Documents Repository', icon: FileText },
    { id: 'upload', label: 'Upload Evidence', icon: Upload, highlight: true },
    { id: 'custody', label: 'Chain of Custody', icon: GitBranch },
    { id: 'verification', label: 'Verify Authenticity', icon: ShieldCheck },
    { id: 'certificates', label: 'Section 63 BSA Certificates', icon: FileCheck2 },
    { id: 'audit', label: 'Audit Trail', icon: ScrollText },
    { id: 'mobile-app', label: 'Offline Sync Hub', icon: RefreshCw },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const handleNavigate = (screenId) => {
    setCurrentScreen(screenId);
    onClose();
  };

  return (
    <div className="mobile-drawer-overlay no-print" onClick={onClose}>
      <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <AshokaLogo size="small" showSubtitle={true} />
          <button onClick={onClose} className="mobile-drawer-close" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* User Role Card */}
        <div className="mobile-drawer-user">
          <div className="mobile-drawer-avatar">
            {userRole?.code || 'IO'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userRole?.title || 'Investigating Officer'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Node #1 • National ICJS II
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mobile-drawer-nav">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || 
              (item.id === 'cases' && currentScreen === 'case-details') ||
              (item.id === 'documents' && currentScreen === 'document-viewer');

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`mobile-drawer-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} style={{ color: isActive ? 'var(--gold-primary)' : 'inherit' }} />
                <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
                {item.highlight && (
                  <span className="badge-status badge-gold" style={{ fontSize: '9px', padding: '2px 6px' }}>
                    New
                  </span>
                )}
                <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <button 
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="mobile-drawer-logout"
          >
            <LogOut size={16} />
            <span>Logout Session</span>
          </button>
        </div>

      </div>
    </div>
  );
}
