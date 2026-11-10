import React, { useState } from 'react';
import Icon from '../common/Icon';
import Button from '../common/Button';
import { maskNik } from '../../services/storage';

export default function Header({
  currentUser,
  activeRoute,
  onRouteChange,
  onOpenAuth,
  onOpenDigitalId,
  onSwitchRole
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems = [
    { id: 'portal', label: 'Portal Layanan', icon: 'home', roles: ['masyarakat', 'petugas', 'administrator'] },
    { id: 'tracking', label: 'Lacak Dokumen', icon: 'timeline', roles: ['masyarakat', 'petugas', 'administrator'] },
    { id: 'complaints', label: 'Pengaduan Warga', icon: 'campaign', roles: ['masyarakat', 'petugas', 'administrator'] },
    { id: 'officer', label: 'Ruang Petugas', icon: 'fact_check', roles: ['petugas', 'administrator'] },
    { id: 'admin', label: 'Administrator', icon: 'admin_panel_settings', roles: ['administrator'] }
  ];

  const handleNavClick = (id) => {
    onRouteChange(id);
    setMobileMenuOpen(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'administrator':
        return { label: 'Admin Smart City', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'petugas':
        return { label: 'Petugas Pelayanan', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'masyarakat':
      default:
        return { label: 'Warga Terverifikasi', bg: 'bg-blue-100 text-secondary border-blue-200' };
    }
  };

  const currentRoleConfig = getRoleBadge(currentUser?.role);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 z-40 transition-all duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand & City Seal */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => handleNavClick('portal')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-tertiary-fixed shadow-sm group-hover:bg-primary-container transition-colors">
              <span className="font-extrabold text-sm tracking-tight">BL</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-primary">BANDAR LAYAN</span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface-container text-secondary">
                  KOTA BANDAR LAMPUNG
                </span>
              </div>
              <p className="text-[10px] text-outline tracking-tight leading-none hidden sm:block">
                Smart Public Service System
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const hasAccess = item.roles.includes(currentUser?.role || 'masyarakat');
            const isActive = activeRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-secondary bg-surface-container font-bold shadow-subtle'
                    : hasAccess
                    ? 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                    : 'text-outline/40 cursor-not-allowed hover:bg-transparent'
                }`}
                title={!hasAccess ? `Fitur khusus ${item.roles.join('/')}` : ''}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  className={isActive ? 'text-secondary' : 'text-outline'}
                />
                <span>{item.label}</span>
                {!hasAccess && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-surface-container-high text-outline">
                    Lock
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Role Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${currentRoleConfig.bg} shadow-subtle hover:opacity-90`}
              title="Ganti Mode Peran Pengguna untuk Pengujian"
            >
              <Icon name="swap_horiz" size={16} />
              <span className="hidden sm:inline">{currentRoleConfig.label}</span>
              <Icon name="arrow_drop_down" size={16} />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-modal border border-outline-variant/40 p-2 z-50 text-xs animate-scaleUp"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 border-b border-outline-variant/30 text-[10px] font-bold uppercase text-outline">
                  Pilih Peran Pengujian (RBAC)
                </div>
                <button
                  onClick={() => onSwitchRole('masyarakat')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors ${
                    currentUser?.role === 'masyarakat' ? 'bg-surface-container-low font-bold text-secondary' : 'text-on-surface'
                  }`}
                >
                  <Icon name="person" size={16} className="text-secondary" />
                  <div>
                    <p className="leading-tight">Warga / Pemohon</p>
                    <p className="text-[10px] text-outline font-normal">Aisyah Nafilah</p>
                  </div>
                </button>

                <button
                  onClick={() => onSwitchRole('petugas')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors ${
                    currentUser?.role === 'petugas' ? 'bg-surface-container-low font-bold text-secondary' : 'text-on-surface'
                  }`}
                >
                  <Icon name="badge" size={16} className="text-amber-700" />
                  <div>
                    <p className="leading-tight">Petugas Verifikator</p>
                    <p className="text-[10px] text-outline font-normal">Hendra Pratama, S.STP</p>
                  </div>
                </button>

                <button
                  onClick={() => onSwitchRole('administrator')}
                  className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 hover:bg-surface-container transition-colors ${
                    currentUser?.role === 'administrator' ? 'bg-surface-container-low font-bold text-secondary' : 'text-on-surface'
                  }`}
                >
                  <Icon name="shield" size={16} className="text-emerald-700" />
                  <div>
                    <p className="leading-tight">Administrator Sistem</p>
                    <p className="text-[10px] text-outline font-normal">Ir. Bambang Wicaksono</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Citizen Digital ID quick view button */}
          {currentUser?.role === 'masyarakat' && (
            <button
              onClick={onOpenDigitalId}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold transition-colors"
              title="Lihat KTP Digital (IKD)"
            >
              <Icon name="badge" size={18} className="text-secondary" />
              <span>KTP Digital</span>
            </button>
          )}

          {/* User Profile Avatar / Logout */}
          <div
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="Klik untuk Masuk / Ganti Akun"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center font-bold text-xs ring-2 ring-outline-variant/40 group-hover:ring-secondary transition-all">
              {currentUser?.avatar || 'US'}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-primary hover:bg-surface-container rounded-lg transition-colors"
            aria-label="Menu navigasi"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white/98 border-b border-outline-variant/30 p-4 shadow-modal z-40 animate-slideDown max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const hasAccess = item.roles.includes(currentUser?.role || 'masyarakat');
              const isActive = activeRoute === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  disabled={!hasAccess}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-secondary text-white font-bold'
                      : hasAccess
                      ? 'text-primary hover:bg-surface-container-low'
                      : 'text-outline/40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={item.icon} size={20} className={isActive ? 'text-white' : 'text-outline'} />
                    <span>{item.label}</span>
                  </div>
                  {!hasAccess && (
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-container text-outline">
                      Terkunci
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
            {currentUser?.role === 'masyarakat' && (
              <Button
                variant="outline"
                size="sm"
                icon="badge"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDigitalId();
                }}
                className="w-full justify-start"
              >
                Lihat KTP Digital (IKD)
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              icon="swap_horiz"
              onClick={() => {
                setMobileMenuOpen(false);
                setRoleDropdownOpen(true);
              }}
              className="w-full justify-start"
            >
              Ganti Peran ({currentRoleConfig.label})
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

