import React, { useState } from 'react';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Microscope,
  Scale, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { ROLES, DEFAULT_ROLE } from '../data/rolesData';
import AshokaLogo from '../components/AshokaLogo';
import '../styles/auth.css';

// Icons mapped strictly to the 4 prototype roles
const ROLE_ICONS = {
  io: Shield,
  fsl: Microscope,
  prosecutor: Scale,
  judge: Scale
};

export default function LoginPage({ setCurrentScreen, setUserRole, userRole, onLogin }) {
  // Find initial role matching current userRole or default to IO
  const initialRole = ROLES.find(r => r.id === userRole?.id) || DEFAULT_ROLE;

  const [selectedRoleId, setSelectedRoleId] = useState(initialRole.id);
  const [userId, setUserId] = useState(initialRole.username);
  const [password, setPassword] = useState(initialRole.defaultPassword || 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle role selection (Only ONE role can be selected at a time)
  // When user selects a role, automatically populate the corresponding prototype username
  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    const matchedRole = ROLES.find(r => r.id === roleId);
    if (matchedRole) {
      setUserId(matchedRole.username);
      if (matchedRole.defaultPassword) {
        setPassword(matchedRole.defaultPassword);
      }
    }
    setValidationError('');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!userId.trim()) {
      setValidationError('Please enter your User ID or Official Email.');
      return;
    }
    if (!password) {
      setValidationError('Please enter your security password.');
      return;
    }
    if (!selectedRoleId) {
      setValidationError('Please select an authorized Role / Access Level.');
      return;
    }

    const selectedRoleObj = ROLES.find(r => r.id === selectedRoleId) || DEFAULT_ROLE;
    
    // Store selected role in authenticated state
    if (setUserRole) {
      setUserRole(selectedRoleObj);
    }

    // DIRECT AUTHENTICATION: Direct to role-specific dashboard (No TFA/MFA/OTP screen)
    if (onLogin) {
      onLogin(selectedRoleObj);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="auth-page login-page-bg">
      
      {/* =========================================================================
          PAGE-LEVEL HEADER (Top-Left NyayaVault Branding + Top-Right RBAC Indicator)
          ========================================================================= */}
      <header className="auth-topbar login-page-header">
        <div 
          onClick={() => setCurrentScreen('landing')} 
          style={{ cursor: 'pointer' }}
          title="Return to Public Landing Page"
        >
          <AshokaLogo size="default" showSubtitle={true} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* RBAC Status Indicator (Glowing Green Dot, Dark & Antique Gold) */}
          <div className="rbac-status-indicator" title="Restricted Access · Role-Based Access Control Enforced">
            <span className="rbac-status-dot" />
            <span className="rbac-status-text">RESTRICTED ACCESS · RBAC ENFORCED</span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN DUAL-PANEL LOGIN MODAL (NyayaVault Judicial Identity)
          ========================================================================= */}
      <div className="login-modal-wrapper">
        
        {/* LEFT PANEL: Ashoka Emblem Artwork (Preserved exactly as requested) */}
        <div className="login-modal-left">
          <div className="login-left-emblem-container">
            <img 
              src="/login-emblem.jpg" 
              alt="State Emblem of India — Digital Evidence. Real Justice."
              className="login-left-emblem-img"
            />
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Form with RBAC cards placed BELOW login button */}
        <div className="login-modal-right">
          
          <h2 className="login-right-title">
            Welcome Back
          </h2>
          <p className="login-right-subtitle">
            Sign into your secure account
          </p>

          {/* Validation Alert Banner */}
          {validationError && (
            <div className="login-validation-banner">
              <AlertCircle size={14} style={{ color: '#EF4444', flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          <form onSubmit={handleSignIn}>
            {/* Field 1: User ID / Official Email (Role-dependent username) */}
            <div className="auth-field-group">
              <label className="auth-label">
                User ID / Official Email
              </label>
              <div className="login-right-input-wrapper">
                <Lock size={14} className="login-input-left-icon" />
                <input 
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  className="login-right-input"
                  placeholder="Enter official user ID"
                  required
                />
              </div>
            </div>

            {/* Field 2: Password */}
            <div className="auth-field-group">
              <label className="auth-label">
                Password
              </label>
              <div className="login-right-input-wrapper">
                <Lock size={14} className="login-input-left-icon" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="login-right-input"
                  placeholder="Enter your security password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-input-right-btn"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Primary Login Button: Authenticate & Access Dashboard → */}
            <button 
              type="submit" 
              className="login-right-btn-primary"
            >
              Authenticate & Access Dashboard →
            </button>

            {/* ===================================================================
                PROTOTYPE DEMO ACCOUNTS (1-CLICK AUTO-FILL)
                Exactly 4 cards: IO, Forensic Lab Analyst, Public Prosecutor, Judge
                =================================================================== */}
            <div className="auth-field-group" style={{ marginTop: '16px', marginBottom: 0 }}>
              <div className="login-role-label-row">
                <label className="auth-label" style={{ marginBottom: 0, fontSize: '10px', letterSpacing: '0.04em' }}>
                  PROTOTYPE DEMO ACCOUNTS (1-CLICK AUTO-FILL)
                </label>
                <span className="login-role-enforced-tag">RBAC ENFORCED</span>
              </div>

              {/* 2x2 Compact Selectable Role Cards */}
              <div className="login-role-grid-2x2">
                {ROLES.map((role) => {
                  const isSelected = selectedRoleId === role.id;
                  const Icon = ROLE_ICONS[role.id] || Shield;

                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className={`login-role-card-compact ${isSelected ? 'selected' : ''}`}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleRoleSelect(role.id);
                        }
                      }}
                    >
                      <div className="login-role-card-inner">
                        <div className="login-role-icon-box">
                          <Icon size={14} />
                        </div>
                        <div className="login-role-text-col">
                          <span className="login-role-title-text">
                            {role.label}
                          </span>
                          <span className="login-role-username-text">
                            {role.username}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="login-role-check-indicator">
                          <Check size={11} strokeWidth={2.8} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Default password note */}
              <div className="login-demo-password-hint">
                Default password for all demo accounts: <span className="login-password-emphasis">password123</span>
              </div>
            </div>

          </form>

        </div>

      </div>

      {/* Bottom Footer Notice */}
      <div 
        style={{ 
          fontSize: '10.5px', 
          color: '#6B7280', 
          textAlign: 'center', 
          marginTop: '12px',
          position: 'relative',
          zIndex: 10
        }}
      >
        Protected by Section 43A & Section 70 of the Information Technology Act.
      </div>

    </div>
  );
}
