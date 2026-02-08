import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ForensicReportPanel } from '../ForensicReportPanel';
import type { IdentificationResult } from '../../types';

vi.mock('../../services/geminiService', () => ({
  generateStylingAudio: vi.fn().mockResolvedValue('browser-tts'),
}));

const grailResult: IdentificationResult = {
  name: 'Vintage Halston Caftan',
  brand: 'Halston',
  category: 'Vintage',
  rarity: 'Grail',
  era: '1970s',
  confidence: 0.98,
  estimatedValue: '$1,850',
  reasoningChain: 'Phase 1: Hand-rolled edges detected. Phase 2: RN# 42850 verified.',
  redFlags: [],
  authenticationNotes: 'Museum quality piece.',
  isAuthentic: true,
  stylingAdvice: 'Pair with minimal gold accessories.',
  pairingSuggestions: ['Gold Cuff', 'Platform Sandals'],
  occasions: ['Gala'],
  materialComposition: { Silk: 100 },
};

const flaggedResult: IdentificationResult = {
  name: 'Suspicious Nike Dunks',
  brand: 'Nike',
  category: 'Footwear',
  rarity: 'Common',
  era: '2020s',
  confidence: 0.35,
  estimatedValue: '$45',
  isAuthentic: false,
  redFlags: ['Inconsistent stitching', 'Wrong font on tag'],
};

describe('ForensicReportPanel', () => {
  it('renders grail verdict for high-confidence authentic item', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('Grail Found')).toBeInTheDocument();
    expect(screen.getByText('Vintage Halston Caftan')).toBeInTheDocument();
    expect(screen.getByText('$1,850')).toBeInTheDocument();
  });

  it('renders threat detected for flagged items', () => {
    render(<ForensicReportPanel result={flaggedResult} onReset={vi.fn()} />);
    expect(screen.getByText('Threat Detected')).toBeInTheDocument();
    expect(screen.getByText('Suspicious Nike Dunks')).toBeInTheDocument();
  });

  it('shows red flags when present', () => {
    render(<ForensicReportPanel result={flaggedResult} onReset={vi.fn()} />);
    expect(screen.getByText('Red Flags')).toBeInTheDocument();
    expect(screen.getByText(/Inconsistent stitching/)).toBeInTheDocument();
    expect(screen.getByText(/Wrong font on tag/)).toBeInTheDocument();
  });

  it('shows material composition bars', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('Silk')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('shows reasoning chain section', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('Forensic Reasoning')).toBeInTheDocument();
  });

  it('shows styling advice and pairing suggestions', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('Styling Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Gold Cuff')).toBeInTheDocument();
    expect(screen.getByText('Platform Sandals')).toBeInTheDocument();
  });

  it('shows action buttons (audio, share, scan another)', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('Scan Another')).toBeInTheDocument();
    // Audio + Share are icon-only buttons
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('calls onReset when scan another is clicked', async () => {
    const onReset = vi.fn();
    render(<ForensicReportPanel result={grailResult} onReset={onReset} />);
    screen.getByText('Scan Another').click();
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('shows confidence ring with correct percentage', () => {
    render(<ForensicReportPanel result={grailResult} onReset={vi.fn()} />);
    expect(screen.getByText('98')).toBeInTheDocument();
    expect(screen.getByText('confidence')).toBeInTheDocument();
  });
});
