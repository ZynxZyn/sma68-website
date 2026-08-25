import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import heroGedung from '../assets/hero-3.png';
import heroKegiatan from '../assets/hero-1.png';
import heroPrestasi from '../assets/hero-2.png';
import './Tentang.css';

/* ==========================================================================
   Data: Misi Strategis
   ========================================================================== */
const MISI = [
  {
    num: '01',
    title: 'Keimanan & Akhlak Mulia',
    desc: 'Menumbuhkembangkan penghayatan dan pengamalan nilai-nilai keagamaan serta budi pekerti luhur dalam kehidupan sehari-hari.',
  },
  {
    num: '02',
    title: 'Keunggulan Akademik Global',
    desc: 'Menyelenggarakan proses pembelajaran yang inovatif, kritis, kolaboratif, dan adaptif terhadap perkembangan sains serta teknologi masa depan.',
  },
  {
    num: '03',
    title: 'Pengembangan Bakat & Minat',
    desc: 'Memfasilitasi dan mengoptimalkan potensi peserta didik di bidang riset, seni, budaya, olahraga, dan kepemimpinan hingga tingkat internasional.',
  },
  {
    num: '04',
    title: 'Kultur Disiplin & Integritas',
    desc: 'Membangun ekosistem sekolah yang tertib, transparan, berkeadilan, dan menjunjung tinggi kejujuran serta tanggung jawab moral.',
  },
  {
    num: '05',
    title: 'Wawasan Lingkungan (Adiwiyata)',
    desc: 'Mewujudkan lingkungan sekolah yang bersih, sehat, asri, hemat energi, dan berbudaya ramah lingkungan hidup secara berkelanjutan.',
  },
  {
    num: '06',
    title: 'Kemitraan & Jejaring Global',
    desc: 'Memperluas kolaborasi dengan perguruan tinggi ternama, dunia usaha, industri kreatif, dan komunitas internasional.',
  },
];

/* ==========================================================================
   Data: Fasilitas Sekolah
   ========================================================================== */
const FASILITAS = [
  {
    title: '24 Ruang Kelas Digital Smartboard',
    cat: 'Ruang Belajar',
    desc: 'Dilengkapi pendingin udara (AC), proyektor interaktif/Smart TV, koneksi internet serat optik kecepatan tinggi, dan ergonomis.',
    icon: 'screen',
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
  },
];

/* ==========================================================================
   Data: Ekstrakurikuler (Eskul)
   ========================================================================== */
const ESKUL = [
  {
    name: 'TOSLA 68',
    sub: 'Tim Olimpiade Sains',
    cat: 'akademik',
    desc: 'Wadah pembinaan intensif juara OSN Matematika, Fisika, Kimia, Biologi, Astronomi, Kebumian, dan Informatika.',
    badge: 'Juara OSN Nasional',
  },
  {
    name: 'KIR 68',
    sub: 'Karya Ilmiah Remaja',
    cat: 'akademik',
    desc: 'Riset sains terapan, inovasi bioteknologi, ilmu sosial humaniora, dan penulisan karya ilmiah bertaraf nasional.',
    badge: 'Riset Inovasi',
  },
  {
    name: 'Solitaire 68',
    sub: 'English Debate & Speech',
    cat: 'akademik',
    desc: 'Klub debat bahasa Inggris parlementer, pidato publik, Model United Nations (MUN), dan storytelling.',
    badge: 'Kompetisi Bahasa',
  },
  {
    name: 'MBrass 68',
    sub: 'Marching Band & Brass Band',
    cat: 'seni',
    desc: 'Grup drum corps legendaris peraih gelar Juara Umum Grand Prix Marching Band tingkat provinsi dan nasional.',
    badge: 'Juara Umum GPJB',
  },
  {
    name: 'Tracesight 68',
    sub: 'Tari Tradisional Nusantara',
    cat: 'seni',
    desc: 'Melestarikan kekayaan seni tari nusantara dari Sabang sampai Merauke dan peraih medali di ajang FLS2N Nasional.',
    badge: 'Medali FLS2N',
  },
  {
    name: 'Roxxels 68',
    sub: 'Modern Dance & Hip Hop',
    cat: 'seni',
    desc: 'Komunitas tari modern dan koreografi dinamis yang rutin tampil di ajang DBL Dance Competition dan festival pelajar.',
    badge: 'DBL Dance Finalist',
  },
  {
    name: 'Teater 68 & Paduan Suara',
    sub: 'Seni Peran & Olah Vokal',
    cat: 'seni',
    desc: 'Eksplorasi seni peran, monolog teaterikal, sastra drama, serta paduan suara vokal harmoni (Voice of 68).',
    badge: 'Seni Panggung',
  },
  {
    name: 'Basket 68 (Men & Women)',
    sub: 'Tim Basket DBL',
    cat: 'olahraga',
    desc: 'Tim bola basket putra dan putri yang berkompetisi di liga basket pelajar terbesar DBL Jakarta Championship.',
    badge: 'Liga DBL Jakarta',
  },
  {
    name: 'Futsal & Sepakbola 68',
    sub: 'Tim Futsal Utama',
    cat: 'olahraga',
    desc: 'Pembinaan teknik, taktik, dan fisik olahraga futsal dengan sederet trofi turnamen antar-SMA se-Jabodetabek.',
    badge: 'Turnamen Jabodetabek',
  },
  {
    name: 'Bulu Tangkis & Softball',
    sub: 'Cabang Olahraga Pilihan',
    cat: 'olahraga',
    desc: 'Pengembangan ketangkasan atlet bulutangkis dan tim softball 68 di berbagai kejuaraan resmi tingkat daerah.',
    badge: 'O2SN & Kejurda',
  },
  {
    name: 'Paskibra 68',
    sub: 'Pasukan Pengibar Bendera',
    cat: 'kepemimpinan',
    desc: 'Membina kedisiplinan tinggi, baris-berbaris presisi, ketahanan mental, dan delegasi paskibraka kota hingga nasional.',
    badge: 'Paskibraka Terpilih',
  },
  {
    name: 'Pramuka Inti 68',
    sub: 'Gugus Depan Salemba',
    cat: 'kepemimpinan',
    desc: 'Pendidikan kepanduan, survival alam bebas, kepemimpinan regu, serta kepedulian sosial kemasyarakatan.',
    badge: 'Pramuka Garuda',
  },
  {
    name: 'Elpala 68',
    sub: 'Eksplorasi Pecinta Alam',
    cat: 'kepemimpinan',
    desc: 'Navigasi darat, pendakian gunung, panjat dinding, konservasi hutan, dan aksi tanggap darurat bencana.',
    badge: 'Pecinta Alam Sejak 1983',
  },
  {
    name: 'PMR Wira 68',
    sub: 'Palang Merah Remaja',
    cat: 'kepemimpinan',
    desc: 'Layanan pertolongan pertama pada kecelakaan (PPGD), bakti sosial donor darah, dan kesiapsiagaan kesehatan remaja.',
    badge: 'Relawan Kemanusiaan',
  },
  {
    name: 'Rohis & Rohkris 68',
    sub: 'Kerohanian Siswa',
    cat: 'kepemimpinan',
    desc: 'Wadah penguatan keimanan, kajian keagamaan, kepedulian sosial, serta jalinan toleransi harmonis antarumat.',
    badge: 'Karakter & Spiritual',
  },
];

/* Helper Icon Component */
function FacilityIcon({ name }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (name) {
    case 'screen':
      return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
    case 'flask':
      return <svg {...common}><path d="M9 3h6M10 9h4M10 3v6l-4 9a2 2 0 0 0 1.7 3h12.6A2 2 0 0 0 22 18l-4-9V3" /></svg>;
    case 'cpu':
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
    case 'theater':
      return <svg {...common}><path d="M2 10s3-3 3-8M22 10s-3-3-3-8M12 2v20M2 10a10 10 0 0 0 20 0" /></svg>;
    case 'book':
      return <svg {...common}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
    case 'activity':
      return <svg {...common}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
    case 'moon':
      return <svg {...common}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>;
    case 'heart':
      return <svg {...common}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>;
    default:
      return null;
  }
}

export default function Tentang() {
  const location = useLocation();
  const [eskulFilter, setEskulFilter] = useState('all');

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.hash, location.pathname]);

  const filteredEskul = eskulFilter === 'all'
    ? ESKUL
    : ESKUL.filter((e) => e.cat === eskulFilter);


  return (
    <div className="p-tentang-page">
      <Navbar />

      <main id="konten-utama">
        {/* ==========================================================================
            HERO HEADER SECTION
            ========================================================================== */}
        <section className="p-tentang-hero">
          <div className="p-tentang-hero-bg">
            <img src={heroGedung} alt="Gedung SMAN 68 Jakarta" />
          </div>
          <div className="p-tentang-hero-overlay" />

          <div className="container p-tentang-hero-inner">
            <div className="p-tentang-badge">
              <span className="p-tentang-badge-dot" />
              <span>Profil Lengkap &bull; SMAN 68 Jakarta</span>
            </div>

            <h1 className="p-tentang-hero-title">
              Mengenal Lebih Dekat <em>Enam Delapan</em>
            </h1>

            <p className="p-tentang-hero-desc">
              Pusat keunggulan akademik, wadah pembinaan karakter juara, dan ekosistem kreatif
              pencetak generasi pemimpin berdaya saing global sejak tahun 1981.
            </p>

            {/* Quick Navigation Jump Bar */}
            <div className="p-tentang-nav-pills">
              <a href="#visi-misi" className="p-tentang-nav-pill">Visi &amp; Misi</a>
              <a href="#fasilitas" className="p-tentang-nav-pill">Fasilitas Kampus</a>
              <a href="#ekstrakurikuler" className="p-tentang-nav-pill">Ekstrakurikuler</a>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            SECTION 1: VISI, MISI & NILAI UTAMA
            ========================================================================== */}
        <section className="sec p-tentang-sec" id="visi-misi">
          <div className="container">
            
            <div className="sec-header sec--centered">
              <h2 className="sec-title">
                Visi, Misi &amp; Nilai Dasar <em>Institusi</em>
              </h2>
              <p className="sec-sub">
                Arah haluan strategis SMA Negeri 68 Jakarta dalam mewujudkan insan cerdas berkarakter luhur.
              </p>
            </div>

            {/* Visi Card */}
            <div className="p-tentang-visi-card">
              <div className="p-tentang-visi-tag">Visi Resmi SMAN 68 Jakarta</div>
              <blockquote className="p-tentang-visi-quote">
                "Terwujudnya insan yang beriman dan bertakwa kepada Tuhan Yang Maha Esa, berakhlak mulia,
                unggul dalam prestasi akademik dan non-akademik, berjiwa kewirausahaan, serta berwawasan lingkungan global."
              </blockquote>
            </div>

            {/* Misi Grid */}
            <div className="p-tentang-misi-grid">
              {MISI.map((m) => (
                <div key={m.num} className="p-tentang-misi-card">
                  <div className="p-tentang-misi-num">{m.num}</div>
                  <h3 className="p-tentang-misi-title">{m.title}</h3>
                  <p className="p-tentang-misi-desc">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Nilai Dasar D-K-P */}
            <div className="p-tentang-nilai-banner">
              <div className="p-tentang-nilai-header">
                <h3>Nilai Luhur Tri Prasetya: Disiplin, Kreasi, Prestasi</h3>
                <p>Tiga pilar karakter yang tertanam kuat dalam setiap langkah sivitas akademika SMAN 68 Jakarta.</p>
              </div>

              <div className="p-tentang-nilai-grid">
                <div className="p-tentang-nilai-item">
                  <div className="p-tentang-nilai-letter">D</div>
                  <h4>Disiplin</h4>
                  <p>Menjunjung tinggi ketertiban, ketepatan waktu, kejujuran akademik, dan tanggung jawab moral dalam setiap tindakan.</p>
                </div>

                <div className="p-tentang-nilai-item">
                  <div className="p-tentang-nilai-letter">K</div>
                  <h4>Kreasi</h4>
                  <p>Berani berinovasi, berpikir kritis, menciptakan karya orisinal, dan adaptif terhadap transformasi sains teknologi.</p>
                </div>

                <div className="p-tentang-nilai-item">
                  <div className="p-tentang-nilai-letter">P</div>
                  <h4>Prestasi</h4>
                  <p>Memiliki mentalitas juara tanpa henti menorehkan prestasi gemilang demi kemuliaan bangsa di panggung dunia.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==========================================================================
            SECTION 2: FASILITAS KAMPUS SALEMBA
            ========================================================================== */}
        <section className="sec sec--soft p-tentang-sec" id="fasilitas">
          <div className="container">

            <div className="sec-header sec--centered">
              <h2 className="sec-title">
                Sarana &amp; Fasilitas <em>Modern Kampus</em>
              </h2>
              <p className="sec-sub">
                Infrastruktur berstandar nasional dan ramah lingkungan untuk menunjang eksplorasi tanpa batas peserta didik.
              </p>
            </div>

            <div className="p-tentang-fasilitas-grid">
              {FASILITAS.map((f) => (
                <div key={f.title} className="p-tentang-fasilitas-card">
                  <div className="p-tentang-fasilitas-top">
                    <span className="p-tentang-fasilitas-icon">
                      <FacilityIcon name={f.icon} />
                    </span>
                    <span className="p-tentang-fasilitas-cat">{f.cat}</span>
                  </div>
                  <h3 className="p-tentang-fasilitas-title">{f.title}</h3>
                  <p className="p-tentang-fasilitas-desc">{f.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ==========================================================================
            SECTION 3: EKSTRAKURIKULER (ESKUL)
            ========================================================================== */}
        <section className="sec p-tentang-sec" id="ekstrakurikuler">
          <div className="container">

            <div className="sec-header sec--centered">
              <h2 className="sec-title">
                Ruang Dinamika &amp; <em>Ekstrakurikuler Siswa</em>
              </h2>
              <p className="sec-sub">
                Lebih dari sekadar belajar, temukan minat sejatimu, bangun persahabatan seumur hidup, dan raih prestasi membanggakan.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="p-tentang-eskul-filters">
              <button
                type="button"
                className={`p-tentang-eskul-btn ${eskulFilter === 'all' ? 'active' : ''}`}
                onClick={() => setEskulFilter('all')}
              >
                Semua Eskul ({ESKUL.length})
              </button>
              <button
                type="button"
                className={`p-tentang-eskul-btn ${eskulFilter === 'akademik' ? 'active' : ''}`}
                onClick={() => setEskulFilter('akademik')}
              >
                Akademik &amp; Riset
              </button>
              <button
                type="button"
                className={`p-tentang-eskul-btn ${eskulFilter === 'seni' ? 'active' : ''}`}
                onClick={() => setEskulFilter('seni')}
              >
                Seni &amp; Musik
              </button>
              <button
                type="button"
                className={`p-tentang-eskul-btn ${eskulFilter === 'olahraga' ? 'active' : ''}`}
                onClick={() => setEskulFilter('olahraga')}
              >
                Olahraga &amp; Bela Diri
              </button>
              <button
                type="button"
                className={`p-tentang-eskul-btn ${eskulFilter === 'kepemimpinan' ? 'active' : ''}`}
                onClick={() => setEskulFilter('kepemimpinan')}
              >
                Kepemimpinan &amp; Sosial
              </button>
            </div>

            {/* Eskul Grid */}
            <div className="p-tentang-eskul-grid">
              {filteredEskul.map((e) => (
                <div key={e.name} className="p-tentang-eskul-card">
                  <div className="p-tentang-eskul-header">
                    <span className="p-tentang-eskul-badge">{e.badge}</span>
                  </div>
                  <h3 className="p-tentang-eskul-name">{e.name}</h3>
                  <div className="p-tentang-eskul-sub">{e.sub}</div>
                  <p className="p-tentang-eskul-desc">{e.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Join */}
            <div className="p-tentang-cta-box">
              <div className="p-tentang-cta-content">
                <h3>Siap Menjadi Bagian dari Tradisi Juara SMAN 68 Jakarta?</h3>
                <p>Pendaftaran Murid Baru (SPMB 2025/2026) telah dibuka. Mulai perjalanan inspiratif Anda sekarang.</p>
              </div>
              <div className="p-tentang-cta-actions">
                <a href="https://ppdb.jakarta.go.id" target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--lg">
                  <span>Daftar SPMB Online</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
                <Link to="/#kontak" className="btn btn--glass btn--lg">
                  Hubungi Panitia
                </Link>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
