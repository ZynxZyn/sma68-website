import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


export function Spinner({ size = 20 }) {
  return (
    <span
      className="ui-spinner"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 8) }}
      aria-label="Memuat"
    />
  );
}

export function Modal({ open = true, onClose, title, subtitle, children, footer, width = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    document.addEventListener('keydown', onKey);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;


  return createPortal(
    <div className="ui-modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`ui-modal ui-modal--${width}`} role="dialog" aria-modal="true">
        <div className="ui-modal-header">
          <div>
            <h3 className="ui-modal-title">{title}</h3>
            {subtitle && <p className="ui-modal-subtitle">{subtitle}</p>}
          </div>
          <button type="button" className="ui-icon-btn" onClick={onClose} aria-label="Tutup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="ui-modal-body">{children}</div>
        {footer && <div className="ui-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}


export function ConfirmDialog({ open, title = 'Hapus Data', message, confirmLabel = 'Hapus', busy, onConfirm, onCancel }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      subtitle="Tindakan ini tidak dapat dibatalkan."
      width="sm"
      footer={
        <>
          <button type="button" className="ui-btn ui-btn--ghost" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button type="button" className="ui-btn ui-btn--danger" onClick={onConfirm} disabled={busy}>
            {busy ? <Spinner size={16} /> : confirmLabel}
          </button>
        </>
      }
    >
      <p className="ui-confirm-message">{message}</p>
    </Modal>
  );
}

export function Toast({ toasts, dismiss }) {
  return (
    <div className="ui-toast-region" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`ui-toast ui-toast--${t.type}`} onClick={() => dismiss(t.id)}>
          <span className="ui-toast-icon">
            {t.type === 'success' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : t.type === 'error' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
          </span>
          <span className="ui-toast-message">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export function useToasts() {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const push = (type, message) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 4000);
  };

  return { toasts, dismiss, notify: (type, message) => push(type, message) };
}

export function StatusBadge({ status }) {
  const map = {
    PUBLISHED: 'Publish',
    DRAFT: 'Draft',
    ARCHIVED: 'Arsip',
    ACTIVE: 'Aktif',
    INACTIVE: 'Nonaktif',
  };
  const cls = String(status || '').toLowerCase();
  return <span className={`ui-badge ui-badge--${cls}`}>{map[status] ?? status}</span>;
}

export function RoleBadge({ role }) {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    GURU: 'Guru',
    STAFF: 'Staff',
    SISWA: 'Siswa',
  };
  return <span className={`ui-badge ui-badge--role ui-badge--role-${String(role).toLowerCase()}`}>{labels[role] ?? role}</span>;
}

export function Pagination({ page, totalPages, total, onChange }) {
  if (!total) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) pages.push(i);

  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="ui-pagination">
      <span className="ui-pagination-info">
        Menampilkan <strong>{total}</strong> data
      </span>
      <div className="ui-pagination-btns">
        <button type="button" className="ui-page-btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        {visible.map((p, i, arr) => (
          <span key={p} className="ui-pagination-group">
            {i > 0 && arr[i - 1] !== p - 1 && <span className="ui-page-ellipsis">…</span>}
            <button
              type="button"
              className={`ui-page-btn ${p === page ? 'ui-page-btn--active' : ''}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          </span>
        ))}
        <button type="button" className="ui-page-btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="ui-empty">
      {icon && <div className="ui-empty-icon">{icon}</div>}
      <h4 className="ui-empty-title">{title}</h4>
      {description && <p className="ui-empty-desc">{description}</p>}
      {action}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="ui-skeleton-table">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="ui-skeleton-row" key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <span className="ui-skeleton-cell" key={c} style={{ width: `${[40, 100, 70, 30][c % 4]}%` }} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function Avatar({ name, src, size = 36 }) {
  const initials = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  if (src) {
    return (
      <img
        className="ui-avatar"
        src={src}
        alt={name}
        style={{ width: size, height: size }}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling.style.display = 'flex';
        }}
      />
    );
  }
  return (
    <span className="ui-avatar ui-avatar--fallback" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function toDateTimeLocal(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}