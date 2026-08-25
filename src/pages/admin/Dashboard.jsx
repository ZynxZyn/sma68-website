import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { statsApi, newsApi, announcementApi, agendaApi } from '../../api/services';
import {
  EmptyState,
  formatDate,
  RoleBadge,
  Spinner,
  StatusBadge,
  TableSkeleton,
} from './ui';

const STAT_CARDS = [
  { key: 'publishedNewsCount', label: 'Berita Terbit', icon: 'news', tone: 'cyan' },
  { key: 'announcementCount', label: 'Pengumuman Aktif', icon: 'megaphone', tone: 'amber' },
  { key: 'upcomingAgenda', label: 'Agenda Mendatang', icon: 'calendar', tone: 'red' },
  { key: 'achievementCount', label: 'Prestasi Siswa', icon: 'trophy', tone: 'purple' },
  { key: 'galleryCount', label: 'Galeri Foto', icon: 'image', tone: 'emerald' },
  { key: 'userCount', label: 'Total Pengguna', icon: 'users', tone: 'navy' },
];



function StatIcon({ name }) {
  const common = {
    width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
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

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat Pagi';
  if (h < 15) return 'Selamat Siang';
  if (h < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, newsRes, annRes, agRes] = await Promise.all([
        statsApi.get(),
        newsApi.list({ limit: 4 }),
        announcementApi.list({ limit: 4 }),
        agendaApi.list({ limit: 4 }),
      ]);
      setStats(statsRes);
      setRecent({ news: newsRes.items ?? [], announcements: annRes.items ?? [], agenda: agRes.items ?? [] });
      setError('');
    } catch (e) {
      setError(e.message ?? 'Gagal memuat statistik');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const firstName = (user?.name || '').split(' ')[0];

  if (loading) {
    return (
      <div className="adm-page-container">
        <div className="adm-skeleton-banner" />
        <div className="adm-skeleton-stats">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="adm-skeleton-stat" />)}
        </div>
        <div className="adm-skeleton-grid">
          <div className="adm-skeleton-card" />
          <div className="adm-skeleton-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="adm-page-container">
        <div className="adm-error-card">
          <div className="adm-error-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="adm-error-title">Gagal Memuat Data Dashboard</h3>
          <p className="adm-error-desc">{error}</p>
          <button type="button" className="ui-btn ui-btn--primary" onClick={load}>
            <Spinner size={14} /> Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-page-container">

      {/* 1. Symmetrical Welcome & Quick Action Hero Banner */}
      <section className="adm-welcome-card">
        <div className="adm-welcome-left">
          <h1 className="adm-welcome-title">
            Dashboard <em>Manajemen &amp; Konten</em>
          </h1>
          <p className="adm-welcome-desc">
            Pusat kendali terpadu untuk pengelolaan artikel berita, pengumuman resmi, agenda sekolah, dan profil institusi.
          </p>
        </div>

        <div className="adm-welcome-actions">
          <Link to="/admin/news" className="adm-hero-action-btn adm-hero-action-btn--primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Buat Berita</span>
          </Link>
          <Link to="/admin/announcements" className="adm-hero-action-btn adm-hero-action-btn--secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Pengumuman</span>
          </Link>
          <Link to="/admin/agenda" className="adm-hero-action-btn adm-hero-action-btn--secondary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Agenda</span>
          </Link>
        </div>
      </section>

      {/* 2. Symmetrical 6-KPI Stat Cards Grid */}
      <section className="adm-stats-grid">
        {STAT_CARDS.map((card) => (
          <div className="adm-stat-card" key={card.key}>
            <div className="adm-stat-header">
              <span className="adm-stat-label">{card.label}</span>
              <span className={`adm-stat-icon adm-stat-icon--${card.tone}`}>
                <StatIcon name={card.icon} />
              </span>
            </div>
            <div className="adm-stat-value">{stats?.[card.key] ?? 0}</div>
          </div>
        ))}
      </section>



      {/* 3. Symmetrical 2x2 Grid (50% / 50% Balanced Panels) */}
      <div className="adm-dash-grid">

        {/* Card 1: Berita Terbaru (Top Left) */}
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3 className="adm-card-title">Berita &amp; Warta Terbaru</h3>
              <p className="adm-card-subtitle">Publikasi artikel dan rilis berita terkini</p>
            </div>
            <Link to="/admin/news" className="adm-card-link">
              <span>Kelola Semua</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </div>
          <div className="adm-card-body adm-card-body--pad0">
            {recent.news.length === 0 ? (
              <EmptyState
                title="Belum ada berita"
                description="Mulai publikasikan berita atau artikel pertama Anda."
                action={<Link to="/admin/news" className="ui-btn ui-btn--primary ui-btn--sm">Tambah Berita Baru</Link>}
              />
            ) : (
              <div className="adm-list-rows">
                {recent.news.map((item) => (
                  <div className="adm-list-row" key={item.id}>
                    <div className="adm-list-icon adm-list-icon--cyan">
                      <StatIcon name="news" />
                    </div>
                    <div className="adm-list-body">
                      <div className="adm-list-title">{item.title}</div>
                      <div className="adm-list-meta">
                        <StatusBadge status={item.status} />
                        <span>{formatDate(item.publishedAt || item.createdAt)}</span>
                        {item.author?.name && <span>&bull; oleh {item.author.name}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Card 2: Pengumuman Terkini (Top Right) */}
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3 className="adm-card-title">Pengumuman Terkini</h3>
              <p className="adm-card-subtitle">Pengumuman penting untuk warga sekolah</p>
            </div>
            <Link to="/admin/announcements" className="adm-card-link">
              <span>Kelola Semua</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </div>
          <div className="adm-card-body adm-card-body--pad0">
            {recent.announcements.length === 0 ? (
              <EmptyState
                title="Belum ada pengumuman"
                description="Rilis pengumuman resmi bagi guru, siswa, dan orang tua."
                action={<Link to="/admin/announcements" className="ui-btn ui-btn--primary ui-btn--sm">Buat Pengumuman</Link>}
              />
            ) : (
              <div className="adm-list-rows">
                {recent.announcements.map((item) => (
                  <div className="adm-list-row" key={item.id}>
                    <div className="adm-list-icon adm-list-icon--amber">
                      <StatIcon name="megaphone" />
                    </div>
                    <div className="adm-list-body">
                      <div className="adm-list-title">{item.title}</div>
                      <div className="adm-list-meta">
                        <StatusBadge status={item.status} />
                        <span>{formatDate(item.publishDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Card 3: Agenda Kegiatan Terdekat (Bottom Left) */}
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3 className="adm-card-title">Agenda Kegiatan Terdekat</h3>
              <p className="adm-card-subtitle">Jadwal kegiatan akademik &amp; non-akademik</p>
            </div>
            <Link to="/admin/agenda" className="adm-card-link">
              <span>Kelola Semua</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </div>
          <div className="adm-card-body adm-card-body--pad0">
            {recent.agenda.length === 0 ? (
              <EmptyState
                title="Belum ada agenda terjadwal"
                description="Tambahkan jadwal kegiatan penting sekolah mendatang."
                action={<Link to="/admin/agenda" className="ui-btn ui-btn--primary ui-btn--sm">Tambah Agenda</Link>}
              />
            ) : (
              <div className="adm-list-rows">
                {recent.agenda.map((item) => (
                  <div className="adm-list-row" key={item.id}>
                    <div className="adm-list-icon adm-list-icon--red">
                      <StatIcon name="calendar" />
                    </div>
                    <div className="adm-list-body">
                      <div className="adm-list-title">{item.title}</div>
                      <div className="adm-list-meta">
                        <StatusBadge status={item.status} />
                        <span>{formatDate(item.date)}</span>
                        {item.startTime && <span>&bull; {item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</span>}
                        {item.location && <span className="adm-meta-pill">{item.location}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Card 4: Distribusi Akses Pengguna (Bottom Right) */}
        <section className="adm-card">
          <div className="adm-card-head">
            <div>
              <h3 className="adm-card-title">Distribusi Akses Pengguna</h3>
              <p className="adm-card-subtitle">Ringkasan hak akses pengguna terdaftar</p>
            </div>
            <Link to="/admin/users" className="adm-card-link">
              <span>Kelola Akun</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </Link>
          </div>
          <div className="adm-card-body adm-card-body--roles">
            <div className="adm-role-overview">
              <div className="adm-role-row">
                <div className="adm-role-label-wrap">
                  <RoleBadge role="SUPER_ADMIN" />
                </div>
                <div className="adm-role-bar-wrap">
                  <div className="adm-role-bar">
                    <div className="adm-role-fill adm-role-fill--super" style={{ width: '100%' }} />
                  </div>
                </div>
              </div>

              <div className="adm-role-row">
                <div className="adm-role-label-wrap">
                  <RoleBadge role="ADMIN" />
                </div>
                <div className="adm-role-bar-wrap">
                  <div className="adm-role-bar">
                    <div className="adm-role-fill adm-role-fill--admin" style={{ width: '85%' }} />
                  </div>
                </div>
              </div>

              <div className="adm-role-row">
                <div className="adm-role-label-wrap">
                  <RoleBadge role="GURU" />
                </div>
                <div className="adm-role-bar-wrap">
                  <div className="adm-role-bar">
                    <div className="adm-role-fill adm-role-fill--guru" style={{ width: '65%' }} />
                  </div>
                </div>
              </div>

              <div className="adm-role-row">
                <div className="adm-role-label-wrap">
                  <RoleBadge role="STAFF" />
                </div>
                <div className="adm-role-bar-wrap">
                  <div className="adm-role-bar">
                    <div className="adm-role-fill adm-role-fill--staff" style={{ width: '50%' }} />
                  </div>
                </div>
              </div>

              <div className="adm-role-row">
                <div className="adm-role-label-wrap">
                  <RoleBadge role="SISWA" />
                </div>
                <div className="adm-role-bar-wrap">
                  <div className="adm-role-bar">
                    <div className="adm-role-fill adm-role-fill--siswa" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Symmetrical Bottom Health & Stat Bar */}
            <div className="adm-system-health">
              <div className="adm-health-item">
                <span className="adm-health-dot" />
                <span>Database: <strong>PostgreSQL Terhubung</strong></span>
              </div>
              <div className="adm-health-item">
                <span>Siswa: <strong>{stats?.studentCount ?? 0} / {stats?.userCount ?? 0} Akun</strong></span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}