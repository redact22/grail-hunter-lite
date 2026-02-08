import React, { useState, useCallback, useEffect, useRef } from 'react';
import { safeLocalStorage } from './lib/safe-storage';
import { Zap, Scan, Store, MessageCircle, MapPin } from 'lucide-react';
import { isConfigured } from './services/geminiService';
import { SAMPLE_ITEMS } from './constants';
import { ToastOverlay } from './components/ToastOverlay';
import { ListingCard } from './components/ListingCard';
import { DetailModal } from './components/DetailModal';
import { Scanner } from './components/Scanner';
import { AssistantChat } from './components/AssistantChat';
import { NearbyStores } from './components/NearbyStores';
import { CinematicSplash } from './components/CinematicSplash';
import { MarketTicker } from './components/MarketTicker';
import { ScanHistory } from './components/ScanHistory';
import { RNLookupCard } from './components/RNLookupCard';
import { BadgeUnlock } from './components/BadgeUnlock';
import { BadgeGallery } from './components/BadgeGallery';
import { InstallBanner } from './components/InstallBanner';
import { ScanStats } from './components/ScanStats';
import { useScanHistory } from './hooks/useScanHistory';
import { useFavorites } from './hooks/useFavorites';
import { useBadges } from './hooks/useBadges';
import type { GrailItem, IdentificationResult } from './types';

const SPLASH_KEY = 'grail-hunter-splash-seen';

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !safeLocalStorage.getItem(SPLASH_KEY);
  });
  const [activeTab, setActiveTab] = useState<'scan' | 'market' | 'intel' | 'map'>('scan');
  const [selectedItem, setSelectedItem] = useState<GrailItem | null>(null);
  const { history, addScan, clearHistory } = useScanHistory();
  const { toggle: toggleFavorite, isFavorite } = useFavorites();
  const { lastUnlocked, isUnlocked, checkAfterScan, checkTabVisits, dismissCelebration } =
    useBadges();
  const visitedTabsRef = useRef(new Set<string>(['scan']));

  // Track tab visits for Void Walker badge
  useEffect(() => {
    visitedTabsRef.current.add(activeTab);
    checkTabVisits(visitedTabsRef.current);
  }, [activeTab, checkTabVisits]);

  // Keyboard shortcuts: 1-4 for tabs
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const tabMap: Record<string, typeof activeTab> = { '1': 'scan', '2': 'market', '3': 'intel', '4': 'map' };
      const tab = tabMap[e.key];
      if (tab) setActiveTab(tab);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleEnterVault = useCallback(() => {
    safeLocalStorage.setItem(SPLASH_KEY, '1');
    setShowSplash(false);
  }, []);

  const handleScanResult = useCallback(
    (result: IdentificationResult) => {
      addScan(result);
      checkAfterScan(result, history.length + 1);
    },
    [addScan, checkAfterScan, history.length]
  );

  const tabs = [
    { id: 'scan' as const, icon: Scan, label: 'Scan', key: '1' },
    { id: 'market' as const, icon: Store, label: 'Market', key: '2' },
    { id: 'intel' as const, icon: MessageCircle, label: 'Intel', key: '3' },
    { id: 'map' as const, icon: MapPin, label: 'Map', key: '4' },
  ];

  if (showSplash) {
    return <CinematicSplash onEnter={handleEnterVault} />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white pb-24">
      <ToastOverlay />
      <InstallBanner />

      {/* Badge unlock celebration */}
      {lastUnlocked && <BadgeUnlock badge={lastUnlocked} onDismiss={dismissCelebration} />}

      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2BF3C0]/10 border border-[#2BF3C0]/20 flex items-center justify-center text-[#2BF3C0]">
              <Zap size={20} />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider">Grail Hunter</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                  {isConfigured() ? 'Live' : 'Simulation'}
                </span>
                <div
                  className={`w-1.5 h-1.5 rounded-full ${isConfigured() ? 'bg-[#2BF3C0]' : 'bg-[#FFB020]'} animate-pulse`}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-[10px] font-mono text-white/40">{history.length} scans</div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <div className="w-1 h-1 rounded-full bg-[#4285F4]" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30">
                5 Gemini APIs
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Market Ticker — shows above Market tab */}
      {activeTab === 'market' && <MarketTicker />}

      {/* Content */}
      <main className="px-6 py-8">
        {activeTab === 'scan' && (
          <>
            <ScanStats history={history} />
            <Scanner onResult={handleScanResult} />
            <RNLookupCard />
            <BadgeGallery isUnlocked={isUnlocked} />
            <ScanHistory history={history} onClear={clearHistory} />
          </>
        )}
        {activeTab === 'market' && (
          <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
            {SAMPLE_ITEMS.map((item) => (
              <ListingCard
                key={item.id}
                item={item}
                onSelect={setSelectedItem}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
        {activeTab === 'intel' && <AssistantChat />}
        {activeTab === 'map' && <NearbyStores />}
      </main>

      {/* Tab Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0F]/90 backdrop-blur-xl border-t border-white/5"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
      >
        <div className="max-w-lg mx-auto flex relative">
          {/* Sliding indicator */}
          <div
            className="absolute top-0 h-0.5 rounded-full bg-[#2BF3C0] shadow-[0_0_8px_rgba(43,243,192,0.6)] transition-all duration-300 ease-out"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${tabs.findIndex((t) => t.id === activeTab) * 100}%)`,
            }}
          >
            <div className="w-8 h-full bg-[#2BF3C0] rounded-full mx-auto" />
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`hv-btn flex-1 py-4 flex flex-col items-center gap-1 transition-colors duration-200 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2BF3C0] focus-visible:outline-offset-[-2px] ${activeTab === tab.id ? 'text-[#2BF3C0]' : 'text-white/30'}`}
            >
              <tab.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              <span className="hidden sm:block text-[8px] font-mono text-white/15">{tab.key}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Detail Modal */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  );
};
