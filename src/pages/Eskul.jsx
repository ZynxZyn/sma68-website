import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import foto1 from '../assets/foto-1.jpg';
import foto2 from '../assets/foto-2.webp';
import foto4 from '../assets/foto-4.jpg';
import './PageCommon.css';

const ESKUL = [
  { name: 'TOSLA 68', sub: 'Tim Olimpiade Sains', cat: 'akademik', desc: 'Wadah pembinaan intensif juara OSN Matematika, Fisika, Kimia, Biologi, Astronomi, Kebumian, dan Informatika.', badge: 'Juara OSN Nasional' },
  { name: 'KIR 68', sub: 'Karya Ilmiah Remaja', cat: 'akademik', desc: 'Riset sains terapan, inovasi bioteknologi, ilmu sosial humaniora, dan penulisan karya ilmiah bertaraf nasional.', badge: 'Riset Inovasi' },
  { name: 'Solitaire 68', sub: 'English Debate & Speech', cat: 'akademik', desc: 'Klub debat bahasa Inggris parlementer, pidato publik, Model United Nations (MUN), dan storytelling.', badge: 'Kompetisi Bahasa' },
  { name: 'MBrass 68', sub: 'Marching Band & Brass Band', cat: 'seni', desc: 'Grup drum corps legendaris peraih gelar Juara Umum Grand Prix Marching Band tingkat provinsi dan nasional.', badge: 'Juara Umum GPJB' },
  { name: 'Tracesight 68', sub: 'Tari Tradisional Nusantara', cat: 'seni', desc: 'Melestarikan kekayaan seni tari nusantara dari Sabang sampai Merauke dan peraih medali di ajang FLS2N Nasional.', badge: 'Medali FLS2N' },
  { name: 'Roxxels 68', sub: 'Modern Dance & Hip Hop', cat: 'seni', desc: 'Komunitas tari modern dan koreografi dinamis yang rutin tampil di ajang DBL Dance Competition dan festival pelajar.', badge: 'DBL Dance Finalist', image: foto2 },
  { name: 'Teater 68 & Paduan Suara', sub: 'Seni Peran & Olah Vokal', cat: 'seni', desc: 'Eksplorasi seni peran, monolog teaterikal, sastra drama, serta paduan suara vokal harmoni (Voice of 68).', badge: 'Seni Panggung' },
  { name: 'Basket 68 (Men & Women)', sub: 'Tim Basket DBL', cat: 'olahraga', desc: 'Tim bola basket putra dan putri yang berkompetisi di liga basket pelajar terbesar DBL Jakarta Championship.', badge: 'Liga DBL Jakarta', image: foto1 },
  { name: 'Futsal & Sepakbola 68', sub: 'Tim Futsal Utama', cat: 'olahraga', desc: 'Pembinaan teknik, taktik, dan fisik olahraga futsal dengan sederet trofi turnamen antar-SMA se-Jabodetabek.', badge: 'Turnamen Jabodetabek' },
  { name: 'Bulu Tangkis & Softball', sub: 'Cabang Olahraga Pilihan', cat: 'olahraga', desc: 'Pengembangan ketangkasan atlet bulutangkis dan tim softball 68 di berbagai kejuaraan resmi tingkat daerah.', badge: 'O2SN & Kejurda' },
  { name: 'Paskibra 68', sub: 'Pasukan Pengibar Bendera', cat: 'kepemimpinan', desc: 'Membina kedisiplinan tinggi, baris-berbaris presisi, ketahanan mental, dan delegasi paskibraka kota hingga nasional.', badge: 'Paskibraka Terpilih' },
  { name: 'Pramuka Inti 68', sub: 'Gugus Depan Salemba', cat: 'kepemimpinan', desc: 'Pendidikan kepanduan, survival alam bebas, kepemimpinan regu, serta kepedulian sosial kemasyarakatan.', badge: 'Pramuka Garuda' },
  { name: 'Elpala 68', sub: 'Eksplorasi Pecinta Alam', cat: 'kepemimpinan', desc: 'Navigasi darat, pendakian gunung, panjat dinding, konservasi hutan, dan aksi tanggap darurat bencana.', badge: 'Pecinta Alam Sejak 1983' },
  { name: 'PMR Wira 68', sub: 'Palang Merah Remaja', cat: 'kepemimpinan', desc: 'Layanan pertolongan pertama pada kecelakaan (PPGD), bakti sosial donor darah, dan kesiapsiagaan kesehatan remaja.', badge: 'Relawan Kemanusiaan', image: foto4 },
  { name: 'Rohis & Rohkris 68', sub: 'Kerohanian Siswa', cat: 'kepemimpinan', desc: 'Wadah penguatan keimanan, kajian keagamaan, kepedulian sosial, serta jalinan toleransi harmonis antarumat.', badge: 'Karakter & Spiritual' },
];


const FILTERS = [
  { key: 'all', label: 'Semua Eskul' },
  { key: 'akademik', label: 'Akademik & Riset' },
  { key: 'seni', label: 'Seni & Musik' },
  { key: 'olahraga', label: 'Olahraga' },
  { key: 'kepemimpinan', label: 'Kepemimpinan & Sosial' },
];

export default function Eskul() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? ESKUL : ESKUL.filter((e) => e.cat === filter);

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
                <span>Ekstrakurikuler</span>
              </div>
              <h1 className="p-page-title">Ekstrakurikuler <em>Unggulan</em></h1>
              <p className="p-page-subtitle">
                Lebih dari sekadar belajar — temukan minat sejatimu, bangun persahabatan seumur hidup,
                dan ukir prestasi membanggakan bersama <strong>15+ organisasi &amp; eskul juara</strong>.
              </p>
            </div>


            <div className="sec-header sec--centered" style={{ marginBottom: '36px' }}>
              <h2 className="sec-title">Temukan <em>Eskul-mu</em></h2>
              <p className="sec-sub">Gunakan filter kategori untuk menemukan kegiatan yang sesuai dengan minat dan bakatmu.</p>
            </div>

            {/* Filter Tabs */}
            <div className="p-eskul-filter-bar">
              {FILTERS.map((f) => {
                const count = f.key === 'all' ? ESKUL.length : ESKUL.filter((e) => e.cat === f.key).length;
                return (
                  <button
                    key={f.key}
                    type="button"
                    className={`p-eskul-filter-btn${filter === f.key ? ' active' : ''}`}
                    onClick={() => setFilter(f.key)}
                  >
                    <span>{f.label}</span>
                    <span className="p-eskul-count">{count}</span>
                  </button>
                );
              })}
            </div>


            {/* Eskul Grid */}
            <div className="p-eskul-grid">
              {filtered.map((e) => (
                <div key={e.name} className="p-eskul-card">
                  {e.image ? (
                    <div className="p-eskul-thumb">
                      <img src={e.image} alt={e.name} loading="lazy" />
                    </div>
                  ) : (
                    <div className="p-eskul-thumb p-thumb-no-image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>NO IMAGE</span>
                    </div>
                  )}
                  <div className="p-eskul-card-body">
                    <div className="p-eskul-header">
                      <span className="p-eskul-badge">{e.badge}</span>
                    </div>
                    <h3 className="p-eskul-name">{e.name}</h3>
                    <div className="p-eskul-sub">{e.sub}</div>
                    <p className="p-eskul-desc">{e.desc}</p>
                  </div>
                </div>

              ))}
            </div>


            {/* CTA */}
            <div className="p-page-cta-box">
              <div className="p-page-cta-content">
                <h3>Siap Menjadi Bagian dari Tradisi Juara SMAN 68?</h3>
                <p>Pendaftaran Murid Baru (SPMB 2025/2026) telah dibuka. Mulai perjalanan inspiratif Anda sekarang.</p>
              </div>
              <div className="p-page-cta-actions">
                <a href="https://ppdb.jakarta.go.id" target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--lg">
                  <span>Daftar SPMB Online</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </a>
                <Link to="/#kontak" className="btn btn--glass btn--lg">Hubungi Panitia</Link>
              </div>
            </div>

            {/* Cross-page navigation */}
            <div className="p-page-nav-footer">
              <Link to="/fasilitas" className="p-page-nav-btn p-page-nav-btn--back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                <span>Fasilitas Kampus</span>
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
