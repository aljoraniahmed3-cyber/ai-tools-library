import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

const SECRET = process.env.NEXTAUTH_SECRET || 'dev-secret-key';
const EXPIRATION = '7d';

export function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRATION });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token);
    return decoded as TokenPayload | null;
  } catch (error) {
    return null;
  }
}
