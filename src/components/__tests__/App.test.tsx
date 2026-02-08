/* eslint-disable no-restricted-syntax */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../../App';

// Mock geminiService
vi.mock('../../services/geminiService', () => ({
  isConfigured: () => false,
  identifyGrail: vi.fn(),
  generateStylingAdvice: vi.fn().mockResolvedValue({
    advice: 'test',
    pairings: ['a'],
    occasions: ['b'],
  }),
  generateStylingAudio: vi.fn(),
  generateProductReel: vi.fn(),
  askAssistant: vi.fn().mockResolvedValue({ text: 'hello', links: [] }),
  findNearbyDrops: vi.fn().mockResolvedValue([]),
}));

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn((success: (pos: GeolocationPosition) => void) => {
      success({ coords: { latitude: 37.77, longitude: -122.41 } } as GeolocationPosition);
    }),
  },
  writable: true,
});

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
    // Ensure splash is skipped for tab tests
    localStorage.setItem('grail-hunter-splash-seen', '1');
  });

  it('renders header with Grail Hunter title', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Grail Hunter' })).toBeInTheDocument();
  });

  it('shows Simulation mode when not configured', () => {
    render(<App />);
    expect(screen.getByText('Simulation')).toBeInTheDocument();
  });

  it('renders all 4 tab labels', () => {
    render(<App />);
    expect(screen.getByText('Scan')).toBeInTheDocument();
    expect(screen.getByText('Market')).toBeInTheDocument();
    expect(screen.getByText('Intel')).toBeInTheDocument();
    expect(screen.getByText('Map')).toBeInTheDocument();
  });

  it('switches to Market tab and shows items', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Market'));
    expect(screen.getByText('Halston Caftan')).toBeInTheDocument();
  });

  it('shows scan count', () => {
    render(<App />);
    expect(screen.getByText('0 scans')).toBeInTheDocument();
  });
});
