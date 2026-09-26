import axios, { AxiosInstance, AxiosError } from 'axios';

export interface APIClientConfig {
  baseURL?: string;
  token?: string;
}

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(config?: APIClientConfig) {
    this.client = axios.create({
      baseURL: config?.baseURL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (config?.token) {
      this.setToken(config.token);
    }

    // Add interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  }

  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }

  // Auth
  async register(email: string, name: string, password: string) {
    const response = await this.client.post('/auth/register', {
      email,
      name,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }

  // Projects
  async getProjects(page = 1, limit = 10) {
    const response = await this.client.get('/projects', {
      params: { page, limit },
    });
    return response.data;
  }

  async getProject(id: string) {
    const response = await this.client.get(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: any) {
    const response = await this.client.post('/projects', data);
    return response.data;
  }

  async updateProject(id: string, data: any) {
    const response = await this.client.put(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string) {
    const response = await this.client.delete(`/projects/${id}`);
    return response.data;
  }

  // Scripts
  async generateStory(projectId: string, idea: string, genre: string) {
    const response = await this.client.post(`/projects/${projectId}/story/generate`, {
      idea,
      genre,
    });
    return response.data;
  }

  async generateScript(projectId: string, storyId: string, language = 'en') {
    const response = await this.client.post(`/projects/${projectId}/script/generate`, {
      storyId,
      language,
    });
    return response.data;
  }

  // Characters
  async getCharacters(projectId: string) {
    const response = await this.client.get(`/projects/${projectId}/characters`);
    return response.data;
  }

  async createCharacter(projectId: string, data: any) {
    const response = await this.client.post(`/projects/${projectId}/characters`, data);
    return response.data;
  }

  async updateCharacter(projectId: string, characterId: string, data: any) {
    const response = await this.client.put(
      `/projects/${projectId}/characters/${characterId}`,
      data
    );
    return response.data;
  }

  // Scenes
  async getScenes(projectId: string) {
    const response = await this.client.get(`/projects/${projectId}/scenes`);
    return response.data;
  }

  async createScene(projectId: string, data: any) {
    const response = await this.client.post(`/projects/${projectId}/scenes`, data);
    return response.data;
  }

  async updateScene(projectId: string, sceneId: string, data: any) {
    const response = await this.client.put(
      `/projects/${projectId}/scenes/${sceneId}`,
      data
    );
    return response.data;
  }

  // Video Generation
  async generateVideo(projectId: string, sceneId: string, prompt: string, options = {}) {
    const response = await this.client.post(
      `/projects/${projectId}/video/generate`,
      {
        sceneId,
        prompt,
        ...options,
      }
    );
    return response.data;
  }

  async getVideoJobStatus(projectId: string, jobId: string) {
    const response = await this.client.get(
      `/projects/${projectId}/video/jobs/${jobId}`
    );
    return response.data;
  }

  async cancelVideoJob(projectId: string, jobId: string) {
    const response = await this.client.post(
      `/projects/${projectId}/video/jobs/${jobId}/cancel`
    );
    return response.data;
  }

  // Audio Generation
  async generateAudio(projectId: string, type: string, text: string, options = {}) {
    const response = await this.client.post(
      `/projects/${projectId}/audio/generate`,
      {
        type,
        text,
        ...options,
      }
    );
    return response.data;
  }

  // Timeline/Export
  async createTimeline(projectId: string, data: any) {
    const response = await this.client.post(`/projects/${projectId}/timeline`, data);
    return response.data;
  }

  async exportVideo(projectId: string, timelineId: string, options: any) {
    const response = await this.client.post(`/projects/${projectId}/export`, {
      timelineId,
      ...options,
    });
    return response.data;
  }

  async getExportJobStatus(projectId: string, jobId: string) {
    const response = await this.client.get(
      `/projects/${projectId}/export/jobs/${jobId}`
    );
    return response.data;
  }

  // API Connections
  async getConnections() {
    const response = await this.client.get('/connections');
    return response.data;
  }

  async verifyConnection(type: string, provider: string) {
    const response = await this.client.post('/connections/verify', {
      type,
      provider,
    });
    return response.data;
  }

  // Health
  async getHealth() {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Singleton instance
let client: APIClient | null = null;

export function getAPIClient(config?: APIClientConfig): APIClient {
  if (!client) {
    client = new APIClient(config);
  }
  return client;
}

export default getAPIClient();
