const PROMPT_TEMPLATES = {
  default: "{prompt}, high quality, digital art, 4k, ultra detailed",
  anime: "{prompt}, anime style, vibrant colors, studio ghibli, makoto shinkai",
  realistic: "{prompt}, realistic photo, 8k, ultra detailed, national geographic"
} as const;

export type Style = keyof typeof PROMPT_TEMPLATES;

export async function translatePrompt(
  chinesePrompt: string, 
  style: Style = 'default'
): Promise<string> {
  const template = PROMPT_TEMPLATES[style] || PROMPT_TEMPLATES.default
  return template.replace('{prompt}', chinesePrompt)
}