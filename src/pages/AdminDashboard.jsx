import React, { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { servicesService, requestsService, auditService, INITIAL_USERS } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function AdminDashboard({ currentUser }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | services | users | audit
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [loading, setLoading] = useState(true);

  // New Service Modal
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Kependudukan');
  const [newServiceOpd, setNewServiceOpd] = useState('');
  const [newServiceSla, setNewServiceSla] = useState('2 Hari Kerja');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [submittingService, setSubmittingService] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadAllAdminData();
  }, [currentUser]);

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [srvList, reqList, logs] = await Promise.all([
        servicesService.getAll(),
        requestsService.getAll(currentUser),
        auditService.getAll()
      ]);
      setServices(srvList);
      setRequests(reqList);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleService = async (serviceId) => {
    try {
      const updated = await servicesService.toggleActive(serviceId);
      setServices((prev) => prev.map((s) => (s.id === serviceId ? updated : s)));
      showToast(`Status layanan ${updated.name} diubah.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim() || !newServiceOpd.trim()) {
      showToast('Nama layanan dan OPD wajib diisi.', 'error');
      return;
    }

    try {
      setSubmittingService(true);
      const created = await servicesService.create({
        code: `SRV-${Math.floor(10 + Math.random() * 90)}`,
        name: newServiceName,
        category: newServiceCategory,
        opd: newServiceOpd,
        sla: newServiceSla,
        cost: 'Gratis (Rp 0)',
        icon: 'miscellaneous_services',
        description: newServiceDesc || 'Deskripsi pelayanan administrasi publik Kota Bandar Lampung.',
        requirements: ['KTP Elektronik Asli', 'Surat Permohonan Resmi'],
        formFields: [
          { name: 'keperluan', label: 'Keperluan Pengajuan', type: 'text', required: true, placeholder: 'Alasan permohonan' }
        ]
      });

      setServices((prev) => [created, ...prev]);
      setNewServiceModalOpen(false);
      setNewServiceName('');
      setNewServiceOpd('');
      setNewServiceDesc('');
      showToast(`Layanan baru "${created.name}" berhasil ditambahkan!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingService(false);
    }
  };

  // Metrics
  const totalRequests = requests.length;
  const completedRequests = requests.filter((r) => r.status === 'completed').length;
  const inProgressRequests = requests.filter((r) => r.status === 'in_process' || r.status === 'under_review').length;
  const activeServicesCount = services.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Card */}
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs font-semibold text-tertiary-fixed">
            <Icon name="shield" size={16} />
            <span>Pusat Kendali Administrator Sistem Smart City</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Pengelola BANDAR LAYAN
          </h1>
          <p className="text-xs sm:text-sm text-on-primary-container">
            Pemerintah Kota Bandar Lampung • Monitoring operasional, integritas data, dan katalog master.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon="add"
            onClick={() => setNewServiceModalOpen(true)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            Tambah Layanan Baru
          </Button>
        </div>
      </section>

      {/* 2. Key Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">Total Permohonan</span>
          <p className="text-2xl sm:text-3xl font-black text-primary">{totalRequests}</p>
          <span className="text-[11px] text-secondary font-bold">Terdaftar di Sistem</span>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">Layanan Aktif</span>
          <p className="text-2xl sm:text-3xl font-black text-primary">{activeServicesCount} / {services.length}</p>
          <span className="text-[11px] text-emerald-700 font-bold">Katalog Layanan Publik</span>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">Tingkat Penyelesaian</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-800">
            {totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}%
          </p>
          <span className="text-[11px] text-outline font-medium">{completedRequests} Dokumen Terbit</span>
        </div>

        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-1">
          <span className="text-xs font-semibold text-outline uppercase tracking-wider">Indeks Kepuasan (IKM)</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">4.8 / 5.0</p>
          <span className="text-[11px] text-emerald-700 font-bold">Mutu Layanan Sangat Baik</span>
        </div>
      </section>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-outline-variant/30 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'overview', label: 'Ringkasan & Analitik', icon: 'monitoring' },
          { id: 'services', label: 'Katalog Layanan', icon: 'list_alt' },
          { id: 'users', label: 'Manajemen Akun & Role', icon: 'manage_accounts' },
          { id: 'audit', label: 'Audit Log Sistem', icon: 'security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-surface-container-lowest text-secondary border-t-2 border-secondary shadow-subtle'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
            }`}
          >
            <Icon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 4. Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Performance Distribution */}
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <Icon name="bar_chart" size={18} className="text-secondary" />
              <span>Volume Permohonan Berdasarkan Status Operasional</span>
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-emerald-800">Selesai Diterbitkan ({completedRequests})</span>
                  <span>{totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-secondary">Sedang Diproses OPD ({inProgressRequests})</span>
                  <span>{totalRequests > 0 ? Math.round((inProgressRequests / totalRequests) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full"
                    style={{ width: `${totalRequests > 0 ? (inProgressRequests / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-orange-900">Perlu Revisi Dokumen ({requests.filter(r => r.status === 'needs_revision').length})</span>
                  <span>{totalRequests > 0 ? Math.round((requests.filter(r => r.status === 'needs_revision').length / totalRequests) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${totalRequests > 0 ? (requests.filter(r => r.status === 'needs_revision').length / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-error">Ditolak ({requests.filter(r => r.status === 'rejected').length})</span>
                  <span>{totalRequests > 0 ? Math.round((requests.filter(r => r.status === 'rejected').length / totalRequests) * 100) : 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-error rounded-full"
                    style={{ width: `${totalRequests > 0 ? (requests.filter(r => r.status === 'rejected').length / totalRequests) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* OPD Partners */}
          <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-primary flex items-center gap-2">
              <Icon name="apartment" size={18} className="text-secondary" />
              <span>Unit Pelaksana Layanan (OPD Terhubung)</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">Disdukcapil Kota Bandar Lampung</p>
                  <p className="text-[10px] text-outline">Kependudukan, KIA, Domisili</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Aktif (98% SLA)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">DPMPTSP Kota Bandar Lampung</p>
                  <p className="text-[10px] text-outline">Perizinan Usaha Mikro (IUMK)</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Aktif (95% SLA)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-bold text-primary">Dinas Sosial Kota Bandar Lampung</p>
                  <p className="text-[10px] text-outline">DTKS, Bantuan Sosial Prasejahtera</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Aktif (92% SLA)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Management Tab */}
      {activeTab === 'services' && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary">Master Katalog Pelayanan Publik</h3>
              <p className="text-xs text-outline">Kelola status aktif, SLA, dan persyaratan layanan publik.</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon="add"
              onClick={() => setNewServiceModalOpen(true)}
            >
              Tambah Layanan
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-primary uppercase text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Layanan</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">OPD Penanggungjawab</th>
                  <th className="py-3 px-4">SLA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-mono font-bold text-secondary">{srv.code}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{srv.name}</td>
                    <td className="py-3 px-4 text-outline">{srv.category}</td>
                    <td className="py-3 px-4 text-outline">{srv.opd}</td>
                    <td className="py-3 px-4 font-mono text-outline">{srv.sla}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          srv.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {srv.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleService(srv.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          srv.isActive
                            ? 'border-error/40 text-error hover:bg-error-container/30'
                            : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        {srv.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users & RBAC Tab */}
      {activeTab === 'users' && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-primary">Manajemen Akun & Role Pengguna (RBAC)</h3>
            <p className="text-xs text-outline">Daftar akun berwenang pada sistem BANDAR LAYAN.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-primary uppercase text-[10px] font-bold border-b border-outline-variant/30">
                <tr>
                  <th className="py-3 px-4">Nama Pengguna</th>
                  <th className="py-3 px-4">Alamat Email</th>
                  <th className="py-3 px-4">Peran (Role)</th>
                  <th className="py-3 px-4">Unit / Instansi</th>
                  <th className="py-3 px-4">Status Akun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-bold text-primary flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-tertiary-fixed text-[10px] font-bold flex items-center justify-center">
                        {u.avatar}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-outline">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="capitalize px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container text-secondary">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-outline">{u.unit || 'Warga Masyarakat'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Aktif / Terverifikasi
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* System Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div>
            <h3 className="text-sm font-bold text-primary">Jejak Audit Aktivitas Sistem (Audit Trail)</h3>
            <p className="text-xs text-outline">Mencatat seluruh aksi sensitif: otorisasi, perubahan status, checklist berkas, dan konfigurasi.</p>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] px-2 py-0.2 rounded bg-surface-container font-bold text-primary">
                      {log.action}
                    </span>
                    <span className="font-semibold text-secondary font-mono">{log.target}</span>
                  </div>
                  <p className="text-on-surface-variant">{log.details}</p>
                </div>
                <div className="text-right sm:shrink-0 text-[10px] text-outline font-mono">
                  <p className="font-semibold text-primary">{log.actor}</p>
                  <p>{new Date(log.timestamp).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Service Modal Dialog */}
      <Modal
        isOpen={newServiceModalOpen}
        onClose={() => setNewServiceModalOpen(false)}
        title="Tambah Layanan Publik Baru"
        subtitle="Konfigurasi katalog layanan digital Kota Bandar Lampung"
        icon="post_add"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setNewServiceModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={submittingService}
              onClick={handleCreateService}
              icon="save"
            >
              Simpan Layanan
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateService} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-primary block">Nama Layanan Publik *</label>
            <input
              type="text"
              required
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Contoh: Surat Izin Praktik Dokter Mandiri"
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-primary block">Kategori</label>
              <select
                value={newServiceCategory}
                onChange={(e) => setNewServiceCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-none"
              >
                <option value="Kependudukan">Kependudukan</option>
                <option value="Perizinan & Usaha">Perizinan & Usaha</option>
                <option value="Bantuan Sosial">Bantuan Sosial</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Perpajakan & Aset">Perpajakan & Aset</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-primary block">Estimasi SLA</label>
              <input
                type="text"
                value={newServiceSla}
                onChange={(e) => setNewServiceSla(e.target.value)}
                placeholder="Contoh: 3 Hari Kerja"
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-primary block">Unit Pelaksana (OPD) *</label>
            <input
              type="text"
              required
              value={newServiceOpd}
              onChange={(e) => setNewServiceOpd(e.target.value)}
              placeholder="Contoh: Dinas Kesehatan Kota Bandar Lampung"
              className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-primary block">Deskripsi Singkat Layanan</label>
            <textarea
              rows={3}
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              placeholder="Jelaskan tujuan dan kriteria pemohon..."
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

