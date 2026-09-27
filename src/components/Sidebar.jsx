import React from 'react';
import AshokaLogo from './AshokaLogo';
import {
  LayoutDashboard,
  FolderLock,
  FileText,
  Upload,
  GitBranch,
  RefreshCw,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ currentScreen, setCurrentScreen, userRole, onLogout }) {
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Case Dossiers', icon: FolderLock },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'upload', label: 'Upload Evidence', icon: Upload, highlight: true },
    { id: 'custody', label: 'Chain of Custody', icon: GitBranch },
    { id: 'mobile-app', label: 'Offline Sync', icon: RefreshCw },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  // RBAC functional filter: only show screens permitted for the user's role
  const allowed = userRole?.allowedScreens;
  const navItems = allowed 
    ? allNavItems.filter(item => allowed.includes(item.id))
    : allNavItems;

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div 
        className="app-sidebar-logo" 
        onClick={() => setCurrentScreen('dashboard')} 
        style={{ cursor: 'pointer' }}
        title="NyayaVault Dashboard"
      >
        <AshokaLogo size="small" showSubtitle={true} />
      </div>

      {/* Navigation List */}
      <nav className="app-sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || 
            (item.id === 'cases' && currentScreen === 'case-details') ||
            (item.id === 'documents' && currentScreen === 'document-viewer');

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              style={{
                textAlign: 'left',
                width: '100%',
                position: 'relative'
              }}
            >
              <Icon 
                size={17} 
                style={{ 
                  color: isActive ? 'var(--gold-primary)' : 'inherit',
                  flexShrink: 0 
                }} 
              />
              <span style={{ flex: 1 }}>{item.label}</span>

              {item.highlight && (
                <span 
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--gold-primary)'
                  }} 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User / Exit Bar */}
      <div 
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ROLE CONSOLE</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }} title={userRole?.title}>
              {userRole?.title || 'Judicial Node'}
            </div>
          </div>
          <span className="badge-status badge-verified" style={{ fontSize: '9px', padding: '2px 6px' }}>
            {userRole?.code || 'NODE #1'}
          </span>
        </div>

        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--status-tampered)';
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'transparent';
          }}
          title="Logout and Exit to Public Portal"
        >
          <LogOut size={14} />
          <span>Exit to Public Portal</span>
        </button>
      </div>
    </aside>
  );
}
