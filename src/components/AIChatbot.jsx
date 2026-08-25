import { useEffect, useRef, useState } from 'react';
import './AIChatbot.css';


const KNOWLEDGE_BASE = [
  {
    keywords: ['spmb', 'ppdb', 'daftar', 'pendaftaran', 'jalur', 'zonasi', 'afirmasi', 'syarat', 'masuk'],
    response: '**Informasi SPMB / PPDB SMAN 68 Jakarta 2025/2026**\n\n• **Jalur Zonasi (50%):** Berdasarkan jarak radius domisili resmi wilayah DKI Jakarta.\n• **Jalur Prestasi (30%):** Berdasarkan nilai rapor akademik & sertifikat kejuaraan resmi.\n• **Jalur Afirmasi (15%):** Khusus penerima KJP Plus / afirmasi & disabilitas.\n• **Jalur Pindah Tugas (5%):** Anak guru / mutasi orang tua.\n\n*Pendaftaran online mandiri melalui portal resmi ppdb.jakarta.go.id tanpa pungutan biaya.*',
  },
  {
    keywords: ['profil', 'sejarah', 'tentang', 'alamat', 'lokasi', 'di mana', 'kontak', 'telepon'],
    response: '**Profil & Kontak SMAN 68 Jakarta**\n\n• **Alamat:** Jl. Salemba Raya No. 18, Kenari, Senen, Jakarta Pusat 10430\n• **Akreditasi:** A (Unggul)\n• **Telepon:** (021) 3142929\n• **Email:** info@sma68.sch.id / emailsman68@gmail.com\n• **Kepala Sekolah:** Tjahyani, M.Pd.\n• **Motto:** Disiplin, Kreasi, Prestasi',
  },
  {
    keywords: ['prestasi', 'juara', 'osn', 'utbk', 'ranking', 'peringkat', 'fls2n', 'lomba'],
    response: '**Catatan Prestasi Terkini SMAN 68 Jakarta**\n\n• **Top 10 Nasional UTBK** (Peringkat 5 Terbaik di DKI Jakarta)\n• **Medali Emas & Perak OSN 2025** bidang Sains & Matematika (TOSLA 68)\n• **Juara 1 Grand Prix Marching Band** DKI Jakarta (MBrass 68)\n• **Medali Perunggu FLS2N Nasional** Seni Tari Tradisional\n• **95%+ Lulusan Diterima di PTN Favorit** (UI, ITB, UGM, Unpad, ITS, Airlangga)',
  },
  {
    keywords: ['kurikulum', 'akademik', 'jurusan', 'ipa', 'ips', 'fase', 'merdeka', 'pelajaran'],
    response: '**Program Akademik SMAN 68 Jakarta**\n\n• **Kurikulum:** Kurikulum Merdeka Fase E & F\n• **Fokus Pembelajaran:** Pembinaan olimpiade sains (TOSLA), riset ilmiah remaja (KIR), literasi digital, penguasaan bahasa asing, dan kepemimpinan berwawasan lingkungan.',
  },
  {
    keywords: ['ekskul', 'ekstrakurikuler', 'klub', 'organisasi', 'osis', 'mpk', 'rohis', 'marching', 'futsal', 'basket'],
    response: '**Ekstrakurikuler & Organisasi SMAN 68 Jakarta**\n\n• **Kepemimpinan:** OSIS, MPK, Paskibra, Pramuka, PMR, Elpala (Pecinta Alam)\n• **Akademik & Riset:** TOSLA (Olimpiade Sains), KIR, Solitaire (English Club), Jacussie\n• **Seni & Kreativitas:** MBrass 68 (Marching Band), Roxxels (Modern Dance), Tracesight (Tari Tradisional), Teater\n• **Olahraga:** Futsal, Basket, Bulutangkis, Softball, Silat',
  },
  {
    keywords: ['fasilitas', 'sarpras', 'gedung', 'lab', 'laboratorium', 'perpustakaan', 'menza'],
    response: '**Sarana & Prasarana SMAN 68 Jakarta**\n\n• 24 Ruang Kelas Ber-AC dengan Smart Interactive Display\n• Laboratorium Sains (Fisika, Kimia, Biologi) & Komputer TIK Modern\n• Perpustakaan Digital Berstandar Nasional\n• Gedung Pertemuan Menza & Lapangan Olahraga Multifungsi\n• Masjid Darul Ulum & Studio Audio Visual Multimedia',
  },
];

const DEFAULT_RESPONSE =
  'Terima kasih atas pertanyaannya. Sebagai Asisten AI SMAN 68 Jakarta, saya dapat memberikan informasi seputar:\n\n• Alur & Persyaratan SPMB / PPDB\n• Profil & Sejarah Sekolah\n• Prestasi Akademik & Ranking UTBK\n• Ekstrakurikuler & Organisasi Siswa\n• Fasilitas Sarana Prasarana\n\nSilakan pilih salah satu topik di bawah atau sampaikan pertanyaan Anda.';

function getAIResponse(input) {
  const lower = input.toLowerCase().trim();
  const match = KNOWLEDGE_BASE.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );
  return match ? match.response : DEFAULT_RESPONSE;
}

function formatResponse(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Halo! Saya **Asisten AI SMAN 68 Jakarta**.\nAda informasi seputar sekolah atau SPMB 2025/2026 yang ingin Anda ketahui?',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setMessages((prev) => [...prev, { from: 'user', text: query }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: getAIResponse(query) },
      ]);
    }, 500);
  };

  const quickChips = [
    'Syarat & Jalur SPMB 2025',
    'Prestasi & Ranking UTBK',
    'Ekstrakurikuler Sekolah',
    'Lokasi & Kontak SMAN 68',
  ];

  return (
    <aside className="p-ai-chat-root" aria-label="Asisten AI SMA 68">
      {/* Floating Toggle Button (§3.7: Bulat Accent #06B6D4) */}
      <button
        type="button"
        className={`p-ai-fab ${open ? 'active' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Tutup Asisten AI' : 'Buka Asisten AI SMAN 68'}
        aria-expanded={open}
      >
        <span className="p-ai-fab-pulse" aria-hidden="true" />
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Floating Chatbox Panel */}
      {open && (
        <div className="p-ai-panel" role="dialog" aria-modal="true" aria-labelledby="ai-chat-title">
          {/* Header (§3.7) */}
          <div className="p-ai-header">
            <div className="p-ai-header-info">
              <div className="p-ai-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="10" rx="2" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line x1="8" y1="16" x2="8" y2="16" />
                  <line x1="16" y1="16" x2="16" y2="16" />
                </svg>
              </div>
              <div>
                <h3 id="ai-chat-title" className="p-ai-title">Asisten SMA 68</h3>
                <span className="p-ai-status">
                  <span className="p-ai-status-dot" /> AI Online · Siap Membantu
                </span>
              </div>
            </div>
            <button
              type="button"
              className="p-ai-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Tutup Chat"
            >
              ×
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-ai-body" ref={chatBodyRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`p-ai-bubble-row ${m.from}`}>
                <div
                  className={`p-ai-bubble ${m.from}`}
                  dangerouslySetInnerHTML={{ __html: formatResponse(m.text) }}
                />
              </div>
            ))}

            {typing && (
              <div className="p-ai-bubble-row bot">
                <div className="p-ai-bubble bot p-ai-typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {/* Quick Chips */}
          <div className="p-ai-chips">
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="p-ai-chip-btn"
                onClick={() => handleSend(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            className="p-ai-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              placeholder="Tanyakan info sekolah, SPMB..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="p-ai-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-ai-send-btn"
              aria-label="Kirim pesan"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}