import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarketTicker } from '../MarketTicker';

describe('MarketTicker', () => {
  it('renders with market ticker role', () => {
    render(<MarketTicker />);
    expect(screen.getByRole('region', { name: 'Market ticker' })).toBeInTheDocument();
  });

  it('shows Asset_Class labels', () => {
    render(<MarketTicker />);
    const labels = screen.getAllByText('Asset_Class');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders ticker items', () => {
    render(<MarketTicker />);
    // Check for known market trend labels (duplicated 2x for infinite scroll)
    const items = screen.getAllByText('AJ1 BRED 85');
    expect(items.length).toBe(2);
  });
});
