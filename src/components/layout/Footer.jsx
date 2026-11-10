import React from 'react';
import Icon from '../common/Icon';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-16 text-xs text-on-surface-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Upper Footer: Brand & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-tertiary-fixed font-black text-xs shadow-sm">
                BL
              </div>
              <span className="font-black text-base text-primary tracking-tight">BANDAR LAYAN</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed max-w-md">
              Platform Pelayanan Publik Digital Terpadu Pemerintah Kota Bandar Lampung. Memudahkan masyarakat mengakses perizinan, administrasi kependudukan, bantuan sosial, dan pelacakan status dokumen secara transparan, terintegrasi, dan tepercaya.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                <Icon name="verified" size={14} className="text-emerald-600" />
                <span>Mal Pelayanan Publik (MPP) Kota Bandar Lampung</span>
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-xs uppercase text-primary tracking-wider">
              Layanan Terpadu
            </h5>
            <ul className="space-y-1.5 text-xs text-outline">
              <li className="hover:text-secondary transition-colors cursor-pointer">Administrasi Kependudukan (Disdukcapil)</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Perizinan Usaha Mikro & Berusaha (DPMPTSP)</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Bantuan Sosial & DTKS (Dinas Sosial)</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Jaminan Kesehatan Jamkesda (Dinkes)</li>
              <li className="hover:text-secondary transition-colors cursor-pointer">Pajak Bumi & Bangunan (Bapenda)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h5 className="font-bold text-xs uppercase text-primary tracking-wider">
              Kontak Bantuan & Darurat
            </h5>
            <div className="space-y-2 text-xs text-outline">
              <div className="flex items-center gap-2">
                <Icon name="call" size={16} className="text-secondary" />
                <span>Call Center Darurat: <strong>112 (Bebas Pulsa)</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="location_on" size={16} className="text-secondary" />
                <span>Gedung MPP, Jl. Dr. Susilo No. 2, Bandar Lampung</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="mail" size={16} className="text-secondary" />
                <span>layanan@bandarlampung.go.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line: Copyright & Student Academic Disclaimer */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-outline">
          <p>
            © 2026 Pemerintah Kota Bandar Lampung • Portal Pelayanan Publik Digital <strong>BANDAR LAYAN</strong>.
          </p>
          <p className="text-[10px] text-on-surface-variant font-mono">
            Prototipe PPSI • Mahasiswa: <strong>Aisyah Nafilah (NPM: 24311064)</strong> • Universitas Teknokrat Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}

