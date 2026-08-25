import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ok, error, unauthorized, forbidden } from '@/lib/api';
import {
  createRefreshToken,
  signAccessToken,
  updateLastLogin,
  verifyPassword,
} from '@/lib/auth';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);
  }

  const { username, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email: username }],
    },
  });

  if (!user) return unauthorized('Username/email atau password salah');
  if (!user.isActive) return forbidden('Akun dinonaktifkan');
  if (!(await verifyPassword(password, user.passwordHash)))
    return unauthorized('Username/email atau password salah');

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);
  await updateLastLogin(user.id);

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
