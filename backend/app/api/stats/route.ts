import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const now = new Date();

  const [newsCount, publishedNewsCount, announcementCount, agendaCount, upcomingAgenda, achievementCount, galleryCount, userCount, studentCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.news.count({ where: { status: 'PUBLISHED' } }),
      prisma.announcement.count({ where: { status: 'PUBLISHED' } }),
      prisma.agenda.count({ where: { status: 'PUBLISHED' } }),
      prisma.agenda.count({ where: { status: 'PUBLISHED', date: { gte: now } } }),
      prisma.achievement.count(),
      prisma.gallery.count(),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SISWA' } }),
    ]);

  return ok({
    newsCount,
    publishedNewsCount,
    announcementCount,
    agendaCount,
    upcomingAgenda,
    achievementCount,
    galleryCount,
    userCount,
    studentCount,
  });
}
