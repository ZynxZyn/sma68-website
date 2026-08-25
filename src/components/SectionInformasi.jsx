import { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import { newsApi, achievementApi, galleryApi } from '../api/services';
import './SectionInformasi.css';

export default function SectionInformasi() {
  const [activeTab, setActiveTab] = useState('berita'); // 'berita' | 'prestasi' | 'galeri'

  // Live CMS State — starts empty, populated from database
  const [beritaData, setBeritaData] = useState([]);
  const [prestasiData, setPrestasiData] = useState([]);
  const [galeriData, setGaleriData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Modal State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [selectedPrestasi, setSelectedPrestasi] = useState(null);
  const [selectedGaleri, setSelectedGaleri] = useState(null);

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');

  // Fetch Live Data from CMS Backend
  useEffect(() => {
    async function fetchCmsData() {
      setIsLoading(true);
      try {
        const [newsRes, achRes, galRes] = await Promise.allSettled([
          newsApi.list({ limit: 12, status: 'PUBLISHED' }),
          achievementApi.list({ limit: 20 }),
          galleryApi.list({ limit: 12 }),
        ]);

        if (newsRes.status === 'fulfilled' && newsRes.value?.items?.length > 0) {
          const mappedNews = newsRes.value.items.map((n) => ({
            id: n.id,
            title: n.title,
            category: n.category || 'Warta',
            date: n.publishedAt ? n.publishedAt.slice(0, 10) : '2026-01-01',
            summary: n.excerpt || n.content?.slice(0, 140) + '...',
            content: n.content || '',
            image: n.thumbnail || '',
            author: n.author?.name || 'Humas SMAN 68',
          }));
          setBeritaData(mappedNews);
        }

        if (achRes.status === 'fulfilled' && achRes.value?.items?.length > 0) {
          const mappedAch = achRes.value.items.map((a) => {
            const achLower = (a.achievement || '').toLowerCase();
            let tier = 'gold';
            if (achLower.includes('perak') || achLower.includes('2')) tier = 'silver';
            else if (achLower.includes('perunggu') || achLower.includes('3')) tier = 'bronze';
            else if (achLower.includes('finalis') || achLower.includes('peserta')) tier = 'finalist';

            return {
              id: a.id,
              title: a.title,
              event: a.description || a.title,
              category: a.category || 'Akademik',
              level: a.level || 'Nasional',
              year: a.year || '2025',
              tier,
              tierLabel: a.achievement || 'Juara',
              winner: a.studentTeam || 'Siswa SMAN 68',
              image: a.image || '',
            };
          });
          setPrestasiData(mappedAch);
        }

        if (galRes.status === 'fulfilled' && galRes.value?.items?.length > 0) {
          const mappedGal = galRes.value.items.map((g) => ({
            id: g.id,
            title: g.title,
            category: g.album || 'Kegiatan',
            image: g.images?.[0]?.url || '',
            desc: g.caption || g.title,
          }));
          setGaleriData(mappedGal);
        }
      } catch (err) {
        console.warn('CMS API error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCmsData();
  }, []);

  // Filtered Berita
  const filteredBerita = useMemo(() => {
    if (!searchQuery.trim()) return beritaData;
    const q = searchQuery.toLowerCase();
    return beritaData.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.summary.toLowerCase().includes(q)
    );
  }, [searchQuery, beritaData]);

  // Filtered Prestasi
  const filteredPrestasi = useMemo(() => {
    return prestasiData.filter((p) => {
      const matchCat = filterCategory === 'ALL' || (p.category && p.category.toLowerCase().includes(filterCategory.toLowerCase()));
      const matchLvl = filterLevel === 'ALL' || p.level === filterLevel;
      const matchYr = filterYear === 'ALL' || p.year === filterYear;
      return matchCat && matchLvl && matchYr;
    });
  }, [filterCategory, filterLevel, filterYear, prestasiData]);

  const resetPrestasiFilter = () => {
    setFilterCategory('ALL');
    setFilterLevel('ALL');
    setFilterYear('ALL');
  };

  return (
    <section className="sec sec--soft" id="section-informasi">
      <div className="container">
        
        {/* Centered Global Header */}
        <div className="sec-header sec--centered">
          <h2 className="sec-title">
            Eksplorasi Dinamika, <em>Warta &amp; Rekam Prestasi</em>
          </h2>
          <p className="sec-sub">
            Temukan kisah inspiratif, kabar pencapaian mutakhir, dan ragam dokumentasi kebersamaan siswa-siswi SMA Negeri 68 Jakarta.
          </p>
        </div>

        {/* Dynamic Hub Tabs Navigation */}
        <div className="p-tabs-wrapper" role="tablist" aria-label="Kategori Informasi">
          <button
            type="button"
            className={`p-tab-btn ${activeTab === 'berita' ? 'active' : ''}`}
            onClick={() => setActiveTab('berita')}
            role="tab"
            aria-selected={activeTab === 'berita'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
              <line x1="10" y1="6" x2="18" y2="6" /><line x1="10" y1="10" x2="18" y2="10" />
            </svg>
            <span>Berita &amp; Warta</span>
            <span className="p-tab-indicator" />
          </button>

          <button
            type="button"
            className={`p-tab-btn ${activeTab === 'prestasi' ? 'active' : ''}`}
            onClick={() => setActiveTab('prestasi')}
            role="tab"
            aria-selected={activeTab === 'prestasi'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
              <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
            </svg>
            <span>Ruang Prestasi</span>
            <span className="p-tab-indicator" />
          </button>

          <button
            type="button"
            className={`p-tab-btn ${activeTab === 'galeri' ? 'active' : ''}`}
            onClick={() => setActiveTab('galeri')}
            role="tab"
            aria-selected={activeTab === 'galeri'}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Galeri Kegiatan</span>
            <span className="p-tab-indicator" />
          </button>
        </div>

        {/* TAB 1: BERITA & WARTA */}
        {activeTab === 'berita' && (
          <div className="p-tab-content p-tab-animate" role="tabpanel">
            {/* Search Bar */}
            <div className="p-search-container">
              <div className="p-search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="p-search-icon" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari berita, agenda, pengumuman (mendukung pencarian cerdas)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="p-search-input"
                  aria-label="Cari berita"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="p-search-clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus pencarian"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* News Cards Grid */}
            {isLoading ? (
              <div className="p-news-grid">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="p-news-card p-news-card--skeleton">
                    <div className="p-news-media p-skeleton-block" style={{ height: 180 }} />
                    <div className="p-news-body">
                      <div className="p-skeleton-line" style={{ width: '40%', marginBottom: 8 }} />
                      <div className="p-skeleton-line" style={{ width: '90%', marginBottom: 6 }} />
                      <div className="p-skeleton-line" style={{ width: '70%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBerita.length === 0 ? (
              <div className="p-empty-state">
                <p>Tidak ada berita yang sesuai dengan kata kunci "<strong>{searchQuery}</strong>".</p>
                <button type="button" className="btn btn--secondary btn--sm" onClick={() => setSearchQuery('')}>
                  Tampilkan Semua Berita
                </button>
              </div>
            ) : (
              <div className="p-news-grid">
                {filteredBerita.map((item) => (
                  <article
                    className="p-news-card"
                    key={item.id}
                    onClick={() => setSelectedBerita(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedBerita(item)}
                  >
                    <div className="p-news-media">
                      {item.image ? (
                        <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="p-no-image-box">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                          </svg>
                          <span>NO IMAGE</span>
                        </div>
                      )}
                      <span className="p-news-badge">{item.category}</span>
                    </div>
                    <div className="p-news-body">
                      <div className="p-news-meta">
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>
                      <h3 className="p-news-title">{item.title}</h3>
                      <p className="p-news-desc">{item.summary}</p>
                      <span className="p-news-readmore">
                        Baca Selengkapnya
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RUANG PRESTASI (With Photos & CMS Connection) */}
        {activeTab === 'prestasi' && (
          <div className="p-tab-content p-tab-animate" role="tabpanel">
            {/* Multi-filter system */}
            <div className="p-prestasi-filter-bar">
              <div className="p-filter-group">
                <label htmlFor="filter-kat" className="p-filter-label">Kategori:</label>
                <select
                  id="filter-kat"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-filter-select"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Akademik">Akademik &amp; Sains</option>
                  <option value="Riset">Riset &amp; Bioteknologi</option>
                  <option value="Seni">Seni &amp; Musik</option>
                  <option value="Olahraga">Olahraga</option>
                  <option value="Bahasa">Bahasa &amp; Debat</option>
                </select>
              </div>

              <div className="p-filter-group">
                <label htmlFor="filter-lvl" className="p-filter-label">Tingkat:</label>
                <select
                  id="filter-lvl"
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="p-filter-select"
                >
                  <option value="ALL">Semua Tingkat</option>
                  <option value="Nasional">Tingkat Nasional</option>
                  <option value="Provinsi">Tingkat Provinsi</option>
                  <option value="Kota">Tingkat Kota / Wilayah</option>
                </select>
              </div>

              <div className="p-filter-group">
                <label htmlFor="filter-yr" className="p-filter-label">Tahun:</label>
                <select
                  id="filter-yr"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="p-filter-select"
                >
                  <option value="ALL">Semua Tahun</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              <button
                type="button"
                className="p-filter-reset-btn"
                onClick={resetPrestasiFilter}
              >
                Reset Filter
              </button>
            </div>

            {/* Prestasi Cards Grid with Images and Tier Badges */}
            {filteredPrestasi.length === 0 ? (
              <div className="p-empty-state">
                <p>Tidak ditemukan data prestasi dengan kombinasi filter yang dipilih.</p>
                <button type="button" className="btn btn--secondary btn--sm" onClick={resetPrestasiFilter}>
                  Reset Pilihan Filter
                </button>
              </div>
            ) : (
              <div className="p-prestasi-grid">
                {filteredPrestasi.map((p) => (
                  <article
                    className="p-prestasi-card"
                    key={p.id}
                    onClick={() => setSelectedPrestasi(p)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedPrestasi(p)}
                  >
                    {/* Prestasi Image Media with Tier Badge */}
                    <div className="p-prestasi-media">
                      {p.image ? (
                        <img src={p.image} alt={p.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      ) : (
                        <div className="p-no-image-box">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                            <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
                            <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
                          </svg>
                          <span>NO IMAGE</span>
                        </div>
                      )}
                      <span className={`p-tier-badge p-tier--${p.tier || 'gold'}`}>
                        {p.tierLabel}
                      </span>
                    </div>

                    <div className="p-prestasi-body">
                      <div className="p-prestasi-meta">
                        <span className="p-prestasi-year">{p.year}</span>
                        <span>•</span>
                        <span className="p-prestasi-cat">{p.category}</span>
                      </div>

                      <h3 className="p-prestasi-title">{p.title}</h3>
                      <p className="p-prestasi-event">{p.event}</p>

                      <div className="p-prestasi-footer">
                        <div className="p-prestasi-winner">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          <span>{p.winner}</span>
                        </div>
                        <span className="p-prestasi-tag">{p.level}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GALERI KEGIATAN */}
        {activeTab === 'galeri' && (
          <div className="p-tab-content p-tab-animate" role="tabpanel">
            <div className="p-galeri-grid">
              {galeriData.map((item) => (
                <div
                  className="p-galeri-item"
                  key={item.id}
                  onClick={() => setSelectedGaleri(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedGaleri(item)}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.title} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  ) : (
                    <div className="p-no-image-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>NO IMAGE</span>
                    </div>
                  )}
                  <div className="p-galeri-overlay">
                    <span className="p-galeri-badge">{item.category}</span>
                    <h4 className="p-galeri-title">{item.title}</h4>
                    <p className="p-galeri-desc">{item.desc}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Berita Detail Modal */}
      {selectedBerita && (
        <Modal onClose={() => setSelectedBerita(null)} title={selectedBerita.title}>
          <div className="p-modal-news-body">
            <img src={selectedBerita.image} alt={selectedBerita.title} className="p-modal-news-img" />
            <div className="p-modal-news-meta">
              <span className="p-meta-tag">{selectedBerita.category}</span>
              <span>{selectedBerita.date}</span>
              <span>Oleh: {selectedBerita.author}</span>
            </div>
            <div className="p-modal-news-text">
              <p>{selectedBerita.content}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Prestasi Detail Modal */}
      {selectedPrestasi && (
        <Modal onClose={() => setSelectedPrestasi(null)} title={selectedPrestasi.title}>
          <div className="p-modal-news-body">
            {selectedPrestasi.image && (
              <img src={selectedPrestasi.image} alt={selectedPrestasi.title} className="p-modal-news-img" />
            )}
            <div className="p-modal-news-meta">
              <span className={`p-tier-badge p-tier--${selectedPrestasi.tier || 'gold'}`}>{selectedPrestasi.tierLabel}</span>
              <span className="p-meta-tag">{selectedPrestasi.category}</span>
              <span>Tahun {selectedPrestasi.year}</span>
              <span>Tingkat: {selectedPrestasi.level}</span>
            </div>
            <div className="p-modal-news-text">
              <p><strong>Ajang / Kejuaraan:</strong> {selectedPrestasi.event}</p>
              <p><strong>Penerima Penghargaan:</strong> {selectedPrestasi.winner}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Galeri Lightbox Modal */}
      {selectedGaleri && (
        <Modal onClose={() => setSelectedGaleri(null)} title={selectedGaleri.title}>
          <div className="p-modal-galeri-body">
            <img src={selectedGaleri.image} alt={selectedGaleri.title} className="p-modal-galeri-img" />
            <div className="p-modal-galeri-info">
              <span className="p-meta-tag">{selectedGaleri.category}</span>
              <p>{selectedGaleri.desc}</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}
