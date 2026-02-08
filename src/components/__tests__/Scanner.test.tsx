import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Scanner } from '../Scanner';

vi.mock('../../services/geminiService', () => ({
  identifyGrail: vi.fn(),
}));

describe('Scanner', () => {
  it('renders camera and upload buttons', () => {
    render(<Scanner onResult={vi.fn()} />);
    expect(screen.getByText('Start Live Scan')).toBeInTheDocument();
    expect(screen.getByText('Upload Evidence')).toBeInTheDocument();
  });

  it('shows OR divider', () => {
    render(<Scanner onResult={vi.fn()} />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('has a hidden file input with image accept', () => {
    render(<Scanner onResult={vi.fn()} />);
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeTruthy();
    expect(input?.getAttribute('accept')).toBe('image/*');
  });
});
