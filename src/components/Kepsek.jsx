import heroGedung from '../assets/hero-3.png';
import schoolLogo from '../assets/logo.png';
import kepsekPhoto from '../assets/kepsek.png';
import './Kepsek.css';

export default function Kepsek() {
  return (
    <section className="p-section-bg p-kepsek-section" id="kepsek">
      {/* Background Gedung photo base layer */}
      <div className="p-section-bg-media" aria-hidden="true">
        <img src={heroGedung} alt="Gedung Kampus SMA Negeri 68 Jakarta" loading="lazy" />
      </div>
      {/* Navy Scrim Overlay */}
      <div className="p-section-bg-overlay p-kepsek-overlay" aria-hidden="true" />

      <div className="container">
        {/* Layered Composition: Sambutan di kiri (rata kanan), Foto Kepsek di kanan */}
        <div className="p-kepsek-layered-card p-kepsek-layered-card--reversed">
          
          {/* Left Column: Quote / Sambutan (Rata Kanan) */}
          <div className="p-kepsek-content-col">
            <h2 className="p-kepsek-heading">
              "Pendidikan Terbaik Membuka Pintu Inovasi dan Menyalakan Impian Tanpa Batas."
            </h2>

            <div className="p-kepsek-quote-body">
              <p>
                Selamat datang di portal resmi SMA Negeri 68 Jakarta. Kami meyakini setiap anak muda
                memiliki benih keunggulan yang akan tumbuh dalam lingkungan belajar yang penuh motivasi,
                kreativitas, dan disiplin. Bersama para pendidik hebat, kami membekali peserta didik
                untuk berani bermimpi besar dan menjadi teladan bagi kemajuan bangsa.
              </p>
            </div>

            <div className="p-kepsek-sign-box">
              <div className="p-kepsek-name">Tjahyani, M.Pd.</div>
              <div className="p-kepsek-title">Kepala SMA Negeri 68 Jakarta</div>
            </div>
          </div>

          {/* Right Column: Foto Kepala Sekolah dengan shadow elevation */}
          <div className="p-kepsek-photo-col">
            <div className="p-kepsek-photo-frame">
              <div className="p-kepsek-photo-container">
                <div className="p-kepsek-avatar-badge">
                  <img src={schoolLogo} alt="Badge SMAN 68 Jakarta" className="p-kepsek-badge-img" />
                </div>
                <img
                  src={kepsekPhoto}
                  alt="Tjahyani, M.Pd. - Kepala SMA Negeri 68 Jakarta"
                  className="p-kepsek-real-photo"
                  loading="lazy"
                />
              </div>
              <div className="p-kepsek-badge-pill">
                <span>Kepala Sekolah</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
