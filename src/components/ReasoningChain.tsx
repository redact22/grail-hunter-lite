import React, { useEffect, useState } from 'react';

interface ReasoningChainProps {
  reasoning?: string;
}

function splitIntoPhases(reasoning: string): string[] {
  // Split on "Phase N:" patterns, or sentence boundaries if no phases found
  const phaseMatch = reasoning.split(/(?=Phase\s+\d)/i);
  if (phaseMatch.length > 1) return phaseMatch.map((s) => s.trim()).filter(Boolean);

  // Fallback: split on periods into chunks of ~2 sentences
  const sentences = reasoning.split(/(?<=\.)\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }
  return chunks.length > 0 ? chunks : [reasoning];
}

export const ReasoningChain: React.FC<ReasoningChainProps> = ({ reasoning }) => {
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setReveal(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!reasoning) return null;

  const phases = splitIntoPhases(reasoning);

  return (
    <div className="space-y-1" data-testid="reasoning-chain">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
        Forensic Reasoning
      </div>
      {phases.map((phase, i) => (
        <div
          key={i}
          className="flex items-start gap-2 text-[11px] font-mono leading-relaxed"
          style={{
            opacity: reveal ? 1 : 0,
            transform: reveal ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            transitionDelay: `${i * 400}ms`,
          }}
        >
          <span className="text-[#2BF3C0]/40 shrink-0 select-none" aria-hidden="true">
            {'>>'}
          </span>
          <span className="text-white/50">{phase}</span>
        </div>
      ))}
    </div>
  );
};
