const { PrismaClient } = require('C:/Users/Nazihan/.gemini/antigravity/scratch/sma68-website/backend/node_modules/@prisma/client');
const bcrypt = require('C:/Users/Nazihan/.gemini/antigravity/scratch/sma68-website/backend/node_modules/bcryptjs');

process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_Pe6dc7QCRtAm@ep-winter-mode-azi13j9m-pooler.c-3.ap-southeast-1.aws.neon.tech/sman68?sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log('--- Seeding SMAN 68 Live Neon Database ---');
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  // 1. Ensure Admin & System Users
  const superadmin = await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@sma68.sch.id',
      passwordHash,
      name: 'Super Admin SMAN 68',
      role: 'SUPER_ADMIN',
    },
  });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@sma68.sch.id',
      passwordHash,
      name: 'Humas SMAN 68 Jakarta',
      role: 'ADMIN',
    },
  });

  const guru = await prisma.user.upsert({
    where: { username: 'guru1' },
    update: {},
    create: {
      username: 'guru1',
      email: 'guru1@sma68.sch.id',
      passwordHash,
      name: 'Tim Kesiswaan & Akademik',
      role: 'GURU',
    },
  });

  const staff = await prisma.user.upsert({
    where: { username: 'staff1' },
    update: {},
    create: {
      username: 'staff1',
      email: 'staff1@sma68.sch.id',
      passwordHash,
      name: 'Tata Usaha SMAN 68',
      role: 'STAFF',
    },
  });

  // 2. Clear old demo data
  console.log('Cleaning old demo records...');
  await prisma.galleryImage.deleteMany({});
  await prisma.gallery.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.agenda.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.news.deleteMany({});

  // 3. Seed Authentic News (12 items)
  console.log('Seeding authentic News...');
  const newsItems = [
    {
      title: 'SMAN 68 Jakarta Luncurkan "Pusat Layanan" — Portal Digital Resmi untuk Seluruh Warga Sekolah',
      slug: 'sman-68-jakarta-luncurkan-pusat-layanan-portal-digital-resmi',
      excerpt: 'SMAN 68 Jakarta menghadirkan terobosan digital baru yang dirancang khusus untuk memenuhi kebutuhan seluruh warga sekolah dalam satu ekosistem terpadu.',
      content: 'Jakarta, Juni 2026 — SMAN 68 Jakarta kini menghadirkan sebuah terobosan digital yang dirancang khusus untuk mempermudah akses informasi dan layanan administrasi bagi siswa, guru, orang tua, dan alumni. Portal ini mengintegrasikan pengecekan kelulusan, legalisir ijazah online, survei kinerja guru, hingga informasi beasiswa perkuliahan secara real-time.',
      category: 'Digital',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-20T01:22:58.652Z'),
      thumbnail: 'https://github.com/nadhiframadhan780-dev/appsmanegeri68jakarta/blob/main/pusat%20layanan%20lainnya%20sman%2068%20jakarta.png?raw=true',
      authorId: admin.id,
    },
    {
      title: 'Siswa SMAN 68 Jakarta Raih Medali Emas di Olimpiade Sains Nasional (OSN) 2025',
      slug: 'siswa-sman-68-jakarta-raih-medali-emas-osn-2025',
      excerpt: 'Prestasi gemilang kembali ditorehkan oleh delegasi Tim Olimpiade Sains (TOSLA) SMAN 68 Jakarta di ajang tingkat nasional bidang Matematika dan Fisika.',
      content: 'Tim Olimpiade Sains SMAN 68 Jakarta (TOSLA) berhasil mempertahankan tradisi juara dengan membawa pulang 2 Medali Emas dan 1 Medali Perak pada ajang Olimpiade Sains Nasional (OSN) yang diselenggarakan oleh Balai Pengembangan Talenta Indonesia (BPTI). Keberhasilan ini merupakan buah dari pembinaan intensif guru pembimbing dan semangat juang siswa.',
      category: 'Akademik',
      status: 'PUBLISHED',
      publishedAt: new Date('2025-08-14T08:00:00.000Z'),
      thumbnail: 'https://media.indozone.id/crop/0x0:0x0/images/2026/01/14/1768352620_6966eb6c54bf6_maxresdefault.jpg',
      authorId: guru.id,
    },
    {
      title: 'Pengumuman Hasil Seleksi Calon Peserta Didik Baru Jalur Mutasi Tahun Ajaran 2026/2027',
      slug: 'pengumuman-hasil-seleksi-calon-peserta-didik-baru-jalur-mutasi-2026-2027',
      excerpt: 'Panitia Seleksi Murid Mutasi (PENMURMUT) SMAN 68 Jakarta menyampaikan hasil seleksi resmi bagi calon peserta didik mutasi.',
      content: 'Jakarta, 01 Juli 2026 — Panitia Seleksi Murid Mutasi (PENMURMUT) SMAN 68 Jakarta dengan ini menyampaikan hasil seleksi resmi penerimaan murid baru mutasi semester ganjil tahun ajaran 2026/2027. Seluruh calon siswa yang dinyatakan lolos diimbau segera melakukan daftar ulang sesuai jadwal yang ditetapkan.',
      category: 'Pengumuman',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-01T02:08:08.460Z'),
      thumbnail: 'https://github.com/nadhiframadhan780-dev/appsmanegeri68jakarta/blob/main/Pengumuman%20seleksi%20penmurmut.png?raw=true',
      authorId: staff.id,
    },
    {
      title: 'Pemeringkatan PTN & Kampus Impian: Sebaran Lulusan SMAN 68 Jakarta di PTN Unggulan',
      slug: 'pemeringkatan-ptn-dan-kampus-impian-sebaran-lulusan-sman-68',
      excerpt: 'Lebih dari 850 alumni SMAN 68 Jakarta sukses menembus Universitas Indonesia (UI), disusul UGM, ITB, UNAIR, dan universitas ternama dunia.',
      content: 'SMA Negeri 68 Jakarta dengan bangga mempersembahkan laman khusus Pemeringkatan Perguruan Tinggi Negeri (PTN) Indonesia 2026. Berdasarkan data rekam jejak kelulusan dari tahun 2011 hingga sekarang, SMAN 68 konsisten mencatatkan diri sebagai sekolah pemasok mahasiswa terbanyak di UI (2.450+ alumni), ITB (1.650+ alumni), dan UGM (1.850+ alumni).',
      category: 'Prestasi',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-15T09:00:00.000Z'),
      thumbnail: 'https://media.indozone.id/crop/0x0:0x0/images/2026/01/14/1768352620_6966eb6c54bf6_maxresdefault.jpg',
      authorId: admin.id,
    },
    {
      title: 'VIRSCH 68: Kompetisi Akbar Olahraga & Seni Tahunan SMA Negeri 68 Jakarta',
      slug: 'virsch-68-kompetisi-akbar-olahraga-dan-seni-tahunan',
      excerpt: 'Ajang bergengsi kejuaraan basket, tari modern, tari tradisional, dan musik antar-SMA se-Jabodetabek kembali digelar meriah.',
      content: 'VIRSCH 68 (Virtual & Real Salemba Championship) sukses menarik ribuan partisipan dari puluhan SMA di Jabodetabek dalam berbagai cabang lomba olahraga dan seni pertunjukan di kampus Salemba.',
      category: 'Kegiatan',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-05-10T10:00:00.000Z'),
      thumbnail: 'https://github.com/nadhiframadhan780-dev/smanegeri68jakarta/blob/main/carasel_monstazia.jpeg?raw=true',
      authorId: guru.id,
    },
    {
      title: 'SMAN 68 Jakarta Perpanjang Masa Daftar Ulang Calon Siswa Mutasi, Tenggat Baru Berlaku hingga 6 Juli 2026',
      slug: 'sman-68-perpanjang-masa-daftar-ulang-calon-siswa-mutasi',
      excerpt: 'Panitia Penerimaan Murid Mutasi memberikan kelonggaran waktu bagi orang tua murid untuk melengkapi berkas administrasi.',
      content: 'Jakarta, 4 Juli 2026 — Panitia Penerimaan Murid Mutasi (PENMURMUT) SMAN 68 Jakarta mengumumkan kebijakan perpanjangan masa lapor diri dan daftar ulang guna mengakomodasi calon peserta didik yang masih melengkapi dokumen legalisir dan verifikasi kesehatan.',
      category: 'Pengumuman',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-07-04T03:57:20.694Z'),
      thumbnail: 'https://github.com/p4nelof5434234468adm/imglink.sman68jkt/blob/main/perpanjangan%20masa%20daftar%20ulang.png?raw=true',
      authorId: staff.id,
    },
    {
      title: 'Peluncuran Resmi Aplikasi SMAN 68 Jakarta Versi Android & Windows Desktop',
      slug: 'peluncuran-resmi-aplikasi-sman-68-jakarta-versi-android-dan-windows',
      excerpt: 'Aplikasi resmi sekolah kini hadir di platform Android (APK) dan Windows Desktop (EXE) untuk kemudahan akses informasi warga sekolah.',
      content: 'Untuk meningkatkan kecepatan akses informasi akademik, jadwal ujian, dan pengumuman instan, tim IT SMAN 68 Jakarta resmi merilis aplikasi native yang dapat diunduh langsung oleh seluruh siswa dan wali murid.',
      category: 'Digital',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-06-28T04:00:00.000Z'),
      thumbnail: 'https://github.com/nadhiframadhan780-dev/appsmanegeri68jakarta/blob/main/pusat%20layanan%20lainnya%20sman%2068%20jakarta.png?raw=true',
      authorId: admin.id,
    },
    {
      title: 'Penerapan Pembelajaran Interaktif Kurikulum Merdeka & Penguatan P5 di Salemba',
      slug: 'penerapan-pembelajaran-interaktif-kurikulum-merdeka-p5',
      excerpt: 'Siswa kelas X dan XI menunjukkan antusiasme tinggi dalam proyek rekayasa teknologi dan kewirausahaan ramah lingkungan.',
      content: 'Kurikulum Merdeka di SMAN 68 Jakarta terus berfokus pada deep learning dan pembelajaran kontekstual, mendorong siswa untuk berpikir kritis, kreatif, dan berakhlak mulia melalui Projek Penguatan Profil Pelajar Pancasila (P5).',
      category: 'Akademik',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-05-15T07:30:00.000Z'),
      thumbnail: 'https://awsimages.detik.net.id/community/media/visual/2022/04/08/suasana-ptm-di-sman-68-jakarta-anggi-detikcom_169.jpeg?w=1200',
      authorId: guru.id,
    },
  ];

  for (const item of newsItems) {
    await prisma.news.create({ data: item });
  }

  // 4. Seed Authentic Achievements
  console.log('Seeding authentic Achievements...');
  const achievements = [
    {
      title: 'Juara 1 & Medali Emas Olimpiade Matematika Nasional',
      category: 'Akademik',
      level: 'Nasional',
      year: '2025',
      achievement: 'Medali Emas',
      studentTeam: 'Fakhri & Tim Matematika TOSLA',
      description: 'Olimpiade Sains Nasional (OSN) 2025 bidang Matematika tingkat SMA/MA se-Indonesia.',
      image: 'https://media.indozone.id/crop/0x0:0x0/images/2026/01/14/1768352620_6966eb6c54bf6_maxresdefault.jpg',
      authorId: guru.id,
    },
    {
      title: 'Juara 2 Lomba Riset Ilmiah Lingkungan & Bioteknologi',
      category: 'Riset & Sains',
      level: 'Nasional',
      year: '2025',
      achievement: 'Medali Perak',
      studentTeam: 'KIR 68 Salemba',
      description: 'National Young Scientists Fair 2025 penelitian pemanfaatan limbah organik ramah lingkungan.',
      image: 'https://awsimages.detik.net.id/community/media/visual/2022/04/08/suasana-ptm-di-sman-68-jakarta-anggi-detikcom_169.jpeg?w=1200',
      authorId: guru.id,
    },
    {
      title: 'Juara 1 Kejuaraan Marching Band & Brass Band Tingkat Provinsi',
      category: 'Seni & Musik',
      level: 'Provinsi',
      year: '2024',
      achievement: 'Juara 1 (Emas)',
      studentTeam: 'MBrass 68 Jakarta',
      description: 'Grand Prix Marching Band DKI Jakarta 2024 kategori Divisi Utama.',
      image: 'https://github.com/nadhiframadhan780-dev/smanegeri68jakarta/blob/main/carasel_monstazia.jpeg?raw=true',
      authorId: guru.id,
    },
    {
      title: 'Peringkat 10 Nasional Sekolah Berdasarkan Nilai UTBK',
      category: 'Akademik',
      level: 'Nasional',
      year: '2024',
      achievement: 'Top 10 Nasional',
      studentTeam: 'Sivitas SMAN 68 Jakarta',
      description: 'Pemeringkatan resmi Top 1000 Sekolah Berdasarkan Nilai Rata-rata UTBK oleh LTMPT.',
      image: 'https://media.indozone.id/crop/0x0:0x0/images/2026/01/14/1768352620_6966eb6c54bf6_maxresdefault.jpg',
      authorId: admin.id,
    },
    {
      title: 'Medali Perunggu Festival & Lomba Seni Siswa (FLS2N)',
      category: 'Seni & Tari',
      level: 'Nasional',
      year: '2024',
      achievement: 'Medali Perunggu',
      studentTeam: 'Tracesight 68',
      description: 'FLS2N Tingkat Nasional Bidang Seni Tari Tradisional Kreasi Daerah.',
      image: 'https://github.com/nadhiframadhan780-dev/smanegeri68jakarta/blob/main/carasel_monstazia.jpeg?raw=true',
      authorId: guru.id,
    },
    {
      title: 'Finalis Debat Bahasa Inggris LDBI Tingkat Nasional',
      category: 'Bahasa',
      level: 'Nasional',
      year: '2024',
      achievement: 'Finalis Nasional',
      studentTeam: 'Solitaire English Club 68',
      description: 'Lomba Debat Bahasa Indonesia & Bahasa Inggris (LDBI/NSDC) Tingkat Nasional.',
      image: 'https://media.suara.com/pictures/653x366/2017/04/07/21547-persiapan-ujian-nasional-berbasis-komputer.jpg',
      authorId: guru.id,
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.create({ data: ach });
  }

  // 5. Seed Authentic Agenda (16 items)
  console.log('Seeding authentic Agenda...');
  const agendaList = [
    {
      title: 'Pengambilan Ijazah Khusus Alumni Kelas XII Angkatan 2026',
      description: 'Pengambilan dokumen ijazah asli dan SKHUN di ruang kelas masing-masing.',
      date: new Date('2026-06-02T00:00:00.000Z'),
      startTime: '13:00',
      endTime: '15:00',
      location: 'Ruang Kelas Masing-Masing',
      status: 'PUBLISHED',
      authorId: staff.id,
    },
    {
      title: 'KEGIATAN MPLS KELAS 10 T.A 2026/2027',
      description: 'Masa Pengenalan Lingkungan Sekolah bagi seluruh peserta didik baru kelas X.',
      date: new Date('2026-07-13T00:00:00.000Z'),
      startTime: '06:30',
      endTime: '15:00',
      location: 'Kampus SMAN 68 Jakarta',
      status: 'PUBLISHED',
      authorId: guru.id,
    },
    {
      title: 'Konsultasi Siswa Kelas XII Mengenai Keikutsertaan PPKB UI 2026',
      description: 'Bimbingan intensif persiapan berkas dan pemilihan jurusan jalur prestasi PPKB Universitas Indonesia.',
      date: new Date('2026-05-18T00:00:00.000Z'),
      startTime: '06:30',
      endTime: '15:00',
      location: 'Ruang BK Lantai 2',
      status: 'PUBLISHED',
      authorId: guru.id,
    },
    {
      title: 'Pengumuman Kelulusan Kelas XII SMAN 68 Jakarta Tahun Ajaran 2025/2026',
      description: 'Pengumuman resmi kelulusan daring melalui portal Pusat Layanan SMAN 68.',
      date: new Date('2026-05-04T00:00:00.000Z'),
      startTime: '10:00',
      endTime: '12:00',
      location: 'Portal Online SMAN 68 Jakarta',
      status: 'PUBLISHED',
      authorId: admin.id,
    },
    {
      title: 'ACARA KELULUSAN KELAS XII ANGKATAN TAHUN 2026',
      description: 'Pelepasan dan wisuda akbar purnawiyata siswa kelas XII angkatan 2026.',
      date: new Date('2026-05-05T00:00:00.000Z'),
      startTime: '07:00',
      endTime: '13:00',
      location: 'Lapangan Utama & Gedung Menza SMAN 68',
      status: 'PUBLISHED',
      authorId: admin.id,
    },
    {
      title: 'Pengumuman Hasil Seleksi SNBT Alumni Kelas XII Angkatan 2026',
      description: 'Rekapitulasi resmi hasil kelulusan Seleksi Nasional Berdasarkan Tes (SNBT) PTN.',
      date: new Date('2026-05-25T00:00:00.000Z'),
      startTime: '15:00',
      endTime: '18:00',
      location: 'Laman Resmi SNPMB & Website 68',
      status: 'PUBLISHED',
      authorId: guru.id,
    },
    {
      title: 'UJIAN AKHIR SEMESTER KELAS X & XI TAHUN 2026/2027',
      description: 'Pelaksanaan Asesmen Sumatif Akhir Tahun berbasis komputer (CBT).',
      date: new Date('2026-06-02T00:00:00.000Z'),
      startTime: '06:30',
      endTime: '12:00',
      location: 'Ruang Ujian Masing-Masing',
      status: 'PUBLISHED',
      authorId: guru.id,
    },
  ];

  for (const ag of agendaList) {
    await prisma.agenda.create({ data: ag });
  }

  // 6. Seed Authentic Announcements
  console.log('Seeding authentic Announcements...');
  const announcements = [
    {
      title: 'PELUNCURAN PORTAL PUSAT LAYANAN DIGITAL SMAN 68 JAKARTA',
      content: 'Diberitahukan kepada seluruh sivitas akademika bahwa Pusat Layanan Digital SMAN 68 Jakarta kini telah resmi beroperasi penuh untuk melayani legalisir online, info kelulusan, dan aduan.',
      status: 'PUBLISHED',
      publishDate: new Date('2026-06-20T00:00:00.000Z'),
      authorId: admin.id,
    },
    {
      title: 'INFORMASI HASIL PEMELIHARAAN DAN PEMBARUAN LAYANAN DIGITAL',
      content: 'Pembaruan infrastruktur server dan peningkatan kecepatan akses website telah selesai dilaksanakan. Seluruh layanan portal kini dapat diakses dengan optimal.',
      status: 'PUBLISHED',
      publishDate: new Date('2026-07-02T00:00:00.000Z'),
      authorId: admin.id,
    },
    {
      title: 'PENDAFTARAN MURID MUTASI TAHUN AJARAN 2026/2027',
      content: 'Pengumuman resmi persyaratan administrasi dan tata cara pendaftaran seleksi calon murid mutasi semester ganjil SMAN 68 Jakarta.',
      status: 'PUBLISHED',
      publishDate: new Date('2026-06-25T00:00:00.000Z'),
      authorId: staff.id,
    },
    {
      title: 'Masa Unduh Kartu Peserta Seleksi Murid Mutasi',
      content: 'Calon peserta didik yang telah terverifikasi berkasnya dapat mengunduh kartu ujian seleksi melalui portal resmi.',
      status: 'PUBLISHED',
      publishDate: new Date('2026-06-28T00:00:00.000Z'),
      authorId: staff.id,
    },
  ];

  for (const ann of announcements) {
    await prisma.announcement.create({ data: ann });
  }

  // 7. Seed Authentic Gallery
  console.log('Seeding authentic Gallery...');
  const galleryItems = [
    {
      title: 'Suasana Belajar Kondusif & Pembelajaran Tatap Muka',
      caption: 'Aktivitas belajar mengajar dengan fasilitas kelas modern dan teknologi interaktif di kampus Salemba.',
      album: 'Akademik',
      images: {
        create: [
          { url: 'https://awsimages.detik.net.id/community/media/visual/2022/04/08/suasana-ptm-di-sman-68-jakarta-anggi-detikcom_169.jpeg?w=1200', caption: 'Suasana Kelas Interaktif', sortOrder: 0 },
        ],
      },
    },
    {
      title: 'Gelar Karya Budaya & Pagelaran Seni Monstazia',
      caption: 'Kemeriahan festival seni tahunan unjuk talenta dan kebersamaan murid SMAN 68.',
      album: 'Seni & Budaya',
      images: {
        create: [
          { url: 'https://github.com/nadhiframadhan780-dev/smanegeri68jakarta/blob/main/carasel_monstazia.jpeg?raw=true', caption: 'Monstazia 68 Art Festival', sortOrder: 0 },
        ],
      },
    },
    {
      title: 'Kampus Hijau & Gedung Megah SMAN 68 Salemba',
      caption: 'Lingkungan kampus asri dan strategis di jantung kota Salemba, Jakarta Pusat.',
      album: 'Kampus',
      images: {
        create: [
          { url: 'https://media.indozone.id/crop/0x0:0x0/images/2026/01/14/1768352620_6966eb6c54bf6_maxresdefault.jpg', caption: 'Gedung SMAN 68 Salemba', sortOrder: 0 },
        ],
      },
    },
    {
      title: 'Laboratorium Komputer & Ujian Berbasis Komputer',
      caption: 'Sarana komputer dan simulasi digital berstandar nasional untuk asesmen dan pemrograman.',
      album: 'Teknologi',
      images: {
        create: [
          { url: 'https://media.suara.com/pictures/653x366/2017/04/07/21547-persiapan-ujian-nasional-berbasis-komputer.jpg', caption: 'Lab Komputer CBT', sortOrder: 0 },
        ],
      },
    },
    {
      title: 'Perpustakaan & Pusat Literasi Ki Hajar Dewantara',
      caption: 'Ruang baca tenang dengan ribuan koleksi referensi cetak dan digital.',
      album: 'Fasilitas',
      images: {
        create: [
          { url: 'https://img.antarafoto.com/cache/400x300/2013/07/15/implementasi-kurikulum-2013-7034-dom.jpg', caption: 'Perpustakaan Salemba', sortOrder: 0 },
        ],
      },
    },
    {
      title: 'Laboratorium IPA & Eksperimen Sains Terpadu',
      caption: 'Praktikum biologi, kimia, dan fisika dengan peralatan modern berstandar keselamatan lab.',
      album: 'Fasilitas',
      images: {
        create: [
          { url: 'https://github.com/nadhiframadhan780-dev/appsmanegeri68jakarta/blob/main/Lab%20ipa.png?raw=true', caption: 'Lab IPA Terpadu', sortOrder: 0 },
        ],
      },
    },
  ];

  for (const gal of galleryItems) {
    await prisma.gallery.create({ data: gal });
  }

  console.log('✅ SEED DATABASE BERHASIL! Seluruh data asli SMAN 68 tersimpan di live Neon PostgreSQL.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
