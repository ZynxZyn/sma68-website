import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';
import { slugify } from '@/lib/utils';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  thumbnail: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const news = await prisma.news.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });
  if (!news) return notFound('Berita tidak ditemukan');
  return ok(news);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return notFound('Berita tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  let slug = data.slug;
  if (data.title && !data.slug) slug = slugify(data.title);

  if (slug && slug !== existing.slug) {
    const dup = await prisma.news.findFirst({ where: { slug, NOT: { id } } });
    if (dup) slug = `${slug}-${Date.now().toString(36)}`;
  }

  const news = await prisma.news.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(slug !== undefined && { slug }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.publishedAt !== undefined && {
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription }),
    },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  return ok(news);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return notFound('Berita tidak ditemukan');

  await prisma.news.delete({ where: { id } });
  return ok({ message: 'Berita dihapus' });
}
