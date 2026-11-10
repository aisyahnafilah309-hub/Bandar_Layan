import React, { useState, createContext, useContext, useCallback } from 'react';
import Icon from './Icon';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-card border backdrop-blur-md transition-all duration-300 animate-slideUp ${
              toast.type === 'success'
                ? 'bg-white/95 text-emerald-950 border-emerald-200'
                : toast.type === 'error'
                ? 'bg-white/95 text-red-950 border-error/30'
                : 'bg-white/95 text-primary border-outline-variant/40'
            }`}
            role="alert"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                toast.type === 'success'
                  ? 'bg-emerald-100 text-emerald-700'
                  : toast.type === 'error'
                  ? 'bg-error-container text-error'
                  : 'bg-surface-container text-secondary'
              }`}
            >
              <Icon
                name={
                  toast.type === 'success'
                    ? 'verified'
                    : toast.type === 'error'
                    ? 'report_problem'
                    : 'notifications_active'
                }
                size={18}
              />
            </div>
            <div className="flex-1 text-sm font-medium leading-snug pt-0.5">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-outline hover:text-on-surface rounded-md transition-colors"
              aria-label="Tutup notifikasi"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: (msg) => console.log(msg) };
  }
  return context;
}
