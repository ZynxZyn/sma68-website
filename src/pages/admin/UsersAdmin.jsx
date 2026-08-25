import { useCallback, useEffect, useRef, useState } from 'react';
import { userApi } from '../../api/services';
import { useAuth } from '../../auth/AuthContext';
import {
  Avatar,
  ConfirmDialog,
  EmptyState,
  formatDate,
  formatDateTime,
  Modal,
  Pagination,
  RoleBadge,
  Spinner,
  TableSkeleton,
  Toast,
  useToasts,
} from './ui';
import './admin.css';

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF', 'SISWA'];

const EMPTY_FORM = {
  username: '',
  email: '',
  password: '',
  name: '',
  role: 'SISWA',
  avatar: '',
};

export default function UsersAdmin() {
  const { toasts, dismiss, notify } = useToasts();
  const { user: me } = useAuth();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [role, setRole] = useState('');
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

  const canDelete = me?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (role) params.role = role;
      if (search) params.search = search;
      const res = await userApi.list(params);
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
      setError('');
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [page, role, search]);

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
      username: item.username ?? '',
      email: item.email ?? '',
      password: '',
      name: item.name ?? '',
      role: item.role ?? 'SISWA',
      avatar: item.avatar ?? '',
    });
    setFieldErrors({});
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (form.username.trim().length < 3) errors.username = 'Username minimal 3 karakter';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Email tidak valid';
    if (!form.name.trim() || form.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter';
    if (!editing && form.password.length < 6) errors.password = 'Password minimal 6 karakter';
    if (editing && form.password && form.password.length < 6) errors.password = 'Password minimal 6 karakter';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      if (editing) {
        const payload = {
          username: form.username.trim(),
          email: form.email.trim(),
          name: form.name.trim(),
          role: form.role,
          avatar: form.avatar.trim() || null,
        };
        if (form.password) payload.password = form.password;
        await userApi.update(editing.id, payload);
        notify('success', 'Pengguna berhasil diperbarui');
      } else {
        await userApi.create({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          role: form.role,
          avatar: form.avatar.trim() || null,
        });
        notify('success', 'Pengguna berhasil dibuat');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menyimpan pengguna');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await userApi.remove(deleting.id);
      notify('success', 'Pengguna berhasil dihapus');
      setDeleting(null);
      if (items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal menghapus pengguna');
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  }

  async function toggleActive(item) {
    try {
      await userApi.update(item.id, { isActive: !item.isActive });
      notify('success', item.isActive ? 'Akun dinonaktifkan' : 'Akun diaktifkan');
      load();
    } catch (err) {
      notify('error', err.message ?? 'Gagal mengubah status akun');
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
          <h1 className="adm-page-title">Manajemen User</h1>
          <p className="adm-page-desc">Kelola akun siswa, guru, staf, dan administrator.</p>
        </div>
        <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tambah User
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
              placeholder="Cari nama, username, atau email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="adm-select"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Belum ada pengguna"
            description={search || role ? 'Tidak ada hasil untuk filter ini.' : 'Buat akun pengguna baru.'}
            action={!search && !role ? <button type="button" className="ui-btn ui-btn--primary" onClick={openCreate}>Tambah User</button> : undefined}
          />
        ) : (
          <>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Pengguna</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Login Terakhir</th>
                    <th>Bergabung</th>
                    <th style={{ width: 120 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={item.name} src={item.avatar} size={34} />
                          <div>
                            <div className="adm-cell-title">
                              {item.name}
                              {item.id === me?.id && (
                                <span className="adm-you-badge">Anda</span>
                              )}
                            </div>
                            <div className="adm-cell-sub">@{item.username} · {item.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><RoleBadge role={item.role} /></td>
                      <td>
                        <button
                          type="button"
                          className={`adm-toggle ${item.isActive ? 'adm-toggle--on' : 'adm-toggle--off'}`}
                          onClick={() => toggleActive(item)}
                          title={item.isActive ? 'Klik untuk menonaktifkan' : 'Klik untuk mengaktifkan'}
                        >
                          <span className="adm-toggle-track">
                            <span className="adm-toggle-thumb" />
                          </span>
                          {item.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                      </td>
                      <td className="adm-cell-muted">{formatDateTime(item.lastLoginAt)}</td>
                      <td className="adm-cell-muted">{formatDate(item.createdAt)}</td>
                      <td>
                        <div className="adm-actions">
                          <button type="button" className="ui-icon-btn" title="Edit" onClick={() => openEdit(item)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          {canDelete && item.id !== me?.id && (
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
                          )}
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
        title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
        subtitle={editing ? `Mengedit akun ${editing.name}` : 'Buat akun baru untuk pengguna portal.'}
        width="lg"
        footer={
          <>
            <button type="button" className="ui-btn ui-btn--ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </button>
            <button type="button" className="ui-btn ui-btn--primary" onClick={handleSubmit} disabled={saving}>
              {saving ? <Spinner size={15} /> : editing ? 'Simpan Perubahan' : 'Buat Akun'}
            </button>
          </>
        }
      >
        <form className="ui-form-grid" onSubmit={handleSubmit}>
          <div className={`ui-field ${fieldErrors.name ? 'ui-field--error' : ''}`}>
            <label>Nama Lengkap <span className="req">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="Contoh: Budi Santoso"
            />
            {fieldErrors.name && <span className="ui-field-error">{fieldErrors.name}</span>}
          </div>

          <div className={`ui-field ${fieldErrors.username ? 'ui-field--error' : ''}`}>
            <label>Username <span className="req">*</span></label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setField('username', e.target.value)}
              placeholder="min. 3 karakter"
            />
            {fieldErrors.username && <span className="ui-field-error">{fieldErrors.username}</span>}
          </div>

          <div className={`ui-field ${fieldErrors.email ? 'ui-field--error' : ''}`}>
            <label>Email <span className="req">*</span></label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="nama@contoh.com"
            />
            {fieldErrors.email && <span className="ui-field-error">{fieldErrors.email}</span>}
          </div>

          <div className={`ui-field ${fieldErrors.password ? 'ui-field--error' : ''}`}>
            <label>
              Password {editing ? '(kosongkan jika tidak diganti)' : <span className="req">*</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder={editing ? '••••••••' : 'min. 6 karakter'}
              autoComplete="new-password"
            />
            {fieldErrors.password && <span className="ui-field-error">{fieldErrors.password}</span>}
          </div>

          <div className="ui-field">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setField('role', e.target.value)}>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="ui-field">
            <label>URL Avatar</label>
            <input
              type="url"
              value={form.avatar}
              onChange={(e) => setField('avatar', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={handleDelete}
        busy={deleteBusy}
        message={deleting ? `Yakin ingin menghapus akun "${deleting.name}" (@${deleting.username})? Tindakan ini permanen.` : ''}
      />

      <Toast toasts={toasts} dismiss={dismiss} />
    </div>
  );
}