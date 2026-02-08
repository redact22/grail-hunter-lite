import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DetailModal } from '../DetailModal';
import type { GrailItem, GrailRarity } from '../../types';

vi.mock('../../services/geminiService', () => ({
  generateStylingAdvice: vi.fn().mockResolvedValue({
    advice: 'test',
    pairings: ['pair1'],
    occasions: ['occ1'],
  }),
  generateStylingAudio: vi.fn(),
  generateProductReel: vi.fn(),
}));

const mockItem: GrailItem = {
  id: 'modal-1',
  name: 'Test Caftan',
  brand: 'TestBrand',
  category: 'Vintage',
  estimatedValue: 2000,
  rarity: 'Grail' as unknown as GrailRarity,
  imageUrl: 'https://example.com/img.jpg',
  description: 'A vintage piece',
  curatorNote: 'Museum quality',
};

describe('DetailModal', () => {
  it('renders nothing when item is null', () => {
    const { container } = render(<DetailModal item={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows item name and brand', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />);
    expect(screen.getByText('Test Caftan')).toBeInTheDocument();
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
  });

  it('shows curator note', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />);
    expect(screen.getByText(/"Museum quality"/)).toBeInTheDocument();
  });

  it('shows condition slider', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />);
    expect(screen.getByText('Condition_Modifier')).toBeInTheDocument();
    const slider = document.querySelector('input[type="range"]');
    expect(slider).toBeTruthy();
  });

  it('shows price chart', () => {
    render(<DetailModal item={mockItem} onClose={vi.fn()} />);
    expect(screen.getByText('Value_By_Condition')).toBeInTheDocument();
  });
});
