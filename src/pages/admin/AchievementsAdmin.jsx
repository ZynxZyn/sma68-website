import { useCallback, useEffect, useRef, useState } from 'react';
import { achievementApi } from '../../api/services';
import ImageUploader from '../../components/ImageUploader';
import {
  ConfirmDialog,
  EmptyState,
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
  category: '',
  level: '',
  year: '',
  achievement: '',
  studentTeam: '',
  image: '',
  description: '',
};

export default function AchievementsAdmin() {
  const { toasts, dismiss, notify } = useToasts();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
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
  const years = useMemoYears();

  function useMemoYears() {
    const [yearsList] = useState(() => {
      const arr = [];
      const now = new Date().getFullYear();
      for (let y = now; y >= now - 15; y -= 1) arr.push(String(y));
      return arr;
    });
    return yearsList;
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (level) params.level = level;
      if (year) params.year = year;
      if (search) params.search = search;
      const res = await achievementApi.list(params);
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
      setError('');
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [page, level, year, search]);

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
      level: item.level ?? '',
      year: item.year ?? '',
      achievement: item.achievement ?? '',
      studentTeam: item.studentTeam ?? '',
      image: item.image ?? '',
      description: item.description ?? '',
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (form.title.trim().length < 3) errors.title = 'Judul minimal 3 karakter';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category.trim() || null,
        level: form.level.trim() || null,
        year: form.year.trim() || null,
        achievement: form.achievement.trim() || null,
        studentTeam: form.studentTeam.trim() || null,
        image: form.image.trim() || null,
        description: form.description.trim() || null,
      };
      if (editing) {
        await achievementApi.update(editing.id, payload);
        notify('success', 'Prestasi berhasil diperbarui');
      } else {
        await achievementApi.create(payload);
        notify('success', 'Prestasi berhasil dibuat');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menyimpan prestasi');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await achievementApi.remove(deleting.id);
      notify('success', 'Prestasi berhasil dihapus');
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menghapus prestasi');
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
          <h1 className="adm-page-title">Prestasi</h1>
          <p className="adm-page-desc">Kelola prestasi siswa dan sekolah yang tampil di website.</p>
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah Prestasi
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
              placeholder="Cari prestasi, siswa, atau tim..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="adm-select"
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Level</option>
            <option value="Internasional">Internasional</option>
            <option value="Nasional">Nasional</option>
            <option value="Provinsi">Provinsi</option>
            <option value="Kota">Kota</option>
          </select>
          <select
            className="adm-select"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Tahun</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
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
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
                <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
              </svg>
            }
            title="Belum ada prestasi"
            description={search || level || year ? 'Tidak ada hasil untuk filter ini.' : 'Catat prestasi pertama sekolah.'}
            action={!search && !level && !year ? <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>Tambah Prestasi</button> : undefined}
          />
        ) : (
          <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Judul</th>
                    <th>Level</th>
                    <th>Kategori</th>
                    <th>Tahun</th>
                    <th>Siswa / Tim</th>
                    <th style={{ width: 90 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="adm-cell-media">
                          {item.image ? (
                            <img
                              className="adm-thumb"
                              src={item.image}
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
                            <div className="adm-cell-sub">{item.achievement || ''}</div>
                          </div>
                        </div>
                      </td>

                      <td className="adm-cell-muted">{item.level || '-'}</td>
                      <td className="adm-cell-muted">{item.category || '-'}</td>
                      <td className="adm-cell-muted">{item.year || '-'}</td>
                      <td className="adm-cell-muted">{item.studentTeam || '-'}</td>
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
        title={editing ? 'Edit Prestasi' : 'Tambah Prestasi'}
        subtitle={editing ? `Mengedit "${editing.title}"` : 'Catat prestasi baru siswa atau sekolah.'}
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
          <div className={`ui-field ui-field--full ${fieldErrors.title ? 'ui-field--error' : ''}`}>
            <label>Judul Prestasi <span className="req">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder="Contoh: Juara 1 Olimpiade Sains Nasional"
            />
            {fieldErrors.title && <span className="ui-field-error">{fieldErrors.title}</span>}
          </div>

          <div className="ui-field">
            <label>Kategori</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setField('category', e.target.value)}
              placeholder="Akademik, Olahraga, Seni..."
            />
          </div>

          <div className="ui-field">
            <label>Level</label>
            <select value={form.level} onChange={(e) => setField('level', e.target.value)}>
              <option value="">Pilih level</option>
              <option value="Internasional">Internasional</option>
              <option value="Nasional">Nasional</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Kota">Kota</option>
            </select>
          </div>

          <div className="ui-field">
            <label>Pencapaian</label>
            <input
              type="text"
              value={form.achievement}
              onChange={(e) => setField('achievement', e.target.value)}
              placeholder="Juara 1, Medali Emas..."
            />
          </div>

          <div className="ui-field">
            <label>Tahun</label>
            <select value={form.year} onChange={(e) => setField('year', e.target.value)}>
              <option value="">Pilih tahun</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="ui-field">
            <label>Siswa / Tim</label>
            <input
              type="text"
              value={form.studentTeam}
              onChange={(e) => setField('studentTeam', e.target.value)}
              placeholder="Nama siswa atau tim"
            />
          </div>

          <div className="ui-field ui-field--full">
            <ImageUploader
              label="Foto Prestasi"
              value={form.image}
              onChange={(url) => setField('image', url)}
              folder="achievements"
              hint="JPG, PNG, WEBP · Maks. 5MB"
            />
          </div>

          <div className="ui-field ui-field--full">
            <label>Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              placeholder="Deskripsi singkat prestasi..."
              style={{ minHeight: 90 }}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        message={deleting ? `Yakin ingin menghapus prestasi "${deleting.title}"?` : ''}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  );
}