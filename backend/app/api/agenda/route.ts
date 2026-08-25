import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const agendaSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional().nullable(),
  date: z.string().datetime(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get('status');
  const from = searchParams.get('from');

  const where: Record<string, unknown> = {};
  if (status) {
    where.status = status;
  } else {
    where.status = 'PUBLISHED';
  }
  if (from) {
    where.date = { gte: new Date(from) };
  }

  const [items, total] = await Promise.all([
    prisma.agenda.findMany({
      where,
      orderBy: { date: 'asc' },
      skip,
      take: limit,
      include: { author: { select: { id: true, name: true } } },
    }),
    prisma.agenda.count({ where }),
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

  const parsed = agendaSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const agenda = await prisma.agenda.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,
      coverImage: data.coverImage,
      status: data.status ?? 'PUBLISHED',
      authorId: auth.ctx.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return created(agenda);
}
