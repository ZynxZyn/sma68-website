import { NextRequest } from 'next/server';
import { ok, unauthorized } from '@/lib/api';
import { getUserFromToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return unauthorized('Token tidak ditemukan');

  const user = await getUserFromToken(token);
  if (!user) return unauthorized('Token tidak valid atau akun dinonaktifkan');

  return ok({
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  });
}
