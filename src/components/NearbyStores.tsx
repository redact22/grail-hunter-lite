import React, { useState, useEffect } from 'react';
import { MapPin, Store } from 'lucide-react';
import { findNearbyDrops } from '../services/geminiService';
import type { NearbyStore } from '../types';

export const NearbyStores: React.FC = () => {
  const [stores, setStores] = useState<NearbyStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = () => {
      findNearbyDrops(37.7749, -122.4194)
        .then(setStores)
        .finally(() => setLoading(false));
    };
    if (!navigator.geolocation) {
      fallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await findNearbyDrops(pos.coords.latitude, pos.coords.longitude);
          setStores(data);
        } catch {
          const data = await findNearbyDrops(37.7749, -122.4194);
          setStores(data);
        } finally {
          setLoading(false);
        }
      },
      () => fallback()
    );
  }, []);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <MapPin size={20} className="text-[#2BF3C0]" aria-hidden="true" />
        <h2 className="text-lg font-black uppercase tracking-wider text-white">
          Nearby Archive Nodes
        </h2>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative w-32 h-32 mb-6">
            <div className="radar-ring" />
            <div className="radar-ring" />
            <div className="radar-ring" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin size={24} className="text-[#2BF3C0] animate-pulse" aria-hidden="true" />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Scanning local network...
          </p>
        </div>
      ) : (
        <div className="stagger-children space-y-3">
          {stores.map((s) => (
            <a
              key={`${s.name}-${s.address ?? ''}`}
              href={s.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-[#2BF3C0]/20 hover:shadow-[0_4px_24px_rgba(43,243,192,0.06)] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2BF3C0]/10 border border-[#2BF3C0]/20 flex items-center justify-center">
                  <Store size={16} className="text-[#2BF3C0]" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-white truncate">{s.name}</p>
                  {s.address && <p className="text-[10px] text-white/40 truncate">{s.address}</p>}
                </div>
                <MapPin size={14} className="text-white/15 shrink-0" aria-hidden="true" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
