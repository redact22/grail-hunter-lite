import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NearbyStores } from '../NearbyStores';

vi.mock('../../services/geminiService', () => ({
  findNearbyDrops: vi
    .fn()
    .mockResolvedValue([{ name: 'Test Store', address: '123 Main', uri: '#' }]),
}));

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn((_s: unknown, err: (e: GeolocationPositionError) => void) => {
      err({ code: 1, message: 'denied' } as GeolocationPositionError);
    }),
  },
  writable: true,
  configurable: true,
});

describe('NearbyStores', () => {
  it('shows heading', () => {
    render(<NearbyStores />);
    expect(screen.getByText('Nearby Archive Nodes')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<NearbyStores />);
    expect(screen.getByText('Scanning local network...')).toBeInTheDocument();
  });
});
