import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishDate: z.string().datetime().optional().nullable(),
  expireDate: z.string().datetime().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!announcement) return notFound('Pengumuman tidak ditemukan');
  return ok(announcement);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) return notFound('Pengumuman tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const announcement = await prisma.announcement.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.publishDate !== undefined && {
        publishDate: data.publishDate ? new Date(data.publishDate) : null,
      }),
      ...(data.expireDate !== undefined && {
        expireDate: data.expireDate ? new Date(data.expireDate) : null,
      }),
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return ok(announcement);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.announcement.findUnique({ where: { id } });
  if (!existing) return notFound('Pengumuman tidak ditemukan');

  await prisma.announcement.delete({ where: { id } });
  return ok({ message: 'Pengumuman dihapus' });
}
