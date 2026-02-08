import React, { useEffect, useState } from 'react';
import { Award } from 'lucide-react';
import { playBadgeUnlock } from '../lib/sounds';
import type { BadgeDef } from '../data/badges';

interface BadgeUnlockProps {
  badge: BadgeDef;
  onDismiss: () => void;
}

export const BadgeUnlock: React.FC<BadgeUnlockProps> = ({ badge, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    navigator.vibrate?.(300);
    playBadgeUnlock();
    const showRaf = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 600);
    }, 3000);
    return () => {
      cancelAnimationFrame(showRaf);
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
      data-testid="badge-unlock"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative text-center z-10"
        style={{
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="w-24 h-24 rounded-full bg-[#FFB020]/20 border-2 border-[#FFB020] flex items-center justify-center mx-auto mb-4 shadow-[0_0_60px_rgba(255,176,32,0.4)]">
          <Award size={48} className="text-[#FFB020]" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FFB020]/60 mb-2">
          Badge Unlocked
        </div>
        <div className="text-2xl font-black text-white mb-1">{badge.name}</div>
        <div className="text-xs text-white/40">{badge.description}</div>
      </div>
    </div>
  );
};
