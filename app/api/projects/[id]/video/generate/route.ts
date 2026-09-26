import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query, execute } from '@/lib/db';
import { addVideoJob } from '@/lib/jobs/queue';
import { selectBestProvider } from '@/lib/ai/videoProviders';
import { z } from 'zod';

const generateVideoSchema = z.object({
  sceneId: z.string().optional(),
  prompt: z.string().min(10).max(2000),
  imageUrl: z.string().optional(),
  duration: z.number().default(10),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('16:9'),
  quality: z.enum(['low', 'medium', 'high', 'ultra']).default('medium'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await authenticateRequest(request);

  if (error || !user) {
    return createErrorResponse(error || 'Unauthorized', 401);
  }

  try {
    // Verify project ownership
    const projectResult = await query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [params.id, user.userId]
    );

    if (projectResult.length === 0) {
      return createErrorResponse('Project not found', 404);
    }

    const body = await request.json();
    const { sceneId, prompt, imageUrl, duration, aspectRatio, quality } =
      generateVideoSchema.parse(body);

    // Check for available video provider
    const provider = await selectBestProvider({
      type: imageUrl ? 'image_to_video' : 'text_to_video',
      prompt: imageUrl ? undefined : prompt,
      imageUrl: imageUrl,
      duration,
      aspectRatio,
      quality,
    });

    if (!provider) {
      return createErrorResponse(
        'No video provider connected. Please configure a video provider in settings.',
        503
      );
    }

    // Create database record for the job
    const jobResult = await query(
      `INSERT INTO video_generation_jobs
       (project_id, scene_id, type, prompt, provider, status, progress)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        params.id,
        sceneId || null,
        imageUrl ? 'image_to_video' : 'text_to_video',
        prompt,
        provider.name,
        'queued',
        0,
      ]
    );

    const jobRecord = jobResult[0];

    // Queue the job
    try {
      await addVideoJob({
        projectId: params.id,
        sceneId: sceneId || '',
        prompt,
        duration,
        aspectRatio,
        quality,
      });
    } catch (queueError) {
      console.error('Failed to queue video job:', queueError);
      // Still return success - job is in database
    }

    return createSuccessResponse(
      {
        jobId: jobRecord.id,
        status: 'queued',
        message: `Video generation queued with ${provider.name}`,
      },
      202
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse('Invalid input', 400);
    }

    console.error('Generate video error:', error);
    return createErrorResponse('Failed to queue video generation', 500);
  }
}
