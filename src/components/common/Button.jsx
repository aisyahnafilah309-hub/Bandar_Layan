import React from 'react';
import Icon from './Icon';

/**
 * Reusable Button component adhering to Bandar Layan Design Skill (Section 7)
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | destructive | ghost
  size = 'md', // sm | md | lg
  icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-secondary hover:bg-secondary-container active:bg-blue-800 text-white shadow-sm disabled:bg-outline/30 disabled:text-white/60';
      case 'secondary':
        return 'bg-surface-container hover:bg-surface-container-high text-primary active:bg-surface-container-highest disabled:opacity-50';
      case 'outline':
        return 'border border-outline-variant hover:bg-surface-container-low text-on-surface active:bg-surface-container disabled:opacity-40';
      case 'destructive':
        return 'bg-error hover:bg-red-700 active:bg-red-800 text-white shadow-sm disabled:opacity-40';
      case 'ghost':
        return 'bg-transparent hover:bg-surface-container-low text-secondary active:bg-surface-container disabled:opacity-40';
      case 'navy':
        return 'bg-primary hover:bg-primary-container text-white shadow-sm disabled:opacity-50';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-9 px-3 text-xs gap-1.5 rounded-lg';
      case 'lg':
        return 'h-12 px-6 text-base gap-2.5 rounded-xl';
      case 'md':
      default:
        return 'h-11 px-4 text-sm gap-2 rounded-xl min-h-[44px]'; // 44px touch target per design guidelines
    }
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Memproses...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
          {children}
          {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'sm' ? 16 : 20} />}
        </>
      )}
    </button>
  );
}
