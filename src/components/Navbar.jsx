import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isTentangPage = ['/visi-misi', '/fasilitas', '/eskul'].includes(location.pathname);

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(isTentangPage ? '/tentang' : '#beranda');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 25);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* Scroll spy on homepage */
  useEffect(() => {
    if (isTentangPage) {
      setActive('/tentang');
      return undefined;
    }

    const homeAnchors = ['#beranda', '#profil-singkat', '#kepsek', '#section-informasi', '#spmb', '#kontak'];
    const sections = homeAnchors.map((href) => document.querySelector(href)).filter(Boolean);
    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isTentangPage]);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const regularLinks = [
    { href: isTentangPage ? '/#beranda' : '#beranda', label: 'Beranda' },
    { href: isTentangPage ? '/#kepsek' : '#kepsek', label: 'Kepsek' },
    { href: isTentangPage ? '/#section-informasi' : '#section-informasi', label: 'Informasi' },
    { href: isTentangPage ? '/#spmb' : '#spmb', label: 'SPMB' },
    { href: isTentangPage ? '/#kontak' : '#kontak', label: 'Kontak' },
  ];

  return (
    <>
      <header className={`p-navbar${scrolled ? ' p-navbar--scrolled' : ''}`}>
        <div className="container p-navbar-inner">

          {/* Brand: Logo + SMAN 68 JAKARTA */}
          <Link to="/" className="p-navbar-brand" aria-label="Beranda SMAN 68 Jakarta">
            <div className="p-navbar-logo-box">
              <img src={logo} alt="Logo SMAN 68 Jakarta" className="p-navbar-logo-img" />
            </div>
            <span className="p-navbar-school-name">SMAN 68 JAKARTA</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="p-navbar-links" aria-label="Navigasi Utama">
            {regularLinks.map((l) => {
              const isActive = !isTentangPage && active === l.href;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  className={`p-navbar-link${isActive ? ' active' : ''}`}
                >
                  <span>{l.label}</span>
                  {isActive && <span className="p-navbar-link-indicator" />}
                </a>
              );
            })}

            {/* Tentang Dropdown at the far right of nav links */}
            <div
              className={`p-navbar-dropdown-wrapper${dropdownOpen ? ' open' : ''}`}
              ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                className={`p-navbar-link p-navbar-dropdown-btn${isTentangPage ? ' active' : ''}`}
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span>Tentang</span>
                <svg
                  className={`p-navbar-dropdown-arrow${dropdownOpen ? ' open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                {isTentangPage && <span className="p-navbar-link-indicator" />}
              </button>

              {/* Dropdown Floating Menu */}
              <div className={`p-navbar-dropdown-menu${dropdownOpen ? ' show' : ''}`}>
                <Link
                  to="/visi-misi"
                  className="p-navbar-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="p-navbar-dd-badge">01</span>
                  <div className="p-navbar-dd-info">
                    <span className="p-navbar-dd-title">Visi &amp; Misi</span>
                    <span className="p-navbar-dd-desc">Arah Strategis &amp; Karakter D-K-P</span>
                  </div>
                </Link>

                <Link
                  to="/fasilitas"
                  className="p-navbar-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="p-navbar-dd-badge">02</span>
                  <div className="p-navbar-dd-info">
                    <span className="p-navbar-dd-title">Fasilitas</span>
                    <span className="p-navbar-dd-desc">Sarana &amp; Prasarana Kampus</span>
                  </div>
                </Link>

                <Link
                  to="/eskul"
                  className="p-navbar-dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="p-navbar-dd-badge">03</span>
                  <div className="p-navbar-dd-info">
                    <span className="p-navbar-dd-title">Ekstrakurikuler</span>
                    <span className="p-navbar-dd-desc">15+ Organisasi &amp; Eskul Juara</span>
                  </div>
                </Link>
              </div>
            </div>
          </nav>

          {/* Right Action Buttons */}
          <div className="p-navbar-actions">
            <a href={isTentangPage ? '/#spmb' : '#spmb'} className="p-navbar-spmb-btn">
              SPMB 2025
            </a>
            <Link to="/login" className="p-navbar-login-btn" aria-label="Login Portal">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={`p-navbar-toggle${open ? ' open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="p-navbar-mobile-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div className={`p-navbar-mobile-drawer${open ? ' open' : ''}`}>
        <div className="p-navbar-mobile-header">
          <div className="p-navbar-mobile-brand">
            <img src={logo} alt="Logo" className="p-navbar-mobile-logo" />
            <span className="p-navbar-school-name">SMAN 68 JAKARTA</span>
          </div>
          <button
            type="button"
            className="p-navbar-mobile-close"
            onClick={() => setOpen(false)}
            aria-label="Tutup Menu"
          >
            &times;
          </button>
        </div>

        <div className="p-navbar-mobile-links">
          {regularLinks.map((l) => {
            const isActive = !isTentangPage && active === l.href;
            return (
              <a
                key={l.label}
                href={l.href}
                className={`p-navbar-mobile-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span>{l.label}</span>
                {isActive && <span className="p-navbar-mobile-active-badge">Aktif</span>}
              </a>
            );
          })}

          {/* Mobile Tentang Sub-links */}
          <div className="p-navbar-mobile-section-divider">
            <span>TENTANG SEKOLAH</span>
          </div>

          <Link
            to="/visi-misi"
            className="p-navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <span>📌 Visi &amp; Misi</span>
          </Link>

          <Link
            to="/fasilitas"
            className="p-navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <span>🏫 Fasilitas Kampus</span>
          </Link>

          <Link
            to="/eskul"
            className="p-navbar-mobile-link"
            onClick={() => setOpen(false)}
          >
            <span>🏆 Ekstrakurikuler (Eskul)</span>
          </Link>
        </div>

        <div className="p-navbar-mobile-footer">
          <a
            href={isTentangPage ? '/#spmb' : '#spmb'}
            className="p-navbar-mobile-spmb"
            onClick={() => setOpen(false)}
          >
            Daftar SPMB 2025/2026
          </a>
          <Link
            to="/login"
            className="p-navbar-mobile-login"
            onClick={() => setOpen(false)}
          >
            🔐 Portal Masuk
          </Link>
        </div>
      </div>
    </>
  );
}
