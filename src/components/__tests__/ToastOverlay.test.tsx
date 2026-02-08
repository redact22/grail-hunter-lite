import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastOverlay } from '../ToastOverlay';
import { emitToastShow } from '../../eventBus';

describe('ToastOverlay', () => {
  it('renders nothing with no toasts', () => {
    const { container } = render(<ToastOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it('shows toast on event', () => {
    vi.useFakeTimers();
    render(<ToastOverlay />);
    act(() => {
      emitToastShow({ variant: 'success', title: 'Test Title', message: 'Test message' });
    });
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('auto-dismisses after ttl', () => {
    vi.useFakeTimers();
    render(<ToastOverlay />);
    act(() => {
      emitToastShow({ variant: 'info', title: 'Dismiss Me', message: 'Going away', ttl: 1000 });
    });
    expect(screen.getByText('Dismiss Me')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(screen.queryByText('Dismiss Me')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
