import React, { useState } from 'react';
import AshokaLogo from '../components/AshokaLogo';
import { 
  Shield, 
  FlaskConical, 
  Briefcase, 
  Scale, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ROLES } from '../data/rolesData';
import '../styles/auth.css';

const roleIcons = {
  io: Shield,
  fsl: FlaskConical,
  prosecutor: Briefcase,
  judge: Scale
};

export default function RoleSelectPage({ setCurrentScreen, setUserRole, onLogin }) {
  const roles = ROLES.map(r => ({
    ...r,
    icon: roleIcons[r.id] || Shield
  }));

  const [selectedRoleId, setSelectedRoleId] = useState('io');

  const handleContinue = () => {
    const roleObj = roles.find(r => r.id === selectedRoleId);
    if (setUserRole) setUserRole(roleObj);
    if (onLogin) {
      onLogin(roleObj);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="auth-page">
      {/* Top Header */}
      <div className="auth-topbar">
        <AshokaLogo size="default" showSubtitle={true} />
        <button 
          onClick={() => setCurrentScreen('login')}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 14px' }}
        >
          ← Change Account
        </button>
      </div>

      {/* Main Content (Matching Screenshot 4 Exactly) */}
      <div className="role-selection-wrapper">
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', color: 'var(--gold-light, #E0BA68)', textTransform: 'uppercase' }}>
            FEDERATED ACCESS CONTROL
          </span>
          <h2 className="auth-title" style={{ marginTop: '6px', fontSize: '26px' }}>
            SELECT YOUR ROLE
          </h2>
          <p className="auth-subtitle" style={{ margin: '6px 0 0 0' }}>
            Choose the role that best matches your jurisdictional duty and credentials
          </p>
        </div>

        {/* 6 Role Cards Grid */}
        <div className="role-selection-grid">
          {roles.map(role => {
            const isSelected = selectedRoleId === role.id;
            const Icon = role.icon;

            return (
              <div
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                style={{
                  background: isSelected ? '#161C28' : '#10141D',
                  border: isSelected ? '1px solid #C59A45' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 20px rgba(197, 154, 69, 0.15)' : 'none',
                  position: 'relative'
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '6px',
                    background: isSelected ? 'rgba(197, 154, 69, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${isSelected ? 'rgba(197, 154, 69, 0.35)' : 'rgba(255, 255, 255, 0.08)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#E0BA68' : '#9CA3AF',
                    flexShrink: 0
                  }}
                >
                  <Icon size={19} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? '#E0BA68' : '#FFFFFF' }}>
                      {role.title}
                    </div>
                    {isSelected && (
                      <CheckCircle2 size={16} style={{ color: '#C59A45' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#A37A2C', fontWeight: 600, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                    {role.code} • @{role.username}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px', lineHeight: 1.5 }}>
                    {role.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Action */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={handleContinue}
            className="landing-hero-cta-btn" 
            style={{ padding: '13px 36px', fontSize: '13px', minWidth: '220px', justifyContent: 'center' }}
          >
            <span>Continue to Workspace →</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="auth-footer-notice">
        Inter-Operable Criminal Justice System (ICJS Phase II) • Sovereign Access Node
      </div>
    </div>
  );
}
