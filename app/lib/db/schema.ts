export const SCHEMA_SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  language VARCHAR(2) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'system',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  duration INTEGER,
  language VARCHAR(10),
  status VARCHAR(20) DEFAULT 'draft',
  cover_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  synopsis TEXT,
  theme VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scripts table
CREATE TABLE IF NOT EXISTS scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  language VARCHAR(10),
  format VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  role VARCHAR(50),
  appearance TEXT,
  personality TEXT,
  background TEXT,
  voice_description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scenes table
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scene_number INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  duration INTEGER,
  description TEXT,
  characters_json JSONB,
  visual_prompt TEXT,
  camera_prompt TEXT,
  lighting_description TEXT,
  music_description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  assets_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, scene_number)
);

-- Video generation jobs table
CREATE TABLE IF NOT EXISTS video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scene_id UUID REFERENCES scenes(id) ON DELETE CASCADE,
  type VARCHAR(50),
  prompt TEXT NOT NULL,
  provider VARCHAR(100),
  provider_id TEXT,
  status VARCHAR(20) DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  video_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- Audio generation table
CREATE TABLE IF NOT EXISTS audio_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50),
  text TEXT,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  provider VARCHAR(100),
  provider_id TEXT,
  status VARCHAR(20) DEFAULT 'queued',
  audio_url TEXT,
  duration FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Timelines table
CREATE TABLE IF NOT EXISTS timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255),
  duration FLOAT,
  fps INTEGER DEFAULT 30,
  resolution VARCHAR(20) DEFAULT '1080p',
  aspect_ratio VARCHAR(10) DEFAULT '16:9',
  tracks_json JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Export jobs table
CREATE TABLE IF NOT EXISTS export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  timeline_id UUID REFERENCES timelines(id) ON DELETE SET NULL,
  format VARCHAR(20),
  quality VARCHAR(20),
  aspect_ratio VARCHAR(10),
  status VARCHAR(20) DEFAULT 'queued',
  progress INTEGER DEFAULT 0,
  file_url TEXT,
  file_size BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP
);

-- API Connections table
CREATE TABLE IF NOT EXISTS api_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  provider VARCHAR(100),
  is_active BOOLEAN DEFAULT false,
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue jobs table
CREATE TABLE IF NOT EXISTS queue_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(100) NOT NULL,
  payload JSONB,
  status VARCHAR(20) DEFAULT 'queued',
  attempt INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error TEXT,
  result JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_project_id ON stories(project_id);
CREATE INDEX IF NOT EXISTS idx_scripts_project_id ON scripts(project_id);
CREATE INDEX IF NOT EXISTS idx_characters_project_id ON characters(project_id);
CREATE INDEX IF NOT EXISTS idx_scenes_project_id ON scenes(project_id);
CREATE INDEX IF NOT EXISTS idx_video_jobs_project_id ON video_generation_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_audio_project_id ON audio_generations(project_id);
CREATE INDEX IF NOT EXISTS idx_timelines_project_id ON timelines(project_id);
CREATE INDEX IF NOT EXISTS idx_export_jobs_project_id ON export_jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_api_connections_user_id ON api_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_status ON queue_jobs(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
`;
