import { useCallback, useEffect, useState } from 'react';
import { galleryApi } from '../../api/services';
import ImageUploader from '../../components/ImageUploader';
import {
  ConfirmDialog,
  EmptyState,
  formatDate,
  Modal,
  Pagination,
  Spinner,
  TableSkeleton,
  Toast,
  useToasts,
} from './ui';
import './admin.css';

const EMPTY_FORM = {
  title: '',
  caption: '',
  album: '',
  images: '',
};

export default function GalleryAdmin() {
  const { toasts, dismiss, notify } = useToasts();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [album, setAlbum] = useState('');
  const [albumList, setAlbumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (album) params.album = album;
      const res = await galleryApi.list(params);
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
      setError('');

      const allRes = await galleryApi.list({ limit: 100 });
      const albums = [...new Set((allRes.items ?? []).map((g) => g.album).filter(Boolean))];
      setAlbumList(albums);
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [page, album]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      title: item.title ?? '',
      caption: item.caption ?? '',
      album: item.album ?? '',
      images: (item.images ?? []).map((img) => img.url).join('\n'),
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (form.title.trim().length < 3) errors.title = 'Judul minimal 3 karakter';
    const imageUrls = form.images
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (imageUrls.some((u) => !/^https?:\/\/.+/.test(u))) {
      errors.images = 'Setiap URL gambar harus diawali http(s)://';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        caption: form.caption.trim() || null,
        album: form.album.trim() || null,
        images: imageUrls.map((url, i) => ({ url, sortOrder: i })),
      };
      if (editing) {
        await galleryApi.update(editing.id, payload);
        notify('success', 'Galeri berhasil diperbarui');
      } else {
        await galleryApi.create(payload);
        notify('success', 'Galeri berhasil dibuat');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menyimpan galeri');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await galleryApi.remove(deleting.id);
      notify('success', 'Galeri berhasil dihapus');
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menghapus galeri');
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((fe) => {
      const next = { ...fe };
      delete next[key];
      return next;
    });
  }

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">Galeri</h1>
          <p className="adm-page-desc">Kelola album galeri foto kegiatan sekolah.</p>
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Galeri
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-toolbar">
          <select
            className="adm-select"
            value={album}
            onChange={(e) => {
              setAlbum(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Album</option>
            {albumList.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <span className="ui-hint" style={{ marginLeft: 'auto' }}>
            {total} album galeri
          </span>
        </div>

        {loading ? (
          <TableSkeleton rows={6} cols={4} />
        ) : error ? (
          <div className="adm-error">
            <p className="adm-error-desc">{error}</p>
            <button type="button" className="ui-btn ui-btn--primary" onClick={load}>Coba Lagi</button>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            }
            title="Belum ada galeri"
            description={album ? 'Tidak ada hasil untuk album ini.' : 'Buat album galeri foto kegiatan.'}
            action={!album ? <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>Tambah Galeri</button> : undefined}
          />
        ) : (
          <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Album &amp; Cover</th>
                    <th>Jumlah Foto</th>
                    <th>Album Group</th>
                    <th>Dibuat</th>
                    <th style={{ width: 90 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const cover = item.images?.[0]?.url;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="adm-cell-media">
                            {cover ? (
                              <img
                                className="adm-thumb"
                                src={cover}
                                alt=""
                                onClick={() => setPreviewIndex(item.images[0])}
                                style={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <div className="adm-thumb-placeholder">
                                <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>NO IMG</span>
                              </div>

                            )}
                            <div className="adm-cell-text">
                              <div className="adm-cell-title">{item.title}</div>
                              <div className="adm-cell-sub">{item.caption || 'Tanpa keterangan'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="adm-cell-muted">{(item.images ?? []).length} foto</td>
                        <td className="adm-cell-muted">{item.album || '-'}</td>
                        <td className="adm-cell-muted">{formatDate(item.createdAt)}</td>

                        <td>
                          <div className="adm-actions">
                            <button type="button" className="ui-icon-btn" title="Edit" onClick={() => openEdit(item)}>
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="ui-icon-btn"
                              title="Hapus"
                              style={{ color: '#dc2626' }}
                              onClick={() => setDeleting(item)}
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={Math.ceil(total / 10)} total={total} onChange={setPage} />
          </>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Galeri' : 'Tambah Galeri'}
        subtitle={editing ? `Mengedit "${editing.title}"` : 'Buat album galeri foto baru.'}
        width="lg"
        footer={
          <>
            <button type="button" className="ui-btn ui-btn--ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </button>
            <button type="button" className="ui-btn ui-btn--primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <Spinner size={15} /> : editing ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </>
        }
      >
        <form className="ui-form-grid" onSubmit={handleSubmit}>
          <div className={`ui-field ${fieldErrors.title ? 'ui-field--error' : ''}`}>
            <label>Judul Album <span className="req">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Contoh: Kegiatan LDKS 2026"
            />
            {fieldErrors.title && <span className="ui-field-error">{fieldErrors.title}</span>}
          </div>

          <div className="ui-field">
            <label>Album Group</label>
            <input
              type="text"
              value={form.album}
              onChange={(e) => setField('album', e.target.value)}
              placeholder="Contoh: Kegiatan Sekolah"
              list="adm-album-options"
            />
            <datalist id="adm-album-options">
              {albumList.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
          </div>

          <div className="ui-field ui-field--full">
            <label>Keterangan (Caption)</label>
            <input
              type="text"
              value={form.caption}
              onChange={(e) => setField('caption', e.target.value)}
              placeholder="Deskripsi singkat album"
            />
          </div>

          <div className="ui-field ui-field--full">
            <ImageUploader
              label={<>Foto Cover <span className="req">*</span></>}
              value={form.images ? form.images.split('\n')[0].trim() : ''}
              onChange={(url) => {
                const lines = form.images ? form.images.split('\n') : [];
                lines[0] = url;
                setField('images', lines.join('\n').trim());
              }}
              folder="gallery"
              hint="Foto pertama menjadi cover album. JPG, PNG, WEBP · Maks. 5MB"
            />
            {fieldErrors.images && <span className="ui-field-error">{fieldErrors.images}</span>}
          </div>

          <div className={`ui-field ui-field--full`}>
            <label>URL Foto Tambahan (satu per baris)</label>
            <textarea
              value={form.images ? form.images.split('\n').slice(1).join('\n') : ''}
              onChange={(e) => {
                const cover = form.images ? form.images.split('\n')[0].trim() : '';
                const extra = e.target.value;
                setField('images', [cover, extra].filter(Boolean).join('\n').trim());
              }}
              placeholder={'https://contoh.com/foto2.jpg\nhttps://contoh.com/foto3.jpg'}
              style={{ minHeight: 90 }}
            />
            <span className="ui-hint">Opsional. Tambahkan URL foto lainnya dalam album ini.</span>
          </div>

        </form>
      </Modal>

      <Modal
        open={!!previewIndex}
        onClose={() => setPreviewIndex(null)}
        title="Preview Foto"
        width="md"
      >
        {previewIndex && (
          <div className="adm-preview-wrap">
            <img src={previewIndex.url} alt={previewIndex.caption || ''} />
            {previewIndex.caption && <p className="adm-preview-caption">{previewIndex.caption}</p>}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        message={deleting ? `Yakin ingin menghapus galeri "${deleting.title}" beserta semua fotonya?` : ''}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  );
}