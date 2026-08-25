import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export default function Modal({ open = true, onClose, children, dark = false }) {
  useEffect(() => {
    if (!open) return undefined;
    if (typeof document !== 'undefined') {
      document.body.classList.add('p-modal-open');
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('p-modal-open');
      }
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;


  return createPortal(
    <div
      className={`p-modal-backdrop ${dark ? 'p-modal-backdrop--dark' : ''}`}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="p-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="p-modal-close" onClick={onClose} aria-label="Tutup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}