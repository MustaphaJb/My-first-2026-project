import React from 'react';

interface RegimentLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const RegimentLogo: React.FC<RegimentLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { width: 36, height: 44, title: 'text-xs' },
    md: { width: 56, height: 68, title: 'text-sm' },
    lg: { width: 80, height: 96, title: 'text-base' },
    xl: { width: 110, height: 132, title: 'text-lg' },
  };

  const dim = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="relative flex-shrink-0 flex items-center justify-center p-1 rounded-lg bg-emerald-950/80 border border-amber-500/30 shadow-md"
        style={{ width: dim.width + 12, height: dim.height + 12 }}
      >
        <svg
          width={dim.width}
          height={dim.height}
          viewBox="0 0 160 190"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-md"
        >
          {/* Shield Outer Border */}
          <path
            d="M80 6 C 130 6, 148 20, 148 85 C 148 140, 110 172, 80 184 C 50 172, 12 140, 12 85 C 12 20, 30 6, 80 6 Z"
            fill="#064e3b"
            stroke="#d4af37"
            strokeWidth="4"
          />

          {/* Vertical Stripes inside Shield (Red - Dark Blue - Red) */}
          <g clipPath="url(#shieldClip)">
            {/* Background Red */}
            <rect x="0" y="0" width="160" height="190" fill="#dc2626" />
            {/* Center Blue Stripe */}
            <rect x="54" y="0" width="52" height="190" fill="#1e3a8a" />
          </g>

          <clipPath id="shieldClip">
            <path d="M80 8 C 128 8, 144 22, 144 85 C 144 138, 108 168, 80 180 C 52 168, 16 138, 16 85 C 16 22, 32 8, 80 8 Z" />
          </clipPath>

          {/* Outer Shield Border overlay for crispness */}
          <path
            d="M80 8 C 128 8, 144 22, 144 85 C 144 138, 108 168, 80 180 C 52 168, 16 138, 16 85 C 16 22, 32 8, 80 8 Z"
            fill="none"
            stroke="#b45309"
            strokeWidth="2.5"
          />

          {/* Central Circular Wreath & Emblem */}
          <circle cx="80" cy="85" r="38" fill="#15803d" stroke="#f59e0b" strokeWidth="3" />
          
          {/* Inner Wreath Circle */}
          <circle cx="80" cy="85" r="28" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2.5" />

          {/* Nigerian Flag Colors inside Center (Green-White-Green) */}
          <rect x="62" y="67" width="36" height="36" rx="4" fill="#166534" />
          <rect x="71" y="67" width="18" height="36" fill="#ffffff" />
          
          {/* Central Red Lion Rampant Motif */}
          <path
            d="M80 72 C78 74, 76 77, 78 81 C77 82, 75 83, 76 86 C77 88, 79 90, 82 89 C84 89, 85 86, 83 83 C84 81, 83 78, 80 72 Z"
            fill="#b91c1c"
          />

          {/* Laurel Leaves around Emblem */}
          <g stroke="#d4af37" strokeWidth="2" fill="none">
            {/* Left Laurel */}
            <path d="M42 90 C38 75, 45 60, 60 52" />
            <path d="M44 80 C40 76, 42 68, 52 64" />
            <path d="M48 92 C46 86, 50 78, 58 76" />
            {/* Right Laurel */}
            <path d="M118 90 C122 75, 115 60, 100 52" />
            <path d="M116 80 C120 76, 118 68, 108 64" />
            <path d="M112 92 C114 86, 110 78, 102 76" />
          </g>

          {/* Top Coat of Arms Motif (Eagle/Horses) */}
          <path d="M80 18 L86 28 L94 28 L88 34 L90 42 L80 37 L70 42 L72 34 L66 28 L74 28 Z" fill="#d4af37" />
          <path d="M78 37 L80 24 L82 37 Z" fill="#b91c1c" />

          {/* Bottom Gold Scroll Banner "NIGERIAN ARMY ENGINEERS" */}
          <path
            d="M 22 148 C 45 140, 115 140, 138 148 C 145 160, 130 172, 80 174 C 30 172, 15 160, 22 148 Z"
            fill="#d4af37"
            stroke="#78350f"
            strokeWidth="2"
          />
          <text
            x="80"
            y="162"
            textAnchor="middle"
            fill="#1e1b4b"
            fontSize="10"
            fontWeight="900"
            letterSpacing="0.4"
            fontFamily="sans-serif"
          >
            NIGERIAN ARMY ENGINEERS
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wide text-white uppercase text-base sm:text-lg leading-tight font-sans">
            23 Support Engr Regt
          </span>
          <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
            Nigerian Army • Jos Headquarters
          </span>
        </div>
      )}
    </div>
  );
};
