import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, created, error } from '@/lib/api';
import { parsePagination } from '@/lib/api';
import { requireAuth } from '@/lib/auth-guard';
import { hashPassword } from '@/lib/auth';

const userSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'GURU', 'STAFF', 'SISWA']),
  avatar: z.string().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
  if ('res' in auth) return auth.res;

  const { searchParams } = new URL(req.url);
  const { page, limit, skip } = parsePagination(searchParams);
  const role = searchParams.get('role');
  const search = searchParams.get('search');

  const where: Record<string, unknown> = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { username: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
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
    }),
    prisma.user.count({ where }),
  ]);

  return ok({ items, total, page, limit, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
  if ('res' in auth) return auth.res;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const data = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username: data.username }, { email: data.email }] },
  });
  if (existing) {
    return error('Username atau email sudah terdaftar', 409);
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
      avatar: data.avatar,
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

  return created(user);
}
