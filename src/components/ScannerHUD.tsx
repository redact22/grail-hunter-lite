import React, { useEffect, useRef, useCallback } from 'react';

interface ScannerHUDProps {
  progress: number;
  phase: string;
}

export const ScannerHUD: React.FC<ScannerHUDProps> = ({ progress, phase }) => {
  const frameRef = useRef<HTMLSpanElement>(null);
  const coordsRef = useRef<HTMLSpanElement>(null);
  const matchRef = useRef<HTMLSpanElement>(null);
  const frameCount = useRef(0);
  const patternMatches = useRef(0);

  const tick = useCallback(() => {
    frameCount.current += 1;
    patternMatches.current += Math.floor(Math.random() * 3);
    const x = Math.floor(Math.random() * 4096);
    const y = Math.floor(Math.random() * 4096);

    if (frameRef.current)
      frameRef.current.textContent = `FRM: ${String(frameCount.current).padStart(6, '0')}`;
    if (coordsRef.current)
      coordsRef.current.textContent = `[${String(x).padStart(4, '0')}, ${String(y).padStart(4, '0')}]`;
    if (matchRef.current)
      matchRef.current.textContent = `MATCH: ${patternMatches.current}`;
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 400);
    return () => clearInterval(interval);
  }, [tick]);

  const cpuLoad = Math.min(84 + Math.floor(progress * 0.15), 99);
  const memUsage = Math.min(42 + Math.floor(progress * 0.3), 87);
  const gpuLoad = Math.min(60 + Math.floor(progress * 0.38), 98);
  const neuralLayer = Math.min(Math.floor(progress / 8) + 1, 12);

  return (
    <div
      className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex justify-between"
      aria-hidden="true"
    >
      {/* Left panel */}
      <div className="flex flex-col gap-0.5 bg-black/40 rounded-lg px-2 py-1.5 backdrop-blur-sm border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#2BF3C0] animate-pulse" />
          <span className="text-[9px] font-black font-mono text-[#2BF3C0]/80 uppercase">
            CPU: {cpuLoad}%
          </span>
        </div>
        <span className="text-[9px] font-black font-mono text-[#FF3BD4]/50 uppercase">
          GPU: {gpuLoad}%
        </span>
        <span className="text-[9px] font-black font-mono text-white/30 uppercase">
          MEM: {memUsage}%
        </span>
        <span ref={frameRef} className="text-[9px] font-black font-mono text-white/20 uppercase">
          FRM: 000000
        </span>
      </div>

      {/* Right panel */}
      <div className="flex flex-col gap-0.5 items-end bg-black/40 rounded-lg px-2 py-1.5 backdrop-blur-sm border border-white/5">
        <span ref={coordsRef} className="text-[9px] font-black font-mono text-[#9B7BFF]/70 uppercase">
          [0000, 0000]
        </span>
        <span className="text-[9px] font-black font-mono text-[#2BF3C0]/40 uppercase">
          LAYER: {neuralLayer}/12
        </span>
        <span ref={matchRef} className="text-[9px] font-black font-mono text-white/20 uppercase">
          MATCH: 0
        </span>
        <span className="text-[9px] font-black font-mono text-[#FFB020]/60 uppercase tracking-wider">
          {phase}
        </span>
      </div>
    </div>
  );
};
