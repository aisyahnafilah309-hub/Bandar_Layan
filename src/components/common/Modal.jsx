import React, { useEffect } from 'react';
import Icon from './Icon';

/**
 * Accessible Modal Dialog adhering to Bandar Layan Design Skill (Section 7)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer = null,
  maxWidth = 'max-w-lg', // max-w-md | max-w-lg | max-w-2xl | max-w-4xl
  icon = null
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative bg-surface-container-lowest rounded-xl shadow-modal border border-outline-variant/30 w-full ${maxWidth} z-10 overflow-hidden flex flex-col max-h-[90vh] transition-all transform animate-scaleUp`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 flex items-start justify-between bg-surface-container-low/40">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                <Icon name={icon} size={22} />
              </div>
            )}
            <div>
              <h3 id="modal-title" className="text-lg font-bold text-primary leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 -mr-1 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
            aria-label="Tutup dialog"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 text-sm text-on-surface">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/20 flex flex-wrap items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
