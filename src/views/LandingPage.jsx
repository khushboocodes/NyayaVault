import React from 'react';
import AshokaLogo from '../components/AshokaLogo';
import { 
  ShieldCheck, 
  Layers, 
  FileCheck2, 
  UserCheck, 
  ArrowRight, 
  Scale 
} from 'lucide-react';
import '../styles/landing.css';

export default function LandingPage({ setCurrentScreen }) {
  return (
    <div className="landing-page">
      
      {/* =========================================================================
          CINEMATIC HERO (Full 100vh Integrated Scene matching IMAGE 1)
          ========================================================================= */}
      <section className="landing-hero">
        
        {/* Full-bleed Judicial Background Image */}
        <div className="landing-hero-bg" />

        {/* Controlled Atmosphere Gradient (Ensures text readability without hiding the case file) */}
        <div className="landing-hero-overlay" />

        {/* 1. TOP NAVBAR (Integrated into the cinematic scene) */}
        <header className="landing-header">
          {/* Brand Logo: Gold Judicial Pillar + NyayaVault | */}
          <div 
            onClick={() => setCurrentScreen('landing')} 
            className="landing-logo-group"
          >
            <span className="landing-logo-icon">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M4 28H28V30H4V28Z" fill="#C59A45" />
                <path d="M6 26H26V27.5H6V26Z" fill="#E6CA65" />
                <rect x="8" y="10" width="3" height="15" rx="0.5" fill="#C59A45" />
                <rect x="14.5" y="10" width="3" height="15" rx="0.5" fill="#C59A45" />
                <rect x="21" y="10" width="3" height="15" rx="0.5" fill="#C59A45" />
                <path d="M6 8.5H26V10H6V8.5Z" fill="#E6CA65" />
                <path d="M4 6.5H28V8H4V6.5Z" fill="#C59A45" />
                <path d="M16 2L3 6.5H29L16 2Z" fill="#C59A45" />
                <circle cx="16" cy="4.8" r="1.2" fill="#0A0D14" />
              </svg>
            </span>
            <span className="landing-logo-title">NyayaVault</span>
            <span className="landing-logo-divider" />
          </div>

          {/* Center Navigation Links */}
          <nav className="landing-nav">
            <button 
              onClick={() => setCurrentScreen('landing')}
              className="landing-nav-link active"
            >
              HOME
            </button>
            <a href="#about" className="landing-nav-link">ABOUT</a>
            <a href="#features" className="landing-nav-link">FEATURES</a>
            <a href="#impact" className="landing-nav-link">IMPACT</a>
            <a href="#contact" className="landing-nav-link">CONTACT</a>
          </nav>

          {/* Right Legal Motto */}
          <div className="landing-header-right">
            <span className="landing-motto">
              TRUTH &nbsp;/&nbsp; INTEGRITY &nbsp;/&nbsp; JUSTICE
            </span>
          </div>
        </header>

        {/* 2. HERO CONTENT (Strict Left Column, Editorial Composition) */}
        <div className="landing-hero-body">
          <div className="landing-hero-content">
            
            {/* Eyebrow */}
            <div className="landing-eyebrow">
              <span>SECURE</span>
              <span>•</span>
              <span>VERIFIED</span>
              <span>•</span>
              <span>COURT-READY</span>
            </div>

            {/* Exact Two-Line Heading */}
            <h1 className="landing-hero-heading">
              From Evidence<br />
              <span className="gold-emphasis">to Admissible Truth</span>
            </h1>

            {/* Description */}
            <p className="landing-hero-description">
              NyayaVault is a secure digital document management system
              for the Indian criminal justice system — ensuring every document
              is authentic, tamper-proof and legally admissible.
            </p>

            {/* Primary CTA: Compact Rectangular Gold Button */}
            <button
              onClick={() => setCurrentScreen('login')}
              className="landing-hero-cta-btn"
            >
              BUILDING A MORE TRUSTED JUSTICE SYSTEM →
            </button>

          </div>
        </div>

        {/* 3. INTEGRATED BOTTOM TRUST BAR (At the base of the cinematic scene) */}
        <div className="landing-trust-bar">
          <div className="landing-trust-container">
            
            <div className="landing-trust-items-group">
              {/* Feature 1 */}
              <div className="landing-trust-item">
                <span className="landing-trust-icon">
                  <ShieldCheck size={16} />
                </span>
                <span>Cryptographic Integrity</span>
              </div>

              {/* Feature 2 */}
              <div className="landing-trust-item">
                <span className="landing-trust-icon">
                  <Layers size={16} />
                </span>
                <span>Permissioned Blockchain</span>
              </div>

              {/* Feature 3 */}
              <div className="landing-trust-item">
                <span className="landing-trust-icon">
                  <FileCheck2 size={16} />
                </span>
                <span>Section 63 BSA Compliant</span>
              </div>

              {/* Feature 4 */}
              <div className="landing-trust-item">
                <span className="landing-trust-icon">
                  <UserCheck size={16} />
                </span>
                <span>Victim Identity Protection (Sec 72 BNS)</span>
              </div>
            </div>

            {/* Lower-Right Micro Label */}
            <div className="landing-system-tag">
              <span>INDIAN CRIMINAL JUSTICE SYSTEM</span>
              <span className="landing-system-rule" />
            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          4. INSTITUTIONAL ARCHITECTURE SECTION
          ========================================================================= */}
      <section 
        id="about"
        style={{
          padding: '80px 48px',
          backgroundColor: '#07090D',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span 
              style={{ 
                fontSize: '11px', 
                fontWeight: 700, 
                letterSpacing: '0.2em', 
                color: 'var(--gold-light, #E0BA68)', 
                textTransform: 'uppercase' 
              }}
            >
              SOVEREIGN TRUST LAYER FOR CCTNS & ICJS
            </span>
            <h2 
              style={{ 
                fontSize: '32px', 
                fontWeight: 700, 
                color: '#FFF', 
                marginTop: '10px',
                fontFamily: 'var(--font-serif, "Cinzel", serif)'
              }}
            >
              Bridging the Chain-of-Custody Deficit
            </h2>
            <p style={{ color: '#9CA3AF', maxWidth: '640px', margin: '14px auto 0 auto', fontSize: '15px', lineHeight: 1.6 }}>
              Every day, thousands of criminal trials are delayed due to contested electronic evidence. 
              NyayaVault inserts a zero-trust, permissioned integrity layer across all justice stakeholders.
            </p>
          </div>

          {/* 4 Agency Nodes */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            <div className="nyaya-card" style={{ borderTop: '3px solid var(--gold-primary, #C59A45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-light)' }}>ORIGINATING NODE</span>
                <span className="badge-status badge-verified">14,000+ Stations</span>
              </div>
              <h3 style={{ fontSize: '17px', color: '#FFF', marginBottom: '8px' }}>Police Station (CCTNS)</h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Investigating Officers capture FIRs, Seizure Memos, and Case Diaries. Files are hashed instantly 
                in-browser or locally on mobile tablets before leaving police custody.
              </p>
            </div>

            <div className="nyaya-card" style={{ borderTop: '3px solid var(--gold-primary, #C59A45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-light)' }}>VALIDATING NODE</span>
                <span className="badge-status badge-verified">FSL Network</span>
              </div>
              <h3 style={{ fontSize: '17px', color: '#FFF', marginBottom: '8px' }}>Forensic Labs (FSL)</h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Analysts verify that digital evidence bytes match the exact hash seized by the IO. 
                Forensic reports are co-signed and immutably appended to the case timeline.
              </p>
            </div>

            <div className="nyaya-card" style={{ borderTop: '3px solid var(--gold-primary, #C59A45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-light)' }}>PRIVACY GATE</span>
                <span className="badge-status badge-bns">Section 72 BNS</span>
              </div>
              <h3 style={{ fontSize: '17px', color: '#FFF', marginBottom: '8px' }}>Public Prosecution</h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Automated NLP identifies and redacts victim/witness identities in sexual assault and POCSO cases. 
                Dual-hash binding guarantees safe distribution without leaking sources.
              </p>
            </div>

            <div className="nyaya-card" style={{ borderTop: '3px solid var(--gold-primary, #C59A45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-light)' }}>JUDICIAL BENCH</span>
                <span className="badge-status badge-gold">e-Courts (CIS)</span>
              </div>
              <h3 style={{ fontSize: '17px', color: '#FFF', marginBottom: '8px' }}>District & High Courts</h3>
              <p style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>
                Judges verify contested evidence in 2 seconds. Automatically emits court-admissible 
                Section 63 BSA electronic evidence certificates with full ledger audit stamps.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. INTERACTIVE VERIFICATION CTA BANNER
          ========================================================================= */}
      <section 
        id="features"
        style={{
          padding: '60px 48px',
          backgroundColor: '#0A0D14',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(22, 28, 40, 0.95) 0%, rgba(16, 20, 29, 0.98) 100%)',
            border: '1px solid var(--gold-border, rgba(197, 154, 69, 0.3))',
            borderRadius: '8px',
            padding: '40px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '32px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--gold-primary, #C59A45)' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-light, #E0BA68)', textTransform: 'uppercase' }}>
                PUBLIC VERIFICATION GATEWAY
              </span>
            </div>
            <h3 style={{ fontSize: '26px', color: '#FFF', marginBottom: '10px', fontFamily: 'var(--font-serif, "Cinzel", serif)' }}>
              Test Document Authenticity Right in Your Browser
            </h3>
            <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.6 }}>
              No document upload required. Your browser computes the SHA-256 hash locally in a secure sandbox 
              and queries the Hyperledger Fabric ledger to prove tamper-evidence.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setCurrentScreen('verification')}
              className="btn-gold"
              style={{ padding: '12px 24px' }}
            >
              <ShieldCheck size={16} />
              Open Verification Portal
            </button>
            <button
              onClick={() => setCurrentScreen('login')}
              className="btn-secondary"
              style={{ padding: '12px 20px' }}
            >
              Officer Portal Sign In
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOOTER
          ========================================================================= */}
      <footer 
        id="contact"
        style={{
          padding: '40px 48px 24px 48px',
          backgroundColor: '#07090D',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div 
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#6B7280',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Scale size={18} style={{ color: 'var(--gold-primary, #C59A45)' }} />
            <span style={{ fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-serif)' }}>
              NyayaVault
            </span>
            <span>— Ministry of Home Affairs / ICJS Phase II Alignment</span>
          </div>

          <div style={{ color: 'var(--gold-light, #E0BA68)', fontWeight: 600, letterSpacing: '0.1em' }}>
            TRUTH • INTEGRITY • JUSTICE
          </div>
        </div>
      </footer>

    </div>
  );
}
