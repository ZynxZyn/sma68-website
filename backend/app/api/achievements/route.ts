import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const achievementSchema = z.object({
  title: z.string().min(3),
  category: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  achievement: z.string().optional().nullable(),
  studentTeam: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const category = searchParams.get('category');
  const level = searchParams.get('level');
  const year = searchParams.get('year');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (level) where.level = level;
  if (year) where.year = year;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { studentTeam: { contains: search } },
      { achievement: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.achievement.findMany({
      where,
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include: { author: { select: { id: true, name: true } } },
    }),
    prisma.achievement.count({ where }),
  ]);

  return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const achievement = await prisma.achievement.create({
    data: {
      title: data.title,
      category: data.category,
      level: data.level,
      year: data.year,
      achievement: data.achievement,
      studentTeam: data.studentTeam,
      image: data.image,
      description: data.description,
      authorId: auth.ctx.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return created(achievement);
}
