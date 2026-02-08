import React, { useState, useEffect } from 'react';
import {
  X,
  Fingerprint,
  Shirt,
  Glasses,
  Target,
  Video,
  Loader2,
  Share2,
  Volume2,
} from 'lucide-react';
import {
  generateStylingAdvice,
  generateStylingAudio,
  generateProductReel,
} from '../services/geminiService';
import { emitToastShow } from '../eventBus';
import { conditionMultiplier, conditionLabel, rarityColors } from '../constants';
import type { GrailItem } from '../types';

export interface DetailModalProps {
  item: GrailItem | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, onClose }) => {
  const [condition, setCondition] = useState(85);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [stylingAdvice, setStylingAdvice] = useState<{
    advice: string;
    pairings: string[];
    occasions: string[];
  } | null>(null);

  useEffect(() => {
    if (item) {
      setVideoUrl(null);
      setCondition(85);
      setStylingAdvice(null);
      let cancelled = false;
      generateStylingAdvice(item)
        .then((data) => {
          if (!cancelled) setStylingAdvice(data);
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }
  }, [item?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Escape to close
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  const adjustedPrice = Math.round(item.estimatedValue * conditionMultiplier(condition));
  const style = rarityColors[item.rarity as string] || rarityColors.Common;

  const handleAudio = async () => {
    setIsPlayingAudio(true);
    try {
      await generateStylingAudio(
        stylingAdvice?.advice ||
          `${item.brand} ${item.name}, ${item.rarity} tier, estimated $${adjustedPrice}.`
      );
    } catch {
      /* audio playback failed — non-critical */
    } finally {
      setIsPlayingAudio(false);
    }
  };

  const handleReel = async () => {
    setIsGeneratingVideo(true);
    emitToastShow({ variant: 'info', title: 'Cinematic Reel', message: 'Generating...', ttl: 1800 });
    try {
      const url = await generateProductReel(item);
      if (url) {
        setVideoUrl(url);
        emitToastShow({ variant: 'success', title: 'Reel Ready', message: 'Generated.', ttl: 2400 });
      } else
        emitToastShow({ variant: 'error', title: 'Unavailable', message: 'Veo not available.' });
    } catch {
      emitToastShow({ variant: 'error', title: 'Failed', message: 'Try again.' });
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleShare = async () => {
    const data = {
      title: `${item.brand} ${item.name}`,
      text: `${item.rarity} find: ${item.brand} ${item.name} — $${adjustedPrice}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* share dismissed */
      }
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(data.text)
        .then(() =>
          emitToastShow({ variant: 'info', title: 'Copied', message: 'Share text copied.', ttl: 1800 })
        )
        .catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl pointer-events-auto"
      />
      <div className="relative w-full max-w-lg bg-[#0A0A0F] border-t sm:border border-white/10 rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col max-h-[95vh]">
        {/* Image */}
        <div className="relative aspect-[16/10]">
          {videoUrl ? (
            <video src={videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
          ) : (
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20"
            aria-hidden="true"
          >
            <Target size={120} className="text-[#2BF3C0] animate-pulse" />
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onClose}
              className="hv-btn p-3 min-w-[48px] min-h-[48px] rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-white active:scale-90 grid place-items-center"
            >
              <X size={22} />
            </button>
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={handleReel}
              disabled={isGeneratingVideo}
              className="hv-btn flex items-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-[#2BF3C0]/20 border border-[#2BF3C0]/40 text-[#2BF3C0] text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-50"
            >
              {isGeneratingVideo ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Video size={14} />
              )}
              Reel
            </button>
          </div>

          <div className="absolute bottom-6 left-8 right-8">
            <span className="text-[11px] font-black uppercase text-[#2BF3C0] tracking-[0.3em]">
              {item.brand}
            </span>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar pb-40">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <Fingerprint size={20} className="text-[#2BF3C0]" />
              <span className="text-xs font-black uppercase text-white">
                Verified_Forensic_Record
              </span>
            </div>
            <span className={`text-xs font-black uppercase italic ${style.text}`}>
              {item.rarity as string}
            </span>
          </div>

          {item.curatorNote && (
            <div className="p-5 rounded-[24px] bg-[#9B7BFF]/5 border border-[#9B7BFF]/20">
              <div className="flex items-center gap-2 mb-2">
                <Glasses size={14} className="text-[#9B7BFF]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Curator_Intel
                </span>
              </div>
              <p className="text-sm text-white/90 italic">"{item.curatorNote}"</p>
            </div>
          )}

          {/* Price + Condition */}
          <div>
            <span className="text-4xl font-black italic text-white font-mono">
              ${adjustedPrice.toLocaleString()}
            </span>
            <div className={`mt-4 p-5 rounded-[24px] bg-white/[0.02] border ${style.border}`}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase text-white/50 tracking-widest">
                  Condition_Modifier
                </span>
                <span className="text-xs font-black text-white font-mono">
                  {conditionLabel(condition)} ({condition}%)
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={condition}
                onChange={(e) => setCondition(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-white/10 cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-[10px] font-black uppercase tracking-wider text-white/20">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
                <span>NWT</span>
              </div>
            </div>
          </div>

          {/* Condition Price Chart */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
              Value_By_Condition
            </div>
            <svg
              viewBox="0 0 280 80"
              className="w-full"
              role="img"
              aria-label="Price by condition chart"
            >
              {[
                { label: 'Poor', mult: 0.4, x: 10 },
                { label: 'Fair', mult: 0.6, x: 66 },
                { label: 'Good', mult: 0.8, x: 122 },
                { label: 'Exc', mult: 1.0, x: 178 },
                { label: 'NWT', mult: 1.25, x: 234 },
              ].map((c) => {
                const barHeight = c.mult * 50;
                const price = Math.round(item.estimatedValue * c.mult);
                const isActive = conditionMultiplier(condition) === c.mult;
                return (
                  <g key={c.label}>
                    <rect
                      x={c.x}
                      y={70 - barHeight}
                      width={36}
                      height={barHeight}
                      rx={4}
                      fill={isActive ? '#2BF3C0' : 'rgba(255,255,255,0.06)'}
                      opacity={isActive ? 1 : 0.5}
                    />
                    <text
                      x={c.x + 18}
                      y={66 - barHeight}
                      textAnchor="middle"
                      fill={isActive ? '#2BF3C0' : 'rgba(255,255,255,0.3)'}
                      fontSize="7"
                      fontWeight="900"
                      fontFamily="monospace"
                    >
                      ${price.toLocaleString()}
                    </text>
                    <text
                      x={c.x + 18}
                      y={78}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.2)"
                      fontSize="6"
                      fontWeight="900"
                    >
                      {c.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Pairings */}
          {stylingAdvice && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shirt size={14} className="text-[#2BF3C0]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  Outfit_Simulation
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar">
                {stylingAdvice.pairings.map((p, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-32 p-4 rounded-[24px] bg-white/[0.02] border border-white/5 text-center"
                  >
                    <span className="text-[9px] font-black uppercase text-white/60">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 pt-16 bg-gradient-to-t from-[#07070A] via-[#07070A] to-transparent z-40"
          style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}
        >
          <div className="flex gap-3">
            <button
              onClick={handleAudio}
              disabled={isPlayingAudio}
              className="hv-btn flex-1 py-4 min-h-[52px] bg-[#2BF3C0]/10 border border-[#2BF3C0]/30 text-[#2BF3C0] font-black uppercase rounded-2xl flex items-center justify-center gap-2 text-[11px] disabled:opacity-50"
            >
              {isPlayingAudio ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Volume2 size={16} />
              )}{' '}
              Briefing
            </button>
            <button
              onClick={handleShare}
              className="hv-btn flex-1 py-4 min-h-[52px] bg-white/5 border border-white/10 text-white font-black uppercase rounded-2xl flex items-center justify-center gap-2 text-[11px]"
            >
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
