import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, TokenPayload } from './jwt';

export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: TokenPayload | null; error: string | null }> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return { user: null, error: 'Missing authorization header' };
    }

    const token = authHeader.slice(7);
    const user = verifyToken(token);

    if (!user) {
      return { user: null, error: 'Invalid or expired token' };
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: 'Authentication failed' };
  }
}

export function createErrorResponse(
  message: string,
  status: number = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: `ERROR_${status}`,
        message,
      },
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function createSuccessResponse<T>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
