import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  date: z.string().datetime().optional(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const agenda = await prisma.agenda.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!agenda) return notFound('Agenda tidak ditemukan');
  return ok(agenda);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.agenda.findUnique({ where: { id } });
  if (!existing) return notFound('Agenda tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;
  const agenda = await prisma.agenda.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.startTime !== undefined && { startTime: data.startTime }),
      ...(data.endTime !== undefined && { endTime: data.endTime }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(data.status !== undefined && { status: data.status }),
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return ok(agenda);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF']);
  if ('res' in auth) return auth.res;

  const existing = await prisma.agenda.findUnique({ where: { id } });
  if (!existing) return notFound('Agenda tidak ditemukan');

  await prisma.agenda.delete({ where: { id } });
  return ok({ message: 'Agenda dihapus' });
}
