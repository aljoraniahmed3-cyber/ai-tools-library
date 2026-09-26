import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query } from '@/lib/db';
import { generateScript } from '@/lib/ai/openai';
import { z } from 'zod';

const generateScriptSchema = z.object({
  storyContent: z.string().min(10),
  language: z.enum(['en', 'ar']).default('en'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    const resolvedParams = await params;
    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [resolvedParams.id, user.userId]
    );

    if (projectResult.length === 0) {
      return createErrorResponse('Project not found', 404);
    }

    const body = await request.json();
    const { storyContent, language } = generateScriptSchema.parse(body);

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return createErrorResponse('OpenAI API is not configured. Please add OPENAI_API_KEY to settings.', 503);
    }

    // Generate script
    const scriptContent = await generateScript(storyContent, language);

    if (!scriptContent) {
      return createErrorResponse('Failed to generate script', 500);
    }

    // Save script to database
    const result = await query(
      `INSERT INTO scripts (project_id, title, content, language, format)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        resolvedParams.id,
        'Generated Script',
        scriptContent,
        language,
        'screenplay',
      ]
    );

    return createSuccessResponse(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Generate script error:', error);
    return createErrorResponse('Failed to generate script', 500);
  }
}
