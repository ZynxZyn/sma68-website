import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import './PageCommon.css';

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

export default function VisiMisi() {
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
                <span>Visi &amp; Misi</span>
              </div>
              <h1 className="p-page-title">Visi &amp; <em>Misi</em> Kami</h1>
              <p className="p-page-subtitle">
                Arah haluan strategis SMA Negeri 68 Jakarta dalam mewujudkan insan cerdas, berkarakter
                luhur, dan berdaya saing global.
              </p>
            </div>


            {/* Visi Card */}
            <div className="p-visi-card">
              <div className="p-visi-tag">Visi Resmi SMAN 68 Jakarta</div>
              <blockquote className="p-visi-quote">
                "Terwujudnya insan yang beriman dan bertakwa kepada Tuhan Yang Maha Esa, berakhlak mulia,
                unggul dalam prestasi akademik dan non-akademik, berjiwa kewirausahaan, serta berwawasan
                lingkungan global."
              </blockquote>
            </div>

            {/* Misi Grid */}
            <div className="sec-header sec--centered" style={{ marginBottom: '36px' }}>
              <h2 className="sec-title">6 Misi <em>Strategis</em></h2>
              <p className="sec-sub">Enam pilar program kerja yang menjadi landasan operasional sekolah kami.</p>
            </div>

            <div className="p-misi-grid">
              {MISI.map((m) => (
                <div key={m.num} className="p-misi-card">
                  <div className="p-misi-num">{m.num}</div>
                  <h3 className="p-misi-title">{m.title}</h3>
                  <p className="p-misi-desc">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Nilai D-K-P */}
            <div className="p-nilai-banner">
              <div className="sec-header sec--centered" style={{ marginBottom: '36px' }}>
                <h2 className="sec-title">Tri Prasetya: <em>D · K · P</em></h2>
                <p className="sec-sub">Tiga pilar karakter yang tertanam kuat dalam setiap sivitas akademika SMAN 68.</p>
              </div>

              <div className="p-nilai-grid">
                {[
                  { letter: 'D', title: 'Disiplin', desc: 'Menjunjung tinggi ketertiban, ketepatan waktu, kejujuran akademik, dan tanggung jawab moral dalam setiap tindakan.' },
                  { letter: 'K', title: 'Kreasi', desc: 'Berani berinovasi, berpikir kritis, menciptakan karya orisinal, dan adaptif terhadap transformasi sains teknologi.' },
                  { letter: 'P', title: 'Prestasi', desc: 'Memiliki mentalitas juara tanpa henti menorehkan prestasi gemilang demi kemuliaan bangsa di panggung dunia.' },
                ].map((n) => (
                  <div key={n.letter} className="p-nilai-item">
                    <div className="p-nilai-letter">{n.letter}</div>
                    <h4>{n.title}</h4>
                    <p>{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-page navigation */}
            <div className="p-page-nav-footer">
              <Link to="/fasilitas" className="p-page-nav-btn">
                <span>Selanjutnya: Fasilitas Kampus</span>
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
