// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  avatar?: string;
  language: 'en' | 'ar';
  theme: 'light' | 'dark' | 'system';
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  title: string;
  description?: string;
  genre: string;
  duration: number; // in minutes
  language: 'en' | 'ar' | 'multi';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Story & Script Types
export interface Story {
  id: string;
  projectId: string;
  title: string;
  content: string;
  synopsis: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Script {
  id: string;
  projectId: string;
  storyId?: string;
  title: string;
  content: string;
  language: 'en' | 'ar' | 'multi';
  format: 'screenplay' | 'treatment' | 'outline';
  createdAt: Date;
  updatedAt: Date;
}

// Character Types
export interface Character {
  id: string;
  projectId: string;
  name: string;
  description: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'extra';
  appearance: string;
  personality: string;
  background: string;
  voiceDescription?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Scene Types
export interface Scene {
  id: string;
  projectId: string;
  sceneNumber: number;
  title: string;
  location: string;
  duration: number; // in seconds
  description: string;
  characters: string[]; // character IDs
  dialogue: SceneDialogue[];
  visualPrompt: string;
  cameraPrompt: string;
  lightingDescription: string;
  musicDescription?: string;
  status: 'draft' | 'approved' | 'in_production' | 'completed';
  assets?: SceneAsset[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SceneDialogue {
  characterId: string;
  text: string;
  voiceSettings?: {
    speed: number;
    pitch: number;
    emotion?: string;
  };
}

export interface SceneAsset {
  id: string;
  type: 'video' | 'image' | 'audio' | 'subtitle';
  url: string;
  duration?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

// Video Generation Types
export interface VideoGenerationJob {
  id: string;
  projectId: string;
  sceneId: string;
  type: 'text_to_video' | 'image_to_video' | 'scene_generation';
  prompt: string;
  provider: string;
  providerId?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  videoUrl?: string;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Audio/Voice Types
export interface AudioGeneration {
  id: string;
  projectId: string;
  type: 'dialogue' | 'narration' | 'voiceover' | 'music' | 'sfx';
  text?: string;
  characterId?: string;
  provider: string;
  providerId?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  audioUrl?: string;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Editing & Montage Types
export interface Timeline {
  id: string;
  projectId: string;
  name: string;
  tracks: TimelineTrack[];
  duration: number;
  fps: 24 | 30 | 60;
  resolution: '1080p' | '2k' | '4k';
  aspectRatio: '16:9' | '9:16' | '1:1';
}

export interface TimelineTrack {
  id: string;
  type: 'video' | 'audio' | 'voice' | 'music' | 'subtitle';
  clips: TimelineClip[];
  muted?: boolean;
  volume?: number;
}

export interface TimelineClip {
  id: string;
  type: 'video' | 'audio' | 'text' | 'effect';
  url?: string;
  text?: string;
  startTime: number;
  duration: number;
  endTime: number;
  effects?: string[];
  volume?: number;
  opacity?: number;
}

// Export Types
export interface ExportJob {
  id: string;
  projectId: string;
  timelineId: string;
  format: 'mp4' | 'mov' | 'webm';
  quality: 'low' | 'medium' | 'high' | 'ultra';
  aspectRatio: '16:9' | '9:16' | '1:1';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  fileUrl?: string;
  fileSize?: number;
  createdAt: Date;
  completedAt?: Date;
}

// API Connection Types
export interface APIConnection {
  id: string;
  userId: string;
  type: 'openai' | 'video_provider' | 'voice_provider' | 'storage';
  provider: string;
  isActive: boolean;
  lastVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Sensitive data not stored directly - only status
}

// Job Queue Types
export interface QueueJob {
  id: string;
  type: string;
  payload: Record<string, any>;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  attempt: number;
  maxAttempts: number;
  error?: string;
  result?: Record<string, any>;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
