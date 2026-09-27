import React, { useState, useEffect, useRef } from 'react';
import AshokaLogo from '../components/AshokaLogo';
import { ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import '../styles/auth.css';

export default function MfaPage({ setCurrentScreen, userRole, onLogin }) {
  const [digits, setDigits] = useState(['4', '8', '2', '9', '', '']);
  const [timeLeft, setTimeLeft] = useState(164); // 02:44
  const inputRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      if (inputRefs.current[5]) inputRefs.current[5].focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    // Flow: Login + RBAC -> MFA -> Role-Specific Dashboard
    if (onLogin) {
      onLogin(userRole);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="auth-page">
      {/* Top Header */}
      <div className="auth-topbar">
        <div onClick={() => setCurrentScreen('landing')} style={{ cursor: 'pointer' }}>
          <AshokaLogo size="default" showSubtitle={true} />
        </div>
        <button 
          onClick={() => setCurrentScreen('login')}
          className="btn-secondary"
          style={{ fontSize: '12px', padding: '6px 14px' }}
        >
          ← Back to Login
        </button>
      </div>

      {/* MFA Card (Matching Screenshot 3 Exactly) */}
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {/* Shield Icon */}
        <div className="auth-icon-circle">
          <ShieldCheck size={26} />
        </div>

        <h2 className="auth-title">
          TWO-FACTOR AUTHENTICATION
        </h2>
        <p className="auth-subtitle">
          Enter the 6-digit code from your official authenticator app<br />
          or hardware token
        </p>

        {/* 6 Digit Input Boxes */}
        <form onSubmit={handleVerify}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={el => inputRefs.current[i] = el}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: '48px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--gold-light, #E0BA68)',
                  background: '#0E121A',
                  border: digit ? '1px solid var(--gold-primary, #C59A45)' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  outline: 'none',
                  boxShadow: digit ? '0 0 12px rgba(197, 154, 69, 0.25)' : 'none'
                }}
              />
            ))}
          </div>

          {/* Countdown Timer */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              color: 'var(--gold-light, #E0BA68)',
              fontSize: '13px',
              fontFamily: 'var(--font-mono, monospace)',
              marginBottom: '24px'
            }}
          >
            <Clock size={15} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button 
            type="submit" 
            className="landing-hero-cta-btn" 
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '13px' }}
          >
            <span>Verify & Continue →</span>
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <button 
            type="button" 
            onClick={() => setDigits(['7', '1', '4', '9', '2', '0'])}
            className="auth-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px' }}
          >
            Try another method
          </button>
        </div>
      </div>

      {/* Bottom Legal Security Note */}
      <div className="auth-footer-notice">
        Protected by Section 43A & Section 70 of the Information Technology Act.
      </div>
    </div>
  );
}
