import React from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import { maskNik, maskPhone } from '../services/storage';

export default function DigitalIdModal({ isOpen, onClose, user }) {
  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Identitas Digital Kependudukan (IKD)"
      subtitle="KTP Digital Resmi Kota Bandar Lampung"
      maxWidth="max-w-md"
      icon="badge"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="primary" size="sm" onClick={onClose}>
            Tutup Identitas
          </Button>
        </div>
      }
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary p-6 text-white shadow-modal overflow-hidden">
        {/* Background Decorative Siger Motif */}
        <div className="absolute right-0 top-0 bottom-0 w-36 opacity-10 pointer-events-none flex items-center justify-center">
          <Icon name="account_balance" size={140} />
        </div>

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-primary font-black flex items-center justify-center text-xs shadow-sm">
              BDL
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-on-primary-container">Republik Indonesia</p>
              <p className="text-xs font-extrabold uppercase">Kota Bandar Lampung</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 rounded-full text-[10px] font-semibold text-tertiary-fixed">
            <Icon name="verified" size={14} />
            <span>IKD AKTIF</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="mt-4 flex gap-4 items-start">
          <div className="w-20 h-24 rounded-xl bg-surface-container-high border-2 border-white/40 flex flex-col items-center justify-center text-primary shrink-0 shadow-inner overflow-hidden">
            <div className="w-full h-full bg-primary/20 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white">{user.avatar || 'AN'}</span>
              <span className="text-[9px] text-white/80 font-mono mt-1">PASFOTO</span>
            </div>
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="text-[10px] text-on-primary-container uppercase tracking-wider">NIK</span>
              <p className="font-mono text-sm font-bold tracking-wider text-white">
                {maskNik(user.nik)}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-on-primary-container uppercase tracking-wider">Nama Lengkap</span>
              <p className="text-xs font-bold truncate text-white">{user.name}</p>
            </div>
            <div>
              <span className="text-[10px] text-on-primary-container uppercase tracking-wider">Kecamatan / Domisili</span>
              <p className="text-[11px] text-white/90 truncate">Kec. Enggal, Kota Bandar Lampung</p>
            </div>
          </div>
        </div>

        {/* Card Footer with QR */}
        <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
          <div className="text-[10px] text-on-primary-container space-y-0.5">
            <p className="font-semibold text-white">Status: Terverifikasi Dukcapil</p>
            <p className="font-mono text-[9px] opacity-75">Hash: 8a91b...bdl2026</p>
          </div>
          <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm">
            <Icon name="qr_code_2" size={36} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-container-low p-3.5 border border-outline-variant/30 text-xs text-on-surface-variant flex items-start gap-2.5">
        <Icon name="lock" size={18} className="text-secondary shrink-0 mt-0.5" />
        <p>
          Data identitas kependudukan ini dilindungi oleh regulasi perlindungan data pribadi UU PDP No. 27/2022 dan SIAK Terpusat Kemendagri.
        </p>
      </div>
    </Modal>
  );
}

