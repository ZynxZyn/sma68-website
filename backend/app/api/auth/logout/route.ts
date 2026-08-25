import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ok, error } from '@/lib/api';
import { revokeRefreshToken } from '@/lib/auth';

const logoutSchema = z.object({
  refreshToken: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return error('Invalid JSON body', 400);
  }

  const parsed = logoutSchema.safeParse(body);
  if (!parsed.success) return error('Validasi gagal', 400, parsed.error.flatten().fieldErrors);

  await revokeRefreshToken(parsed.data.refreshToken);
  return ok({ message: 'Logout berhasil' });
}
