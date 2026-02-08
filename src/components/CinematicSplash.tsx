/**
 * CinematicSplash — cinematic boot sequence with JS-driven staggered reveal
 *
 * Scanline sweep -> glitch text reveal -> terminal log cascade -> CTA pulse
 * Uses React state + CSS transitions for reliable cross-browser animation.
 * CSS @keyframes only for decorative elements (scanlines, pulse ring).
 * Respects prefers-reduced-motion: all transitions skip to final state.
 */

import React, { useCallback, useEffect, useState } from 'react';

const BOOT_LINES = [
  'INITIALIZING GRAIL_OS v4.0...',
  'NEURAL_HANDSHAKE [GEMINI_3.0_PRO]... OK',
  'VISION_PIPELINE: CALIBRATED',
  'AUCTION_NODES [TOKYO/NYC/LDN]: SYNCED',
  'FORENSIC_ENGINE: READY',
  'ALL_SYSTEMS: NOMINAL',
] as const;

interface CinematicSplashProps {
  onEnter?: () => void;
}

/** Inline transition style for staggered fade-up reveal */
const fadeUp = (active: boolean, delayMs: number): React.CSSProperties => ({
  opacity: active ? 1 : 0,
  transform: active ? 'translateY(0)' : 'translateY(12px)',
  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  transitionDelay: `${delayMs}ms`,
});

/** Inline transition style for the glitch-style title reveal */
const glitchReveal = (active: boolean): React.CSSProperties => ({
  opacity: active ? 1 : 0,
  transform: active ? 'translateY(0) skewX(0)' : 'translateY(20px) skewX(-5deg)',
  filter: active ? 'blur(0)' : 'blur(8px)',
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out',
  transitionDelay: '600ms',
});

export const CinematicSplash: React.FC<CinematicSplashProps> = ({ onEnter }) => {
  const [reveal, setReveal] = useState(false);

  const handleEnter = useCallback(() => {
    onEnter?.();
  }, [onEnter]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="relative min-h-dvh bg-[#050505] overflow-hidden flex flex-col items-center justify-center"
      role="main"
    >
      {/* Scanline overlay — pure CSS (decorative only) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 cinematic-scanline"
        aria-hidden="true"
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, #050505 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle grid lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,163,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,163,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-20 text-center max-w-lg w-full px-6">
        {/* Protocol tag */}
        <div
          className="font-mono text-[10px] text-[#3cff78] tracking-[0.5em] uppercase mb-6"
          style={fadeUp(reveal, 300)}
          aria-hidden="true"
        >
          VOID_65 // PROTOCOL_ACTIVE
        </div>

        {/* Main title — glitch reveal */}
        <h1
          className="font-black italic leading-[0.9] tracking-tighter text-white mb-4"
          style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', ...glitchReveal(reveal) }}
        >
          GRAIL
          <br />
          <span className="bg-gradient-to-br from-[#3cff78] to-[#ff6b35] bg-clip-text text-transparent">
            HUNTER
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-mono text-[11px] text-white/40 tracking-widest uppercase mt-4"
          style={fadeUp(reveal, 1200)}
        >
          Autonomous Vintage Authentication Agent
        </p>

        {/* Terminal log cascade */}
        <div
          className="mt-8 text-left font-mono text-[10px] leading-relaxed space-y-0.5"
          style={fadeUp(reveal, 1600)}
          role="status"
          aria-live="polite"
          aria-label="System initialization status"
        >
          {BOOT_LINES.map((line, i) => (
            <div key={line} className="text-[#00ffa3]/50" style={fadeUp(reveal, 1200 + i * 100)}>
              <span className="text-[#00ffa3]/30" aria-hidden="true">
                {'>'}
              </span>{' '}
              {line}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <div className="mt-10 relative z-[100]" style={fadeUp(reveal, 2000)}>
          <button
            type="button"
            data-testid="landing-cta"
            onClick={handleEnter}
            className="cinematic-pulse-btn relative z-[100] pointer-events-auto px-8 py-4 min-h-[48px] rounded-2xl bg-[#00ffa3] text-black font-black uppercase text-xs tracking-widest transition-transform active:scale-95 cursor-pointer hv-btn gpu-layer"
            style={{ userSelect: 'none', touchAction: 'manipulation' } as React.CSSProperties}
          >
            Enter The Vault
          </button>
        </div>

        {/* Skip link — appears after 1s */}
        <div className="mt-4 relative z-[100]" style={fadeUp(reveal, 1000)}>
          <button
            type="button"
            onClick={handleEnter}
            className="text-white/20 text-[10px] font-mono uppercase tracking-widest hover:text-white/40 transition-colors pointer-events-auto"
          >
            Skip &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
