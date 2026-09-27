import React, { useRef } from 'react';
import { 
  Award, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Scale, 
  ArrowLeft 
} from 'lucide-react';

export default function BsaCertificatePage({ setCurrentScreen, selectedDoc }) {
  const printRef = useRef();

  const doc = selectedDoc || {
    id: "DOC-2026-00123",
    name: "Witness_Statement.pdf",
    caseId: "FIR-2026-001",
    caseTitle: "Murder Investigation",
    sha256: "a9f13b2c4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e672be",
    txId: "0x8f13c2d4e6a614661a84f329910cde4b5f89102871134e12c8a91b2c4e6789e",
    blockNumber: 129381,
    signer: "SI Rajesh Kumar (Badge #CG-8401)",
    uploadedOn: "25 Sep 2026, 14:32:14 IST",
    organization: "Chhattisgarh State Police Station"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => setCurrentScreen('document-viewer')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            ← Back to Document
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#FFF' }}>
            Section 63 BSA Admissibility Certificate
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handlePrint}
            className="btn-gold"
            style={{ fontSize: '12px', padding: '8px 18px' }}
          >
            <Printer size={15} />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          HIGH-SECURITY PARCHMENT CERTIFICATE (100% MATCHING SCREEN 16)
          ========================================================================= */}
      <div 
        ref={printRef}
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          width: '100%',
          background: '#FAF7F0',
          color: '#14171A',
          border: '12px solid #EDE5D4',
          borderRadius: '4px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.7)',
          padding: '48px 56px',
          fontFamily: "'Newsreader', Georgia, serif",
          position: 'relative'
        }}
      >
        {/* Double Inner Guilloche Security Border */}
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '2px solid #C59A45',
            pointerEvents: 'none'
          }} 
        />
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            bottom: '12px',
            border: '1px solid rgba(197, 154, 69, 0.5)',
            pointerEvents: 'none'
          }} 
        />

        {/* Header Crest & Titles */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {/* Ashoka Stambh Emblem Minimalist Representation */}
          <div style={{ width: '42px', height: '42px', margin: '0 auto 12px auto', color: '#9C7524' }}>
            <Scale size={42} />
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.18em', color: '#8C6820', textTransform: 'uppercase' }}>
            GOVERNMENT OF INDIA • JUDICIAL ADMISSIBILITY RECORD
          </div>

          <h1 
            style={{ 
              fontSize: '24px', 
              fontWeight: 700, 
              color: '#111417', 
              fontFamily: "'Cinzel', Georgia, serif",
              margin: '8px 0',
              letterSpacing: '0.04em'
            }}
          >
            CERTIFICATE OF ELECTRONIC EVIDENCE
          </h1>

          <div style={{ fontSize: '13px', fontWeight: 600, color: '#4B5563', fontStyle: 'italic' }}>
            Under Section 63(4)(c) of the Bharatiya Sakshya Adhiniyam, 2023 (BSA)
            <br />
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              (Formerly Section 65B of the Indian Evidence Act, 1872)
            </span>
          </div>
        </div>

        {/* Certificate Formal Statutory Text */}
        <div style={{ fontSize: '13px', lineHeight: 1.7, color: '#1F2937', marginBottom: '24px', textAlign: 'justify' }}>
          This is to certify that the digital document described hereunder was produced by the 
          computer systems operating at <strong>{doc.organization}</strong> during the lawful exercise 
          of official duties. The electronic record has remained under unbroken cryptographic chain-of-custody, 
          anchored to the permissioned <strong>Hyperledger Fabric</strong> judicial ledger, and has suffered zero bit-level alteration.
        </div>

        {/* Technical Evidentiary Ledger Table */}
        <div 
          style={{
            border: '1px solid #D1C7B7',
            background: '#F5EFE4',
            borderRadius: '2px',
            padding: '16px 20px',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '8px', fontSize: '12px' }}>
            <span style={{ fontWeight: 700, color: '#4B5563' }}>Document ID:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{doc.id}</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>Case / FIR Number:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{doc.caseId} ({doc.caseTitle})</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>SHA-256 Digest:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', wordBreak: 'break-all' }}>{doc.sha256}</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>Transaction ID:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', wordBreak: 'break-all' }}>{doc.txId}</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>Block Height:</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>#{doc.blockNumber} (Raft Consensus)</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>Ingestion Timestamp:</span>
            <span>{doc.uploadedOn}</span>

            <span style={{ fontWeight: 700, color: '#4B5563' }}>Certifying Authority:</span>
            <span>{doc.organization}</span>
          </div>
        </div>

        {/* Signatures & Seal Row Matching Screen 16 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '36px' }}>
          
          {/* Left: Verifiable QR Code */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '84px',
                height: '84px',
                background: '#FFF',
                border: '1px solid #C59A45',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* QR Code representation */}
              <svg width="74" height="74" viewBox="0 0 100 100" fill="#111417">
                <rect x="0" y="0" width="30" height="30" />
                <rect x="5" y="5" width="20" height="20" fill="#FFF" />
                <rect x="10" y="10" width="10" height="10" />

                <rect x="70" y="0" width="30" height="30" />
                <rect x="75" y="5" width="20" height="20" fill="#FFF" />
                <rect x="80" y="10" width="10" height="10" />

                <rect x="0" y="70" width="30" height="30" />
                <rect x="5" y="75" width="20" height="20" fill="#FFF" />
                <rect x="10" y="80" width="10" height="10" />

                <rect x="40" y="10" width="10" height="20" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="70" y="70" width="20" height="10" />
                <rect x="70" y="40" width="10" height="10" />
              </svg>
            </div>

            <div style={{ fontSize: '10px', color: '#6B7280', maxWidth: '140px', lineHeight: 1.4 }}>
              Scan QR to verify live blockchain integrity against NyayaVault ledger.
            </div>
          </div>

          {/* Center: Official Police Stamp (Screen 16 circular seal) */}
          <div 
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              border: '2px dashed #9E2A2B',
              color: '#9E2A2B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              transform: 'rotate(-10deg)',
              padding: '6px'
            }}
          >
            <div>★ OFFICIAL SEAL ★</div>
            <div style={{ fontSize: '9px', fontWeight: 800 }}>CHHATTISGARH</div>
            <div>POLICE STATION</div>
            <div>EVIDENCE VAULT</div>
          </div>

          {/* Right: Digital Signature Sign-Off */}
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <div style={{ fontFamily: "'Newsreader', cursive", fontSize: '18px', color: '#1E3A8A', marginBottom: '4px' }}>
              Rajesh Kumar, SI
            </div>
            <div style={{ fontWeight: 700, color: '#111417' }}>
              {doc.signer}
            </div>
            <div style={{ fontSize: '11px', color: '#4B5563' }}>
              Investigating Officer / Custodian of Electronic Record
            </div>
            <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>
              ✓ Digitally Signed (Class 3 DSC)
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
