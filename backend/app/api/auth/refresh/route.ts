import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error } from '@/lib/api';
import { createRefreshToken, rotateRefreshToken, signAccessToken } from '@/lib/auth';

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = refreshSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  const rotated = await rotateRefreshToken(parsed.data.refreshToken);
  if (!rotated) return error('Refresh token tidak valid atau sudah kedaluwarsa', 401);

  const user = await prisma.user.findUnique({ where: { id: rotated.userId } });
  if (!user || !user.isActive) return error('Akun tidak ditemukan atau dinonaktifkan', 401);

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return ok({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
    },
  });
}
