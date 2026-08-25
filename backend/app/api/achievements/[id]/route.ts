import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  category: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  year: z.string().optional().nullable(),
  achievement: z.string().optional().nullable(),
  studentTeam: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const achievement = await prisma.achievement.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!achievement) return notFound('Prestasi tidak ditemukan');
  return ok(achievement);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return notFound('Prestasi tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const achievement = await prisma.achievement.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.achievement !== undefined && { achievement: data.achievement }),
      ...(data.studentTeam !== undefined && { studentTeam: data.studentTeam }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.description !== undefined && { description: data.description }),
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return ok(achievement);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.achievement.findUnique({ where: { id } });
  if (!existing) return notFound('Prestasi tidak ditemukan');

  await prisma.achievement.delete({ where: { id } });
  return ok({ message: 'Prestasi dihapus' });
}
