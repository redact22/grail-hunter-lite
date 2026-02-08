import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
    else setDismissed(true);
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-[100] max-w-lg mx-auto animate-[slideDown_0.4s_ease-out]">
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#2BF3C0]/10 border border-[#2BF3C0]/20 backdrop-blur-xl">
        <Download size={18} className="text-[#2BF3C0] shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-black text-white">Install Grail Hunter</p>
          <p className="text-[10px] text-white/40">Add to home screen for quick access</p>
        </div>
        <button
          onClick={handleInstall}
          className="hv-btn px-4 py-2 rounded-xl bg-[#2BF3C0] text-black text-[10px] font-black uppercase tracking-widest active:scale-95"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss install banner"
          className="hv-btn p-2 text-white/30 hover:text-white/60"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
