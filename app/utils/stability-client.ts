export class StabilityClient {
  private apiKey: string;
  private baseUrl = 'https://api.stability.ai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateImage(prompt: string, style: string = 'default'): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generation/stable-diffusion-xl-1024-v1-0/text-to-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 4,
          steps: 30,
          style_preset: style === 'default' ? 'photographic' : style,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate image');
      }

      const result = await response.json();
      return result.artifacts.map((artifact: any) => artifact.base64);
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
} 