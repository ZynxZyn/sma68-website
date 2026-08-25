const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@sma68.sch.id',
      passwordHash,
      name: 'Super Admin SMA 68',
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
      name: 'Admin SMA 68',
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
      name: 'Guru Contoh',
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
      name: 'Staff Contoh',
      role: 'STAFF',
    },
  });

  await prisma.user.upsert({
    where: { username: 'siswa1' },
    update: {},
    create: {
      username: 'siswa1',
      email: 'siswa1@sma68.sch.id',
      passwordHash,
      name: 'Siswa Contoh',
      role: 'SISWA',
    },
  });

  const newsCount = await prisma.news.count();
  if (newsCount === 0) {
    await prisma.news.createMany({
      data: [
        {
          title: 'SMA Negeri 68 Jakarta Gelar Upacara Bendera',
          slug: 'sma-negeri-68-jakarta-gelar-upacara-bendera',
          excerpt: 'Upacara bendera berlangsung khidmat di lapangan utama.',
          content:
            'Senin pagi ini SMA Negeri 68 Jakarta melaksanakan upacara bendera rutin. Seluruh siswa, guru, dan staf mengikuti kegiatan dengan khidmat.',
          category: 'Kegiatan',
          status: 'PUBLISHED',
          publishedAt: new Date(),
          authorId: admin.id,
          thumbnail: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        },
        {
          title: 'Prestasi OSN Tingkat Kota',
          slug: 'prestasi-osn-tingkat-kota',
          excerpt: 'Siswa SMA 68 meraih medali emas OSN tingkat kota.',
          content:
            'Selamat kepada siswa-siswi SMA Negeri 68 Jakarta yang telah meraih prestasi membanggakan pada Olimpiade Sains Nasional (OSN) tingkat kota.',
          category: 'Prestasi',
          status: 'PUBLISHED',
          publishedAt: new Date(),
          authorId: guru.id,
          thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        },
        {
          title: 'PPDB Tahun Ajaran 2026/2027',
          slug: 'ppdb-tahun-ajaran-2026-2027',
          excerpt: 'Informasi pendaftaran PPDB akan segera dibuka.',
          content:
            'SMA Negeri 68 Jakarta akan segera membuka Penerimaan Peserta Didik Baru (PPDB) untuk tahun ajaran 2026/2027. Nantikan informasi selengkapnya.',
          category: 'Pengumuman',
          status: 'DRAFT',
          publishedAt: null,
          authorId: admin.id,
        },
      ],
    });
  }

  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Libur Hari Raya',
          content: 'Sekolah diliburkan dalam rangka hari raya. Kegiatan belajar mengajar dilanjutkan pada tanggal berikutnya.',
          status: 'PUBLISHED',
          publishDate: new Date(),
          authorId: admin.id,
        },
        {
          title: 'Pengumuman Jadwal Ujian',
          content: 'Jadwal ujian tengah semester telah dirilis. Silakan cek di papan pengumuman.',
          status: 'PUBLISHED',
          publishDate: new Date(),
          authorId: staff.id,
        },
      ],
    });
  }

  const agendaCount = await prisma.agenda.count();
  if (agendaCount === 0) {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    await prisma.agenda.createMany({
      data: [
        {
          title: 'Ujian Tengah Semester',
          description: 'Ujian tengah semester ganjil tahun ajaran 2026/2027.',
          date: nextWeek,
          startTime: '07:30',
          endTime: '12:00',
          location: 'SMA Negeri 68 Jakarta',
          status: 'PUBLISHED',
          authorId: guru.id,
        },
        {
          title: 'Rapat Orang Tua Siswa',
          description: 'Rapat orang tua siswa kelas X.',
          date: today,
          startTime: '08:00',
          endTime: '10:00',
          location: 'Aula SMA 68',
          status: 'PUBLISHED',
          authorId: admin.id,
        },
      ],
    });
  }

  const achievementCount = await prisma.achievement.count();
  if (achievementCount === 0) {
    await prisma.achievement.createMany({
      data: [
        {
          title: 'Juara 1 OSN Biologi',
          category: 'Akademik',
          level: 'Kota',
          year: '2026',
          achievement: 'Medali Emas',
          studentTeam: 'Tim OSN Biologi',
          authorId: guru.id,
        },
        {
          title: 'Juara Umum Paskibraka',
          category: 'Non-Akademik',
          level: 'Provinsi',
          year: '2025',
          achievement: 'Piala Bergilir Gubernur',
          studentTeam: 'Paskibra SMA 68',
          authorId: guru.id,
        },
        {
          title: 'Lomba Robotik Nasional',
          category: 'Teknologi',
          level: 'Nasional',
          year: '2025',
          achievement: 'Juara 2',
          studentTeam: 'Robotik Club',
          authorId: guru.id,
        },
      ],
    });
  }

  const galleryCount = await prisma.gallery.count();
  if (galleryCount === 0) {
    await prisma.gallery.create({
      data: {
        title: 'Kegiatan Class Meeting',
        caption: 'Dokumentasi kegiatan class meeting.',
        album: 'Kegiatan',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', caption: 'Kelas', sortOrder: 0 },
            { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800', caption: 'Belajar kelompok', sortOrder: 1 },
            { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', caption: 'Upacara', sortOrder: 2 },
          ],
        },
      },
    });
  }

  console.log('Seed berhasil!');
  console.log('Akun: superadmin / Admin123! (Super Admin), admin / Admin123!, guru1 / Admin123!, staff1 / Admin123!, siswa1 / Admin123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
