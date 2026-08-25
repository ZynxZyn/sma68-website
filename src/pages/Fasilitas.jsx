import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import foto1 from '../assets/foto-1.jpg';
import foto3 from '../assets/foto-3.jpg';
import foto4 from '../assets/foto-4.jpg';
import './PageCommon.css';

const FASILITAS = [
  {
    title: '24 Ruang Kelas Digital Smartboard',
    cat: 'Ruang Belajar',
    desc: 'Dilengkapi pendingin udara (AC), proyektor interaktif/Smart TV, koneksi internet serat optik kecepatan tinggi, dan ergonomis.',
    icon: 'screen',
    image: foto3,
  },
  {
    title: 'Laboratorium Sains Terpadu',
    cat: 'Riset & Eksperimen',
    desc: 'Laboratorium Fisika, Kimia, dan Biologi lengkap dengan instrumen uji modern, mikroskop digital, dan standar keselamatan lab.',
    icon: 'flask',
  },
  {
    title: 'Laboratorium Komputer & TIK',
    cat: 'Teknologi Informasi',
    desc: 'Tiga ruang lab komputer multimedia modern untuk pembelajaran pemrograman, simulasi UTBK-SNBT, dan riset digital.',
    icon: 'cpu',
  },
  {
    title: 'Auditorium & Gedung Menza 68',
    cat: 'Gedung Serbaguna',
    desc: 'Gedung pertemuan dan pertunjukan seni berkapasitas 1.000 orang dengan tata suara profesional dan panggung pertunjukan megah.',
    icon: 'theater',
  },
  {
    title: 'Perpustakaan Digital Ki Hajar Dewantara',
    cat: 'Pusat Sumber Belajar',
    desc: 'Koleksi puluhan ribu buku fisik, ribuan e-book, jurnal ilmiah terakreditasi, ruang diskusi hening, dan e-catalog mandiri.',
    icon: 'book',
  },
  {
    title: 'Sarana Olahraga Multifungsi',
    cat: 'Kebugaran & Prestasi',
    desc: 'Lapangan basket standar kompetisi, lapangan futsal, voli, dan bulutangkis dengan tribun penonton yang representatif.',
    icon: 'activity',
    image: foto1,
  },
  {
    title: 'Masjid Darul Ulum SMAN 68',
    cat: 'Sarana Ibadah',
    desc: 'Pusat pembinaan spiritual berkapasitas 800 jamaah dengan tata kelola modern, ruang wudhu higienis, dan perpustakaan Islam.',
    icon: 'moon',
  },
  {
    title: 'UKS, Poliklinik & Ruang Konseling BK',
    cat: 'Layanan Kesehatan & Karir',
    desc: 'Fasilitas kesehatan siswa dengan tenaga medis berkala serta ruang bimbingan karir untuk konsultasi perguruan tinggi dan beasiswa.',
    icon: 'heart',
    image: foto4,
  },
];


function FacilityIcon({ name }) {
  const common = {
    width: 24, height: 24, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  switch (name) {
    case 'screen': return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case 'flask': return <svg {...common}><path d="M9 3h6M10 9h4M10 3v6l-4 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 22 18l-4-9V3" /></svg>;
    case 'cpu': return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
    case 'theater': return <svg {...common}><path d="M2 10s3-3 3-8M22 10s-3-3-3-8M12 2v20M2 10a10 10 0 0 0 20 0" /></svg>;
    case 'book': return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case 'activity': return <svg {...common}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
    case 'moon': return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
    case 'heart': return <svg {...common}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
    default: return null;
  }
}

export default function Fasilitas() {
  return (
    <div className="p-page">
      <Navbar />

      <main>
        {/* Content */}
        <section className="sec p-page-content">
          <div className="container">

            {/* Page Header */}
            <div className="p-page-header">
              <div className="p-page-breadcrumb-inline">
                <Link to="/">Beranda</Link>
                <span>/</span>
                <span>Fasilitas</span>
              </div>
              <h1 className="p-page-title">Fasilitas <em>Kampus Kami</em></h1>
              <p className="p-page-subtitle">
                Infrastruktur berstandar nasional dan ramah lingkungan untuk menunjang eksplorasi
                tanpa batas peserta didik — dari ruang kelas pintar hingga laboratorium riset mutakhir.
              </p>
            </div>


            <div className="sec-header sec--centered" style={{ marginBottom: '48px' }}>
              <h2 className="sec-title">8 Sarana &amp; <em>Fasilitas Unggulan</em></h2>
              <p className="sec-sub">Setiap sudut kampus dirancang untuk mendukung tumbuh kembang siswa secara holistik.</p>
            </div>

            <div className="p-fasilitas-grid">
              {FASILITAS.map((f) => (
                <div key={f.title} className="p-fasilitas-card">
                  {f.image ? (
                    <div className="p-fasilitas-thumb">
                      <img src={f.image} alt={f.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="p-fasilitas-thumb p-thumb-no-image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>NO IMAGE</span>
                    </div>
                  )}
                  <div className="p-fasilitas-card-body">
                    <div className="p-fasilitas-top">
                      <span className="p-fasilitas-icon">
                        <FacilityIcon name={f.icon} />
                      </span>
                      <span className="p-fasilitas-cat">{f.cat}</span>
                    </div>
                    <h3 className="p-fasilitas-title">{f.title}</h3>
                    <p className="p-fasilitas-desc">{f.desc}</p>
                  </div>
                </div>

              ))}
            </div>



            {/* Cross-page navigation */}
            <div className="p-page-nav-footer p-page-nav-footer--between">
              <Link to="/visi-misi" className="p-page-nav-btn p-page-nav-btn--back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                <span>Visi &amp; Misi</span>
              </Link>
              <Link to="/eskul" className="p-page-nav-btn">
                <span>Selanjutnya: Ekstrakurikuler</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
