import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, ShieldX, AlertTriangle, Volume2, RotateCcw } from 'lucide-react';
import { ConfidenceRing } from './ConfidenceRing';
import { ReasoningChain } from './ReasoningChain';
import { generateStylingAudio } from '../services/geminiService';
import { rarityColors } from '../constants';
import type { IdentificationResult } from '../types';

interface ForensicReportPanelProps {
  result: IdentificationResult;
  onReset: () => void;
}

/** Staggered fadeUp transition reused from CinematicSplash */
const fadeUp = (active: boolean, delayMs: number): React.CSSProperties => ({
  opacity: active ? 1 : 0,
  transform: active ? 'translateY(0)' : 'translateY(12px)',
  transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  transitionDelay: `${delayMs}ms`,
});

export const ForensicReportPanel: React.FC<ForensicReportPanelProps> = ({ result, onReset }) => {
  const [reveal, setReveal] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleAudioBriefing = useCallback(async () => {
    if (audioPlaying) return;
    setAudioPlaying(true);
    const briefing = `${result.name} by ${result.brand}. ${result.era} era. ${result.isAuthentic ? 'Authenticated' : 'Flagged as suspicious'}. Confidence ${Math.round(result.confidence * 100)} percent. Estimated value ${result.estimatedValue}. ${result.stylingAdvice ?? ''}`;
    await generateStylingAudio(briefing);
    setAudioPlaying(false);
  }, [result, audioPlaying]);

  const style = rarityColors[result.rarity as string] || rarityColors.Common;
  const isGrail = result.rarity === 'Grail' && result.isAuthentic && result.confidence > 0.9;
  const materials = result.materialComposition ? Object.entries(result.materialComposition) : [];

  return (
    <div
      className="absolute inset-0 z-50 overflow-y-auto bg-[#0A0A0F]/95 backdrop-blur-xl"
      data-testid="forensic-report-panel"
    >
      <div className="min-h-full px-6 py-8 max-w-lg mx-auto space-y-6">
        {/* Verdict header */}
        <div className="text-center" style={fadeUp(reveal, 0)}>
          {isGrail ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFB020]/10 border border-[#FFB020]/30">
              <span className="text-xl">🏆</span>
              <span className="text-xs font-black uppercase tracking-widest text-[#FFB020]">
                Grail Found
              </span>
            </div>
          ) : (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${result.isAuthentic ? 'bg-[#2BF3C0]/10 border border-[#2BF3C0]/30' : 'bg-red-500/10 border border-red-500/30'}`}
            >
              {result.isAuthentic ? (
                <ShieldCheck size={16} className="text-[#2BF3C0]" />
              ) : (
                <ShieldX size={16} className="text-red-400" />
              )}
              <span
                className={`text-xs font-black uppercase tracking-widest ${result.isAuthentic ? 'text-[#2BF3C0]' : 'text-red-400'}`}
              >
                {result.isAuthentic ? 'Authenticated' : 'Threat Detected'}
              </span>
            </div>
          )}
        </div>

        {/* Item name + brand */}
        <div className="text-center" style={fadeUp(reveal, 200)}>
          <h2 className="text-xl font-black text-white">{result.name}</h2>
          <p className="text-sm text-white/40 font-mono mt-1">
            {result.brand} · {result.era}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.bg} ${style.text} ${style.border} border`}
          >
            {result.rarity as string}
          </span>
        </div>

        {/* Confidence ring + value */}
        <div className="flex items-center justify-center gap-8" style={fadeUp(reveal, 400)}>
          <ConfidenceRing confidence={result.confidence} size={90} />
          <div className="text-center">
            <div className="text-2xl font-black text-white">{result.estimatedValue}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">
              Market Value
            </div>
          </div>
        </div>

        {/* Reasoning chain */}
        <div
          className="rounded-2xl bg-white/[0.03] border border-white/5 p-4"
          style={fadeUp(reveal, 600)}
        >
          <ReasoningChain reasoning={result.reasoningChain} />
        </div>

        {/* Red flags */}
        {result.redFlags && result.redFlags.length > 0 && (
          <div
            className="rounded-2xl bg-red-500/5 border border-red-500/10 p-4 space-y-2"
            style={fadeUp(reveal, 800)}
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Red Flags</span>
            </div>
            {result.redFlags.map((flag, i) => (
              <p key={i} className="text-xs text-red-300/60 pl-5">
                • {flag}
              </p>
            ))}
          </div>
        )}

        {/* Material composition bars */}
        {materials.length > 0 && (
          <div
            className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 space-y-3"
            style={fadeUp(reveal, 1000)}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
              Material Composition
            </div>
            {materials.map(([material, pct]) => (
              <div key={material}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{material}</span>
                  <span className="text-white/30 font-mono">{pct}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2BF3C0] rounded-full"
                    style={{
                      width: `${pct}%`,
                      transition: 'width 1.2s ease-out',
                      transitionDelay: '1200ms',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Authentication notes */}
        {result.authenticationNotes && (
          <div
            className="rounded-2xl bg-white/[0.03] border border-white/5 p-4"
            style={fadeUp(reveal, 1200)}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
              Authentication Notes
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{result.authenticationNotes}</p>
          </div>
        )}

        {/* Styling advice */}
        {result.stylingAdvice && (
          <div
            className="rounded-2xl bg-[#9B7BFF]/5 border border-[#9B7BFF]/10 p-4"
            style={fadeUp(reveal, 1400)}
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-[#9B7BFF]/50 mb-2">
              Styling Intelligence
            </div>
            <p className="text-xs text-white/50 leading-relaxed">{result.stylingAdvice}</p>
            {result.pairingSuggestions && result.pairingSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {result.pairingSuggestions.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-full bg-[#9B7BFF]/10 text-[10px] font-black uppercase text-[#9B7BFF]/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2" style={fadeUp(reveal, 1600)}>
          <button
            onClick={handleAudioBriefing}
            disabled={audioPlaying}
            className="hv-btn flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40"
          >
            <Volume2 size={16} className={audioPlaying ? 'animate-pulse' : ''} />
            {audioPlaying ? 'Playing...' : 'Audio Brief'}
          </button>
          <button
            onClick={onReset}
            className="hv-btn flex-1 py-4 rounded-2xl bg-[#2BF3C0] text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95"
          >
            <RotateCcw size={16} />
            Scan Another
          </button>
        </div>
      </div>
    </div>
  );
};
