import { useRef, useState } from 'react';
import { getToken } from '../api/client';
import './ImageUploader.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? (
  import.meta.env.PROD ? 'https://sma68-backend.vercel.app' : 'http://localhost:4000'
);


/**
 * ImageUploader — Drag & drop / click-to-upload component.
 * Uploads to Cloudflare R2 via POST /api/upload.
 *
 * Props:
 *   value       {string}   — current image URL (controlled)
 *   onChange    {fn}       — called with new URL after upload
 *   folder      {string}   — R2 subfolder (default: 'uploads')
 *   label       {string}   — label text
 *   hint        {string}   — hint text below the drop zone
 */
export default function ImageUploader({
  value = '',
  onChange,
  folder = 'uploads',
  label = 'Gambar',
  hint = 'JPG, PNG, WEBP atau GIF · Maks. 5MB',
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const inputRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setUploadError('');

    const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!ALLOWED.includes(file.type)) {
      setUploadError('Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, GIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 5MB.');
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      // Simulate early progress
      const interval = setInterval(() => {
        setProgress((p) => Math.min(p + 15, 85));
      }, 300);

      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      clearInterval(interval);
      setProgress(95);

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message ?? 'Upload gagal');
      }

      setProgress(100);
      onChange?.(json.data?.url ?? '');
      setTimeout(() => setProgress(0), 600);
    } catch (e) {
      setUploadError(e.message ?? 'Upload gagal. Coba lagi.');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
    e.target.value = '';
  }

  function handleClear() {
    onChange?.('');
    setUploadError('');
  }

  return (
    <div className="img-uploader">
      {label && <label className="img-uploader__label">{label}</label>}

      {value ? (
        /* Preview mode */
        <div className="img-uploader__preview">
          <img src={value} alt="Preview" className="img-uploader__preview-img" />
          <div className="img-uploader__preview-actions">
            <button
              type="button"
              className="img-uploader__replace-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Ganti Gambar
            </button>
            <button type="button" className="img-uploader__clear-btn" onClick={handleClear}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Hapus
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`img-uploader__zone ${dragging ? 'img-uploader__zone--drag' : ''} ${uploading ? 'img-uploader__zone--busy' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload gambar"
        >
          {uploading ? (
            <div className="img-uploader__progress-wrap">
              <div className="img-uploader__spinner" />
              <span className="img-uploader__progress-text">Mengupload... {progress}%</span>
              <div className="img-uploader__progress-bar">
                <div className="img-uploader__progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <div className="img-uploader__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <p className="img-uploader__cta">
                <span className="img-uploader__cta-bold">Klik untuk memilih</span> atau drag & drop gambar di sini
              </p>
              {hint && <p className="img-uploader__hint">{hint}</p>}
            </>
          )}
        </div>
      )}

      {/* Progress bar saat preview ada dan replace */}
      {uploading && value && (
        <div className="img-uploader__progress-bar img-uploader__progress-bar--inline">
          <div className="img-uploader__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      {uploadError && (
        <p className="img-uploader__error">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {uploadError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={onInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
