export type ToastVariant = 'SUCCESS' | 'ERROR' | 'INFO';

export interface ToastEvent {
  description?: string;
  durationMs?: number;
  message: string;
  variant: ToastVariant;
}

type ToastListener = (toastEvent: ToastEvent) => void;

const toastListeners = new Set<ToastListener>();

export function subscribeToToast(listener: ToastListener) {
  toastListeners.add(listener);

  return () => {
    toastListeners.delete(listener);
  };
}

function showToast(toastEvent: ToastEvent) {
  toastListeners.forEach((listener) => {
    listener(toastEvent);
  });
}

export function showSuccessToast(message: string, durationMs?: number) {
  showToast({ durationMs, message, variant: 'SUCCESS' });
}

export function showInfoToast(message: string, durationMs?: number) {
  showToast({ durationMs, message, variant: 'INFO' });
}

export function showErrorToast(message: string, error?: unknown, durationMs?: number) {
  const errorDescription =
    error instanceof Error ? error.message : error != null ? String(error) : undefined;

  showToast({
    description: errorDescription,
    durationMs,
    message,
    variant: 'ERROR',
  });
}
