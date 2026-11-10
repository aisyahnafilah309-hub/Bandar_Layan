import React, { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Stepper from '../components/common/Stepper';
import Modal from '../components/common/Modal';
import FileUpload from '../components/common/FileUpload';
import { requestsService, maskNik } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function Tracking({
  initialRequestId,
  currentUser,
  onViewEdoc
}) {
  const [requests, setRequests] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [searchNumber, setSearchNumber] = useState('');
  const [loading, setLoading] = useState(true);

  // Revision Modal State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionFiles, setRevisionFiles] = useState([]);
  const [revisionNote, setRevisionNote] = useState('');
  const [submittingRevision, setSubmittingRevision] = useState(false);

  // Satisfaction Rating State
  const [ratingScore, setRatingScore] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadRequests();
  }, [currentUser]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const list = await requestsService.getAll(currentUser);
      setRequests(list);

      if (initialRequestId) {
        const found = list.find((r) => r.id === initialRequestId || r.requestNumber === initialRequestId);
        if (found) {
          setSelectedReq(found);
          setSearchNumber(found.requestNumber);
        } else if (list.length > 0) {
          setSelectedReq(list[0]);
          setSearchNumber(list[0].requestNumber);
        }
      } else if (list.length > 0) {
        setSelectedReq(list[0]);
        setSearchNumber(list[0].requestNumber);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchNumber.trim().toUpperCase();
    if (!query) return;

    const found = requests.find(
      (r) => r.requestNumber.toUpperCase() === query || r.id === query
    );

    if (found) {
      setSelectedReq(found);
      showToast(`Permohonan ${found.requestNumber} ditemukan.`, 'info');
    } else {
      showToast('Nomor permohonan tidak ditemukan pada akun Anda.', 'error');
    }
  };

  // Determine active step index for the Stepper
  const getStepIndex = (status) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'under_review':
        return 1;
      case 'needs_revision':
        return 1;
      case 'in_process':
        return 2;
      case 'completed':
        return 3;
      case 'rejected':
      case 'cancelled':
        return 1;
      default:
        return 0;
    }
  };

  const stepperSteps = [
    { label: 'Permohonan Terkirim', date: selectedReq ? new Date(selectedReq.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '' },
    { label: 'Verifikasi Berkas OPD' },
    { label: 'Pemrosesan Teknis' },
    { label: 'Selesai & Diterbitkan' }
  ];

  // Submit Revision
  const handleSubmitRevision = async () => {
    if (revisionFiles.length === 0) {
      showToast('Harap lampirkan minimal 1 dokumen perbaikan.', 'error');
      return;
    }

    try {
      setSubmittingRevision(true);
      const updated = await requestsService.reuploadRevisionDocument(
        selectedReq.id,
        [...selectedReq.documents, ...revisionFiles],
        revisionNote,
        currentUser?.name || 'Masyarakat'
      );

      setSelectedReq(updated);
      setRevisionModalOpen(false);
      setRevisionFiles([]);
      setRevisionNote('');
      showToast('Berkas perbaikan berhasil dikirimkan kembali ke petugas.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingRevision(false);
    }
  };

  // Submit Rating
  const handleSubmitRating = async () => {
    try {
      setSubmittingRating(true);
      const updated = await requestsService.submitRating(
        selectedReq.id,
        ratingScore,
        ratingFeedback,
        currentUser?.name || 'Masyarakat'
      );
      setSelectedReq(updated);
      showToast('Terima kasih! Penilaian kepuasan Anda telah berhasil dikirim.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn pb-12">
      {/* 1. Page Header & Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-primary">
            Lacak Status Permohonan & E-Dokumen
          </h1>
          <p className="text-xs text-outline mt-0.5">
            Masukkan Nomor Registrasi resmi atau pilih dari daftar riwayat permohonan Anda.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline">
              <Icon name="search" size={20} />
            </span>
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Contoh: REG-2026-BDL-00192"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white focus:outline-none text-xs font-mono font-semibold tracking-wide uppercase transition-colors"
            />
          </div>
          <Button type="submit" variant="primary" size="md" icon="search">
            Cari Dokumen
          </Button>
        </form>

        {/* Quick Selection Pills */}
        {requests.length > 0 && (
          <div className="pt-2 flex items-center gap-2 overflow-x-auto text-xs pb-1 scrollbar-none">
            <span className="text-outline text-[11px] font-semibold shrink-0">Permohonan Anda:</span>
            {requests.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedReq(r);
                  setSearchNumber(r.requestNumber);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  selectedReq?.id === r.id
                    ? 'bg-secondary text-white shadow-subtle'
                    : 'bg-surface-container-low hover:bg-surface-container text-primary border border-outline-variant/30'
                }`}
              >
                {r.requestNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
          <p className="text-xs text-outline">Memuat data pelacakan dokumen...</p>
        </div>
      ) : !selectedReq ? (
        <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container text-outline flex items-center justify-center mx-auto">
            <Icon name="search_off" size={28} />
          </div>
          <h3 className="text-sm font-bold text-primary">Tidak Ada Dokumen yang Dipilih</h3>
          <p className="text-xs text-outline max-w-sm mx-auto">
            Gunakan kotak pencarian di atas untuk memasukkan nomor registrasi atau ajukan permohonan baru.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. Top Summary Card */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-secondary bg-surface-container px-2.5 py-0.5 rounded-lg border border-secondary/20">
                    {selectedReq.requestNumber}
                  </span>
                  <Badge status={selectedReq.status} />
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-primary pt-1">
                  {selectedReq.serviceName}
                </h2>
                <p className="text-xs font-semibold text-on-surface-variant">
                  {selectedReq.opd}
                </p>
              </div>

              {/* Action Buttons for Completed / Revision */}
              <div className="flex items-center gap-2">
                {selectedReq.edocAvailable && (
                  <Button
                    variant="primary"
                    size="md"
                    icon="verified"
                    onClick={() => onViewEdoc(selectedReq)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Unduh E-Dokumen
                  </Button>
                )}

                {selectedReq.status === 'needs_revision' && (
                  <Button
                    variant="primary"
                    size="md"
                    icon="upload_file"
                    onClick={() => setRevisionModalOpen(true)}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Perbaiki Berkas
                  </Button>
                )}
              </div>
            </div>

            {/* Stepper Component */}
            <Stepper steps={stepperSteps} currentStepIndex={getStepIndex(selectedReq.status)} />

            {/* Revision Notice Banner if status is needs_revision */}
            {selectedReq.status === 'needs_revision' && (
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-orange-900">
                  <Icon name="error" size={18} className="text-orange-600" />
                  <span>Petugas Membutuhkan Perbaikan Berkas Dokumen</span>
                </div>
                <p className="leading-relaxed pl-6">
                  {selectedReq.publicNote || 'Harap periksa kembali dokumen yang diminta oleh verifikator dinas terkait.'}
                </p>
                <div className="pl-6 pt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="edit"
                    onClick={() => setRevisionModalOpen(true)}
                    className="bg-orange-200 hover:bg-orange-300 text-orange-950 font-bold border border-orange-300"
                  >
                    Unggah Ulang Dokumen Revisi Sekarang
                  </Button>
                </div>
              </div>
            )}

            {/* Public Officer Note */}
            {selectedReq.publicNote && selectedReq.status !== 'needs_revision' && (
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs space-y-1">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Icon name="info" size={16} className="text-secondary" />
                  <span>Catatan Petugas Layanan:</span>
                </span>
                <p className="text-on-surface-variant leading-relaxed pl-5">
                  {selectedReq.publicNote}
                </p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/20 text-xs font-mono">
              <div>
                <span className="text-[10px] text-outline block uppercase">Pemohon</span>
                <span className="font-bold text-primary truncate block">{selectedReq.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-outline block uppercase">NIK (Masking)</span>
                <span className="font-bold text-primary truncate block">{maskNik(selectedReq.applicantNik)}</span>
              </div>
              <div>
                <span className="text-[10px] text-outline block uppercase">Tanggal Masuk</span>
                <span className="text-on-surface-variant block">
                  {new Date(selectedReq.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-outline block uppercase">Pembaruan Terakhir</span>
                <span className="text-emerald-800 font-semibold block">
                  {new Date(selectedReq.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </section>

          {/* 3. Two-Column Details (Audit Timeline & Documents Checklist) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left (7 cols): Audit Timeline Stepper */}
            <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
              <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                <div className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                  <Icon name="history" size={18} />
                </div>
                <h3 className="text-sm font-bold text-primary">Riwayat Penanganan & Audit Trail</h3>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-highest">
                {selectedReq.timeline?.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-secondary ring-4 ring-white" />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-primary">{item.title}</h4>
                        <span className="text-[10px] text-outline font-mono">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-secondary font-medium">Oleh: {item.actor}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low/60 p-2.5 rounded-lg border border-outline-variant/20">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right (5 cols): Documents & Rating Feedback */}
            <div className="lg:col-span-5 space-y-6">
              {/* Documents Card */}
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
                    <Icon name="folder" size={18} />
                  </div>
                  <h3 className="text-sm font-bold text-primary">Berkas Lampiran ({selectedReq.documents?.length || 0})</h3>
                </div>

                <div className="space-y-2">
                  {selectedReq.documents?.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <Icon name="description" size={20} className="text-secondary shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-primary truncate">{doc.name}</p>
                          <p className="text-[10px] text-outline">{doc.size}</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white text-emerald-800 border border-emerald-200 shrink-0">
                        {doc.statusText || 'Valid'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Satisfaction Survey Card if Completed */}
              {selectedReq.status === 'completed' && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
                  <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Icon name="star" size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-primary">Penilaian Mutu Pelayanan</h3>
                  </div>

                  {selectedReq.ratingGiven ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs">
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(selectedReq.ratingGiven)].map((_, i) => (
                          <Icon key={i} name="star" size={18} />
                        ))}
                        <span className="font-bold text-emerald-950 ml-1">
                          {selectedReq.ratingGiven} / 5 Bintang
                        </span>
                      </div>
                      <p className="text-emerald-900 italic">
                        "{selectedReq.ratingFeedback || 'Pelayanan sangat memuaskan.'}"
                      </p>
                      <span className="text-[10px] text-emerald-700 block">
                        Ulasan Anda telah dicatat dalam indeks kepuasan publik Pemkot.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <p className="text-on-surface-variant">
                        Bagaimana pengalaman Anda terhadap kecepatan dan keramahan pelayanan ini?
                      </p>

                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingScore(star)}
                            className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                              ratingScore >= star ? 'text-amber-500' : 'text-outline-variant'
                            }`}
                          >
                            <Icon name="star" size={26} />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-primary ml-2">
                          {ratingScore} Bintang
                        </span>
                      </div>

                      <textarea
                        rows={2}
                        value={ratingFeedback}
                        onChange={(e) => setRatingFeedback(e.target.value)}
                        placeholder="Berikan saran atau apresiasi Anda..."
                        className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
                      />

                      <Button
                        variant="primary"
                        size="sm"
                        loading={submittingRating}
                        onClick={handleSubmitRating}
                        icon="send"
                        className="w-full justify-center"
                      >
                        Kirim Penilaian
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal Dialog */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Unggah Ulang Berkas Revisi"
        subtitle={`Permohonan: ${selectedReq?.requestNumber}`}
        icon="upload_file"
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setRevisionModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={submittingRevision}
              onClick={handleSubmitRevision}
              icon="send"
            >
              Kirimkan Perbaikan Berkas
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-950">
            <p className="font-bold">Permintaan Perbaikan Petugas:</p>
            <p className="mt-1">{selectedReq?.publicNote}</p>
          </div>

          <FileUpload
            label="Pilih Berkas yang Telah Diperbaiki"
            required={true}
            files={revisionFiles}
            onChange={(files) => setRevisionFiles(files)}
            onRemove={(idx) => setRevisionFiles(revisionFiles.filter((_, i) => i !== idx))}
          />

          <div className="space-y-1">
            <label className="font-semibold text-primary block">
              Catatan Penjelasan untuk Petugas (Opsional)
            </label>
            <textarea
              rows={2}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="Contoh: Sudah mengunggah ulang e-KTP asli dengan foto yang jelas dan tajam."
              className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

