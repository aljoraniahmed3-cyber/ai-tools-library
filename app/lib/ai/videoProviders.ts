// Video Provider Interface - Allows plugging in different video generation APIs
export interface VideoProvider {
  name: string;
  type: 'text_to_video' | 'image_to_video' | 'both';
  isConnected: boolean;

  generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult>;
  getStatus(jobId: string): Promise<VideoJobStatus>;
  cancelJob(jobId: string): Promise<boolean>;
}

export interface VideoGenerationOptions {
  type: 'text_to_video' | 'image_to_video';
  prompt?: string;
  imageUrl?: string;
  duration: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  quality?: 'low' | 'medium' | 'high' | 'ultra';
  style?: string;
}

export interface VideoGenerationResult {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress: number;
  estimatedTime?: number;
  error?: string;
}

export interface VideoJobStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  error?: string;
}

// Base implementation for future providers
export class BaseVideoProvider implements VideoProvider {
  name: string;
  type: 'text_to_video' | 'image_to_video' | 'both' = 'both';
  isConnected: boolean = false;

  constructor(name: string) {
    this.name = name;
    this.checkConnection();
  }

  protected checkConnection(): void {
    this.isConnected = !!process.env[`${this.name.toUpperCase()}_API_KEY`];
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    if (!this.isConnected) {
      return {
        jobId: '',
        status: 'failed',
        progress: 0,
        error: `${this.name} provider is not connected. Please add API key in Settings.`,
      };
    }

    throw new Error(`${this.name} generateVideo not implemented`);
  }

  async getStatus(jobId: string): Promise<VideoJobStatus> {
    throw new Error(`${this.name} getStatus not implemented`);
  }

  async cancelJob(jobId: string): Promise<boolean> {
    throw new Error(`${this.name} cancelJob not implemented`);
  }
}

// Placeholder implementations for future integration
class SoraAlternativeProvider extends BaseVideoProvider {
  constructor() {
    super('sora-alternative');
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    // To be implemented with actual Sora alternative API
    // This could be: Runway, Pika, Stabilityai, or other emerging providers
    return super.generateVideo(options);
  }

  async getStatus(jobId: string): Promise<VideoJobStatus> {
    return {
      jobId,
      status: 'processing',
      progress: 0,
    };
  }
}

class HeyGenProvider extends BaseVideoProvider {
  constructor() {
    super('heygen');
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    // To be implemented with HeyGen API
    return super.generateVideo(options);
  }

  async getStatus(jobId: string): Promise<VideoJobStatus> {
    return {
      jobId,
      status: 'processing',
      progress: 0,
    };
  }
}

class HiggsfieldProvider extends BaseVideoProvider {
  constructor() {
    super('higgsfield');
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    // To be implemented with Higgsfield API
    return super.generateVideo(options);
  }

  async getStatus(jobId: string): Promise<VideoJobStatus> {
    return {
      jobId,
      status: 'processing',
      progress: 0,
    };
  }
}

// Provider Registry
const providers: Map<string, VideoProvider> = new Map();

export function registerProvider(provider: VideoProvider): void {
  providers.set(provider.name, provider);
}

export function getProvider(name: string): VideoProvider | null {
  return providers.get(name) || null;
}

export function getAllProviders(): VideoProvider[] {
  return Array.from(providers.values());
}

export function getConnectedProviders(): VideoProvider[] {
  return Array.from(providers.values()).filter((p) => p.isConnected);
}

// Initialize default providers
export function initializeProviders(): void {
  registerProvider(new SoraAlternativeProvider());
  registerProvider(new HeyGenProvider());
  registerProvider(new HiggsfieldProvider());
}

// Helper to select best available provider
export async function selectBestProvider(options: VideoGenerationOptions): Promise<VideoProvider | null> {
  const connected = getConnectedProviders();

  if (connected.length === 0) {
    return null;
  }

  // Select provider based on capabilities
  const suitable = connected.filter((p) => {
    if (options.type === 'text_to_video') {
      return p.type === 'text_to_video' || p.type === 'both';
    } else {
      return p.type === 'image_to_video' || p.type === 'both';
    }
  });

  return suitable.length > 0 ? suitable[0] : null;
}
