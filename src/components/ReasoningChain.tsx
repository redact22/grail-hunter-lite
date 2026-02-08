import React, { useEffect, useState } from 'react';

interface ReasoningChainProps {
  reasoning?: string;
}

function splitIntoPhases(reasoning: string): string[] {
  const phaseMatch = reasoning.split(/(?=Phase\s+\d)/i);
  if (phaseMatch.length > 1) return phaseMatch.map((s) => s.trim()).filter(Boolean);
  const sentences = reasoning.split(/(?<=\.)\s+/).filter(Boolean);
  const chunks: string[] = [];
  for (let i = 0; i < sentences.length; i += 2) {
    chunks.push(sentences.slice(i, i + 2).join(' '));
  }
  return chunks.length > 0 ? chunks : [reasoning];
}

/** Typewriter hook — reveals text character by character */
function useTypewriter(text: string, speed: number, startDelay: number): string {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const delayTimer = setTimeout(() => {
      let idx = 0;
      intervalId = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) clearInterval(intervalId);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(delayTimer);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return displayed;
}

const PhaseRow: React.FC<{ phase: string; index: number }> = ({ phase, index }) => {
  const text = useTypewriter(phase, 12, index * 1200);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReveal(true), index * 1200);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className="flex items-start gap-2 text-[11px] font-mono leading-relaxed"
      style={{
        opacity: reveal ? 1 : 0,
        transform: reveal ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
      }}
    >
      <span className="text-[#2BF3C0]/40 shrink-0 select-none" aria-hidden="true">
        {'>>'}
      </span>
      <span className="text-white/50">
        {text}
        {text.length < phase.length && (
          <span className="inline-block w-[2px] h-[14px] bg-[#2BF3C0]/60 ml-[1px] align-middle animate-pulse" />
        )}
      </span>
    </div>
  );
};

export const ReasoningChain: React.FC<ReasoningChainProps> = ({ reasoning }) => {
  if (!reasoning) return null;
  const phases = splitIntoPhases(reasoning);

  return (
    <div className="space-y-1" data-testid="reasoning-chain">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">
        Forensic Reasoning
      </div>
      {phases.map((phase, i) => (
        <PhaseRow key={i} phase={phase} index={i} />
      ))}
    </div>
  );
};
