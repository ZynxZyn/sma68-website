import { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { Avatar, Spinner } from './ui';
import logo from '../../assets/logo.png';
import './admin.css';

const ROLE_LABEL = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  GURU: 'Guru',
  STAFF: 'Staff',
  SISWA: 'Siswa',
};

const MENU = [
  {
    label: 'UTAMA',
    items: [
      { to: '/admin', end: true, label: 'Dashboard', icon: 'grid' },
    ],
  },
  {
    label: 'KONTEN & INFORMASI',
    items: [
      { to: '/admin/news', label: 'Berita & Warta', icon: 'news' },
      { to: '/admin/announcements', label: 'Pengumuman', icon: 'megaphone' },
      { to: '/admin/agenda', label: 'Agenda Kegiatan', icon: 'calendar' },
      { to: '/admin/achievements', label: 'Prestasi Siswa', icon: 'trophy' },
      { to: '/admin/gallery', label: 'Galeri Foto', icon: 'image' },
    ],
  },
  {
    label: 'PENGGUNA & SISTEM',
    items: [
      { to: '/admin/users', label: 'Manajemen Pengguna', icon: 'users' },
    ],
  },
];

const ROLE_MENU = {
  GURU: { '/admin/news': true, '/admin/announcements': false, '/admin/agenda': true, '/admin/achievements': true, '/admin/gallery': false, '/admin/users': false },
  STAFF: { '/admin/news': true, '/admin/announcements': true, '/admin/agenda': true, '/admin/achievements': true, '/admin/gallery': true, '/admin/users': false },
  ADMIN: { '/admin/news': true, '/admin/announcements': true, '/admin/agenda': true, '/admin/achievements': true, '/admin/gallery': true, '/admin/users': true },
  SUPER_ADMIN: { '/admin/news': true, '/admin/announcements': true, '/admin/agenda': true, '/admin/achievements': true, '/admin/gallery': true, '/admin/users': true },
};

const PAGE_TITLES = {
  '/admin': 'Dashboard Utama',
  '/admin/news': 'Manajemen Berita & Warta',
  '/admin/announcements': 'Manajemen Pengumuman',
  '/admin/agenda': 'Manajemen Agenda Kegiatan',
  '/admin/achievements': 'Manajemen Prestasi Siswa',
  '/admin/gallery': 'Manajemen Galeri Foto',
  '/admin/users': 'Manajemen Pengguna & Akses',
};

function MenuIcon({ name }) {
  const common = {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'news':
      return (
        <svg {...common}>
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
          <line x1="10" y1="6" x2="18" y2="6" /><line x1="10" y1="10" x2="18" y2="10" />
          <line x1="10" y1="14" x2="18" y2="14" /><line x1="6" y1="18" x2="18" y2="18" />
        </svg>
      );
    case 'megaphone':
      return (
        <svg {...common}>
          <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
        </svg>
      );
    case 'image':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'users':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const allowed = ROLE_MENU[user?.role] ?? {};
  const currentTitle = PAGE_TITLES[location.pathname] ?? 'Admin Console';

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  }

  const filteredMenu = MENU.map((group) => ({
    ...group,
    items: group.items.filter((item) => allowed[item.to] !== false),
  })).filter((group) => group.items.length > 0);

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="adm-shell">
      {sidebarOpen && <div className="adm-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-brand">
          <Link to="/admin" className="adm-sidebar-brand-link">
            <div className="adm-sidebar-logo">
              <img src={logo} alt="Logo SMAN 68 Jakarta" />
            </div>
            <div>
              <div className="adm-sidebar-name">SMAN 68 JAKARTA</div>
              <div className="adm-sidebar-sub">Portal CMS Sekolah</div>
            </div>
          </Link>
        </div>

        <nav className="adm-sidebar-nav" aria-label="Navigasi Menu Admin">
          {filteredMenu.map((group) => (
            <div className="adm-nav-group" key={group.label}>
              <span className="adm-nav-label">{group.label}</span>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `adm-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <MenuIcon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Card */}
        <div className="adm-sidebar-footer">
          <div className="adm-user-mini">
            <Avatar name={user?.name} src={user?.avatar} size={38} />
            <div className="adm-user-mini-info">
              <div className="adm-user-mini-name">{user?.name}</div>
              <div className="adm-user-mini-role">{ROLE_LABEL[user?.role] ?? user?.role}</div>
            </div>
          </div>
          <button
            type="button"
            className="adm-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
            title="Keluar dari portal admin"
          >
            {loggingOut ? <Spinner size={14} /> : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="adm-main">
        {/* Topbar Header */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              type="button"
              className="adm-hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="adm-topbar-breadcrumb">
              <span className="adm-topbar-crumb-parent">CMS SMAN 68</span>
              <span className="adm-topbar-crumb-sep">/</span>
              <span className="adm-topbar-crumb-active">{currentTitle}</span>
            </div>
          </div>

          <div className="adm-topbar-right">
            {/* Live Date Indicator */}
            <div className="adm-topbar-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{todayFormatted}</span>
            </div>

            {/* Direct Link to Live Public Website */}
            <Link to="/" className="adm-preview-site-btn" target="_blank" rel="noopener noreferrer" title="Buka website publik di tab baru">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Lihat Website</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            {/* User Profile Quick Tag */}
            <div className="adm-topbar-user" title={user?.email}>
              <Avatar name={user?.name} src={user?.avatar} size={34} />
              <div className="adm-topbar-user-info">
                <div className="adm-topbar-user-name">{user?.name}</div>
                <div className="adm-topbar-user-role">{ROLE_LABEL[user?.role] ?? user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}