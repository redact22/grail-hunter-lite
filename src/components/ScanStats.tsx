import React from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import type { IdentificationResult } from '../types';

interface ScanStatsProps {
  history: IdentificationResult[];
}

export const ScanStats: React.FC<ScanStatsProps> = ({ history }) => {
  if (history.length === 0) return null;

  const authenticated = history.filter((s) => s.isAuthentic).length;
  const flagged = history.length - authenticated;
  const avgConfidence = Math.round(
    (history.reduce((sum, s) => sum + s.confidence, 0) / history.length) * 100
  );
  const grails = history.filter((s) => s.rarity === 'Grail').length;

  const stats = [
    { icon: ShieldCheck, label: 'Auth', value: authenticated, color: '#2BF3C0' },
    { icon: AlertTriangle, label: 'Flag', value: flagged, color: '#FF4444' },
    { icon: TrendingUp, label: 'Avg %', value: `${avgConfidence}`, color: '#9B7BFF' },
    { icon: Target, label: 'Grails', value: grails, color: '#FFB020' },
  ];

  return (
    <div className="max-w-lg mx-auto grid grid-cols-4 gap-2 mb-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="flex flex-col items-center gap-1 py-3 rounded-2xl bg-white/[0.02] border border-white/5"
        >
          <s.icon size={14} style={{ color: s.color }} />
          <span className="text-lg font-black font-mono text-white">{s.value}</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-white/25">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};
