import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import Kepsek from './components/Kepsek';
import SectionInformasi from './components/SectionInformasi';
import PPDB from './components/PPDB';
import Kontak from './components/Kontak';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import './App.css';

function App() {
  return (
    <div className="app-main">
      <a href="#konten-utama" className="skip-link">
        Lewati ke konten utama
      </a>
      <Navbar />
      <main id="konten-utama">
        {/* Homepage structure: Hero → Profil Singkat → Kepsek → Section Informasi (Tabs) → SPMB CTA → Kontak */}
        <Hero />
        <Profile />
        <Kepsek />
        <SectionInformasi />
        <PPDB />
        <Kontak />
      </main>
      <Footer />
      {/* AI Chatbox — global floating */}
      <AIChatbot />
    </div>
  );
}

export default App;