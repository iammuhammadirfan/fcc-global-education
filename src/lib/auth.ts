import crypto from 'crypto';
import { cookies } from 'next/headers';
import { User } from './types';

const AUTH_COOKIE_NAME = 'fccglobal_admin_session';
const SESSION_SECRET = process.env.AUTH_SECRET || process.env.ADMIN_SESSION_SECRET || 'fccglobal-super-secret-production-key-2026';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

export function signToken(payload: { userId: string; email: string; role: string }): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function getCurrentAdminUser(getUserById: (id: string) => User | undefined): Promise<User | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  const user = getUserById(decoded.userId);
  return user || null;
}

export function signPasswordResetToken(payload: { userId: string; email: string }): string {
  // Token valid for 1 hour
  const data = Buffer.from(
    JSON.stringify({ ...payload, purpose: 'admin_password_reset', exp: Date.now() + 60 * 60 * 1000 })
  ).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

export function verifyPasswordResetToken(token: string): { userId: string; email: string } | null {
  try {
    const [data, signature] = token.split('.');
    if (!data || !signature) return null;
    const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.purpose !== 'admin_password_reset') return null;
    if (payload.exp && Date.now() > payload.exp) return null;
    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export { AUTH_COOKIE_NAME };
