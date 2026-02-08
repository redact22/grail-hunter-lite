import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { rarityColors } from '../constants';
import type { IdentificationResult } from '../types';

interface ScanHistoryProps {
  history: IdentificationResult[];
  onClear: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({ history, onClear }) => {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="max-w-lg mx-auto mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="hv-btn w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-white/60 text-[10px] font-black uppercase tracking-widest"
      >
        <span>Scan History ({history.length})</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 halston-fade-in-up">
          {history.map((scan, i) => {
            const style = rarityColors[scan.rarity as string] || rarityColors.Common;
            return (
              <div
                key={scan.id ?? i}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${scan.isAuthentic ? 'bg-[#2BF3C0]' : 'bg-red-400'}`}
                  />
                  <div>
                    <p className="text-xs font-black text-white">{scan.name}</p>
                    <p className="text-[10px] text-white/30 font-mono">
                      {scan.brand} · {Math.round(scan.confidence * 100)}%
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase ${style.text}`}>
                  {scan.rarity as string}
                </span>
              </div>
            );
          })}
          <button
            onClick={onClear}
            className="hv-btn flex items-center gap-2 px-4 py-2 rounded-xl text-red-400/60 text-[10px] font-black uppercase tracking-widest hover:text-red-400"
          >
            <Trash2 size={12} /> Clear History
          </button>
        </div>
      )}
    </div>
  );
};
