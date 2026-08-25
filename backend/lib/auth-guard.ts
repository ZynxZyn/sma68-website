import { NextRequest, NextResponse } from 'next/server';
import type { Role } from '@prisma/client';
import { prisma } from './db';
import { getUserFromToken } from './auth';

export interface AuthContext {
  user: NonNullable<Awaited<ReturnType<typeof getUserFromToken>>>;
}

export async function requireAuth(
  req: NextRequest,
  roles?: Role[],
): Promise<{ ctx: AuthContext } | { res: NextResponse }> {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token) {
    return { res: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) };
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return { res: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) };
  }

  if (roles && !roles.includes(user.role)) {
    return { res: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) };
  }

  return { ctx: { user } };
}

export async function getOptionalUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  return getUserFromToken(token);
}

export async function logActivity(userId: string, action: string, entity?: string, entityId?: string, ip?: string) {
  await prisma.activityLog.create({
    data: { userId, action, entity, entityId, ip },
  });
}
