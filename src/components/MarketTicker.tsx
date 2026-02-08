import React, { useState, useEffect } from 'react';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus as MinusIcon,
} from 'lucide-react';
import { createMarketTickerItems, type TickerItemData } from '../data/market-trends';

interface TickerItemProps {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'steady';
}

const TickerItem: React.FC<TickerItemProps> = ({ label, value, trend }) => {
  const color =
    trend === 'up' ? 'text-[#2BF3C0]' : trend === 'down' ? 'text-red-400' : 'text-white/30';
  const Icon = trend === 'up' ? TrendingUpIcon : trend === 'down' ? TrendingDownIcon : MinusIcon;

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.2em] leading-none mb-1">
          Asset_Class
        </span>
        <span className="text-[11px] font-black uppercase text-white tracking-widest leading-none">
          {label}
        </span>
      </div>
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 ${color}`}
      >
        <Icon size={10} aria-hidden="true" />
        <span className="text-[10px] font-black uppercase tracking-widest font-mono">{value}</span>
      </div>
    </div>
  );
};

export const MarketTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItemData[]>(createMarketTickerItems);

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(createMarketTickerItems());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-black/60 border-y border-white/5 overflow-hidden py-4 flex select-none mb-6 relative"
      role="region"
      aria-label="Market ticker"
    >
      <div
        className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#0A0A0F] to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="flex gap-12 md:gap-20 whitespace-nowrap px-8"
        style={{
          animation: 'ticker-scroll 60s linear infinite',
          willChange: 'transform',
        }}
      >
        {[...Array(2)].map((_, i) => (
          <React.Fragment key={i}>
            {items.map((item) => (
              <TickerItem
                key={`${i}-${item.label}`}
                label={item.label}
                value={item.value}
                trend={item.trend}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
