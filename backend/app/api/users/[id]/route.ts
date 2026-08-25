import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, notFound } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';
import { hashPassword } from '@/lib/auth';

const updateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(2).optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF', 'SISWA']).optional(),
  avatar: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
  if ('res' in auth) return auth.res;

  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      studentProfile: true,
      teacherProfile: true,
      staffProfile: true,
    },
  });
  if (!user) return notFound('Pengguna tidak ditemukan');
  return ok(user);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
  if ('res' in auth) return auth.res;

  const { id } = await params;
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return notFound('Pengguna tidak ditemukan');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;

  if (data.username || data.email) {
    const dup = await prisma.user.findFirst({
      where: {
        OR: [
          ...(data.username ? [{ username: data.username }] : []),
          ...(data.email ? [{ email: data.email }] : []),
        ],
        NOT: { id },
      },
    });
    if (dup) return error('Username atau email sudah dipakai pengguna lain', 409);
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(data.username !== undefined && { username: data.username }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.password !== undefined && { passwordHash: await hashPassword(data.password) }),
      ...(data.name !== undefined && { name: data.name }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.avatar !== undefined && { avatar: data.avatar }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      createdAt: true,
    },
  });

  return ok(user);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(req, ['SUPER_ADMIN']);
  if ('res' in auth) return auth.res;

  const { id } = await params;
  if (auth.ctx.user.id === id) return error('Tidak dapat menghapus akun sendiri', 400);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return notFound('Pengguna tidak ditemukan');

  await prisma.user.delete({ where: { id } });
  return ok({ message: 'Pengguna dihapus' });
}
