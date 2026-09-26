import { NextRequest } from 'next/server';
import { authenticateRequest, createErrorResponse, createSuccessResponse } from '@/lib/auth/middleware';
import { query } from '@/lib/db';
import { getJobStatus, cancelJob } from '@/lib/jobs/queue';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; jobId: string } }
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

    // Get job from database
    const jobResult = await query(
      'SELECT * FROM video_generation_jobs WHERE id = $1 AND project_id = $2',
      [params.jobId, params.id]
    );

    if (jobResult.length === 0) {
      return createErrorResponse('Job not found', 404);
    }

    const job = jobResult[0];

    // Try to get real-time status from queue
    let queueStatus = null;
    try {
      queueStatus = await getJobStatus('video-generation', params.jobId);
    } catch (e) {
      // Queue unavailable, use database status
    }

    return createSuccessResponse({
      ...job,
      queueStatus: queueStatus || { status: job.status, progress: job.progress },
    });
  } catch (error) {
    console.error('Get job status error:', error);
    return createErrorResponse('Failed to fetch job status', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; jobId: string } }
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

    // Verify job exists
    const jobResult = await query(
      'SELECT id FROM video_generation_jobs WHERE id = $1 AND project_id = $2',
      [params.jobId, params.id]
    );

    if (jobResult.length === 0) {
      return createErrorResponse('Job not found', 404);
    }

    // Cancel from queue
    try {
      await cancelJob('video-generation', params.jobId);
    } catch (e) {
      console.error('Failed to cancel queue job:', e);
    }

    // Update database status
    await query(
      'UPDATE video_generation_jobs SET status = $1 WHERE id = $2',
      ['cancelled', params.jobId]
    );

    return createSuccessResponse({ cancelled: true });
  } catch (error) {
    console.error('Cancel job error:', error);
    return createErrorResponse('Failed to cancel job', 500);
  }
}
