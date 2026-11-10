import React from 'react';

/**
 * Material Symbols Outlined component with fallback support
 * Follows Bandar Layan Design Skill (Section 4)
 */
export default function Icon({ name, className = '', size = 20, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center leading-none ${className}`}
      style={{
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        ...style
      }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
