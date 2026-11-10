import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Icon from './Icon';
import { maskNik } from '../../services/storage';

/**
 * Official E-Document / Digital Certificate Modal
 * Complies with Bandar Layan Design Skill & PRD FR-09
 */
export default function EDocumentModal({ isOpen, onClose, request }) {
  if (!request) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="E-Dokumen Pelayanan Publik Resmi"
      subtitle={`Dokumen Terverifikasi Secara Digital • ${request.requestNumber}`}
      maxWidth="max-w-2xl"
      icon="verified"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-outline hidden sm:block">
            Tanda tangan elektronik tersertifikasi sistem pelayanan terpadu.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} icon="print">
              Cetak / Simpan PDF
            </Button>
            <Button variant="primary" size="sm" onClick={onClose}>
              Selesai
            </Button>
          </div>
        </div>
      }
    >
      <div className="bg-white border-2 border-primary/20 rounded-xl p-6 sm:p-8 space-y-6 text-on-surface shadow-subtle relative print:border-none print:shadow-none print:p-0">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-8xl font-black text-primary uppercase rotate-[-25deg]">
            BANDAR LAMPUNG
          </span>
        </div>

        {/* Official Header */}
        <div className="border-b-2 border-primary pb-4 text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-tertiary-fixed font-black text-xl shadow-sm">
              BL
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-primary">
                Pemerintah Kota Bandar Lampung
              </h2>
              <h3 className="text-xs sm:text-sm font-semibold uppercase text-secondary">
                {request.opd}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                Mal Pelayanan Publik (MPP) Jl. Dr. Susilo No. 2, Teluk Betung Utara, Kota Bandar Lampung
              </p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-primary uppercase underline underline-offset-4 tracking-wide">
            Surat Keterangan Tanda Bukti Pelayanan
          </h4>
          <p className="text-xs font-mono text-outline">
            Nomor Registrasi: <span className="font-bold text-secondary">{request.requestNumber}</span>
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
          <p>
            Menerangkan bahwa permohonan pelayanan publik digital yang diajukan oleh warga masyarakat di bawah ini telah selesai diproses dan diverifikasi memenuhi seluruh persyaratan hukum dan administratif:
          </p>

          <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 space-y-2 font-mono text-xs">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">Nama Pemohon</span>
              <span className="col-span-2 font-bold text-primary">: {request.applicantName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">NIK (Masking)</span>
              <span className="col-span-2 font-bold text-primary">: {maskNik(request.applicantNik)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">Jenis Layanan</span>
              <span className="col-span-2 font-bold text-primary">: {request.serviceName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">Unit Pelaksana (OPD)</span>
              <span className="col-span-2 text-on-surface">: {request.opd}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">Tanggal Pengajuan</span>
              <span className="col-span-2 text-on-surface">: {new Date(request.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-outline">Tanggal Penerbitan</span>
              <span className="col-span-2 text-emerald-800 font-bold">: {new Date(request.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <p className="text-xs text-on-surface-variant">
            Surat keterangan digital ini diterbitkan secara sah melalui sistem portal <strong>BANDAR LAYAN</strong> sebagai bukti penyelesaian layanan dan dapat dipergunakan sesuai dengan ketentuan perundang-undangan yang berlaku.
          </p>
        </div>

        {/* Verification & Digital Stamp */}
        <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Simulated QR Code for verification */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-surface-container rounded-lg border-2 border-primary/40 p-1.5 flex flex-col items-center justify-center text-center">
              <Icon name="qr_code_2" size={44} className="text-primary" />
              <span className="text-[9px] font-mono font-bold text-primary tracking-tighter">VALID-BDL</span>
            </div>
            <div className="text-[11px] text-outline leading-tight space-y-0.5">
              <p className="font-semibold text-primary">Pindai Kode QR</p>
              <p>Untuk validasi keabsahan surat di portal resmi Kota Bandar Lampung.</p>
              <p className="font-mono text-[10px] text-secondary">https://bandarlayan.lampung.go.id</p>
            </div>
          </div>

          {/* Official Seal / Signature */}
          <div className="text-center sm:text-right space-y-1">
            <p className="text-xs text-outline">Bandar Lampung, {new Date(request.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-bold">
              <Icon name="verified" size={16} className="text-emerald-600" />
              <span>TERVERIFIKASI SISTEM ELEKTRONIK</span>
            </div>
            <p className="text-xs font-bold text-primary mt-1">Kepala Dinas Terkait</p>
            <p className="text-[11px] text-outline">Pemerintah Kota Bandar Lampung</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

