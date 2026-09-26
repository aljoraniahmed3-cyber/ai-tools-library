import Queue from 'bull';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Queue instances
const queues: { [key: string]: Queue.Queue } = {};

function getQueueInstance(name: string): Queue.Queue {
  if (!queues[name]) {
    queues[name] = new Queue(name, REDIS_URL, {
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600, // Remove after 1 hour
        },
      },
    });

    // Error handling
    queues[name].on('error', (error) => {
      console.error(`Queue ${name} error:`, error);
    });

    queues[name].on('failed', (job, error) => {
      console.error(`Job ${job.id} failed:`, error);
    });
  }

  return queues[name];
}

// Video Generation Queue
export const videoQueue = getQueueInstance('video-generation');

// Audio Generation Queue
export const audioQueue = getQueueInstance('audio-generation');

// Image Generation Queue
export const imageQueue = getQueueInstance('image-generation');

// Export/Rendering Queue
export const exportQueue = getQueueInstance('export');

// FFmpeg Processing Queue
export const ffmpegQueue = getQueueInstance('ffmpeg');

// Generic Job Queue
export const jobQueue = getQueueInstance('jobs');

// Queue Job Types
export interface VideoJobData {
  projectId: string;
  sceneId: string;
  prompt: string;
  duration: number;
  aspectRatio?: string;
  quality?: string;
}

export interface AudioJobData {
  projectId: string;
  type: string;
  text: string;
  characterId?: string;
}

export interface ExportJobData {
  projectId: string;
  timelineId: string;
  format: string;
  quality: string;
  aspectRatio: string;
}

// Add job to queue
export async function addVideoJob(data: VideoJobData) {
  const job = await videoQueue.add(data, {
    jobId: `video-${data.projectId}-${Date.now()}`,
  });
  return job.id;
}

export async function addAudioJob(data: AudioJobData) {
  const job = await audioQueue.add(data, {
    jobId: `audio-${data.projectId}-${Date.now()}`,
  });
  return job.id;
}

export async function addImageJob(data: any) {
  const job = await imageQueue.add(data, {
    jobId: `image-${data.projectId}-${Date.now()}`,
  });
  return job.id;
}

export async function addExportJob(data: ExportJobData) {
  const job = await exportQueue.add(data, {
    jobId: `export-${data.projectId}-${Date.now()}`,
  });
  return job.id;
}

// Get job status
export async function getJobStatus(queueName: string, jobId: string) {
  const queue = getQueueInstance(queueName);
  const job = await queue.getJob(jobId);

  if (!job) {
    return null;
  }

  return {
    id: job.id,
    status: await job.getState(),
    progress: job.progress(),
    data: job.data,
    result: job.returnvalue,
    error: job.failedReason,
  };
}

// Cancel job
export async function cancelJob(queueName: string, jobId: string) {
  const queue = getQueueInstance(queueName);
  const job = await queue.getJob(jobId);

  if (!job) {
    return false;
  }

  await job.remove();
  return true;
}

// Cleanup old queues
export async function cleanupQueues() {
  for (const queue of Object.values(queues)) {
    await queue.clean(3600, 'completed'); // Clean completed jobs after 1 hour
    await queue.clean(86400, 'failed'); // Clean failed jobs after 24 hours
  }
}

// Process queue (to be called by workers)
export function setupProcessors() {
  // Video generation processor
  videoQueue.process(async (job) => {
    console.log(`Processing video job ${job.id}:`, job.data);
    job.progress(10);

    try {
      // TODO: Call video provider API
      // For now, simulate processing
      job.progress(50);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      job.progress(100);

      return {
        success: true,
        videoUrl: 'https://example.com/video.mp4',
        duration: job.data.duration,
      };
    } catch (error) {
      throw error;
    }
  });

  // Audio generation processor
  audioQueue.process(async (job) => {
    console.log(`Processing audio job ${job.id}:`, job.data);
    job.progress(10);

    try {
      // TODO: Call audio provider API
      job.progress(50);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      job.progress(100);

      return {
        success: true,
        audioUrl: 'https://example.com/audio.mp3',
      };
    } catch (error) {
      throw error;
    }
  });

  // Export processor
  exportQueue.process(async (job) => {
    console.log(`Processing export job ${job.id}:`, job.data);
    job.progress(10);

    try {
      // TODO: Call FFmpeg to process video
      job.progress(50);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      job.progress(100);

      return {
        success: true,
        fileUrl: 'https://example.com/export.mp4',
        fileSize: 500000000,
      };
    } catch (error) {
      throw error;
    }
  });

  console.log('Queue processors initialized');
}
