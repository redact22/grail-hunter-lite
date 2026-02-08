import React, { useState, useCallback } from 'react';
import { Search, Calendar, Building2, ShieldCheck } from 'lucide-react';
import { parseRNNumber, lookupRN } from '../data/rn-database';
import { analyzeRNDating } from '../data/rn-dating';
import type { RNDatingResult } from '../data/rn-dating';
import type { BrandRNEntry } from '../data/rn-database';

interface LookupState {
  dating: RNDatingResult;
  brandMatch: BrandRNEntry | null;
  rn: number;
}

const confidenceColor: Record<string, string> = {
  high: 'text-[#2BF3C0]',
  medium: 'text-[#FFB020]',
  low: 'text-red-400',
};

export const RNLookupCard: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<LookupState | null>(null);
  const [error, setError] = useState('');

  const handleLookup = useCallback(() => {
    setError('');
    setResult(null);
    const rn = parseRNNumber(input);
    if (!rn) {
      setError('Enter a valid RN number (e.g. 14806)');
      return;
    }
    const dating = analyzeRNDating(rn);
    const brandMatch = lookupRN(rn);
    setResult({ dating, brandMatch, rn });
  }, [input]);

  return (
    <div className="max-w-lg mx-auto mt-6 rounded-2xl bg-white/[0.03] border border-white/5 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={14} className="text-[#FFB020]" />
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
          RN/WPL Dating Engine
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          placeholder="Enter RN # (e.g. 14806)"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/20 font-mono focus:outline-none focus:border-[#2BF3C0]/30"
        />
        <button
          onClick={handleLookup}
          className="hv-btn px-5 py-3 rounded-xl bg-[#2BF3C0] text-black font-black text-xs uppercase tracking-widest active:scale-95"
        >
          <Search size={16} />
        </button>
      </div>

      {error && <p className="text-xs text-red-400/60">{error}</p>}

      {result && (
        <div className="space-y-3 halston-fade-in-up">
          {/* Year result */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-white font-mono">
                {result.dating.isValid ? `~${Math.round(result.dating.calculatedYear)}` : 'Invalid'}
              </div>
              <div className="text-[10px] text-white/30">
                {result.dating.isValid
                  ? `Range: ${result.dating.yearRange.min}-${result.dating.yearRange.max}`
                  : result.dating.error}
              </div>
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${confidenceColor[result.dating.confidence]}`}
            >
              {result.dating.confidence}
            </span>
          </div>

          {/* Brand match */}
          {result.brandMatch && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#2BF3C0]/5 border border-[#2BF3C0]/10">
              <Building2 size={14} className="text-[#2BF3C0]" />
              <div>
                <span className="text-xs font-black text-[#2BF3C0]">{result.brandMatch.brand}</span>
                {result.brandMatch.notes && (
                  <span className="text-[10px] text-white/30 ml-2">{result.brandMatch.notes}</span>
                )}
              </div>
              <ShieldCheck size={14} className="text-[#2BF3C0] ml-auto" />
            </div>
          )}

          {/* Formula */}
          <div className="text-[10px] font-mono text-white/20">
            Formula: ({result.rn} - 13670) / 2635 + 1959 = {result.dating.calculatedYear.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};
