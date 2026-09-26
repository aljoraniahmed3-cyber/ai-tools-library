import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query } from '@/lib/db';
import { generateStory } from '@/lib/ai/openai';
import { z } from 'zod';

const generateStorySchema = z.object({
  idea: z.string().min(10).max(1000),
  genre: z.string().min(1).max(100),
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
    const { idea, genre } = generateStorySchema.parse(body);

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      return createErrorResponse('OpenAI API is not configured. Please add OPENAI_API_KEY to settings.', 503);
    }

    // Generate story
    const storyContent = await generateStory(idea, genre);

    if (!storyContent) {
      return createErrorResponse('Failed to generate story', 500);
    }

    // Save story to database
    const result = await query(
      `INSERT INTO stories (project_id, title, content, synopsis, theme)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        resolvedParams.id,
        `Story: ${idea.substring(0, 50)}...`,
        storyContent,
        idea,
        genre,
      ]
    );

    return createSuccessResponse(result[0], 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Generate story error:', error);
    return createErrorResponse('Failed to generate story', 500);
  }
}
