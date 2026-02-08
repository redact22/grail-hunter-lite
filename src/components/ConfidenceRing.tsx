import React from 'react';

interface ConfidenceRingProps {
  confidence: number; // 0.0 - 1.0
  size?: number;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({ confidence, size = 100 }) => {
  const pct = Math.round(confidence * 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - confidence);

  const color = pct >= 80 ? '#2BF3C0' : pct >= 50 ? '#FFB020' : '#FF4444';

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size, filter: `drop-shadow(0 0 ${pct >= 80 ? '12' : '6'}px ${color}40)` }}
      data-testid="confidence-ring"
    >
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={4}
        />
        {/* Animated ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out, stroke 0.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black font-mono" style={{ color }}>
          {pct}
        </span>
        <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
          confidence
        </span>
      </div>
    </div>
  );
};
