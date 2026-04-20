import { type PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { subscribeToToast, type ToastEvent, type ToastVariant } from './toastBus';

interface ToastItem extends ToastEvent {
  id: string;
}

const DEFAULT_TOAST_DURATION_MS = 4500;

function getToastVariantStyles(toastVariant: ToastVariant) {
  switch (toastVariant) {
    case 'SUCCESS':
      return {
        iconClassName: 'text-emerald-600 dark:text-emerald-300',
        iconType: Icon.TYPE.CHECK_CIRCLE,
      };
    case 'ERROR':
      return {
        iconClassName: 'text-rose-600 dark:text-rose-300',
        iconType: Icon.TYPE.X_CIRCLE,
      };
    case 'INFO':
    default:
      return {
        iconClassName: 'text-blue-600 dark:text-blue-300',
        iconType: Icon.TYPE.INFO_CIRCLE,
      };
  }
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const dismissTimeoutMapRef = useRef(new Map<string, number>());

  const dismissToast = useCallback((toastID: string) => {
    const dismissTimeout = dismissTimeoutMapRef.current.get(toastID);

    if (dismissTimeout != null) {
      window.clearTimeout(dismissTimeout);
      dismissTimeoutMapRef.current.delete(toastID);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((currentToast) => currentToast.id !== toastID),
    );
  }, []);

  const enqueueToast = useCallback(
    (toastEvent: ToastEvent) => {
      const toastID = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toastDurationMs =
        toastEvent.durationMs == null ? DEFAULT_TOAST_DURATION_MS : toastEvent.durationMs;

      setToasts((currentToasts) => [...currentToasts, { ...toastEvent, id: toastID }]);

      if (toastDurationMs > 0) {
        const dismissTimeout = window.setTimeout(() => {
          dismissToast(toastID);
        }, toastDurationMs);

        dismissTimeoutMapRef.current.set(toastID, dismissTimeout);
      }
    },
    [dismissToast],
  );

  useEffect(() => {
    const dismissTimeoutMap = dismissTimeoutMapRef.current;

    return () => {
      dismissTimeoutMap.forEach((dismissTimeout) => {
        window.clearTimeout(dismissTimeout);
      });

      dismissTimeoutMap.clear();
    };
  }, []);

  useEffect(() => subscribeToToast(enqueueToast), [enqueueToast]);

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => {
          const variantStyles = getToastVariantStyles(toast.variant);
          return (
            <div
              aria-atomic="true"
              className="pointer-events-auto rounded-xl border border-slate-200 bg-white/95 p-3 text-left shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95"
              key={toast.id}
              role={toast.variant === 'ERROR' ? 'alert' : 'status'}
            >
              <div className="flex items-center gap-3">
                <span className={variantStyles.iconClassName}>
                  <Icon size={20} type={variantStyles.iconType} />
                </span>
                <div className="flex-1 text-sm text-slate-800 dark:text-slate-100">
                  <p className="font-medium">{toast.message}</p>
                  {toast.description != null ? (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <button
                  aria-label="Dismiss alert"
                  className="icon-button"
                  onClick={() => dismissToast(toast.id)}
                  type="button"
                >
                  <Icon size={18} type={Icon.TYPE.X} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
