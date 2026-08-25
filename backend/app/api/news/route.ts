import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';
import { slugify } from '@/lib/utils';

const newsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  thumbnail: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const status = searchParams.get('status');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include: { author: { select: { id: true, name: true, avatar: true } } },
    }),
    prisma.news.count({ where }),
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

  const parsed = newsSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now().toString(36)}` : slug;

  const news = await prisma.news.create({
    data: {
      title: data.title,
      slug: finalSlug,
      excerpt: data.excerpt,
      content: data.content,
      thumbnail: data.thumbnail,
      category: data.category,
      status: data.status ?? 'DRAFT',
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      authorId: auth.ctx.user.id,
    },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  });

  return created(news);
}
