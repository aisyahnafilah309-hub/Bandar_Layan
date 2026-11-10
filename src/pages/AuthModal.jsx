import React, { useState } from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import { authService } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('aisyah.nafilah@warga.bandarlampung.go.id');
  const [password, setPassword] = useState('warga123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useToast();

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Harap isi alamat email dan kata sandi.');
      return;
    }

    try {
      setLoading(true);
      const user = await authService.login(email, password);
      showToast(`Selamat datang kembali, ${user.name}!`, 'success');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Gagal melakukan login.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRole = async (roleName, demoEmail, demoPass) => {
    setErrorMsg('');
    setEmail(demoEmail);
    setPassword(demoPass);
    try {
      setLoading(true);
      const user = await authService.login(demoEmail, demoPass);
      showToast(`Login sebagai ${roleName}: ${user.name}`, 'success');
      onLoginSuccess(user);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Masuk ke Portal BANDAR LAYAN"
      subtitle="Sistem Otentikasi Terpadu Pemerintah Kota Bandar Lampung"
      maxWidth="max-w-md"
      icon="lock"
    >
      <div className="space-y-5">
        {/* Quick Demo Switcher */}
        <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
              <Icon name="bolt" size={16} className="text-secondary" />
              <span>Akses Cepat Pengujian (Role Demo)</span>
            </span>
            <span className="text-[10px] text-outline">1-Klik Masuk</span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickRole('Warga', 'aisyah.nafilah@warga.bandarlampung.go.id', 'warga123')}
              className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-left transition-all hover:border-secondary shadow-subtle group"
            >
              <div className="w-6 h-6 rounded-md bg-secondary/10 text-secondary flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Icon name="person" size={16} />
              </div>
              <p className="text-xs font-bold text-primary truncate">Warga</p>
              <p className="text-[10px] text-outline truncate">Aisyah N.</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('Petugas', 'hendra.petugas@bandarlampung.go.id', 'petugas123')}
              className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-left transition-all hover:border-secondary shadow-subtle group"
            >
              <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Icon name="badge" size={16} />
              </div>
              <p className="text-xs font-bold text-primary truncate">Petugas</p>
              <p className="text-[10px] text-outline truncate">Hendra P.</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('Admin', 'admin@bandarlampung.go.id', 'admin123')}
              className="p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-left transition-all hover:border-secondary shadow-subtle group"
            >
              <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                <Icon name="shield" size={16} />
              </div>
              <p className="text-xs font-bold text-primary truncate">Admin</p>
              <p className="text-[10px] text-outline truncate">Ir. Bambang</p>
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-outline-variant/40"></div>
          <span className="flex-shrink mx-3 text-[11px] text-outline font-medium">atau masuk dengan akun</span>
          <div className="flex-grow border-t border-outline-variant/40"></div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-error-container/60 border border-error/20 text-error text-xs flex items-center gap-2">
            <Icon name="error" size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary block">
              Alamat Email / NIK Terdaftar
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="mail" size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-primary">Kata Sandi</label>
              <span className="text-[11px] text-secondary hover:underline cursor-pointer">
                Lupa sandi?
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                <Icon name="key" size={18} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white focus:outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
            icon="login"
          >
            Masuk Sekarang
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-outline">
            Belum memiliki akun warga?{' '}
            <span
              onClick={() => {
                handleQuickRole('Warga', 'aisyah.nafilah@warga.bandarlampung.go.id', 'warga123');
              }}
              className="text-secondary font-semibold hover:underline cursor-pointer"
            >
              Gunakan Akun Tamu Demo
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
}

