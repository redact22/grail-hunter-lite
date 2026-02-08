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
        <MapPin size={20} className="text-[#2BF3C0]" />
        <h2 className="text-lg font-black uppercase tracking-wider text-white">
          Nearby Archive Nodes
        </h2>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-white/10 rounded w-2/3" />
                  <div className="h-2.5 bg-white/5 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
          <p className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-4">
            Scanning local network...
          </p>
        </div>
      ) : (
        stores.map((s) => (
          <a
            key={`${s.name}-${s.address ?? ''}`}
            href={s.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-2"
          >
            <div className="flex items-center gap-3">
              <Store size={18} className="text-[#2BF3C0]" />
              <div>
                <p className="text-sm font-black text-white">{s.name}</p>
                {s.address && <p className="text-[10px] text-white/40">{s.address}</p>}
              </div>
            </div>
          </a>
        ))
      )}
    </div>
  );
};
