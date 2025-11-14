interface TokenPayload {
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function decodeJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return false;
  }

  const expirationTime = payload.exp * 1000;
  const currentTime = Date.now();
  const CLOCK_SKEW_BUFFER = 5 * 60 * 1000;

  return currentTime >= expirationTime - CLOCK_SKEW_BUFFER;
}

function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  return parts.every((part) => part.length > 0);
}

export function validateToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  if (!isValidTokenFormat(token)) {
    return false;
  }

  if (isTokenExpired(token)) {
    return false;
  }

  return true;
}

export function getTokenExpiration(token: string): number | null {
  const payload = decodeJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }
  return payload.exp * 1000;
}

