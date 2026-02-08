/**
 * GRAIL HUNTER LITE — Event Bus
 */
import type { Toast, ToastVariant } from './types';

type EventHandler<T = unknown> = (data: T) => void;

const listeners = new Map<string, Set<EventHandler>>();

export const eventBus = {
  on<T>(event: string, handler: EventHandler<T>): () => void {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler as EventHandler);
    return () => listeners.get(event)?.delete(handler as EventHandler);
  },
  emit<T>(event: string, data: T): void {
    listeners.get(event)?.forEach((handler) => handler(data));
  },
};

export const TOAST_SHOW = 'toast:show';
export const TOAST_HIDE = 'toast:hide';

let toastCounter = 0;

export const emitToastShow = (options: {
  variant: ToastVariant;
  title: string;
  message: string;
  ttl?: number;
}): void => {
  const toast: Toast = {
    id: `toast-${++toastCounter}`,
    ...options,
    ttl: options.ttl ?? (options.variant === 'achievement' ? 5000 : 3200),
  };
  eventBus.emit(TOAST_SHOW, toast);
};

export const emitAchievement = (itemName: string): void => {
  emitToastShow({
    variant: 'achievement',
    title: 'GRAIL FOUND!',
    message: `Authenticated: ${itemName}`,
    ttl: 5000,
  });
};
