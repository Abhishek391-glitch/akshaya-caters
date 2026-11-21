import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'akshaya_admin_session';
const SECRET_KEYS = Array.from(
  new Set(
    [
      process.env.ADMIN_SESSION_SECRET,
      'akshaya_catering_secure_session_secret_2026_x9z',
      'akshaya_secret_session_token_replace_in_production_987654321',
      'akshaya-caterers-default-hmac-secret-2026',
    ].filter(Boolean) as string[]
  )
);
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface SessionData {
  username: string;
  role: 'admin';
  exp: number;
}

// Generate HMAC signature
function signPayload(payload: string, secret = SECRET_KEYS[0]): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function createToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const data: SessionData = { username, role: 'admin', exp };
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const signature = signPayload(payload, SECRET_KEYS[0]);
  return `${payload}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts;

    // Check against all known secret keys (supports smooth secret rotation)
    let isValid = false;
    const sigBuf = Buffer.from(signature);

    for (const secret of SECRET_KEYS) {
      const expectedSignature = signPayload(payload, secret);
      const expBuf = Buffer.from(expectedSignature);
      if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      return null;
    }

    const json = Buffer.from(payload, 'base64url').toString('utf-8');
    const data: SessionData = JSON.parse(json);

    if (Date.now() / 1000 > data.exp) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function setAdminSession(username: string) {
  const token = createToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getAdminSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}
