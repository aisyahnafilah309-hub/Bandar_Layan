import React from 'react';

/**
 * Status Badge component based on Bandar Layan Design Skill (Section 3.1 & 7)
 * Strictly uses defined status tokens (Emerald, Amber, Blue, Error, Slate)
 */
export default function Badge({ status, label, className = '' }) {
  const getBadgeConfig = () => {
    switch (status) {
      case 'submitted':
        return {
          bg: 'bg-surface-container',
          text: 'text-primary',
          border: 'border-outline-variant/50',
          dot: 'bg-secondary',
          defaultLabel: 'Terkirim'
        };
      case 'under_review':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-900',
          border: 'border-amber-200',
          dot: 'bg-amber-500',
          defaultLabel: 'Menunggu Verifikasi'
        };
      case 'in_process':
      case 'in_progress':
        return {
          bg: 'bg-blue-50',
          text: 'text-secondary',
          border: 'border-blue-200',
          dot: 'bg-secondary',
          defaultLabel: 'Sedang Diproses'
        };
      case 'needs_revision':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-900',
          border: 'border-orange-200',
          dot: 'bg-orange-500',
          defaultLabel: 'Perlu Perbaikan'
        };
      case 'rejected':
        return {
          bg: 'bg-error-container/60',
          text: 'text-error',
          border: 'border-error/20',
          dot: 'bg-error',
          defaultLabel: 'Ditolak'
        };
      case 'completed':
      case 'resolved':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          dot: 'bg-emerald-600',
          defaultLabel: 'Selesai Diterbitkan'
        };
      case 'cancelled':
      case 'closed':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          dot: 'bg-slate-400',
          defaultLabel: 'Dibatalkan'
        };
      default:
        return {
          bg: 'bg-surface-container-low',
          text: 'text-on-surface-variant',
          border: 'border-outline-variant/30',
          dot: 'bg-outline',
          defaultLabel: status || 'Status'
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{label || config.defaultLabel}</span>
    </span>
  );
}
