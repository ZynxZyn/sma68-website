import { useCallback, useEffect, useRef, useState } from 'react';
import { announcementApi } from '../../api/services';
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
  content: '',
  status: 'DRAFT',
  publishDate: '',
  expireDate: '',
};

export default function AnnouncementsAdmin() {
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
      const res = await announcementApi.list(params);
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
      content: item.content ?? '',
      status: item.status ?? 'DRAFT',
      publishDate: toDateTimeLocal(item.publishDate),
      expireDate: toDateTimeLocal(item.expireDate),
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (form.title.trim().length < 3) errors.title = 'Judul minimal 3 karakter';
    if (!form.content.trim()) errors.content = 'Konten wajib diisi';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content,
        status: form.status,
        publishDate: form.publishDate ? new Date(form.publishDate).toISOString() : null,
        expireDate: form.expireDate ? new Date(form.expireDate).toISOString() : null,
      };
      if (editing) {
        await announcementApi.update(editing.id, payload);
        notify('success', 'Pengumuman berhasil diperbarui');
      } else {
        await announcementApi.create(payload);
        notify('success', 'Pengumuman berhasil dibuat');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menyimpan pengumuman');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await announcementApi.remove(deleting.id);
      notify('success', 'Pengumuman berhasil dihapus');
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menghapus pengumuman');
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
          <h1 className="adm-page-title">Pengumuman</h1>
          <p className="adm-page-desc">Kelola pengumuman resmi untuk siswa, guru, dan staf.</p>
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Pengumuman
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
              placeholder="Cari pengumuman..."
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
                <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
              </svg>
            }
            title="Belum ada pengumuman"
            description={search || status ? 'Tidak ada hasil untuk filter ini.' : 'Buat pengumuman pertama untuk informasi sekolah.'}
            action={!search && !status ? <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>Tambah Pengumuman</button> : undefined}
          />
        ) : (
          <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Terbit</th>
                    <th>Berakhir</th>
                    <th>Penulis</th>
                    <th style={{ width: 90 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="adm-cell-title">{item.title}</div>
                        <div className="adm-cell-sub">
                          {item.content.length > 90 ? `${item.content.slice(0, 90)}...` : item.content}
                        </div>
                      </td>
                      <td><StatusBadge status={item.status} /></td>
                      <td className="adm-cell-muted">{formatDate(item.publishDate)}</td>
                      <td className="adm-cell-muted">{formatDate(item.expireDate)}</td>
                      <td className="adm-cell-muted">{item.author?.name ?? '-'}</td>
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
        title={editing ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
        subtitle={editing ? `Mengedit "${editing.title}"` : 'Buat pengumuman baru untuk portal sekolah.'}
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
          <div className={`ui-field ui-field--full ${fieldErrors.title ? 'ui-field--error' : ''}`}>
            <label>Judul Pengumuman <span className="req">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Contoh: Jadwal Penilaian Akhir Semester"
            />
            {fieldErrors.title && <span className="ui-field-error">{fieldErrors.title}</span>}
          </div>

          <div className={`ui-field ui-field--full ${fieldErrors.content ? 'ui-field--error' : ''}`}>
            <label>Isi Pengumuman <span className="req">*</span></label>
            <textarea
              value={form.content}
              onChange={(e) => setField('content', e.target.value)}
              placeholder="Tulis isi pengumuman..."
              style={{ minHeight: 130 }}
            />
            {fieldErrors.content && <span className="ui-field-error">{fieldErrors.content}</span>}
          </div>

          <div className="ui-field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="ui-field">
            <label>Tanggal Publish</label>
            <input
              type="datetime-local"
              value={form.publishDate}
              onChange={(e) => setField('publishDate', e.target.value)}
            />
          </div>

          <div className="ui-field">
            <label>Tanggal Expired</label>
            <input
              type="datetime-local"
              value={form.expireDate}
              onChange={(e) => setField('expireDate', e.target.value)}
            />
            <span className="ui-hint">Pengumuman otomatis tidak aktif setelah tanggal ini.</span>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        message={deleting ? `Yakin ingin menghapus pengumuman "${deleting.title}"?` : ''}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  );
}