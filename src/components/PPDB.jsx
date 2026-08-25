import heroKegiatan from '../assets/hero-2.png';
import './PPDB.css';

const JALUR = [
  {
    name: 'Jalur Zonasi',
    quota: '50%',
    desc: 'Prioritas penerimaan berdasarkan radius tempat tinggal di wilayah DKI Jakarta secara transparan.',
  },
  {
    name: 'Jalur Prestasi',
    quota: '30%',
    desc: 'Peluang emas bagi peraih nilai rapor akademik unggulan dan sertifikat juara resmi berjenjang.',
  },
  {
    name: 'Jalur Afirmasi',
    quota: '15%',
    desc: 'Dukungan pendidikan inklusif bagi pemegang KJP Plus, PIP, anak panti, serta penyandang disabilitas.',
  },
  {
    name: 'Pindah Tugas',
    quota: '5%',
    desc: 'Kemudahan akses bagi putra-putri pendidik/guru dan perpindahan tugas kedinasan resmi orang tua.',
  },
];

export default function PPDB() {
  return (
    <section className="p-section-bg p-spmb-section" id="spmb">
      {/* Background Kegiatan photo (§2.5) */}
      <div className="p-section-bg-media" aria-hidden="true">
        <img src={heroKegiatan} alt="Aktivitas dan Pembinaan Siswa SMAN 68 Jakarta" loading="lazy" />
      </div>
      {/* Navy Scrim Overlay */}
      <div className="p-section-bg-overlay p-spmb-overlay" aria-hidden="true" />

      <div className="container">
        <div className="p-spmb-inner">
          <h2 className="sec-title sec-title--on-dark p-spmb-title">
            Wujudkan Impianmu Meraih Masa Depan Gemilang Bersama Enam Delapan
          </h2>

          <p className="sec-sub sec-sub--on-dark p-spmb-desc">
            Penerimaan Murid Baru (SPMB / PPDB) Tahun Ajaran 2025/2026 telah dibuka.
            Bersiaplah menjadi bagian dari tradisi keunggulan akademik dan kepemimpinan di SMA Negeri 68 Jakarta.
          </p>

          {/* Quota breakdown cards */}
          <div className="p-spmb-quota-grid" aria-label="Jalur & Kuota Penerimaan">
            {JALUR.map((j) => (
              <div className="p-spmb-quota-card" key={j.name}>
                <div className="p-spmb-quota-top">
                  <span className="p-spmb-quota-name">{j.name}</span>
                  <span className="p-spmb-quota-val">{j.quota}</span>
                </div>
                <p className="p-spmb-quota-desc">{j.desc}</p>
              </div>
            ))}
          </div>

          {/* Primary CTA button */}
          <div className="p-spmb-cta-group">
            <a
              href="https://ppdb.jakarta.go.id"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--accent btn--lg"
            >
              <span>Daftar SPMB Online Resmi</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#kontak" className="btn btn--glass btn--lg">
              Konsultasi &amp; Kontak Panitia
            </a>
          </div>

          <p className="p-spmb-disclaimer">
            * Pendaftaran resmi dilaksanakan secara terpusat melalui portal ppdb.jakarta.go.id tanpa dipungut biaya apapun (Gratis &amp; Terbuka).
          </p>
        </div>
      </div>
    </section>
  );
}