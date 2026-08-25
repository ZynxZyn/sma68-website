import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { announcementApi, agendaApi } from '../api/services';
import { Avatar, formatDate, formatDateTime, Spinner } from './admin/ui';
import './UserDashboard.css';

const NAV = [
  { key: 'overview', label: 'Dashboard', icon: 'grid' },
  { key: 'announcements', label: 'Pengumuman', icon: 'megaphone' },
  { key: 'agenda', label: 'Agenda', icon: 'calendar' },
  { key: 'profile', label: 'Profil', icon: 'user' },
];

function NavIcon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'grid') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    );
  }
  if (name === 'megaphone') {
    return (
      <svg {...common}>
        <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    );
  }
  if (name === 'calendar') {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const ROLE_LABEL = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  GURU: 'Guru',
  STAFF: 'Staff',
  SISWA: 'Siswa',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState('overview');
  const [announcements, setAnnouncements] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const firstName = useMemo(() => (user?.name || '').split(' ')[0], [user]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString();
      const [annRes, agRes] = await Promise.all([
        announcementApi.list({ limit: 6 }),
        agendaApi.list({ limit: 6, from: today }),
      ]);
      setAnnouncements(annRes.items ?? []);
      setAgenda(agRes.items ?? []);
      setError('');
    } catch (e) {
      setError(e.message ?? 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  }

  const expiringSoon = agenda.filter((a) => {
    const days = (new Date(a.date) - Date.now()) / 86400000;
    return days <= 7;
  }).length;

  return (
    <div className="user-shell">
      {sidebarOpen && <div className="user-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`user-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="user-sidebar-brand">
          <div className="user-sidebar-logo">
            <img src="/logo.png" alt="Logo SMA Negeri 68" />
          </div>
          <div>
            <div className="user-sidebar-name">Portal Siswa</div>
            <div className="user-sidebar-sub">SMA Negeri 68 Jakarta</div>
          </div>
        </div>

        <nav className="user-nav">
          <span className="user-nav-label">Menu</span>
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`user-nav-link ${active === item.key ? 'active' : ''}`}
              onClick={() => {
                setActive(item.key);
                setSidebarOpen(false);
              }}
            >
              <NavIcon name={item.icon} />
              {item.label}
              {item.key === 'overview' && announcements.length > 0 && (
                <span className="user-nav-count">{announcements.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="user-sidebar-foot">
          <div className="user-mini">
            <Avatar name={user?.name} src={user?.avatar} size={36} />
            <div className="user-mini-info">
              <div className="user-mini-name">{user?.name}</div>
              <div className="user-mini-role">{ROLE_LABEL[user?.role] ?? user?.role}</div>
            </div>
          </div>
          <button type="button" className="user-logout" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? <Spinner size={15} /> : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            )}
            Keluar
          </button>
          <Link to="/" className="user-back-site">← Kembali ke website</Link>
        </div>
      </aside>

      <div className="user-main">
        <header className="user-topbar">
          <button
            type="button"
            className="user-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="user-topbar-title">{NAV.find((n) => n.key === active)?.label}</span>
          <div className="user-topbar-right">
            <Avatar name={user?.name} src={user?.avatar} size={34} />
          </div>
        </header>

        <main className="user-content">
          {active === 'overview' && (
            <>
              <section className="user-welcome">
                <div className="user-welcome-text">
                  <h1 className="user-welcome-title">Halo, {firstName}!</h1>
                  <p className="user-welcome-sub">
                    Berikut ringkasan informasi terbaru untuk Anda di portal SMA Negeri 68 Jakarta.
                  </p>
                </div>
                <div className="user-welcome-meta">
                  <span>{formatDate(new Date().toISOString())}</span>
                  <span className="user-welcome-meta-dot" />
                  <span>Akademik {new Date().getFullYear()}/{new Date().getFullYear() + 1}</span>
                </div>
              </section>

              <section className="user-stats">
                <div className="user-stat-card user-stat-card--cyan">
                  <div className="user-stat-icon">📢</div>
                  <div>
                    <div className="user-stat-value">{announcements.length}</div>
                    <div className="user-stat-label">Pengumuman Terbaru</div>
                  </div>
                </div>
                <div className="user-stat-card user-stat-card--yellow">
                  <div className="user-stat-icon">📅</div>
                  <div>
                    <div className="user-stat-value">{agenda.length}</div>
                    <div className="user-stat-label">Agenda Mendatang</div>
                  </div>
                </div>
                <div className="user-stat-card user-stat-card--red">
                  <div className="user-stat-icon">⏳</div>
                  <div>
                    <div className="user-stat-value">{expiringSoon}</div>
                    <div className="user-stat-label">Agenda 7 Hari ke Depan</div>
                  </div>
                </div>
                <div className="user-stat-card user-stat-card--navy">
                  <div className="user-stat-icon">🎓</div>
                  <div>
                    <div className="user-stat-value">{ROLE_LABEL[user?.role] ?? user?.role}</div>
                    <div className="user-stat-label">Peran Anda di Portal</div>
                  </div>
                </div>
              </section>

              <div className="user-grid">
                <section className="user-card">
                  <div className="user-card-head">
                    <h2 className="user-card-title">Pengumuman Terbaru</h2>
                    <button type="button" className="user-card-link" onClick={() => setActive('announcements')}>
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="user-card-body">
                    {loading && (
                      <div className="user-skeleton-list">
                        {[1, 2, 3].map((i) => <div key={i} className="user-skeleton-line" />)}
                      </div>
                    )}
                    {!loading && error && <div className="user-note user-note--error">{error}</div>}
                    {!loading && !error && announcements.length === 0 && (
                      <div className="user-note">Belum ada pengumuman yang tersedia.</div>
                    )}
                    {announcements.slice(0, 4).map((item) => (
                      <article className="user-list-row" key={item.id}>
                        <div className="user-list-icon user-list-icon--cyan">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                          </svg>
                        </div>
                        <div className="user-list-body">
                          <h3 className="user-list-title">{item.title}</h3>
                          <div className="user-list-meta">
                            <span>{formatDateTime(item.publishDate)}</span>
                            <span>·</span>
                            <span>oleh {item.author?.name ?? '-'}</span>
                          </div>
                          <p className="user-list-excerpt">{item.content}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="user-card">
                  <div className="user-card-head">
                    <h2 className="user-card-title">Agenda Mendatang</h2>
                    <button type="button" className="user-card-link" onClick={() => setActive('agenda')}>
                      Lihat Semua →
                    </button>
                  </div>
                  <div className="user-card-body">
                    {loading && (
                      <div className="user-skeleton-list">
                        {[1, 2, 3].map((i) => <div key={i} className="user-skeleton-line" />)}
                      </div>
                    )}
                    {!loading && error && <div className="user-note user-note--error">{error}</div>}
                    {!loading && !error && agenda.length === 0 && (
                      <div className="user-note">Belum ada agenda yang dijadwalkan.</div>
                    )}
                    {agenda.slice(0, 4).map((item) => {
                      const d = new Date(item.date);
                      return (
                        <article className="user-agenda-row" key={item.id}>
                          <div className="user-agenda-date">
                            <span className="user-agenda-day">{d.getDate()}</span>
                            <span className="user-agenda-month">
                              {d.toLocaleDateString('id-ID', { month: 'short' })}
                            </span>
                          </div>
                          <div className="user-agenda-body">
                            <h3 className="user-list-title">{item.title}</h3>
                            <div className="user-list-meta">
                              {item.startTime && <span>🕐 {item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</span>}
                              {item.location && <span>📍 {item.location}</span>}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            </>
          )}

          {active === 'announcements' && (
            <section className="user-card">
              <div className="user-card-head">
                <h2 className="user-card-title">Semua Pengumuman</h2>
                <button type="button" className="user-card-link" onClick={load}>↻ Muat Ulang</button>
              </div>
              <div className="user-card-body">
                {loading && (
                  <div className="user-skeleton-list">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="user-skeleton-line" />)}
                  </div>
                )}
                {!loading && error && (
                  <div className="user-note user-note--error">
                    {error}
                    <button type="button" className="user-retry" onClick={load}>Coba Lagi</button>
                  </div>
                )}
                {!loading && !error && announcements.length === 0 && (
                  <div className="user-note">Belum ada pengumuman yang tersedia.</div>
                )}
                {announcements.map((item) => (
                  <article className="user-list-row" key={item.id}>
                    <div className="user-list-icon user-list-icon--cyan">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3 11 18-5v12L3 14v-3z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                      </svg>
                    </div>
                    <div className="user-list-body">
                      <h3 className="user-list-title">{item.title}</h3>
                      <div className="user-list-meta">
                        <span>{formatDateTime(item.publishDate)}</span>
                        <span>·</span>
                        <span>oleh {item.author?.name ?? '-'}</span>
                      </div>
                      <p className="user-list-excerpt">{item.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {active === 'agenda' && (
            <section className="user-card">
              <div className="user-card-head">
                <h2 className="user-card-title">Semua Agenda</h2>
                <button type="button" className="user-card-link" onClick={load}>↻ Muat Ulang</button>
              </div>
              <div className="user-card-body">
                {loading && (
                  <div className="user-skeleton-list">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="user-skeleton-line" />)}
                  </div>
                )}
                {!loading && error && (
                  <div className="user-note user-note--error">
                    {error}
                    <button type="button" className="user-retry" onClick={load}>Coba Lagi</button>
                  </div>
                )}
                {!loading && !error && agenda.length === 0 && (
                  <div className="user-note">Belum ada agenda yang dijadwalkan.</div>
                )}
                {agenda.map((item) => {
                  const d = new Date(item.date);
                  return (
                    <article className="user-agenda-row" key={item.id}>
                      <div className="user-agenda-date">
                        <span className="user-agenda-day">{d.getDate()}</span>
                        <span className="user-agenda-month">
                          {d.toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                      </div>
                      <div className="user-agenda-body">
                        <h3 className="user-list-title">{item.title}</h3>
                        <div className="user-list-meta">
                          <span>🕐 {item.startTime ?? 'Waktu menyusul'}{item.endTime ? ` - ${item.endTime}` : ''}</span>
                          {item.location && <span>📍 {item.location}</span>}
                        </div>
                        {item.description && <p className="user-list-excerpt">{item.description}</p>}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {active === 'profile' && (
            <div className="user-profile-wrap">
              <section className="user-card user-profile-card">
                <div className="user-card-head">
                  <h2 className="user-card-title">Profil Saya</h2>
                </div>
                <div className="user-card-body">
                  <div className="user-profile-head">
                    <Avatar name={user?.name} src={user?.avatar} size={72} />
                    <div>
                      <h3 className="user-profile-name">{user?.name}</h3>
                      <span className="user-profile-role">{ROLE_LABEL[user?.role] ?? user?.role}</span>
                    </div>
                  </div>
                  <div className="user-profile-grid">
                    <div className="user-profile-item">
                      <span className="user-profile-label">Username</span>
                      <span className="user-profile-value">@{user?.username}</span>
                    </div>
                    <div className="user-profile-item">
                      <span className="user-profile-label">Email</span>
                      <span className="user-profile-value">{user?.email}</span>
                    </div>
                    <div className="user-profile-item">
                      <span className="user-profile-label">Peran</span>
                      <span className="user-profile-value">{ROLE_LABEL[user?.role] ?? user?.role}</span>
                    </div>
                    <div className="user-profile-item">
                      <span className="user-profile-label">Tahun Ajaran</span>
                      <span className="user-profile-value">{new Date().getFullYear()}/{new Date().getFullYear() + 1}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}