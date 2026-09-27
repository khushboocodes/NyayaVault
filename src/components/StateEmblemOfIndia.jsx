import React from 'react';

/**
 * State Emblem of India (Lion Capital of Ashoka)
 * Highly detailed golden vector graphic matching the official national emblem.
 */
export default function StateEmblemOfIndia({ size = 80, className = '' }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldLion" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF1CA" />
          <stop offset="35%" stopColor="#E2BD68" />
          <stop offset="70%" stopColor="#C59A45" />
          <stop offset="100%" stopColor="#8C651F" />
        </linearGradient>
        <linearGradient id="goldDark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#5E4311" />
        </linearGradient>
      </defs>

      {/* Center Lion Head & Crown */}
      <path
        d="M50 12 C44 12, 40 16, 40 22 C40 28, 43 32, 50 34 C57 32, 60 28, 60 22 C60 16, 56 12, 50 12 Z"
        fill="url(#goldLion)"
      />
      {/* Center Lion Face details */}
      <circle cx="46" cy="20" r="1.5" fill="#2A1B05" />
      <circle cx="54" cy="20" r="1.5" fill="#2A1B05" />
      <path d="M49 23 L51 23 L50 25 Z" fill="#2A1B05" />
      <path d="M47 27 Q50 29 53 27" stroke="#2A1B05" strokeWidth="0.8" fill="none" />

      {/* Left Lion Head */}
      <path
        d="M32 18 C28 18, 25 21, 26 26 C27 31, 31 34, 38 36 C37 30, 36 24, 32 18 Z"
        fill="url(#goldLion)"
      />
      <circle cx="29" cy="23" r="1.2" fill="#2A1B05" />
      <path d="M28 26 L30 26 L29 28 Z" fill="#2A1B05" />

      {/* Right Lion Head */}
      <path
        d="M68 18 C72 18, 75 21, 74 26 C73 31, 69 34, 62 36 C63 30, 64 24, 68 18 Z"
        fill="url(#goldLion)"
      />
      <circle cx="71" cy="23" r="1.2" fill="#2A1B05" />
      <path d="M70 26 L72 26 L71 28 Z" fill="#2A1B05" />

      {/* Mane of Lions (Ornate Fluted Hair Details) */}
      <path
        d="M24 35 C20 45, 25 60, 35 68 C40 70, 60 70, 65 68 C75 60, 80 45, 76 35 C70 42, 60 46, 50 46 C40 46, 30 42, 24 35 Z"
        fill="url(#goldLion)"
      />
      {/* Front Chest & Paws */}
      <path d="M38 52 C37 62, 38 72, 42 78 L47 78 L47 54 Z" fill="url(#goldDark)" />
      <path d="M62 52 C63 62, 62 72, 58 78 L53 78 L53 54 Z" fill="url(#goldDark)" />
      <path d="M45 54 L55 54 L53 78 L47 78 Z" fill="url(#goldLion)" />

      {/* Left Forepaw & Right Forepaw */}
      <rect x="34" y="74" width="7" height="6" rx="1.5" fill="url(#goldLion)" />
      <rect x="59" y="74" width="7" height="6" rx="1.5" fill="url(#goldLion)" />
      <rect x="46" y="75" width="8" height="5" rx="1.2" fill="url(#goldLion)" />

      {/* Abacus / Base Platform (Relief carrying Horse, Bull, Elephant, Lion) */}
      <path d="M18 80 L82 80 L80 84 L20 84 Z" fill="url(#goldLion)" />
      <rect x="20" y="84" width="60" height="14" fill="#3D2908" stroke="url(#goldLion)" strokeWidth="0.8" />

      {/* Center Ashoka Chakra on Abacus */}
      <circle cx="50" cy="91" r="5.5" stroke="url(#goldLion)" strokeWidth="0.8" fill="#1C1405" />
      <circle cx="50" cy="91" r="1.5" fill="url(#goldLion)" />
      {/* 24 spokes (represented cleanly) */}
      <line x1="50" y1="86" x2="50" y2="96" stroke="url(#goldLion)" strokeWidth="0.5" />
      <line x1="45" y1="91" x2="55" y2="91" stroke="url(#goldLion)" strokeWidth="0.5" />
      <line x1="46.5" y1="87.5" x2="53.5" y2="94.5" stroke="url(#goldLion)" strokeWidth="0.5" />
      <line x1="46.5" y1="94.5" x2="53.5" y2="87.5" stroke="url(#goldLion)" strokeWidth="0.5" />

      {/* Left Bull / Horse symbol */}
      <path d="M28 88 Q32 86 35 91 Q32 94 28 92 Z" fill="url(#goldLion)" />
      {/* Right Elephant / Lion symbol */}
      <path d="M65 88 Q68 86 72 91 Q68 94 65 92 Z" fill="url(#goldLion)" />

      {/* Lower Inverted Lotus Pedestal */}
      <path d="M22 98 L78 98 L74 108 L26 108 Z" fill="url(#goldLion)" />
      {/* Lotus Petal Ridges */}
      <path d="M30 98 Q32 108 34 108" stroke="#3D2908" strokeWidth="0.8" />
      <path d="M40 98 Q42 108 44 108" stroke="#3D2908" strokeWidth="0.8" />
      <path d="M50 98 L50 108" stroke="#3D2908" strokeWidth="0.8" />
      <path d="M60 98 Q58 108 56 108" stroke="#3D2908" strokeWidth="0.8" />
      <path d="M70 98 Q68 108 66 108" stroke="#3D2908" strokeWidth="0.8" />

      {/* Base Foundation Bar */}
      <rect x="24" y="108" width="52" height="4" rx="0.5" fill="url(#goldLion)" />

      {/* Inscription: Satyameva Jayate (सत्यमेव जयते) */}
      <text
        x="50"
        y="122"
        textAnchor="middle"
        fill="url(#goldLion)"
        fontSize="7.5"
        fontWeight="700"
        fontFamily="serif"
        letterSpacing="0.08em"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}
