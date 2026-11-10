import React, { useState, useEffect } from 'react';
import Icon from '../components/common/Icon';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { requestsService, maskNik } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function OfficerDashboard({ currentUser, onViewEdoc }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL | under_review | in_process | needs_revision | completed | rejected
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);

  // Action Modals State
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [processingAction, setProcessingAction] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    loadRequests();
  }, [currentUser]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const list = await requestsService.getAll(currentUser);
      setRequests(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = requests.filter((r) => {
    const matchesFilter = activeFilter === 'ALL' || r.status === activeFilter;
    const matchesSearch =
      r.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Checklist Validation
  const handleToggleChecklist = async (reqId, idx, currentVal) => {
    try {
      const nextVal = currentVal === true ? false : true;
      const updated = await requestsService.updateChecklist(
        reqId,
        idx,
        nextVal,
        currentUser?.name || 'Petugas'
      );
      setSelectedReq(updated);
      setRequests((prev) => prev.map((r) => (r.id === reqId ? updated : r)));
      showToast(`Item checklist #${idx + 1} diperbarui.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Status Action Handlers
  const handleProcessRequest = async () => {
    try {
      setProcessingAction(true);
      const updated = await requestsService.updateStatus(selectedReq.id, {
        newStatus: 'in_process',
        publicNote: 'Berkas telah diverifikasi dan memenuhi persyaratan administrasi. Sedang dalam proses penyusunan dokumen teknis.',
        internalNote: internalNoteInput || selectedReq.internalNote,
        actorName: currentUser?.name || 'Petugas Verifikator'
      });
      setSelectedReq(updated);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      showToast(`Permohonan ${updated.requestNumber} dialihkan ke proses teknis.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!actionNote.trim()) {
      showToast('Harap tuliskan instruksi perbaikan yang harus dilakukan pemohon.', 'error');
      return;
    }
    try {
      setProcessingAction(true);
      const updated = await requestsService.updateStatus(selectedReq.id, {
        newStatus: 'needs_revision',
        publicNote: actionNote,
        internalNote: internalNoteInput || selectedReq.internalNote,
        actorName: currentUser?.name || 'Petugas Verifikator'
      });
      setSelectedReq(updated);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setRevisionModalOpen(false);
      setActionNote('');
      showToast(`Permintaan revisi berhasil dikirim ke pemohon.`, 'info');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!actionNote.trim()) {
      showToast('Alasan penolakan permohonan wajib diisi.', 'error');
      return;
    }
    try {
      setProcessingAction(true);
      const updated = await requestsService.updateStatus(selectedReq.id, {
        newStatus: 'rejected',
        publicNote: actionNote,
        internalNote: internalNoteInput || selectedReq.internalNote,
        actorName: currentUser?.name || 'Petugas Verifikator'
      });
      setSelectedReq(updated);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setRejectModalOpen(false);
      setActionNote('');
      showToast(`Permohonan ${updated.requestNumber} telah ditolak.`, 'error');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCompleteRequest = async () => {
    try {
      setProcessingAction(true);
      const updated = await requestsService.updateStatus(selectedReq.id, {
        newStatus: 'completed',
        publicNote: actionNote || 'Dokumen resmi telah selesai diproses dan diterbitkan secara elektronik.',
        internalNote: internalNoteInput || selectedReq.internalNote,
        actorName: currentUser?.name || 'Petugas Verifikator'
      });
      setSelectedReq(updated);
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setCompleteModalOpen(false);
      setActionNote('');
      showToast(`Permohonan ${updated.requestNumber} selesai & E-Dokumen diterbitkan!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingAction(false);
    }
  };

  // Metrics
  const countReview = requests.filter((r) => r.status === 'under_review').length;
  const countProcess = requests.filter((r) => r.status === 'in_process').length;
  const countRevision = requests.filter((r) => r.status === 'needs_revision').length;
  const countDone = requests.filter((r) => r.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Officer Header Card */}
      <section className="bg-gradient-to-r from-primary-container to-primary rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-xs font-semibold text-tertiary-fixed">
            <Icon name="badge" size={16} />
            <span>Meja Kerja Verifikator & Petugas Front Office</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {currentUser?.name || 'Hendra Pratama, S.STP'}
          </h1>
          <p className="text-xs sm:text-sm text-on-primary-container">
            NIP: <span className="font-mono text-white">{currentUser?.nip || '198504122010011008'}</span> • Unit: {currentUser?.unit || 'Disdukcapil & Pelayanan Terpadu Satu Atap'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon="refresh"
            onClick={loadRequests}
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            Segarkan Antrean
          </Button>
        </div>
      </section>

      {/* 2. Work Queue Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveFilter('under_review')}
          className={`p-4 rounded-xl border text-left transition-all shadow-subtle ${
            activeFilter === 'under_review' ? 'border-amber-500 bg-amber-50/50' : 'bg-surface-container-lowest border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-outline font-semibold">
            <span>Perlu Diperiksa</span>
            <Icon name="fact_check" size={18} className="text-amber-700" />
          </div>
          <p className="text-2xl font-extrabold text-amber-900 mt-2">{countReview}</p>
          <span className="text-[10px] text-amber-800 font-medium">Antrean Verifikasi Dokumen</span>
        </button>

        <button
          onClick={() => setActiveFilter('in_process')}
          className={`p-4 rounded-xl border text-left transition-all shadow-subtle ${
            activeFilter === 'in_process' ? 'border-secondary bg-blue-50/50' : 'bg-surface-container-lowest border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-outline font-semibold">
            <span>Sedang Diproses</span>
            <Icon name="sync" size={18} className="text-secondary" />
          </div>
          <p className="text-2xl font-extrabold text-secondary mt-2">{countProcess}</p>
          <span className="text-[10px] text-secondary font-medium">Proses Tim Teknis OPD</span>
        </button>

        <button
          onClick={() => setActiveFilter('needs_revision')}
          className={`p-4 rounded-xl border text-left transition-all shadow-subtle ${
            activeFilter === 'needs_revision' ? 'border-orange-500 bg-orange-50/50' : 'bg-surface-container-lowest border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-outline font-semibold">
            <span>Perlu Revisi</span>
            <Icon name="pending_actions" size={18} className="text-orange-700" />
          </div>
          <p className="text-2xl font-extrabold text-orange-900 mt-2">{countRevision}</p>
          <span className="text-[10px] text-orange-800 font-medium">Menunggu Perbaikan Warga</span>
        </button>

        <button
          onClick={() => setActiveFilter('completed')}
          className={`p-4 rounded-xl border text-left transition-all shadow-subtle ${
            activeFilter === 'completed' ? 'border-emerald-500 bg-emerald-50/50' : 'bg-surface-container-lowest border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-outline font-semibold">
            <span>Selesai Diterbitkan</span>
            <Icon name="verified" size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-800 mt-2">{countDone}</p>
          <span className="text-[10px] text-emerald-700 font-medium">E-Dokumen Siap Pakai</span>
        </button>
      </section>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'under_review', label: 'Verifikasi' },
            { id: 'in_process', label: 'Diproses' },
            { id: 'needs_revision', label: 'Revisi' },
            { id: 'completed', label: 'Selesai' },
            { id: 'rejected', label: 'Ditolak' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-primary text-white shadow-subtle'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            <Icon name="search" size={18} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari no. registrasi / pemohon..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-surface-container-lowest border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* 4. Queue Table / Examination Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 or 6 cols): Applications Queue */}
        <div className={`${selectedReq ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-3`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-primary">
              Daftar Antrean Permohonan ({filteredList.length})
            </h3>
            <span className="text-[11px] text-outline font-mono">
              Status: {activeFilter}
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full" />
              <p className="text-xs text-outline">Memuat antrean kerja...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
              <Icon name="inbox" size={32} className="text-outline mx-auto" />
              <p className="text-xs font-semibold text-primary">Tidak Ada Antrean pada Kategori Ini</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredList.map((req) => {
                const isSelected = selectedReq?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setSelectedReq(req);
                      setInternalNoteInput(req.internalNote || '');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-surface-container-low border-secondary shadow-card ring-1 ring-secondary'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low/60 border-outline-variant/30 shadow-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-secondary">
                        {req.requestNumber}
                      </span>
                      <Badge status={req.status} />
                    </div>

                    <div className="mt-2">
                      <h4 className="text-xs font-bold text-primary">{req.serviceName}</h4>
                      <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">
                        Pemohon: <strong>{req.applicantName}</strong>
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-outline font-mono">
                      <span>{new Date(req.submittedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-secondary font-bold flex items-center gap-1">
                        <span>Periksa Berkas</span>
                        <Icon name="chevron_right" size={14} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Detailed Examination Panel */}
        {selectedReq && (
          <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-card space-y-6 animate-scaleUp">
            {/* Header of Examination Panel */}
            <div className="flex items-start justify-between border-b border-outline-variant/20 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-secondary bg-surface-container px-2.5 py-0.5 rounded-lg border border-secondary/20">
                    {selectedReq.requestNumber}
                  </span>
                  <Badge status={selectedReq.status} />
                </div>
                <h3 className="text-base font-extrabold text-primary">
                  {selectedReq.serviceName}
                </h3>
                <p className="text-xs text-outline">{selectedReq.opd}</p>
              </div>

              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 text-outline hover:text-primary rounded-lg hover:bg-surface-container"
                title="Tutup Panel Periksa"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Applicant Data */}
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2 text-xs">
              <h4 className="font-bold text-primary flex items-center gap-1.5">
                <Icon name="person" size={16} className="text-secondary" />
                <span>Identitas Pemohon (Terverifikasi Sistem):</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div>
                  <span className="text-outline block">Nama Pemohon:</span>
                  <span className="font-bold text-primary">{selectedReq.applicantName}</span>
                </div>
                <div>
                  <span className="text-outline block">NIK Pemohon:</span>
                  <span className="font-bold text-primary">{maskNik(selectedReq.applicantNik)}</span>
                </div>
              </div>
            </div>

            {/* Specific Submitted Form Values */}
            {selectedReq.formData && Object.keys(selectedReq.formData).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon name="list" size={16} className="text-secondary" />
                  <span>Rincian Isian Formulir:</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 space-y-1.5 text-xs font-mono">
                  {Object.entries(selectedReq.formData).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-outline-variant/10 py-1">
                      <span className="text-outline capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-semibold text-primary">{v.toString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Checklist (Interactive) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon name="checklist" size={16} className="text-secondary" />
                  <span>Checklist Verifikasi Kelayakan Berkas:</span>
                </h4>
                <span className="text-[10px] text-outline">Klik untuk validasi</span>
              </div>

              <div className="space-y-2">
                {selectedReq.checklist?.map((chk, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleToggleChecklist(selectedReq.id, idx, chk.valid)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                      chk.valid === true
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : chk.valid === false
                        ? 'bg-error-container/40 border-error/20 text-error'
                        : 'bg-surface-container-low border-outline-variant/40 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${
                          chk.valid === true
                            ? 'bg-emerald-600 text-white'
                            : chk.valid === false
                            ? 'bg-error text-white'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        {chk.valid === true ? '✓' : chk.valid === false ? '✕' : '-'}
                      </div>
                      <span className="font-medium">{chk.item}</span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {chk.valid === true ? 'Valid' : chk.valid === false ? 'Tidak Sesuai' : 'Belum Dicek'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Documents */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Icon name="folder_open" size={16} className="text-secondary" />
                <span>Dokumen Berkas Persyaratan ({selectedReq.documents?.length || 0}):</span>
              </h4>

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
                        <p className="text-[10px] text-outline font-mono">{doc.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`Membuka berkas: ${doc.name}`, 'info')}
                        className="px-2.5 py-1 rounded bg-white hover:bg-surface-container border border-outline-variant/40 text-[11px] font-semibold text-secondary flex items-center gap-1 transition-colors"
                      >
                        <Icon name="visibility" size={14} />
                        <span>Lihat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Officer Private Internal Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Icon name="lock" size={16} className="text-amber-700" />
                  <span>Catatan Internal Petugas (Hanya Terlihat Oleh Tim OPD):</span>
                </label>
                <span className="text-[10px] text-outline">Kerahasiaan Terjaga</span>
              </div>
              <textarea
                rows={2}
                value={internalNoteInput}
                onChange={(e) => setInternalNoteInput(e.target.value)}
                placeholder="Tuliskan catatan internal hasil verifikasi lapangan atau pengecekan database SIAK..."
                className="w-full p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
              />
            </div>

            {/* Action Buttons Toolbar with Differentiated Risk */}
            <div className="pt-4 border-t border-outline-variant/30 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-outline block">
                Keputusan & Tindak Lanjut Verifikator:
              </span>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Mulai Proses / Lolos Verifikasi */}
                {selectedReq.status === 'under_review' && (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={processingAction}
                    onClick={handleProcessRequest}
                    icon="task_alt"
                    className="bg-secondary hover:bg-secondary-container"
                  >
                    Verifikasi Lolos & Mulai Proses
                  </Button>
                )}

                {/* 2. Minta Perbaikan Berkas */}
                {(selectedReq.status === 'under_review' || selectedReq.status === 'in_process') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="edit_note"
                    onClick={() => {
                      setActionNote('');
                      setRevisionModalOpen(true);
                    }}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 font-semibold"
                  >
                    Minta Revisi Berkas
                  </Button>
                )}

                {/* 3. Tolak Permohonan */}
                {(selectedReq.status === 'under_review' || selectedReq.status === 'in_process') && (
                  <Button
                    variant="destructive"
                    size="sm"
                    icon="cancel"
                    onClick={() => {
                      setActionNote('');
                      setRejectModalOpen(true);
                    }}
                  >
                    Tolak Permohonan
                  </Button>
                )}

                {/* 4. Selesaikan & Terbitkan E-Dokumen */}
                {selectedReq.status === 'in_process' && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon="verified"
                    onClick={() => {
                      setActionNote('');
                      setCompleteModalOpen(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Terbitkan E-Dokumen Resmi
                  </Button>
                )}

                {/* E-Document Preview if already completed */}
                {selectedReq.edocAvailable && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="download"
                    onClick={() => onViewEdoc(selectedReq)}
                    className="border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                  >
                    Pratinjau E-Dokumen Terbit
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revision Modal Dialog */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title="Kirim Instruksi Perbaikan Berkas ke Pemohon"
        subtitle={`Nomor Registrasi: ${selectedReq?.requestNumber}`}
        icon="edit_note"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setRevisionModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={processingAction}
              onClick={handleRequestRevision}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Kirimkan Permintaan Perbaikan
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-on-surface-variant">
            Jelaskan dokumen apa yang perlu diperbaiki (misal: foto e-KTP buram, surat RT belum ditandatangani) agar pemohon dapat segera mengunggah ulang dokumen yang sah.
          </p>
          <textarea
            rows={3}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="Instruksi perbaikan berkas untuk warga pemohon..."
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
          />
        </div>
      </Modal>

      {/* Reject Modal Dialog */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Konfirmasi Penolakan Permohonan"
        subtitle={`Nomor Registrasi: ${selectedReq?.requestNumber}`}
        icon="report_problem"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              loading={processingAction}
              onClick={handleRejectRequest}
            >
              Tolak Permohonan
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-error font-medium">
            Peringatan: Penolakan permohonan bersifat final pada siklus ini. Alasan penolakan hukum/administratif wajib disampaikan secara jelas kepada pemohon.
          </p>
          <textarea
            rows={3}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="Tuliskan dasar atau alasan penolakan secara resmi..."
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-error focus:bg-white text-xs focus:outline-none"
          />
        </div>
      </Modal>

      {/* Complete & Issue Document Modal Dialog */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Penerbitan E-Dokumen & Tanda Selesai"
        subtitle={`Nomor Registrasi: ${selectedReq?.requestNumber}`}
        icon="verified"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setCompleteModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={processingAction}
              onClick={handleCompleteRequest}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Terbitkan Dokumen Digital
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-on-surface-variant">
            Dengan melanjutkan, sistem secara otomatis akan menerbitkan Surat Keterangan / Tanda Terima Digital dengan stempel elektronik resmi yang dapat diunduh langsung oleh pemohon.
          </p>
          <textarea
            rows={2}
            value={actionNote}
            onChange={(e) => setActionNote(e.target.value)}
            placeholder="Catatan pengambilan dokumen fisik (bila ada) atau pesan resmi..."
            className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-secondary focus:bg-white text-xs focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
}

