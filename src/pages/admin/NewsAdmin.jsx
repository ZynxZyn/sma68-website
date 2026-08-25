import { useCallback, useEffect, useRef, useState } from 'react';
import { newsApi } from '../../api/services';
import ImageUploader from '../../components/ImageUploader';
import {
  ConfirmDialog,
  EmptyState,
  formatDate,
  Modal,
  Pagination,
  Spinner,
  StatusBadge,
  TableSkeleton,
  Toast,
  toDateTimeLocal,
  useToasts,
} from './ui';
import './admin.css';

const EMPTY_FORM = {
  title: '',
  category: '',
  excerpt: '',
  content: '',
  thumbnail: '',
  status: 'DRAFT',
  publishedAt: '',
  seoTitle: '',
  seoDescription: '',
};

export default function NewsAdmin() {
  const { toasts, dismiss, notify } = useToasts();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const searchTimer = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (status) params.status = status;
      if (search) params.search = search;
      const res = await newsApi.list(params);
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
      setError('');
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

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
      category: item.category ?? '',
      excerpt: item.excerpt ?? '',
      content: item.content ?? '',
      thumbnail: item.thumbnail ?? '',
      status: item.status ?? 'DRAFT',
      publishedAt: toDateTimeLocal(item.publishedAt),
      seoTitle: item.seoTitle ?? '',
      seoDescription: item.seoDescription ?? '',
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (form.title.trim().length < 3) errors.title = 'Judul minimal 3 karakter';
    if (!form.content.trim()) errors.content = 'Konten wajib diisi';
    if (form.publishedAt && Number.isNaN(new Date(form.publishedAt).getTime())) {
      errors.publishedAt = 'Format tanggal tidak valid';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || undefined,
        excerpt: form.excerpt.trim() || undefined,
        content: form.content,
        thumbnail: form.thumbnail.trim() || undefined,
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
        seoTitle: form.seoTitle.trim() || undefined,
        seoDescription: form.seoDescription.trim() || undefined,
      };
      if (editing) {
        await newsApi.update(editing.id, payload);
        notify('success', 'Berita berhasil diperbarui');
      } else {
        await newsApi.create(payload);
        notify('success', 'Berita berhasil dibuat');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menyimpan berita');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await newsApi.remove(deleting.id);
      notify('success', 'Berita berhasil dihapus');
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menghapus berita');
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
          <h1 className="adm-page-title">Berita</h1>
          <p className="adm-page-desc">Kelola berita yang tampil di halaman utama website.</p>
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Berita
        </button>
      </div>

      <div className="adm-card">
        <div className="adm-toolbar">
          <div className="adm-search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari judul atau ringkasan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="adm-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
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
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
                <line x1="10" y1="6" x2="18" y2="6" /><line x1="10" y1="10" x2="18" y2="10" />
              </svg>
            }
            title="Belum ada berita"
            description={search || status ? 'Tidak ada hasil untuk filter ini.' : 'Mulai buat berita pertama Anda.'}
            action={!search && !status ? <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>Tambah Berita</button> : undefined}
          />
        ) : (
          <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>Status</th>
                    <th>Terbit</th>
                    <th>Penulis</th>
                    <th style={{ width: 90 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="adm-cell-media">
                          {item.thumbnail ? (
                            <img
                              className="adm-thumb"
                              src={item.thumbnail}
                              alt=""
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="adm-thumb-placeholder">
                              <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>NO IMG</span>
                            </div>

                          )}
                          <div className="adm-cell-text">
                            <div className="adm-cell-title">{item.title}</div>
                            <div className="adm-cell-sub">/{item.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td className="adm-cell-muted">{item.category || '-'}</td>
                      <td><StatusBadge status={item.status} /></td>
                      <td className="adm-cell-muted">{formatDate(item.publishedAt || item.createdAt)}</td>
                      <td className="adm-cell-muted">{item.author?.name ?? '-'}</td>
                      <td>
                        <div className="adm-actions">
                          <button
                            type="button"
                            className="ui-icon-btn"
                            title="Edit"
                            onClick={() => openEdit(item)}
                          >
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
                  ))}
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
        title={editing ? 'Edit Berita' : 'Tambah Berita'}
        subtitle={editing ? `Mengedit "${editing.title}"` : 'Buat berita baru untuk website sekolah.'}
        width="lg"
        footer={
          <>
            <button type="button" className="ui-btn ui-btn--ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </button>
            <button type="button" className="ui-btn ui-btn--primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <Spinner size={15} /> : <>{editing ? 'Simpan Perubahan' : 'Publikasikan'}</>}
            </button>
          </>
        }
      >
        <form className="ui-form-grid" onSubmit={handleSubmit}>
          <div className={`ui-field ui-field--full ${fieldErrors.title ? 'ui-field--error' : ''}`}>
            <label>Judul Berita <span className="req">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Contoh: Upacara Hari Kemerdekaan ke-81"
            />
            {fieldErrors.title && <span className="ui-field-error">{fieldErrors.title}</span>}
          </div>

          <div className="ui-field">
            <label>Kategori</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              placeholder="akademik, prestasi, umum..."
            />
          </div>

          <div className="ui-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div className="ui-field ui-field--full">
            <label>Ringkasan (Excerpt)</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setField('excerpt', e.target.value)}
              placeholder="Ringkasan singkat berita..."
              style={{ minHeight: 60 }}
            />
          </div>

          <div className={`ui-field ui-field--full ${fieldErrors.content ? 'ui-field--error' : ''}`}>
            <label>Konten Berita <span className="req">*</span></label>
            <textarea
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              placeholder="Tulis konten lengkap berita..."
              style={{ minHeight: 140 }}
            />
            {fieldErrors.content && <span className="ui-field-error">{fieldErrors.content}</span>}
          </div>

          <div className="ui-field ui-field--full">
            <ImageUploader
              label="Thumbnail Berita"
              value={form.thumbnail}
              onChange={(url) => setField('thumbnail', url)}
              folder="news"
              hint="JPG, PNG, WEBP · Maks. 5MB · Rasio 16:10 dianjurkan"
            />
          </div>

          <div className="ui-field">
            <label>Tanggal Terbit</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setField('publishedAt', e.target.value)}
            />
            {fieldErrors.publishedAt && <span className="ui-field-error">{fieldErrors.publishedAt}</span>}
          </div>

          <div className="ui-field">
            <label>Slug Otomatis</label>
            <input type="text" value={form.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '-'} disabled />
          </div>

          <div className="ui-field">
            <label>SEO Title</label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={(e) => setField('seoTitle', e.target.value)}
              placeholder="Judul untuk hasil pencarian"
            />
          </div>

          <div className="ui-field">
            <label>SEO Description</label>
            <input
              type="text"
              value={form.seoDescription}
              onChange={(e) => setField('seoDescription', e.target.value)}
              placeholder="Deskripsi untuk hasil pencarian"
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        message={deleting ? `Yakin ingin menghapus berita "${deleting.title}"?` : ''}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  );
}