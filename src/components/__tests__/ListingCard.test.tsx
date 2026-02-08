import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ListingCard } from '../ListingCard';
import type { GrailItem, GrailRarity } from '../../types';

const mockItem: GrailItem = {
  id: 'test-1',
  name: 'Test Item',
  brand: 'TestBrand',
  category: 'Vintage',
  estimatedValue: 1000,
  rarity: 'Rare' as unknown as GrailRarity,
  imageUrl: 'https://example.com/img.jpg',
  description: 'A test item',
  isAuthentic: true,
};

describe('ListingCard', () => {
  it('renders item name and brand', () => {
    render(<ListingCard item={mockItem} onSelect={vi.fn()} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('TestBrand')).toBeInTheDocument();
  });

  it('shows rarity badge', () => {
    render(<ListingCard item={mockItem} onSelect={vi.fn()} />);
    expect(screen.getByText('Rare')).toBeInTheDocument();
  });

  it('shows verified badge for authentic items', () => {
    render(<ListingCard item={mockItem} onSelect={vi.fn()} />);
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<ListingCard item={mockItem} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Test Item'));
    expect(onSelect).toHaveBeenCalled();
  });

  it('toggles favorite with external handler', () => {
    const onToggle = vi.fn();
    render(
      <ListingCard
        item={mockItem}
        onSelect={vi.fn()}
        isFavorite={false}
        onToggleFavorite={onToggle}
      />
    );
    const heartBtn = screen.getByRole('button', { name: 'Add to favorites' });
    fireEvent.click(heartBtn);
    expect(onToggle).toHaveBeenCalledWith('test-1');
  });
});
