import { useState } from 'react';
import './Kontak.css';

const CONTACTS = [
  {
    icon: 'map',
    label: 'Alamat Sekolah',
    value: 'Jl. Salemba Raya No. 18, Paseban',
    sub: 'Kec. Senen, Jakarta Pusat, DKI Jakarta 10440',
    href: 'https://maps.google.com/?q=SMAN+68+Jakarta',
  },
  {
    icon: 'phone',
    label: 'Telepon Kantor',
    value: '(021) 315 4713',
    sub: 'Senin – Jumat, 07.00 – 15.30 WIB',
    href: 'tel:+62213154713',
  },
  {
    icon: 'whatsapp',
    label: 'Layanan WhatsApp SPMB',
    value: '+62 812 6868 6800',
    sub: 'Respons cepat pada jam kerja',
    href: 'https://wa.me/6281268686800?text=Halo%20SMAN%2068%20Jakarta,%20saya%20ingin%20bertanya%20informasi%20sekolah.',
  },
  {
    icon: 'mail',
    label: 'Email Resmi',
    value: 'info@sman68jakarta.sch.id',
    sub: 'Balasan resmi dalam 1–2 hari kerja',
    href: 'mailto:info@sman68jakarta.sch.id',
  },
];

function ContactIcon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  switch (name) {
    case 'map':
      return (
        <svg {...common}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case 'phone':
      return (
        <svg {...common}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.12 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      );
    case 'mail':
      return (
        <svg {...common}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common} width="15" height="15">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Kontak() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'spmb', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', subject: 'spmb', message: '' });
    }, 700);
  }

  return (
    <section className="sec p-kontak-section" id="kontak">
      <div className="container">

        {/* Section Header */}
        <div className="p-kontak-header">
          <h2 className="p-kontak-title">
            Hubungi &amp; Kunjungi <em>SMAN 68 Jakarta</em>
          </h2>
          <p className="p-kontak-sub">
            Kami siap memberikan informasi terkait Penerimaan Murid Baru (SPMB), kurikulum,
            layanan administrasi, dan kemitraan pendidikan.
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="p-kontak-grid">

          {/* LEFT — Interactive Contact Cards & Map */}
          <div className="p-kontak-left">

            <div className="p-kontak-cards">
              {CONTACTS.map((c) => {
                const inner = (
                  <>
                    <span className="p-kontak-ico">
                      <ContactIcon name={c.icon} />
                    </span>
                    <div className="p-kontak-card-body">
                      <span className="p-kontak-card-label">{c.label}</span>
                      <span className="p-kontak-card-value">{c.value}</span>
                      {c.sub && <span className="p-kontak-card-sub">{c.sub}</span>}
                    </div>
                    {c.href && (
                      <span className="p-kontak-card-arrow" aria-hidden="true">
                        <ContactIcon name="arrow" />
                      </span>
                    )}
                  </>
                );

                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="p-kontak-card p-kontak-card--link"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={c.label} className="p-kontak-card">
                    {inner}
                  </div>
                );
              })}
            </div>

            {/* Google Map Embed Card */}
            <div className="p-kontak-map">
              <div className="p-kontak-map-inner">
                <iframe
                  title="Peta Lokasi SMAN 68 Jakarta Salemba"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.6208!2d106.8457!3d-6.1964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f432f9c93485%3A0x7c9e33e82c5f5a47!2sSMA%20Negeri%2068%20Jakarta!5e0!3m2!1sid!2sid!4v1692000000000!5m2!1sid!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.google.com/?q=SMAN+68+Jakarta"
                target="_blank"
                rel="noopener noreferrer"
                className="p-kontak-map-btn"
              >
                <ContactIcon name="map" size={16} />
                <span>Petunjuk Arah di Google Maps</span>
              </a>
            </div>

          </div>

          {/* RIGHT — Formal Inquiry Form */}
          <div className="p-kontak-right">
            <div className="p-kontak-form-card">
              <div className="p-kontak-form-header">
                <h3>Kirimkan Pesan atau Pertanyaan</h3>
                <p>Tim Humas &amp; Layanan Terpadu SMAN 68 akan merespons pesan Anda.</p>
              </div>

              {sent ? (
                <div className="p-kontak-success">
                  <div className="p-kontak-success-ico">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h4>Pesan Berhasil Terkirim!</h4>
                  <p>Terima kasih telah menghubungi SMA Negeri 68 Jakarta. Kami telah menerima pesan Anda dan akan membalas ke email tertera dalam 1–2 hari kerja.</p>
                  <button
                    type="button"
                    className="p-kontak-back-btn"
                    onClick={() => setSent(false)}
                  >
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <form className="p-kontak-form" onSubmit={handleSubmit} noValidate>
                  <div className="p-kontak-row">
                    <div className="p-kontak-field">
                      <label htmlFor="k-name">Nama Lengkap <span>*</span></label>
                      <input
                        id="k-name"
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                    </div>

                    <div className="p-kontak-field">
                      <label htmlFor="k-email">Alamat Email <span>*</span></label>
                      <input
                        id="k-email"
                        type="email"
                        required
                        placeholder="nama@email.com"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="p-kontak-field">
                    <label htmlFor="k-subject">Kategori Perihal</label>
                    <select
                      id="k-subject"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    >
                      <option value="spmb">Penerimaan Murid Baru (SPMB / PPDB)</option>
                      <option value="akademik">Informasi Akademik &amp; Kurikulum</option>
                      <option value="legalisir">Layanan Administrasi / Legalisir Ijazah</option>
                      <option value="kemitraan">Kerjasama &amp; Kemitraan Eksternal</option>
                      <option value="lainnya">Pertanyaan Umum Lainnya</option>
                    </select>
                  </div>

                  <div className="p-kontak-field">
                    <label htmlFor="k-message">Isi Pesan <span>*</span></label>
                    <textarea
                      id="k-message"
                      required
                      placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda sampaikan..."
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="p-kontak-submit-btn"
                    disabled={loading || !form.name || !form.email || !form.message}
                  >
                    {loading ? (
                      <>
                        <span className="p-kontak-spinner" aria-hidden="true" />
                        <span>Mengirimkan Pesan...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Pesan Sekarang</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>

                  <p className="p-kontak-disclaimer">
                    Privasi dan data Anda dijaga sesuai kebijakan resmi SMA Negeri 68 Jakarta.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}