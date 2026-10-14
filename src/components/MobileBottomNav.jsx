import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  Upload, 
  ShieldCheck, 
  RefreshCw,
  Camera,
  GitBranch,
  FileText,
  ScrollText
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentScreen, 
  setCurrentScreen, 
  offlineQueueCount = 0,
  userRole
}) {
  const roleId = userRole?.id || 'io';

  // Role-appropriate 5th tab
  const fifthTab = roleId === 'fsl'
    ? { id: 'custody', label: 'Custody', icon: GitBranch }
    : roleId === 'prosecutor'
    ? { id: 'documents', label: 'Exhibits', icon: FileText }
    : roleId === 'judge'
    ? { id: 'audit', label: 'Audit', icon: ScrollText }
    : { id: 'mobile-app', label: 'Sync', icon: RefreshCw, badge: offlineQueueCount };

  // Role-appropriate action button label & icon
  const actionTab = roleId === 'fsl'
    ? { id: 'upload', label: 'Report', icon: Upload, isAction: true }
    : roleId === 'prosecutor'
    ? { id: 'upload', label: 'Petition', icon: Upload, isAction: true }
    : roleId === 'judge'
    ? { id: 'upload', label: 'Order', icon: Upload, isAction: true }
    : { id: 'upload', label: 'Capture', icon: Camera, isAction: true };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FolderLock },
    actionTab,
    { id: 'verification', label: 'Verify', icon: ShieldCheck },
    fifthTab
  ];

  return (
    <nav className="mobile-bottom-bar no-print" aria-label="Mobile Navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentScreen === item.id || 
          (item.id === 'cases' && currentScreen === 'case-details') ||
          (item.id === 'upload' && currentScreen === 'document-viewer');

        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className="mobile-action-btn"
              title="Quick Capture / Ingest Evidence"
            >
              <div className="mobile-action-icon-wrapper">
                <Icon size={22} color="#0A0D14" strokeWidth={2.5} />
              </div>
              <span className="mobile-action-label">{item.label}</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`mobile-tab-btn ${isActive ? 'active' : ''}`}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {item.badge > 0 && (
                <span className="mobile-badge-pill">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mobile-tab-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
