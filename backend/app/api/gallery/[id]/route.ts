import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const imageSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
});

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  caption: z.string().optional().nullable(),
  sortOrder: z.number().optional(),
  album: z.string().optional().nullable(),
  images: z.array(imageSchema).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });
  if (!gallery) return notFound('Galeri tidak ditemukan');
  return ok(gallery);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) return notFound('Galeri tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;

  const gallery = await prisma.$transaction(async (tx) => {
    await tx.gallery.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.caption !== undefined && { caption: data.caption }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        ...(data.album !== undefined && { album: data.album }),
      },
    });

    if (data.images) {
      await tx.galleryImage.deleteMany({ where: { galleryId: id } });
      await tx.galleryImage.createMany({
        data: data.images.map((img, i) => ({
          url: img.url,
          caption: img.caption,
          sortOrder: img.sortOrder ?? i,
          galleryId: id,
        })),
      });
    }

    return tx.gallery.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });
  });

  return ok(gallery);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.gallery.findUnique({ where: { id } });
  if (!existing) return notFound('Galeri tidak ditemukan');

  await prisma.gallery.delete({ where: { id } });
  return ok({ message: 'Galeri dihapus' });
}
