import React, { useState, useRef } from 'react';
import Icon from './Icon';

/**
 * File Upload component adhering to Bandar Layan Design Skill (Section 6.3)
 */
export default function FileUpload({
  label,
  required = false,
  helperText,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  files = [],
  onChange,
  onRemove
}) {
  const [dragOver, setDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (incomingFiles) => {
    setErrorMsg('');
    const validFiles = [];

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMsg(`Ukuran berkas "${file.name}" melebihi batas maksimum ${maxSizeMB} MB.`);
        return;
      }

      // Format check
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!accept.includes(ext)) {
        setErrorMsg(`Format berkas "${file.name}" tidak didukung. Harap gunakan format: ${accept}`);
        return;
      }

      validFiles.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type || 'application/octet-stream',
        isVerified: true,
        statusText: 'Siap Diunggah'
      });
    }

    if (validFiles.length > 0) {
      setUploadProgress(10);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setUploadProgress(null), 400);
            return 100;
          }
          return prev + 30;
        });
      }, 80);

      onChange([...files, ...validFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
          <span>{label}</span>
          {required ? (
            <span className="text-error font-bold" title="Wajib Diisi">* (Wajib)</span>
          ) : (
            <span className="text-outline font-normal text-[11px]">(Opsional)</span>
          )}
        </label>
        <span className="text-[11px] text-outline">Maks. {maxSizeMB} MB ({accept})</span>
      </div>

      {helperText && (
        <p className="text-xs text-on-surface-variant">{helperText}</p>
      )}

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors duration-200 ${
          dragOver
            ? 'border-secondary bg-surface-container-high'
            : 'border-outline-variant/60 bg-surface-container-low hover:bg-surface-container hover:border-secondary/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          multiple
          onChange={handleChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary shadow-sm">
            <Icon name="cloud_upload" size={26} />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">
              Seret & letakkan berkas di sini atau <span className="text-secondary underline">jelajah berkas</span>
            </p>
            <p className="text-xs text-outline mt-1">
              Format didukung: PDF, JPG, PNG (Maks. {maxSizeMB} MB per dokumen)
            </p>
          </div>
        </div>
      </div>

      {/* Upload Progress Bar if active */}
      {uploadProgress !== null && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-secondary font-medium">
            <span>Mengunggah dokumen...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-150"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-error-container/60 border border-error/20 text-error text-xs">
          <Icon name="report_problem" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* List of Uploaded Documents */}
      {files && files.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-primary">Berkas yang Dilampirkan ({files.length}):</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {files.map((file, idx) => (
              <div
                key={file.id || idx}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/40 shadow-subtle group hover:border-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                    <Icon name={file.name.endsWith('.pdf') ? 'description' : 'image'} size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-primary truncate max-w-[180px] sm:max-w-[200px]" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[11px] text-outline mt-0.5">
                      {file.size} • <span className="text-emerald-700 font-medium">Terverifikasi</span>
                    </p>
                  </div>
                </div>
                {onRemove && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(idx);
                    }}
                    className="p-1.5 text-outline hover:text-error hover:bg-error-container/40 rounded-lg transition-colors"
                    title="Hapus berkas"
                  >
                    <Icon name="delete" size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
