import React from 'react';
import { 
  LayoutDashboard, 
  FolderLock, 
  Upload, 
  ShieldCheck, 
  RefreshCw,
  Camera
} from 'lucide-react';

export default function MobileBottomNav({ 
  currentScreen, 
  setCurrentScreen, 
  offlineQueueCount = 0 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FolderLock },
    { id: 'upload', label: 'Capture', icon: Camera, isAction: true },
    { id: 'verification', label: 'Verify', icon: ShieldCheck },
    { id: 'mobile-app', label: 'Sync', icon: RefreshCw, badge: offlineQueueCount }
  ];

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Navigation">
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
