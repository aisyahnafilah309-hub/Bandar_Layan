import React from 'react';
import Icon from './Icon';

/**
 * Stepper component adhering to Bandar Layan Design Skill (Section 6.4 & 7)
 */
export default function Stepper({ steps, currentStepIndex }) {
  return (
    <div className="w-full py-4">
      {/* Horizontal for md+ screens */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-surface-container-highest z-0 mx-8" />
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const isPending = idx > currentStepIndex;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center max-w-[140px]">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : isActive
                    ? 'bg-secondary text-white ring-4 ring-secondary/20'
                    : 'bg-surface-container text-outline border border-outline-variant/40'
                }`}
              >
                {isDone ? (
                  <Icon name="check" size={20} />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <p
                className={`text-xs mt-2 font-semibold ${
                  isActive
                    ? 'text-secondary'
                    : isDone
                    ? 'text-emerald-800'
                    : 'text-outline'
                }`}
              >
                {step.label}
              </p>
              {step.date && (
                <span className="text-[10px] text-outline mt-0.5">{step.date}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Vertical / Compact for mobile screens */}
      <div className="md:hidden space-y-3">
        {steps.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;

          return (
            <div key={idx} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isActive
                    ? 'bg-secondary text-white ring-2 ring-secondary/30'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {isDone ? <Icon name="check" size={16} /> : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-medium truncate ${
                    isActive ? 'text-secondary font-bold' : isDone ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {step.label}
                </p>
                {step.date && <p className="text-[10px] text-outline">{step.date}</p>}
              </div>
              {isActive && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-semibold shrink-0">
                  Tahap Aktif
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
