import React from 'react';
import { Award, Lock } from 'lucide-react';
import { BADGES } from '../data/badges';

interface BadgeGalleryProps {
  isUnlocked: (id: string) => boolean;
}

export const BadgeGallery: React.FC<BadgeGalleryProps> = ({ isUnlocked }) => {
  const earned = BADGES.filter((b) => isUnlocked(b.id)).length;

  return (
    <div className="max-w-lg mx-auto mt-6" data-testid="badge-gallery">
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
          Badges
        </span>
        <span className="text-[10px] font-mono text-white/20">
          {earned}/{BADGES.length}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {BADGES.map((badge) => {
          const unlocked = isUnlocked(badge.id);
          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${unlocked ? 'bg-[#FFB020]/5 border-[#FFB020]/20' : 'bg-white/[0.02] border-white/5 opacity-40'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${unlocked ? 'bg-[#FFB020]/20 text-[#FFB020]' : 'bg-white/5 text-white/20'}`}
              >
                {unlocked ? <Award size={20} /> : <Lock size={14} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-center text-white/60">
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
