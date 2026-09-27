import React from 'react';

export default function AshokaLogo({ size = 'default', showSubtitle = false, className = '' }) {
  const isLarge = size === 'large';
  const isSmall = size === 'small';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {/* Classical Judicial Pillar & Scales Crest */}
      <svg
        width={isLarge ? 36 : isSmall ? 22 : 28}
        height={isLarge ? 36 : isSmall ? 22 : 28}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Pedestal Base */}
        <path d="M4 28H28V30H4V28Z" fill="#C59A45" />
        <path d="M6 26H26V27.5H6V26Z" fill="#E6CA65" />
        
        {/* Classical Columns / Pillars */}
        <rect x="8" y="10" width="3" height="15" rx="0.5" fill="url(#goldGrad)" />
        <rect x="14.5" y="10" width="3" height="15" rx="0.5" fill="url(#goldGrad)" />
        <rect x="21" y="10" width="3" height="15" rx="0.5" fill="url(#goldGrad)" />
        
        {/* Entablature & Capital */}
        <path d="M6 8.5H26V10H6V8.5Z" fill="#E6CA65" />
        <path d="M4 6.5H28V8H4V6.5Z" fill="#C59A45" />
        
        {/* Pediment Roof with Center Scales Symbol */}
        <path d="M16 2L3 6.5H29L16 2Z" fill="url(#goldGradRoof)" />
        <circle cx="16" cy="4.8" r="1.2" fill="#0A0D14" />
        
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E6CA65" />
            <stop offset="50%" stopColor="#C59A45" />
            <stop offset="100%" stopColor="#9C7524" />
          </linearGradient>
          <linearGradient id="goldGradRoof" x1="3" y1="2" x2="29" y2="6.5">
            <stop offset="0%" stopColor="#C59A45" />
            <stop offset="50%" stopColor="#F3DC82" />
            <stop offset="100%" stopColor="#B2872A" />
          </linearGradient>
        </defs>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 700,
            fontSize: isLarge ? '24px' : isSmall ? '15px' : '19px',
            letterSpacing: '0.04em',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #E6CA65 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1,
            textTransform: 'uppercase'
          }}
        >
          NYAYAVAULT
        </span>
        {showSubtitle && (
          <span
            style={{
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--gold-light)',
              fontWeight: 600,
              marginTop: '2px'
            }}
          >
            Digital Evidence Trust
          </span>
        )}
      </div>
    </div>
  );
}
