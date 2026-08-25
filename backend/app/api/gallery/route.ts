import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const imageSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

const gallerySchema = z.object({
  title: z.string().min(3),
  caption: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
  album: z.string().optional().nullable(),
  images: z.array(imageSchema).optional().default([]),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const album = searchParams.get('album');

  const where: Record<string, unknown> = {};
  if (album) where.album = album;

  const [items, total] = await Promise.all([
    prisma.gallery.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    }),
    prisma.gallery.count({ where }),
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

  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const gallery = await prisma.gallery.create({
    data: {
      title: data.title,
      caption: data.caption,
      sortOrder: data.sortOrder ?? 0,
      album: data.album,
      images: {
        create: data.images.map((img, i) => ({
          url: img.url,
          caption: img.caption,
          sortOrder: img.sortOrder ?? i,
        })),
      },
    },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  return created(gallery);
}
