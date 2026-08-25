import { useEffect, useRef, useState } from 'react';
import foto1 from '../assets/foto-1.jpg';
import foto2 from '../assets/foto-2.webp';
import foto3 from '../assets/foto-3.jpg';
import foto4 from '../assets/foto-4.jpg';
import './Hero.css';

const SLIDES = [
  {
    img: foto1,
    alt: 'Kegiatan Upacara & Kunjungan Resmi di Lapangan Basket SMAN 68 Jakarta',
  },
  {
    img: foto2,
    alt: 'Kegembiraan Siswa SMAN 68 Jakarta di Hari Spesial Sekolah',
  },
  {
    img: foto3,
    alt: 'Suasana Belajar di Ruang Kelas SMAN 68 Jakarta',
  },
  {
    img: foto4,
    alt: 'Kegiatan Pembinaan & Seminar Kesehatan Remaja SMAN 68 Jakarta',
  },
];

const INTERVAL = 6000;

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (isPaused) return;
    timer.current = setInterval(next, INTERVAL);
    return () => clearInterval(timer.current);
  }, [isPaused, idx]);

  function next() {
    setIdx((i) => (i + 1) % SLIDES.length);
  }

  function prev() {
    setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }

  function go(i) {
    setIdx(i);
  }

  function scrollTo(e, target) {
    e.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      className="p-hero"
      id="beranda"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with subtle crossfade & Ken Burns */}
      <div className="p-hero-slides">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`p-hero-slide${i === idx ? ' active' : ''}`}
            aria-hidden={i !== idx}
          >
            <img src={s.img} alt={s.alt} loading={i === 0 ? 'eager' : 'lazy'} />
          </div>
        ))}
      </div>

      {/* Layered Navy Scrim & Atmospheric Radial Glow */}
      <div className="p-hero-overlay" />
      <div className="p-hero-ambient-glow" aria-hidden="true" />

      {/* Side Slide Navigation Arrows (Desktop) */}
      <button
        type="button"
        className="p-hero-nav-btn p-hero-nav-btn--prev"
        onClick={prev}
        aria-label="Slide sebelumnya"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="p-hero-nav-btn p-hero-nav-btn--next"
        onClick={next}
        aria-label="Slide berikutnya"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="container">
        <div className="p-hero-inner">

          {/* Hero Main Headline */}
          <h1 className="p-hero-title">
            Disiplin, Kreasi, <em>Prestasi.</em>
          </h1>

          <p className="p-hero-desc">
            Membina insan berwibawa dan berdaya saing global melalui pendidikan berkualitas
            serta pembinaan karakter sejak 1981.
          </p>

          {/* Action CTA Buttons */}
          <div className="p-hero-cta">
            <a
              href="#spmb"
              onClick={(e) => scrollTo(e, '#spmb')}
              className="btn btn--accent btn--lg p-hero-cta-btn"
            >
              <span>Daftar SPMB 2025/2026</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a
              href="#profil-singkat"
              onClick={(e) => scrollTo(e, '#profil-singkat')}
              className="btn btn--glass btn--lg p-hero-cta-btn"
            >
              <span>Jelajahi Profil</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>

        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="p-hero-dots" role="tablist" aria-label="Navigasi slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`p-hero-dot${i === idx ? ' active' : ''}`}
            onClick={() => go(i)}
            aria-label={`Pilih slide ${i + 1}`}
            role="tab"
            aria-selected={i === idx}
          >
            <span />
          </button>
        ))}
      </div>


      {/* Scroll down indicator */}
      <a
        href="#profil-singkat"
        className="p-hero-scroll"
        onClick={(e) => scrollTo(e, '#profil-singkat')}
        aria-label="Scroll ke profil singkat"
      >
        <span className="p-hero-scroll-mouse" aria-hidden="true">
          <span className="p-hero-scroll-wheel" />
        </span>
      </a>
    </section>
  );
}