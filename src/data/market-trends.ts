/**
 * Market trend ticker data for the MarketTicker component.
 */

export interface TickerItemData {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'steady';
}

export const MARKET_TRENDS: TickerItemData[] = [
  { label: 'AJ1 BRED 85', value: '+18.2%', trend: 'up' },
  { label: 'CARHARTT J97', value: '+42.1%', trend: 'up' },
  { label: 'SUPREME KRM', value: '-3.4%', trend: 'down' },
  { label: 'LEVI 501 BIG E', value: '+12.8%', trend: 'up' },
  { label: 'HALSTON CAFTAN', value: '+28.7%', trend: 'up' },
  { label: 'STONE ISLAND 04', value: 'STEADY', trend: 'steady' },
  { label: 'VNTG ROLEX GMT', value: '+8.4%', trend: 'up' },
  { label: 'HELMUT LANG 98', value: '-1.2%', trend: 'down' },
  { label: 'CELINE SKP', value: '+15.0%', trend: 'up' },
  { label: 'DUNK LOW PANDA', value: '+6.3%', trend: 'up' },
  { label: 'NB 550 GRN', value: '+9.7%', trend: 'up' },
  { label: 'AF1 LOW WHT', value: 'STEADY', trend: 'steady' },
  { label: 'DICKIES 874', value: '+3.1%', trend: 'up' },
  { label: 'RED WING 875', value: '+11.5%', trend: 'up' },
  { label: 'RAF SIMONS 03', value: '+34.6%', trend: 'up' },
  { label: 'MARGIELA TABI', value: '+22.0%', trend: 'up' },
  { label: 'HERMES BIRKIN', value: '+19.4%', trend: 'up' },
  { label: 'CHANEL 2.55', value: '+14.1%', trend: 'up' },
  { label: 'ED HARDY TEE', value: '+26.3%', trend: 'up' },
  { label: 'VON DUTCH CAP', value: '+17.8%', trend: 'up' },
];

function fluctuate(raw: string): string {
  const numeric = parseFloat(raw.replace('%', ''));
  if (Number.isNaN(numeric)) return raw;
  const noise = (Math.random() - 0.5) * 1.0;
  const result = numeric + noise;
  const sign = result >= 0 ? '+' : '';
  return `${sign}${result.toFixed(1)}%`;
}

export function createMarketTickerItems(): TickerItemData[] {
  return MARKET_TRENDS.map((item) => ({
    ...item,
    value: item.trend === 'steady' ? 'STEADY' : fluctuate(item.value),
  }));
}
