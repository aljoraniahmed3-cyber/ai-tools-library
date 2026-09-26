import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { verifyPassword } from '@/lib/auth/password';
import { createToken } from '@/lib/auth/jwt';
import { query } from '@/lib/db';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    // Find user
    const result = await query(
      'SELECT id, email, name, password_hash, language FROM users WHERE email = $1',
      [email]
    );

    if (result.length === 0) {
      return createErrorResponse('Invalid email or password', 401);
    }

    const user = result[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return createErrorResponse('Invalid email or password', 401);
    }

    // Create token
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    return createSuccessResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Login error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
