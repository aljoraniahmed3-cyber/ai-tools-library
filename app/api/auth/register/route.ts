import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { hashPassword } from '@/lib/auth/password';
import { createToken } from '@/lib/auth/jwt';
import { query, execute } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(255),
  password: z.string().min(8),
  language: z.enum(['en', 'ar']).default('en'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, language } = registerSchema.parse(body);

    // Check if email exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.length > 0) {
      return createErrorResponse('Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const result = await query(
      'INSERT INTO users (email, name, password_hash, language) VALUES ($1, $2, $3, $4) RETURNING id, email, name, language',
      [email, name, passwordHash, language]
    );

    const user = result[0];
    if (!user) {
      return createErrorResponse('Failed to create user', 500);
    }

    // Create token
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    return createSuccessResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          language: user.language,
        },
        token,
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Register error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
