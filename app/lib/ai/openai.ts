import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

export async function generateStory(idea: string, genre: string): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a creative storyteller. Generate engaging and coherent stories based on ideas and genres.',
      },
      {
        role: 'user',
        content: `Create a compelling story based on this idea and genre:\nIdea: ${idea}\nGenre: ${genre}\n\nProvide a detailed story outline.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  });

  return response.choices[0]?.message.content || '';
}

export async function generateScript(
  story: string,
  language: 'en' | 'ar' = 'en'
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a professional screenwriter. Create detailed scripts in ${language === 'ar' ? 'Arabic' : 'English'} format.`,
      },
      {
        role: 'user',
        content: `Convert this story into a screenplay format:\n\n${story}\n\nInclude scene headings, action, dialogue, and character descriptions.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  return response.choices[0]?.message.content || '';
}

export async function generateDialogue(
  characterName: string,
  context: string,
  language: 'en' | 'ar' = 'en'
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a dialogue writer creating authentic conversations for characters in ${language === 'ar' ? 'Arabic' : 'English'}.`,
      },
      {
        role: 'user',
        content: `Write natural and engaging dialogue for the character "${characterName}" in the following context:\n\n${context}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  return response.choices[0]?.message.content || '';
}

export async function generateVisualPrompt(
  sceneDescription: string,
  style?: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at creating detailed visual prompts for AI image and video generation. Create vivid, descriptive, and technically sound prompts.',
      },
      {
        role: 'user',
        content: `Create a detailed visual prompt for this scene:\n\nScene: ${sceneDescription}\n${style ? `\nStyle: ${style}` : ''}\n\nMake it descriptive enough for AI video generation.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message.content || '';
}

export async function generateCharacterDescription(
  characterName: string,
  traits: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a character development expert. Create detailed character descriptions.',
      },
      {
        role: 'user',
        content: `Create a detailed description for a character:\nName: ${characterName}\nTraits: ${traits}\n\nInclude appearance, personality, background, and voice characteristics.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return response.choices[0]?.message.content || '';
}

export async function extractSceneBreakdown(scriptContent: string): Promise<any[]> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a script analyst. Extract and structure scene information from scripts in JSON format.',
      },
      {
        role: 'user',
        content: `Analyze this script and extract scene information. Return a JSON array with scene details:\n\n${scriptContent}\n\nReturn JSON with: sceneNumber, title, location, duration, characters, description`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
  });

  try {
    const content = response.choices[0]?.message.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error('Error parsing scene breakdown:', error);
    return [];
  }
}
