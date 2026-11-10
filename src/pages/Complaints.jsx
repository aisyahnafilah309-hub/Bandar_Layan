import React, { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import { complaintsService } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function Complaints({ currentUser }) {
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'create'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();

  // Form State
  const [category, setCategory] = useState('Infrastruktur & Jalan');
  const [subject, setSubject] = useState('');
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadComplaints();
  }, [currentUser]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const list = await complaintsService.getAll(currentUser);
      setComplaints(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Infrastruktur & Jalan',
    'Kebersihan & Lingkungan Hidup',
    'Pelayanan Administrasi & Pungli',
    'Ketertiban & Keamanan Umum',
    'Kesehatan & Rumah Sakit',
    'Pendidikan & Fasilitas Umum',
    'Lainnya'
  ];

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!subject.trim()) errors.subject = 'Judul laporan wajib diisi.';
    if (!location.trim()) errors.location = 'Lokasi kejadian wajib diisi.';
    if (description.trim().length < 20) {
      errors.description = 'Kronologi pengaduan minimal 20 karakter agar petugas dapat menindaklanjuti.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast('Harap lengkapi isian form pengaduan.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const created = await complaintsService.submitComplaint(
        {
          category,
          subject,
          location,
          incidentDate: incidentDate || 'Hari ini',
          description,
          isAnonymous,
          evidenceName: evidenceFiles.length > 0 ? evidenceFiles[0].name : 'foto_kejadian.jpg',
          opdTarget: 'Dinas / Instansi Terkait Kota Bandar Lampung'
        },
        currentUser
      );

      showToast(`Pengaduan berhasil dicatat! Nomor Tiket: ${created.ticketNumber}`, 'success');
      // Reset form
      setSubject('');
      setLocation('');
      setDescription('');
      setEvidenceFiles([]);
      setIsAnonymous(false);
      setValidationErrors({});
      setActiveTab('list');
      loadComplaints();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Header */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-2">
            <Icon name="campaign" size={16} className="text-amber-700" />
            <span>Kanal Aspirasi & Pengaduan Warga Bandar Lampung</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-primary">
            Layanan Pengaduan & Aspirasi Masyarakat
          </h1>
          <p className="text-xs text-outline mt-1 max-w-xl leading-relaxed">
            Sampaikan permasalahan sarana publik, lampu jalan, kebersihan, atau pelayanan birokrasi secara transparan dan bertanggung jawab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'list' ? 'secondary' : 'outline'}
            size="md"
            icon="list_alt"
            onClick={() => setActiveTab('list')}
          >
            Laporan Saya ({complaints.length})
          </Button>
          <Button
            variant={activeTab === 'create' ? 'primary' : 'outline'}
            size="md"
            icon="add_comment"
            onClick={() => setActiveTab('create')}
          >
            Buat Laporan Baru
          </Button>
        </div>
      </div>

      {activeTab === 'create' ? (
        /* Form Pengaduan */
        <form onSubmit={handleSubmitComplaint} className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-subtle space-y-5">
            <h2 className="text-sm font-bold text-primary border-b border-outline-variant/20 pb-3 flex items-center gap-2">
              <Icon name="edit" size={18} className="text-secondary" />
              <span>Formulir Pengaduan Pelayanan & Fasilitas Publik</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary">Kategori Masalah</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary">Tanggal Kejadian / Ditemukan</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary">
                Judul Ringkas Pengaduan <span className="text-error font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Lampu PJU Mati di Depan Kampus Teknokrat Jl. ZA Pagar Alam"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (validationErrors.subject) {
                    setValidationErrors((p) => { const n = { ...p }; delete n.subject; return n; });
                  }
                }}
                className={`w-full h-11 px-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                  validationErrors.subject ? 'border-error' : 'border-outline-variant/60 focus:border-secondary'
                }`}
              />
              {validationErrors.subject && (
                <p className="text-[11px] text-error">{validationErrors.subject}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-primary">
                Lokasi Spesifik / Alamat Kejadian <span className="text-error font-bold">*</span>
              </label>
              <input
                type="text"
                placeholder="Jl., RT/RW, Kelurahan, Kecamatan, patokan terdekat"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (validationErrors.location) {
                    setValidationErrors((p) => { const n = { ...p }; delete n.location; return n; });
                  }
                }}
                className={`w-full h-11 px-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                  validationErrors.location ? 'border-error' : 'border-outline-variant/60 focus:border-secondary'
                }`}
              />
              {validationErrors.location && (
                <p className="text-[11px] text-error">{validationErrors.location}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-primary">
                  Uraian Kronologi Masalah <span className="text-error font-bold">*</span>
                </label>
                <span className={`text-[11px] ${description.length < 20 ? 'text-outline' : 'text-emerald-700 font-bold'}`}>
                  {description.length} / 1000 karakter (Min. 20)
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={1000}
                placeholder="Jelaskan secara jelas apa yang terjadi, sejak kapan masalah berlangsung, dan dampak yang dialami masyarakat..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationErrors.description) {
                    setValidationErrors((p) => { const n = { ...p }; delete n.description; return n; });
                  }
                }}
                className={`w-full p-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                  validationErrors.description ? 'border-error' : 'border-outline-variant/60 focus:border-secondary'
                }`}
              />
              {validationErrors.description && (
                <p className="text-[11px] text-error">{validationErrors.description}</p>
              )}
            </div>

            {/* Foto Bukti */}
            <FileUpload
              label="Foto Bukti Pendukung di Lokasi"
              required={false}
              helperText="Lampirkan foto kondisi nyata jalan rusak, tumpukan sampah, atau bukti administrasi."
              files={evidenceFiles}
              onChange={(files) => setEvidenceFiles(files)}
              onRemove={(idx) => setEvidenceFiles(evidenceFiles.filter((_, i) => i !== idx))}
            />

            {/* Kontrol Privasi / Anonim */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
              <input
                type="checkbox"
                id="anon-check"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-secondary border-outline-variant focus:ring-secondary cursor-pointer"
              />
              <label htmlFor="anon-check" className="text-xs text-on-surface-variant leading-relaxed select-none cursor-pointer">
                <strong>Laporkan secara Anonim:</strong> Nama dan identitas Anda tidak akan ditampilkan kepada publik maupun OPD tujuan, hanya nomor tiket acak yang diterbitkan.
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" size="md" onClick={() => setActiveTab('list')}>
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={submitting}
                icon="send"
              >
                Kirim Pengaduan Resmi
              </Button>
            </div>
          </div>
        </form>
      ) : (
        /* List of Complaints */
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
              <p className="text-xs text-outline">Memuat pengaduan warga...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container text-outline flex items-center justify-center mx-auto">
                <Icon name="campaign" size={28} />
              </div>
              <h3 className="text-sm font-bold text-primary">Belum Ada Pengaduan yang Disampaikan</h3>
              <p className="text-xs text-outline max-w-sm mx-auto">
                Tekan tombol "Buat Laporan Baru" di atas untuk melaporkan masalah sarana publik atau pelayanan kota.
              </p>
            </div>
          ) : (
            complaints.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-subtle space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2.5 py-0.5 rounded-lg border border-secondary/20">
                      {item.ticketNumber}
                    </span>
                    <Badge status={item.status} />
                    <span className="text-xs text-outline">• {item.category}</span>
                  </div>
                  <span className="text-[11px] text-outline font-mono">
                    {new Date(item.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-primary">{item.subject}</h3>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                    <Icon name="location_on" size={15} className="text-secondary" />
                    <span>{item.location}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-2 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/20">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-outline pt-1">
                  <span>
                    Pelapor: <strong>{item.reporterName}</strong>
                  </span>
                  <span>
                    Disposisi: <strong>{item.opdTarget}</strong>
                  </span>
                </div>

                {/* Follow up timeline */}
                {item.followUps && item.followUps.length > 0 && (
                  <div className="pt-2 border-t border-outline-variant/20 space-y-2">
                    <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                      <Icon name="timeline" size={15} className="text-secondary" />
                      <span>Progres Tindak Lanjut Petugas:</span>
                    </span>
                    <div className="space-y-1.5 pl-4 border-l-2 border-secondary/30 text-xs">
                      {item.followUps.map((f, i) => (
                        <div key={i} className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{f.actor}</span>
                            <span className="text-[10px] text-outline font-mono">({f.time})</span>
                          </div>
                          <p className="text-on-surface-variant">{f.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

