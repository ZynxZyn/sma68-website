import profileBg from '../assets/foto-1.jpg';
import './Profile.css';

const STATS = [
  { num: '840', suffix: '+', label: 'Talenta Muda Berprestasi' },
  { num: '95', suffix: '%+', label: 'Diterima di UI, ITB & PTN Top' },
  { num: '10', suffix: 'Besar', label: 'Peringkat UTBK Tertinggi Nasional' },
  { num: '44', suffix: 'Tahun', label: 'Tradisi Juara & Kepemimpinan' },
];

export default function Profile() {
  return (
    <section className="p-section-bg" id="profil-singkat">
      {/* Background Gedung photo */}
      <div className="p-section-bg-media" aria-hidden="true">
        <img src={profileBg} alt="Kegiatan Siswa SMAN 68 Jakarta" loading="lazy" />
      </div>
      {/* Navy Scrim Overlay (60-70% alpha) */}
      <div className="p-section-bg-overlay" aria-hidden="true" />

      <div className="container">
        {/* Left-aligned layout */}
        <div className="p-profile-left-layout">
          <div className="sec-pill-wrap">
            <span className="sec-pill sec-pill--primary" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', borderColor: 'rgba(6, 182, 212, 0.35)' }}>
              ✦ SEJARAH &amp; PRESTASI SALEMBA
            </span>
          </div>
          <h2 className="sec-title sec-title--on-dark">
            Kawah Candradimuka Pemimpin Masa Depan di Jantung Jakarta
          </h2>


          <p className="p-profile-lead">
            Berdiri megah di kawasan prestisius Salemba sejak 1981, <strong>SMA Negeri 68 Jakarta</strong> (Enam Delapan)
            telah menjadi rumah bagi ribuan pemikir kritis, inovator muda, dan generasi pemenang yang mengukir prestasi
            hingga kancah dunia.
          </p>

          <p className="p-profile-body">
            Kami menggabungkan kurikulum adaptif masa depan dengan ekosistem belajar yang suportif dan penuh inspirasi.
            Di sini, setiap potensi diasah secara maksimal — membimbing Anda tidak hanya menembus perguruan tinggi impian,
            tetapi juga tumbuh menjadi insan berintegritas tinggi yang siap memimpin perubahan.
          </p>

          {/* Key Metrics Grid */}
          <div className="p-profile-stats-grid" aria-label="Statistik Utama SMAN 68 Jakarta">
            {STATS.map((s) => (
              <div className="p-profile-stat-card" key={s.label}>
                <div className="p-profile-stat-num">
                  {s.num}
                  <small>{s.suffix}</small>
                </div>
                <div className="p-profile-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="p-profile-cta-group">
            <a href="#section-informasi" className="btn btn--accent">
              <span>Jelajahi Warta &amp; Prestasi</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#kepsek" className="btn btn--glass">
              Sambutan Kepala Sekolah
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}