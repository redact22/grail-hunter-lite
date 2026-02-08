import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastOverlay } from '../ToastOverlay';
import { emitToastShow, TOAST_TTL_MS, DEFAULT_TOAST_VARIANT } from '../../eventBus';
import type { ToastVariant } from '../../types';

const VARIANT_CASES: Array<{
  variant: ToastVariant;
  title: string;
  message: string;
}> = [
  { variant: 'success', title: 'Success toast', message: 'Success path' },
  { variant: 'info', title: 'Info toast', message: 'Info path' },
  { variant: 'error', title: 'Error toast', message: 'Error path' },
  { variant: 'achievement', title: 'Achievement toast', message: 'Achievement path' },
];

afterEach(() => {
  vi.useRealTimers();
});

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
  });

  it.each(VARIANT_CASES)(
    'keeps $variant visible until its TTL then auto-dismisses',
    ({ variant, title, message }) => {
      vi.useFakeTimers();
      render(<ToastOverlay />);

      act(() => {
        emitToastShow({ variant, title, message });
      });

      const ttl = TOAST_TTL_MS[variant];
      expect(screen.getByText(title)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(ttl - 1);
      });
      expect(screen.getByText(title)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    }
  );

  it.each(VARIANT_CASES)('supports dismiss-on-click for $variant variant', ({ variant, title, message }) => {
    render(<ToastOverlay />);
    act(() => {
      emitToastShow({ variant, title, message });
    });

    fireEvent.click(screen.getByText(title));
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it('falls back to default variant policy when an unknown variant is provided', () => {
    vi.useFakeTimers();
    render(<ToastOverlay />);

    const title = 'Unknown variant';
    const message = 'Uses fallback behavior';

    act(() => {
      emitToastShow({ variant: 'mystery' as ToastVariant, title, message });
    });

    const toastTitle = screen.getByText(title);
    const toastContainer = toastTitle.closest('div')?.parentElement;
    expect(toastContainer).toHaveClass('bg-white/10');

    act(() => {
      vi.advanceTimersByTime(TOAST_TTL_MS[DEFAULT_TOAST_VARIANT] - 1);
    });
    expect(screen.getByText(title)).toBeInTheDocument();

    fireEvent.click(screen.getByText(title));
    expect(screen.queryByText(title)).not.toBeInTheDocument();
  });

  it('keeps only the latest four toasts visible for clean stacking', () => {
    render(<ToastOverlay />);

    act(() => {
      for (let idx = 1; idx <= 5; idx += 1) {
        emitToastShow({
          variant: 'info',
          title: `Toast ${idx}`,
          message: `Message ${idx}`,
          ttl: 10_000,
        });
      }
    });

    expect(screen.queryByText('Toast 1')).not.toBeInTheDocument();
    expect(screen.getByText('Toast 2')).toBeInTheDocument();
    expect(screen.getByText('Toast 5')).toBeInTheDocument();
  });
});
