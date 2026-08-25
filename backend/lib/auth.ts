import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Role } from '@prisma/client';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-me';
const ACCESS_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES ?? '15m') as jwt.SignOptions['expiresIn'];
const REFRESH_DAYS = 7;

export interface TokenPayload {
  uid: string;
  role: Role;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAccessToken(user: { id: string; role: Role }): string {
  return jwt.sign({ uid: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: ACCESS_EXPIRES,
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function createRefreshToken(userId: string): Promise<string> {
  const token = jwt.sign({ uid: userId }, JWT_REFRESH_SECRET, {
    expiresIn: `${REFRESH_DAYS}d`,
  } as jwt.SignOptions);
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function rotateRefreshToken(token: string): Promise<{ token: string; userId: string } | null> {
  try {
    jwt.verify(token, JWT_REFRESH_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token } });
    if (!stored || stored.expiresAt < new Date()) return null;

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const newToken = await createRefreshToken(stored.userId);
    return { token: newToken, userId: stored.userId };
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function getUserFromToken(token: string) {
  try {
    const { uid } = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}

export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
}
