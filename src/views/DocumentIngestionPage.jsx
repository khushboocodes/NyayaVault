import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Brain, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  EyeOff, 
  Lock, 
  Key, 
  FileCheck2, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitBranch,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SENSITIVE_ENTITIES_DEMO } from '../data/mockData';

export default function DocumentIngestionPage({ 
  setCurrentScreen, 
  addNewDocument, 
  setSelectedDoc 
}) {
  // Stepper State: 1 = Upload, 2 = AI/Redaction, 3 = Review & Sign, 4 = Anchoring, 5 = Confirmed
  const [currentStep, setCurrentStep] = useState(1);

  // File & Form State
  const [fileName, setFileName] = useState('Witness_Statement.pdf');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [pagesCount, setPagesCount] = useState(4);
  const [docType, setDocType] = useState('Witness Statement');
  const [caseId, setCaseId] = useState('FIR-2026-001');
  const [description, setDescription] = useState('Sworn statement of key eyewitness regarding incident near Sadar Thana.');
  const [isSensitive, setIsSensitive] = useState(true); // Branching trigger
  const [computedSha256, setComputedSha256] = useState('a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be');
  const [isHashing, setIsHashing] = useState(false);

  // Redaction Entities State (Screen 9)
  const [entities, setEntities] = useState(SENSITIVE_ENTITIES_DEMO);
  const [redactedCount, setRedactedCount] = useState(6);
  const [revealedNames, setRevealedNames] = useState(false);

  // Blockchain Anchoring Sequential Progress (Screen 11)
  const [anchorProgress, setAnchorProgress] = useState(0);

  // Real in-browser SHA-256 calculation
  const calculateRealHash = async (file) => {
    setIsHashing(true);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setComputedSha256(hashHex);
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (err) {
      console.error("Hash calculation failed", err);
    } finally {
      setIsHashing(false);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      calculateRealHash(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      calculateRealHash(e.target.files[0]);
    }
  };

  // Preset demo pickers
  const loadSensitiveDemo = () => {
    setFileName('Witness_Statement.pdf');
    setFileSize('2.4 MB');
    setDocType('Witness Statement');
    setIsSensitive(true);
    setComputedSha256('a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be');
  };

  const loadNormalDemo = () => {
    setFileName('Seizure_Memo_Exhibit_A1.pdf');
    setFileSize('1.8 MB');
    setDocType('Seizure Memo');
    setIsSensitive(false);
    setComputedSha256('e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3c2b1a0f9e4d3');
  };

  // Branching Navigation from Step 1
  const handleProceedFromUpload = () => {
    if (isSensitive) {
      // BRANCH A: Sensitive -> Redaction Studio
      setCurrentStep(2);
    } else {
      // BRANCH B: Normal -> Directly to Review & Sign
      setCurrentStep(3);
    }
  };

  // Step 4 Anchoring Animation Trigger
  useEffect(() => {
    if (currentStep === 4) {
      setAnchorProgress(1); // MinIO Encrypt
      const timer1 = setTimeout(() => setAnchorProgress(2), 700); // Hash Generated
      const timer2 = setTimeout(() => setAnchorProgress(3), 1400); // Signature Verified
      const timer3 = setTimeout(() => setAnchorProgress(4), 2200); // Submitting to Fabric
      const timer4 = setTimeout(() => {
        setAnchorProgress(5); // Block Confirmation
        // Advance to Step 5 (Success)
        setCurrentStep(5);
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#C59A45', '#10B981', '#FFFFFF']
          });
        } catch (e) {}
      }, 3200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [currentStep]);

  // Handle entity toggle
  const toggleEntity = (id) => {
    setEntities(prev => prev.map(ent => {
      if (ent.id === id) return { ...ent, checked: !ent.checked };
      return ent;
    }));
  };

  // Stepper Items Definition
  const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'AI Analysis' },
    { number: 3, label: 'Review & Sign' },
    { number: 4, label: 'Blockchain' },
    { number: 5, label: 'Confirm' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* =========================================================================
          HORIZONTAL STEPPER (MATCHING SCREEN 8, 9, 10, 11)
          ========================================================================= */}
      <div 
        className="nyaya-card"
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-serif)', color: '#FFF' }}>
            Document Ingestion Airlock
          </span>
          <span className="badge-status badge-gold">
            Step {currentStep} of 5
          </span>
        </div>

        {/* Stepper Node Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="ingestion-stepper-nodes">
          {steps.map((s) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            const isSkipped = !isSensitive && s.number === 2 && currentStep > 2;

            return (
              <div 
                key={s.number}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  opacity: (isCurrent || isCompleted) ? 1 : 0.4
                }}
              >
                <div 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: isCurrent ? 'var(--gold-primary)' : isCompleted ? 'var(--status-verified)' : 'var(--bg-surface-elevated)',
                    color: (isCurrent || isCompleted) ? '#0A0D14' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  {isCompleted ? '✓' : s.number}
                </div>
                <span 
                  style={{ 
                    fontSize: '12px', 
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--gold-light)' : isCompleted ? '#FFF' : 'var(--text-muted)'
                  }}
                >
                  {s.label}
                  {isSkipped && ' (Skipped)'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          STEP 1: UPLOAD DOCUMENT (SCREEN 8)
          ========================================================================= */}
      {currentStep === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Demo Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Quick Presets:</span>
            <button 
              onClick={loadSensitiveDemo} 
              className={`btn-secondary ${isSensitive ? 'btn-outline-gold' : ''}`}
              style={{ fontSize: '11px', padding: '5px 12px' }}
            >
              📄 Sensitive Witness Statement (Triggers Section 72 BNS)
            </button>
            <button 
              onClick={loadNormalDemo} 
              className={`btn-secondary ${!isSensitive ? 'btn-outline-gold' : ''}`}
              style={{ fontSize: '11px', padding: '5px 12px' }}
            >
              📋 Standard Seizure Memo (Normal Branch)
            </button>
          </div>

          {/* Drag & Drop Area Matching Screen 8 */}
          <div 
            onDragOver={e => e.preventDefault()}
            onDrop={handleFileDrop}
            className="nyaya-card"
            style={{
              border: '2px dashed var(--gold-border)',
              borderRadius: 'var(--radius-md)',
              padding: '48px 32px',
              textAlign: 'center',
              background: 'rgba(16, 20, 29, 0.6)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <input 
              id="file-upload-input"
              type="file" 
              style={{ display: 'none' }} 
              onChange={handleFileInput}
              accept=".pdf,.jpg,.png,.docx"
            />

            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--gold-subtle)',
                border: '1px solid var(--gold-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--gold-light)'
              }}
            >
              <Upload size={30} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
              Drag and drop document here
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              or click to browse from device file system
            </p>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
              Supported: PDF, JPG, PNG, DOCX (Max 100 MB) • Client-Side Cryptographic Sandbox
            </div>

            {/* Selected File Card */}
            <div 
              style={{
                maxWidth: '480px',
                margin: '24px auto 0 auto',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
              onClick={e => e.stopPropagation()}
            >
              <FileText size={20} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#FFF', fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {fileName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {fileSize} • {pagesCount} Pages • Computed SHA-256:
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--gold-light)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {isHashing ? 'Hashing file bytes...' : computedSha256}
                </div>
              </div>
              <span className="badge-status badge-verified" style={{ fontSize: '10px' }}>
                Ready
              </span>
            </div>
          </div>

          {/* Metadata & Classification Grid (Screen 8 Bottom) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="nyaya-card">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Document Category *
              </label>
              <select 
                value={docType} 
                onChange={e => setDocType(e.target.value)}
                className="nyaya-select"
              >
                <option value="Witness Statement">Witness Statement (Sec 180 BNSS / 161 CrPC)</option>
                <option value="FIR">First Information Report (FIR)</option>
                <option value="Seizure Memo">Seizure Memo / Panchnama</option>
                <option value="Forensic Report">FSL Ballistics / Forensic Report</option>
                <option value="Charge Sheet">Police Final Charge Sheet (Sec 193 BNSS)</option>
              </select>

              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '16px', marginBottom: '8px' }}>
                Case Docket Reference
              </label>
              <input 
                type="text" 
                value={caseId} 
                onChange={e => setCaseId(e.target.value)}
                className="nyaya-input"
              />
            </div>

            <div className="nyaya-card">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Brief Description (Optional)
              </label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="nyaya-input"
                rows={4}
                style={{ resize: 'none' }}
              />
            </div>
          </div>

          {/* CRITICAL BRANCHING DECISION TOGGLE */}
          <div 
            className="nyaya-card-gold"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '640px' }}>
              <EyeOff size={24} style={{ color: isSensitive ? 'var(--status-bns)' : 'var(--text-muted)', marginTop: '2px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                  Statutory Classification: Section 72 BNS Victim & Witness Identity Protection
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
                  {isSensitive ? (
                    <span style={{ color: '#F472B6' }}>
                      <strong>Active Protection:</strong> Document flagged as containing confidential victim or complainant details. 
                      Will activate Section 72 BNS AI Redaction Studio to generate dual-bound master/redacted hashes.
                    </span>
                  ) : (
                    <span>
                      <strong>Standard Investigation Record:</strong> No sexual assault / POCSO victim identity restrictions apply. 
                      Document will bypass redaction and proceed straight to digital signing and blockchain commitment.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', background: 'var(--bg-surface-elevated)', padding: '10px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <input 
                type="checkbox" 
                checked={isSensitive} 
                onChange={e => setIsSensitive(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: 'var(--gold-primary)' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold-light)' }}>
                Apply Section 72 BNS
              </span>
            </label>
          </div>

          {/* Stepper Footer Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              onClick={handleProceedFromUpload} 
              className="btn-gold"
              style={{ padding: '12px 32px' }}
            >
              <span>{isSensitive ? 'Next: AI Analysis & Redaction →' : 'Next: Review & Sign →'}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 2: SECTION 72 BNS AI ANALYSIS & REDACTION STUDIO (SCREEN 9)
          ========================================================================= */}
      {currentStep === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div 
            style={{
              background: 'rgba(236, 72, 153, 0.1)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <EyeOff size={18} style={{ color: 'var(--status-bns)' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#F472B6' }}>
                Section 72 BNS Redaction Studio Active: 6 Entities Auto-Masked by InLegalBERT
              </span>
            </div>
            <span className="badge-status badge-bns">
              Dual-Hash Protection Gate
            </span>
          </div>

          {/* Side-by-Side Concept (Matching Screen 9) */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(320px, 1.4fr) minmax(280px, 1fr)',
              gap: '24px'
            }}
            className="redaction-studio-grid"
          >
            {/* Left: Document Preview with Redaction Bars */}
            <div className="nyaya-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                  Document Preview: WITNESS STATEMENT
                </span>
                <button 
                  onClick={() => setRevealedNames(!revealedNames)}
                  className="btn-secondary"
                  style={{ fontSize: '11px', padding: '4px 10px' }}
                >
                  {revealedNames ? 'Hide Redacted Text' : 'Inspect Underlying Text'}
                </button>
              </div>

              {/* Parchment Styled Authentic Document */}
              <div className="parchment-document" style={{ fontSize: '13px', minHeight: '380px' }}>
                <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '16px', letterSpacing: '0.04em', marginBottom: '16px', borderBottom: '1px solid #DCD4C4', paddingBottom: '8px' }}>
                  STATE OF CHHATTISGARH POLICE DEPARTMENT<br />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--parchment-muted)' }}>
                    STATEMENT OF WITNESS RECORDED UNDER SECTION 180 BNSS
                  </span>
                </div>

                <p style={{ marginBottom: '12px' }}>
                  <strong>FIR No.:</strong> FIR-2026-001 &nbsp;|&nbsp; <strong>Police Station:</strong> Sadar Thana
                </p>

                <p style={{ marginBottom: '12px' }}>
                  On this day, the statement of the victim,{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    Kalyani Devi
                  </span>
                  , aged approximately 22 years, residing at{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    House 14, Ward 4, Rampur Village
                  </span>
                  , contact number{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    +91 98765 43210
                  </span>
                  , holder of Aadhaar card{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    XXXX-XXXX-8921
                  </span>
                  , is recorded by the undersigned Investigating Officer.
                </p>

                <p style={{ marginBottom: '12px' }}>
                  The witness states that on 12th August at around 19:30 hours near{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    Near Shanti Kunj Nala
                  </span>
                  , she noticed a speeding motorcycle bearing registration plate{' '}
                  <span className={`redaction-bar ${revealedNames ? 'revealed' : ''}`}>
                    CG 04 MB 7712
                  </span>
                  . Two individuals fled the premises immediately following the altercation.
                </p>

                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #DCD4C4', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--parchment-muted)' }}>
                  <span>Recorded by: SI Rajesh Kumar [Badge #CG-8401]</span>
                  <span>Signature of Witness: [Thumb Impression Attached]</span>
                </div>
              </div>
            </div>

            {/* Right: Detected Sensitive Information (Screen 9 Right Card) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div className="nyaya-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                    Detected Sensitive Information
                  </h3>
                  <span className="badge-status badge-gold">AI Confidence: 99.4%</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {entities.map(ent => (
                    <div 
                      key={ent.id}
                      onClick={() => toggleEntity(ent.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        background: ent.checked ? 'rgba(236, 72, 153, 0.08)' : 'var(--bg-surface-elevated)',
                        border: ent.checked ? '1px solid rgba(236, 72, 153, 0.3)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          checked={ent.checked} 
                          onChange={() => {}} 
                          style={{ accentColor: 'var(--status-bns)' }}
                        />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                            {ent.type} ({ent.count})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {ent.value}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontSize: '11px', color: 'var(--gold-light)' }}>
                        {ent.checked ? 'Masked' : 'Exempt'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Redaction Actions */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                  <button 
                    onClick={() => setEntities(prev => prev.map(e => ({ ...e, checked: true })))}
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '8px', fontSize: '11px', justifyContent: 'center' }}
                  >
                    Redact All (6)
                  </button>
                  <button 
                    onClick={() => alert("Manual bounding box tool activated. Click on document preview to add blackout area.")}
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '8px', fontSize: '11px', justifyContent: 'center' }}
                  >
                    + Add Manual Box
                  </button>
                </div>
              </div>

              {/* Cryptographic Dual-Hash Binding Card */}
              <div className="nyaya-card-gold" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <GitBranch size={16} style={{ color: 'var(--gold-primary)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gold-light)', textTransform: 'uppercase' }}>
                    Dual-Hash Cryptographic Binding
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Master Hash (Judicial Vault):</span>
                    <div style={{ fontFamily: 'var(--font-mono)', color: '#FFF', wordBreak: 'break-all' }}>
                      {computedSha256.slice(0, 32)}...
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Redacted Hash (Defense/Public):</span>
                    <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)', wordBreak: 'break-all' }}>
                      8f4e2b01c9a7d34e65f12980145be8a3f5e7c9b2d4e6f8a2c41893341b8a9f31
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px', color: 'var(--status-verified)' }}>
                  ✓ Merkle Root will bind both hashes into a single atomic block.
                </div>
              </div>

            </div>
          </div>

          {/* Stepper Footer Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentStep(1)} 
              className="btn-secondary"
            >
              ← Back to Upload
            </button>
            <button 
              onClick={() => setCurrentStep(3)} 
              className="btn-gold"
              style={{ padding: '12px 32px' }}
            >
              <span>CONFIRM & SEAL DUAL-HASH →</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 3: REVIEW & SIGN (SCREEN 10)
          ========================================================================= */}
      {currentStep === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Left: Document Details */}
            <div className="nyaya-card">
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF', marginBottom: '16px' }}>
                Document Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>File Name</span>
                  <span style={{ color: '#FFF', fontWeight: 600 }}>{fileName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Type</span>
                  <span className="badge-status badge-gold">{docType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Size</span>
                  <span style={{ color: '#FFF' }}>{fileSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Case ID</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)' }}>{caseId}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>SHA-256 Digest</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-light)', wordBreak: 'break-all' }}>
                    {computedSha256}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Upload Timestamp</span>
                  <span style={{ color: '#FFF' }}>25 Sep 2026, 14:32:11 IST</span>
                </div>
              </div>
            </div>

            {/* Right: Digital Signature (Screen 10 Right Card) */}
            <div className="nyaya-card-gold" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Fingerprint size={22} style={{ color: 'var(--gold-primary)' }} />
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
                      Digital Signature Sign-Off
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Sign using your official law enforcement digital credentials
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Select Digital Certificate
                    </label>
                    <select className="nyaya-select" defaultValue="cert1">
                      <option value="cert1">Class 3 DSC - SI Rajesh Kumar (NIC-CA)</option>
                      <option value="cert2">Department Token #CG-POL-8401</option>
                      <option value="cert3">Aadhaar eSign (UIDAI Gateway)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Hardware Token PIN / Passphrase
                    </label>
                    <input 
                      type="password" 
                      defaultValue="••••••" 
                      className="nyaya-input" 
                      placeholder="Enter 6-digit DSC PIN" 
                    />
                  </div>

                  <div 
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5
                    }}
                  >
                    🔒 <strong>Statutory Notice:</strong> Document will be encrypted with AES-256 envelope keys 
                    and anchored to Hyperledger Fabric. Non-repudiation signature attached under Section 3 of the IT Act.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button 
                  onClick={() => setCurrentStep(4)} 
                  className="btn-gold"
                  style={{ width: '100%', padding: '12px', justifyContent: 'center' }}
                >
                  <Key size={15} />
                  <span>SIGN & CONTINUE TO BLOCKCHAIN →</span>
                </button>
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button 
              onClick={() => setCurrentStep(isSensitive ? 2 : 1)} 
              className="btn-secondary"
            >
              ← Back
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          STEP 4: BLOCKCHAIN ANCHORING ANIMATION (SCREEN 11)
          ========================================================================= */}
      {currentStep === 4 && (
        <div 
          className="nyaya-card"
          style={{
            maxWidth: '600px',
            margin: '40px auto',
            padding: '40px',
            textAlign: 'center',
            background: 'var(--bg-surface)'
          }}
        >
          <div 
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--gold-subtle)',
              border: '1px solid var(--gold-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--gold-light)'
            }}
          >
            <Layers size={32} className="pulse-animation" />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
            Anchoring to Hyperledger Fabric
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Achieving consensus across Police, Judiciary, and FSL consortium peer nodes...
          </p>

          {/* Sequential Checklist Matching Screen 11 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '32px', textAlign: 'left' }}>
            
            {/* Step 1 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-verified)' }} />
                <span style={{ fontSize: '13px', color: '#FFF' }}>File encrypted and stored (MinIO)</span>
              </div>
              <span className="badge-status badge-verified">Completed</span>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-verified)' }} />
                <span style={{ fontSize: '13px', color: '#FFF' }}>Hash generated (SHA-256)</span>
              </div>
              <span className="badge-status badge-verified">Completed</span>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--status-verified)' }} />
                <span style={{ fontSize: '13px', color: '#FFF' }}>Digital signature verified</span>
              </div>
              <span className="badge-status badge-verified">Completed</span>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {anchorProgress >= 4 ? (
                  <CheckCircle2 size={16} style={{ color: 'var(--status-verified)' }} />
                ) : (
                  <Clock size={16} style={{ color: 'var(--gold-primary)' }} />
                )}
                <span style={{ fontSize: '13px', color: '#FFF' }}>Submitting to Hyperledger Fabric</span>
              </div>
              <span className={`badge-status ${anchorProgress >= 4 ? 'badge-verified' : 'badge-gold'}`}>
                {anchorProgress >= 4 ? 'Completed' : 'Processing...'}
              </span>
            </div>

            {/* Step 5 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Waiting for block confirmation</span>
              </div>
              <span className="badge-status badge-pending">Pending...</span>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 5: SUCCESS / DOCUMENT ANCHORED (SCREEN 12)
          ========================================================================= */}
      {currentStep === 5 && (
        <div 
          className="nyaya-card-gold"
          style={{
            maxWidth: '680px',
            margin: '20px auto',
            padding: '40px',
            textAlign: 'center',
            background: 'var(--bg-surface)'
          }}
        >
          {/* Glowing Green Seal Checkmark */}
          <div 
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--status-verified)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: 'var(--status-verified)',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle2 size={38} />
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#FFF', fontFamily: 'var(--font-serif)' }}>
            Document Successfully Anchored!
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Your document has been securely recorded on the permissioned blockchain ledger.
          </p>

          {/* Details Box Matching Screen 12 */}
          <div 
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '20px',
              marginTop: '28px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Document ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold-light)', fontWeight: 600 }}>DOC-2026-00123</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Case ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#FFF' }}>{caseId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>SHA-256 Hash</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--gold-light)' }}>
                {computedSha256.slice(0, 24)}...72be
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction ID</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#FFF' }}>0x8f13c2...789e</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timestamp</span>
              <span style={{ color: '#FFF' }}>25 Sep 2026, 14:32:14 IST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span className="badge-status badge-verified">Confirmed (Block #129381)</span>
            </div>
          </div>

          {/* 3 Action Buttons Matching Screen 12 */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setCurrentScreen('document-viewer')}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '10px 18px' }}
            >
              <FileText size={14} />
              <span>View Document</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('custody')}
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '10px 18px' }}
            >
              <GitBranch size={14} />
              <span>View Chain of Custody</span>
            </button>

            <button 
              onClick={() => setCurrentScreen('certificates')}
              className="btn-gold"
              style={{ fontSize: '12px', padding: '10px 18px' }}
            >
              <FileCheck2 size={14} />
              <span>Generate Certificate</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
