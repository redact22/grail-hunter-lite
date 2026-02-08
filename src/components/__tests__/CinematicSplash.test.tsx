import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CinematicSplash } from '../CinematicSplash';

describe('CinematicSplash', () => {
  it('renders title text', () => {
    render(<CinematicSplash />);
    expect(screen.getByText('GRAIL')).toBeInTheDocument();
    expect(screen.getByText('HUNTER')).toBeInTheDocument();
  });

  it('shows boot lines', () => {
    render(<CinematicSplash />);
    expect(screen.getByText(/INITIALIZING GRAIL_OS/)).toBeInTheDocument();
    expect(screen.getByText(/ALL_SYSTEMS: NOMINAL/)).toBeInTheDocument();
  });

  it('renders enter button', () => {
    render(<CinematicSplash />);
    expect(screen.getByText('Enter The Vault')).toBeInTheDocument();
  });

  it('calls onEnter when button clicked', () => {
    const onEnter = vi.fn();
    render(<CinematicSplash onEnter={onEnter} />);
    fireEvent.click(screen.getByText('Enter The Vault'));
    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('shows subtitle', () => {
    render(<CinematicSplash />);
    expect(screen.getByText('Autonomous Vintage Authentication Agent')).toBeInTheDocument();
  });
});
