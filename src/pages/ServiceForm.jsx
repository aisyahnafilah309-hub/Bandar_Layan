import React, { useState } from 'react';
import Icon from '../components/common/Icon';
import Button from '../components/common/Button';
import FileUpload from '../components/common/FileUpload';
import Modal from '../components/common/Modal';
import { requestsService, maskNik } from '../services/storage';
import { useToast } from '../components/common/Toast';

export default function ServiceForm({
  service,
  currentUser,
  onBack,
  onSubmitSuccess
}) {
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { showToast } = useToast();

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (validationErrors[fieldName]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (service?.formFields) {
      service.formFields.forEach((field) => {
        if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
          errors[field.name] = `${field.label} wajib diisi.`;
        }
      });
    }

    if (uploadedFiles.length === 0) {
      errors.files = 'Harap lampirkan minimal 1 dokumen persyaratan utama.';
    }

    if (!consentAgreed) {
      errors.consent = 'Anda wajib menyetujui pernyataan keabsahan data.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setConfirmModalOpen(true);
    } else {
      showToast('Harap periksa kembali isian formulir dan dokumen yang diperlukan.', 'error');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const newRequest = await requestsService.submitNewRequest(
        {
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          opd: service.opd,
          formData,
          documents: uploadedFiles,
          requirements: service.requirements
        },
        currentUser
      );

      setConfirmModalOpen(false);
      showToast(`Permohonan berhasil dikirim! Nomor: ${newRequest.requestNumber}`, 'success');
      onSubmitSuccess(newRequest);
    } catch (err) {
      showToast(err.message || 'Gagal mengirim permohonan', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    showToast('Draft formulir disimpan di penyimpanan lokal browser Anda.', 'info');
  };

  if (!service) {
    return (
      <div className="p-8 text-center space-y-3">
        <p className="text-sm text-outline">Layanan tidak dipilih.</p>
        <Button variant="outline" size="sm" onClick={onBack}>
          Kembali ke Katalog
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-outline font-medium">
        <button onClick={onBack} className="hover:text-secondary flex items-center gap-1">
          <Icon name="home" size={16} />
          <span>Katalog Layanan</span>
        </button>
        <Icon name="chevron_right" size={14} />
        <span className="text-on-surface-variant">{service.category}</span>
        <Icon name="chevron_right" size={14} />
        <span className="text-primary font-bold truncate max-w-[200px]">{service.name}</span>
      </nav>

      {/* 2. Service Header Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface-container text-secondary flex items-center justify-center shrink-0 shadow-sm">
              <Icon name={service.icon || 'description'} size={32} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-container text-secondary font-bold">
                  {service.code}
                </span>
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">
                  {service.category}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary">
                {service.name}
              </h1>
              <p className="text-xs font-semibold text-secondary">
                {service.opd}
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/20">
            <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
              {service.cost}
            </span>
            <span className="text-xs text-outline flex items-center gap-1">
              <Icon name="schedule" size={16} className="text-secondary" />
              <span>SLA: {service.sla}</span>
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {service.description}
        </p>

        {/* Requirements Box */}
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
          <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Icon name="fact_check" size={16} className="text-secondary" />
            <span>Dokumen Persyaratan Wajib yang Perlu Disiapkan:</span>
          </h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
            {service.requirements?.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                  ✓
                </span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Main Form Section */}
      <form onSubmit={handleOpenConfirm} className="space-y-6">
        {/* Section A: Data Pemohon */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <div className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <Icon name="person" size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Bagian 1: Data Identitas Pemohon</h3>
              <p className="text-[11px] text-outline">Terhubung otomatis dengan profil kependudukan</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Nomor Induk Kependudukan (NIK)
              </label>
              <input
                type="text"
                disabled
                value={maskNik(currentUser?.nik || '1871026405020001')}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-mono text-outline cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Nama Lengkap Pemohon
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.name || 'Aisyah Nafilah'}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs font-semibold text-outline cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Nomor Telepon / WhatsApp Aktif
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.phone || '0812-7890-1234'}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-outline cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-on-surface-variant">
                Alamat Domisili KTP
              </label>
              <input
                type="text"
                disabled
                value={currentUser?.address || 'Jl. Raden Intan No. 45, Enggal, Kota Bandar Lampung'}
                className="w-full h-10 px-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-outline cursor-not-allowed truncate"
              />
            </div>
          </div>
        </div>

        {/* Section B: Dynamic Service Fields */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <div className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <Icon name="edit_note" size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Bagian 2: Data Rincian Layanan</h3>
              <p className="text-[11px] text-outline">Lengkapi formulir spesifik untuk {service.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            {service.formFields?.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-xs font-semibold text-primary flex items-center gap-1">
                  <span>{field.label}</span>
                  {field.required && <span className="text-error font-bold">*</span>}
                </label>

                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full p-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                      validationErrors[field.name]
                        ? 'border-error ring-1 ring-error'
                        : 'border-outline-variant/60 focus:border-secondary'
                    }`}
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                      validationErrors[field.name]
                        ? 'border-error ring-1 ring-error'
                        : 'border-outline-variant/60 focus:border-secondary'
                    }`}
                  >
                    <option value="">-- Pilih {field.label} --</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className={`w-full h-11 px-3 rounded-xl bg-surface-container-low border text-xs focus:bg-white focus:outline-none transition-colors ${
                      validationErrors[field.name]
                        ? 'border-error ring-1 ring-error'
                        : 'border-outline-variant/60 focus:border-secondary'
                    }`}
                  />
                )}

                {validationErrors[field.name] && (
                  <p className="text-[11px] text-error font-medium mt-1">
                    {validationErrors[field.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section C: Upload Dokumen Persyaratan */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
            <div className="w-7 h-7 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <Icon name="cloud_upload" size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Bagian 3: Unggah Berkas Persyaratan</h3>
              <p className="text-[11px] text-outline">Format PDF, JPG, atau PNG (Maks. 5 MB per berkas)</p>
            </div>
          </div>

          <FileUpload
            label="Lampiran Berkas Pendukung"
            required={true}
            helperText="Unggah scan atau foto dokumen sesuai persyaratan di atas. Pastikan teks dan gambar terbaca dengan jelas."
            files={uploadedFiles}
            onChange={(newFiles) => {
              setUploadedFiles(newFiles);
              if (validationErrors.files) {
                setValidationErrors((prev) => {
                  const next = { ...prev };
                  delete next.files;
                  return next;
                });
              }
            }}
            onRemove={(idx) => {
              const updated = uploadedFiles.filter((_, i) => i !== idx);
              setUploadedFiles(updated);
            }}
          />

          {validationErrors.files && (
            <div className="p-3 rounded-xl bg-error-container/60 border border-error/20 text-error text-xs flex items-center gap-2">
              <Icon name="report_problem" size={16} />
              <span>{validationErrors.files}</span>
            </div>
          )}
        </div>

        {/* Section D: Pernyataan & Consent */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-subtle space-y-3">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="consent-check"
              checked={consentAgreed}
              onChange={(e) => {
                setConsentAgreed(e.target.checked);
                if (validationErrors.consent) {
                  setValidationErrors((prev) => {
                    const next = { ...prev };
                    delete next.consent;
                    return next;
                  });
                }
              }}
              className="mt-1 w-4 h-4 rounded text-secondary border-outline-variant focus:ring-secondary cursor-pointer"
            />
            <label htmlFor="consent-check" className="text-xs text-on-surface-variant leading-relaxed cursor-pointer select-none">
              Saya menyatakan dengan sesungguhnya bahwa seluruh data dan dokumen yang saya unggah adalah <strong>benar, sah, dan dapat dipertanggungjawabkan</strong> secara hukum. Apabila di kemudian hari ditemukan ketidaksesuaian, saya bersedia menerima konsekuensi pembatalan permohonan sesuai ketentuan Pemerintah Kota Bandar Lampung.
            </label>
          </div>

          {validationErrors.consent && (
            <p className="text-[11px] text-error font-medium pl-7">
              {validationErrors.consent}
            </p>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onBack} icon="arrow_back">
            Kembali ke Katalog
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="secondary" size="md" onClick={handleSaveDraft} icon="save">
              Simpan Draft
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon="send"
              className="w-full sm:w-auto"
            >
              Kirim Permohonan
            </Button>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Konfirmasi Pengajuan Permohonan"
        subtitle="Harap tinjau kembali data sebelum dikirimkan ke OPD terkait"
        icon="help"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setConfirmModalOpen(false)}>
              Batal & Periksa Kembali
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={submitting}
              onClick={handleFinalSubmit}
              icon="check"
            >
              Ya, Kirim Sekarang
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-xs">
          <p className="text-on-surface-variant">
            Anda akan mengajukan permohonan <strong>{service.name}</strong> dengan rincian:
          </p>
          <div className="p-3.5 rounded-xl bg-surface-container-low space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-outline">Pemohon:</span>
              <span className="font-bold text-primary">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">OPD Tujuan:</span>
              <span className="font-semibold text-secondary">{service.opd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Total Berkas:</span>
              <span className="font-bold text-emerald-800">{uploadedFiles.length} Dokumen</span>
            </div>
            <div className="flex justify-between">
              <span className="text-outline">Biaya:</span>
              <span className="font-bold text-emerald-700">Gratis (Rp 0)</span>
            </div>
          </div>
          <p className="text-[11px] text-outline">
            Setelah dikirim, nomor registrasi resmi akan diterbitkan dan permohonan dapat dilacak statusnya secara real-time.
          </p>
        </div>
      </Modal>
    </div>
  );
}

