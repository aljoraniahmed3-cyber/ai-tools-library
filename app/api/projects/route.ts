import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query, execute } from '@/lib/db';
import { z } from 'zod';

const projectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  genre: z.string().optional(),
  duration: z.number().optional(),
  language: z.enum(['en', 'ar', 'multi']).default('en'),
});

export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const results = await query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3',
      [user.userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) as count FROM projects WHERE user_id = $1',
      [user.userId]
    );

    const total = countResult[0]?.count || 0;

    return createSuccessResponse({
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return createErrorResponse('Failed to fetch projects', 500);
  }
}

export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const { title, description, genre, duration, language } = projectSchema.parse(body);

    const result = await query(
      `INSERT INTO projects (user_id, title, description, genre, duration, language, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user.userId, title, description || null, genre || null, duration || null, language, 'draft']
    );

    const project = result[0];

    return createSuccessResponse(project, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Create project error:', error);
    return createErrorResponse('Failed to create project', 500);
  }
}
