import React, { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { servicesService, requestsService, maskNik } from '../services/storage';

export default function CitizenPortal({
  currentUser,
  onNavigate,
  onSelectService,
  onTrackRequest,
  onViewEdoc,
  onOpenDigitalId
}) {
  const [services, setServices] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [srvList, reqList] = await Promise.all([
        servicesService.getAll(),
        requestsService.getAll(currentUser)
      ]);
      setServices(srvList);
      setMyRequests(reqList);
    } catch (err) {
      console.error('Error loading portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Semua', 'Kependudukan', 'Perizinan & Usaha', 'Bantuan Sosial', 'Kesehatan', 'Perpajakan & Aset'];

  const filteredServices = services.filter((srv) => {
    const matchesCat = selectedCategory === 'Semua' || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.opd.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate metrics
  const metricPending = myRequests.filter((r) => r.status === 'under_review' || r.status === 'submitted').length;
  const metricProcessing = myRequests.filter((r) => r.status === 'in_process').length;
  const metricRevision = myRequests.filter((r) => r.status === 'needs_revision').length;
  const metricCompleted = myRequests.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Welcome Profile Card & Government Announcement */}
      <section className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        {/* Subtle decorative motif */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-5 pointer-events-none flex items-center justify-center">
          <Icon name="account_balance" size={240} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold text-tertiary-fixed">
              <Icon name="verified" size={16} />
              <span>Warga Terverifikasi Kependudukan Kota Bandar Lampung</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Halo, {currentUser?.name || 'Warga Bandar Lampung'}!
            </h1>
            <p className="text-xs sm:text-sm text-on-primary-container max-w-xl">
              NIK: <span className="font-mono font-bold text-white">{maskNik(currentUser?.nik)}</span> • Domisili: Kecamatan Enggal, Kota Bandar Lampung
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon="badge"
              onClick={onOpenDigitalId}
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              Lihat KTP Digital (IKD)
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon="add"
              onClick={() => onNavigate('portal')}
              className="bg-secondary hover:bg-secondary-container shadow-md"
            >
              Ajukan Layanan Baru
            </Button>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-3 text-xs text-white/90">
          <div className="w-6 h-6 rounded-md bg-tertiary-fixed text-primary flex items-center justify-center shrink-0">
            <Icon name="campaign" size={16} />
          </div>
          <p className="line-clamp-1">
            <strong>Pengumuman:</strong> Pelayanan Administrasi Kependudukan Terintegrasi kini hadir di Mal Pelayanan Publik (MPP) Lantai 2 setiap hari kerja pukul 08.00 - 15.00 WIB.
          </p>
        </div>
      </section>

      {/* 2. Quick Actions */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary shadow-subtle hover:shadow-card transition-all text-left group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
            <Icon name="description" size={22} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-primary group-hover:text-secondary transition-colors">
              Katalog Layanan
            </p>
            <p className="text-[11px] text-outline mt-0.5 line-clamp-1">Lihat 6+ layanan aktif</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('tracking')}
          className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary shadow-subtle hover:shadow-card transition-all text-left group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
            <Icon name="timeline" size={22} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-primary group-hover:text-secondary transition-colors">
              Lacak Dokumen
            </p>
            <p className="text-[11px] text-outline mt-0.5 line-clamp-1">Pantau progres pengajuan</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('complaints')}
          className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary shadow-subtle hover:shadow-card transition-all text-left group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Icon name="report_problem" size={22} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-primary group-hover:text-secondary transition-colors">
              Pengaduan Warga
            </p>
            <p className="text-[11px] text-outline mt-0.5 line-clamp-1">Lapor masalah kota</p>
          </div>
        </button>

        <button
          onClick={onOpenDigitalId}
          className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary shadow-subtle hover:shadow-card transition-all text-left group flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Icon name="badge" size={22} />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-primary group-hover:text-secondary transition-colors">
              Identitas Digital
            </p>
            <p className="text-[11px] text-outline mt-0.5 line-clamp-1">KTP Elektronik Anda</p>
          </div>
        </button>
      </section>

      {/* 3. Status Metrics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Menunggu Verifikasi */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Menunggu</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Icon name="schedule" size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">{metricPending}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-900 font-medium">
            <Badge status="under_review" label="Antrean Verifikasi" />
          </div>
        </div>

        {/* Metric 2: Sedang Diproses */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Diproses</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
              <Icon name="sync" size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">{metricProcessing}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
            <Badge status="in_process" label="Proses OPD" />
          </div>
        </div>

        {/* Metric 3: Perlu Revisi */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Perbaikan</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
              <Icon name="edit_document" size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">{metricRevision}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-orange-900 font-medium">
            <Badge status="needs_revision" label="Revisi Berkas" />
          </div>
        </div>

        {/* Metric 4: Selesai */}
        <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-outline uppercase tracking-wider">Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Icon name="verified" size={18} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-primary">{metricCompleted}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <Badge status="completed" label="Siap Diunduh" />
          </div>
        </div>
      </section>

      {/* 4. Main Two-Column Layout (Recent Requests & Sidebar Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Recent Applications */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <h2 className="text-lg font-bold text-primary">Riwayat & Status Permohonan Anda</h2>
            </div>
            <button
              onClick={() => onNavigate('tracking')}
              className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
            >
              <span>Lihat Selengkapnya</span>
              <Icon name="chevron_right" size={16} />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
              <p className="text-xs text-outline">Memuat data permohonan terkini...</p>
            </div>
          ) : myRequests.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-outline flex items-center justify-center mx-auto">
                <Icon name="inbox" size={28} />
              </div>
              <h3 className="text-sm font-bold text-primary">Belum Ada Permohonan Aktif</h3>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Anda belum pernah mengajukan permohonan layanan publik. Silakan pilih layanan di katalog bawah untuk memulai.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low text-primary uppercase text-[10px] font-bold border-b border-outline-variant/30 tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">No. Registrasi</th>
                        <th className="py-3.5 px-4">Layanan & OPD</th>
                        <th className="py-3.5 px-4">Tanggal Masuk</th>
                        <th className="py-3.5 px-4">Status Terkini</th>
                        <th className="py-3.5 px-4 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {myRequests.slice(0, 4).map((req) => (
                        <tr key={req.id} className="hover:bg-surface-container-low/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-secondary">
                            {req.requestNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-primary">{req.serviceName}</p>
                            <p className="text-[10px] text-outline mt-0.5">{req.opd}</p>
                          </td>
                          <td className="py-3.5 px-4 text-on-surface-variant font-mono">
                            {new Date(req.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge status={req.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {req.edocAvailable && (
                                <button
                                  onClick={() => onViewEdoc(req)}
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
                                  title="Unduh E-Dokumen Resmi"
                                >
                                  <Icon name="download" size={16} />
                                </button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onTrackRequest(req.id)}
                                icon="visibility"
                              >
                                Detail
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card List View */}
              <div className="sm:hidden space-y-3">
                {myRequests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-secondary">
                        {req.requestNumber}
                      </span>
                      <Badge status={req.status} />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-primary">{req.serviceName}</h4>
                      <p className="text-[10px] text-outline mt-0.5">{req.opd}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-[11px]">
                      <span className="text-outline font-mono">
                        {new Date(req.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </span>
                      <div className="flex items-center gap-2">
                        {req.edocAvailable && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onViewEdoc(req)}
                            icon="download"
                          >
                            E-Dokumen
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onTrackRequest(req.id)}
                          icon="visibility"
                        >
                          Lacak
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Column (4 cols): Companion Sidebar Panels */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Mal Pelayanan Publik (MPP) Info */}
          <div className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0">
                <Icon name="location_on" size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-primary leading-tight">
                  Mal Pelayanan Publik (MPP)
                </h3>
                <p className="text-[11px] text-outline">Gedung Satu Atap Pemkot</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Kunjungi gerai fisik pelayanan terpadu di Gedung Satu Atap Pemerintah Kota Bandar Lampung, Jl. Dr. Susilo No. 2, Teluk Betung Utara.
            </p>
            <div className="p-2.5 rounded-lg bg-surface-container-low text-xs space-y-1">
              <div className="flex justify-between text-outline">
                <span>Senin - Kamis:</span>
                <span className="font-semibold text-primary">08.00 - 15.00 WIB</span>
              </div>
              <div className="flex justify-between text-outline">
                <span>Jumat:</span>
                <span className="font-semibold text-primary">08.00 - 15.30 WIB</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Survei Kepuasan Warga */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant/40 shadow-subtle space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Icon name="rate_review" size={18} className="text-secondary" />
                <span>Indeks Kepuasan (IKM)</span>
              </span>
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                4.8 / 5.0 (Sangat Baik)
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Bantu Pemerintah Kota Bandar Lampung meningkatkan mutu pelayanan publik dengan memberikan penilaian dan aspirasi Anda secara transparan.
            </p>
            <Button
              variant="outline"
              size="sm"
              icon="campaign"
              onClick={() => onNavigate('complaints')}
              className="w-full bg-white justify-center shadow-subtle"
            >
              Sampaikan Kritik & Saran
            </Button>
          </div>
        </div>
      </div>

      {/* 5. Featured Services Catalog */}
      <section id="catalog-section" className="space-y-5 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-primary">Katalog Pelayanan Publik Resmi</h2>
            <p className="text-xs text-outline mt-0.5">
              Pilih permohonan layanan publik digital sesuai kebutuhan administrasi Anda.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="search" size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari layanan, izin, atau OPD..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:bg-white focus:outline-none text-xs transition-colors shadow-subtle"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-container text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                    <Icon name={srv.icon} size={24} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container-low text-secondary font-semibold border border-secondary/20">
                    {srv.code}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline">
                    {srv.category}
                  </span>
                  <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors mt-0.5">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1.5 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-outline-variant/20">
                <div className="flex items-center justify-between text-[11px] text-outline">
                  <span className="flex items-center gap-1">
                    <Icon name="schedule" size={14} className="text-secondary" />
                    <span>{srv.sla}</span>
                  </span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {srv.cost}
                  </span>
                </div>

                <div className="text-[10px] text-outline truncate" title={srv.opd}>
                  Unit: <strong>{srv.opd}</strong>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectService(srv)}
                  className="w-full justify-center"
                  icon="send"
                >
                  Ajukan Permohonan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

