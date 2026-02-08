import React, { useState, useEffect, useCallback } from 'react';
import { Heart, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';
import { rarityColors } from '../constants';
import type { GrailItem } from '../types';

/** SVG gradient placeholder when Unsplash images fail to load */
const fallbackImage = (brand: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0A0A0F"/></linearGradient></defs><rect fill="url(#g)" width="400" height="500"/><text x="200" y="240" text-anchor="middle" fill="rgba(43,243,192,0.3)" font-family="monospace" font-size="64" font-weight="900">${brand.charAt(0)}</text><text x="200" y="290" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-family="monospace" font-size="11" font-weight="700">${brand.toUpperCase()}</text></svg>`)}`;

export interface ListingCardProps {
  item: GrailItem;
  onSelect: (item: GrailItem) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  item,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const [localFav, setLocalFav] = useState(false);
  const isFav = isFavorite ?? localFav;
  const [livePrice, setLivePrice] = useState(item.estimatedValue);
  const [initialPrice] = useState(item.estimatedValue);
  const [imgSrc, setImgSrc] = useState(item.imageUrl);
  const handleImgError = useCallback(() => setImgSrc(fallbackImage(item.brand)), [item.brand]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice((prev) => Math.round(prev * (1 + (Math.random() - 0.5) * 0.006)));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const trend = ((livePrice - initialPrice) / initialPrice) * 100;
  const style = rarityColors[item.rarity as string] || rarityColors.Common;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect({ ...item, estimatedValue: livePrice })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect({ ...item, estimatedValue: livePrice });
        }
      }}
      className={`relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/[0.08] cursor-pointer group transition-all duration-300 ${style.glow} hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(43,243,192,0.08)] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2`}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImgError}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-transparent to-transparent opacity-80 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className={`absolute top-3 left-3 px-2 py-1 rounded-lg ${style.bg} ${style.text} text-[8px] font-black uppercase tracking-widest`}
        >
          {item.rarity as string}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) {
              onToggleFavorite(item.id);
            } else {
              setLocalFav(!localFav);
            }
          }}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFav}
          className={`hv-btn absolute top-2 right-2 p-3 min-w-[44px] min-h-[44px] rounded-xl border transition-all active:scale-90 grid place-items-center ${
            isFav
              ? 'bg-[#FF3BD4]/20 border-[#FF3BD4]/40 text-[#FF3BD4]'
              : 'bg-black/40 border-white/10 text-white/60'
          }`}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
        {item.isAuthentic && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-[#2BF3C0]/20 border border-[#2BF3C0]/30">
            <ShieldCheck size={10} className="text-[#2BF3C0]" />
            <span className="text-[8px] font-black text-[#2BF3C0] uppercase">Verified</span>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <p className="text-[9px] font-bold text-[#2BF3C0] uppercase tracking-widest">
          {item.brand}
        </p>
        <h3 className="text-sm font-black text-white uppercase leading-tight line-clamp-2">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-black text-white font-mono">
            ${livePrice.toLocaleString()}
          </span>
          <div
            className={`flex items-center gap-0.5 text-[10px] font-bold font-mono ${Math.abs(trend) < 0.05 ? 'text-[#2BF3C0]/50' : trend >= 0 ? 'text-[#2BF3C0]' : 'text-[#FF3B3B]'}`}
          >
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
