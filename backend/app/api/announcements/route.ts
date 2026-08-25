import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const announcementSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishDate: z.string().datetime().optional().nullable(),
  expireDate: z.string().datetime().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get('status');
  const now = new Date();

  const where: Record<string, unknown> = {};
  if (status) {
    where.status = status;
  } else {
    where.status = 'PUBLISHED';
    where.publishDate = { lte: now };
  }

  const [items, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ publishDate: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include: { author: { select: { id: true, name: true } } },
    }),
    prisma.announcement.count({ where }),
  ]);

  return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF']);
  if ('res' in auth) return auth.res;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = announcementSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const announcement = await prisma.announcement.create({
    data: {
      title: data.title,
      content: data.content,
      status: data.status ?? 'DRAFT',
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      expireDate: data.expireDate ? new Date(data.expireDate) : null,
      authorId: auth.ctx.user.id,
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return created(announcement);
}
