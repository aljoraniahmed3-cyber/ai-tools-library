import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query, execute } from '@/lib/db';
import { z } from 'zod';

const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  genre: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['draft', 'in_progress', 'completed', 'archived']).optional(),
  language: z.enum(['en', 'ar', 'multi']).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    const result = await query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [params.id, user.userId]
    );

    if (result.length === 0) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse(result[0]);
  } catch (error) {
    console.error('Get project error:', error);
    return createErrorResponse('Failed to fetch project', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    // Check ownership
    const project = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [params.id, user.userId]
    );

    if (project.length === 0) {
      return createErrorResponse('Project not found', 404);
    }

    const body = await request.json();
    const updates = updateProjectSchema.parse(body);

    // Build update query dynamically
    const updates_entries = Object.entries(updates).filter(([, v]) => v !== undefined);
    if (updates_entries.length === 0) {
      return createErrorResponse('No fields to update', 400);
    }

    let query_str = 'UPDATE projects SET ';
    const values: any[] = [];
    let param_idx = 1;

    updates_entries.forEach(([key, value], idx) => {
      if (idx > 0) query_str += ', ';
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      query_str += `${dbKey} = $${param_idx}`;
      values.push(value);
      param_idx++;
    });

    query_str += `, updated_at = CURRENT_TIMESTAMP WHERE id = $${param_idx} AND user_id = $${param_idx + 1} RETURNING *`;
    values.push(params.id, user.userId);

    const result = await query(query_str, values);

    if (result.length === 0) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse(result[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Update project error:', error);
    return createErrorResponse('Failed to update project', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    const rowsDeleted = await execute(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2',
      [params.id, user.userId]
    );

    if (rowsDeleted === 0) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse({ deleted: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return createErrorResponse('Failed to delete project', 500);
  }
}
