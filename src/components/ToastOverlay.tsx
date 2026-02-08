import React, { useState, useEffect } from 'react';
import { eventBus, TOAST_SHOW, TOAST_HIDE } from '../eventBus';
import type { Toast } from '../types';

export const ToastOverlay: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const unsub1 = eventBus.on<Toast>(TOAST_SHOW, (toast) => {
      setToasts((prev) => [...prev.slice(-2), toast]);
      const timer = setTimeout(() => {
        timers.delete(timer);
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.ttl ?? 4000);
      timers.add(timer);
    });
    const unsub2 = eventBus.on<string>(TOAST_HIDE, (id) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    });
    return () => {
      unsub1();
      unsub2();
      timers.forEach(clearTimeout);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-3 sm:right-4 z-[100] flex flex-col gap-2 w-[min(calc(100vw-1.5rem),22rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
          className={`px-4 py-3 rounded-2xl border backdrop-blur-xl text-sm font-bold animate-[slideIn_0.3s_ease-out] cursor-pointer ${
            t.variant === 'error'
              ? 'bg-red-500/20 border-red-500/40 text-red-300'
              : t.variant === 'achievement'
                ? 'bg-[#FFB020]/20 border-[#FFB020]/40 text-[#FFB020]'
                : t.variant === 'success'
                  ? 'bg-[#2BF3C0]/20 border-[#2BF3C0]/40 text-[#2BF3C0]'
                  : 'bg-white/10 border-white/20 text-white'
          }`}
        >
          <div className="font-black text-[10px] uppercase tracking-widest mb-0.5">{t.title}</div>
          <div className="text-xs opacity-80">{t.message}</div>
        </div>
      ))}
    </div>
  );
};
