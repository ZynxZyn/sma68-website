import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="p-footer">
      <div className="container">

        {/* Main 4-Column Institutional Footer Grid */}
        <div className="p-footer-grid">

          {/* Col 1: Identity & Accreditation */}
          <div className="p-footer-col p-footer-col--brand">
            <a href="#beranda" className="p-footer-logo-link">
              <img src={logo} alt="Logo SMA Negeri 68 Jakarta" className="p-footer-logo" />
              <div>
                <span className="p-footer-school-name">SMA Negeri 68 Jakarta</span>
                <span className="p-footer-school-sub">Sekolah Unggulan DKI Jakarta</span>
              </div>
            </a>

            <p className="p-footer-brand-desc">
              Membentuk generasi pemimpin yang berintegritas, berwawasan global, dan berakhlak mulia
              berlandaskan budaya disiplin, kreasi, dan tradisi prestasi sejak tahun 1981.
            </p>

            <div className="p-footer-badge-row">
              <span className="p-footer-badge">Akreditasi A Unggul</span>
              <span className="p-footer-badge p-footer-badge--cyan">Kurikulum Merdeka</span>
            </div>
          </div>

          {/* Col 2: Navigasi Utama */}
          <div className="p-footer-col">
            <h4 className="p-footer-col-title">Navigasi Utama</h4>
            <ul className="p-footer-links">
              <li><Link to="/">Beranda Utama</Link></li>
              <li><Link to="/visi-misi">Visi &amp; Misi</Link></li>
              <li><Link to="/fasilitas">Fasilitas Kampus</Link></li>
              <li><Link to="/eskul">Ekstrakurikuler</Link></li>
              <li><a href="/#section-informasi">Berita &amp; Warta</a></li>
              <li><a href="/#section-informasi">Galeri Kegiatan</a></li>
            </ul>
          </div>



          {/* Col 3: Layanan & Portal */}
          <div className="p-footer-col">
            <h4 className="p-footer-col-title">Layanan &amp; Portal</h4>
            <ul className="p-footer-links">
              <li>
                <a href="#spmb">Penerimaan Murid Baru (SPMB)</a>
              </li>
              <li>
                <a href="https://ppdb.jakarta.go.id" target="_blank" rel="noopener noreferrer">
                  Portal PPDB DKI Jakarta &rarr;
                </a>
              </li>
              <li>
                <a href="#kontak">Layanan Informasi &amp; Humas</a>
              </li>
              <li>
                <Link to="/login">Portal Masuk (CMS Admin)</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Alamat & Kontak */}
          <div className="p-footer-col">
            <h4 className="p-footer-col-title">Kontak &amp; Lokasi</h4>
            <address className="p-footer-address">
              <p>
                <strong>Kampus SMAN 68 Jakarta</strong><br />
                Jl. Salemba Raya No. 18, Paseban, Kec. Senen, Jakarta Pusat 10440
              </p>
              <p>
                <span>Telp:</span> (021) 315 4713<br />
                <span>WA:</span> +62 812 6868 6800<br />
                <span>Email:</span> info@sman68jakarta.sch.id
              </p>
              <p className="p-footer-hours">
                <span>Jam Pelayanan:</span> Senin – Jumat, 07.00 – 15.30 WIB
              </p>
            </address>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="p-footer-bottom">
          <div className="p-footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} SMA Negeri 68 Jakarta. Hak Cipta Dilindungi Undang-Undang.</p>
            <span className="p-footer-motto">Disiplin &bull; Kreasi &bull; Prestasi</span>
          </div>

          <button
            type="button"
            className="p-footer-top-btn"
            onClick={scrollToTop}
            aria-label="Kembali ke atas halaman"
          >
            <span>Ke Atas</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}