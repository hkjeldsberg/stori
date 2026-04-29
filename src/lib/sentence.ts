export const BLANK_TOKEN = "_____";

export interface ParsedSentence {
  prefix: string;
  suffix: string;
  hasBlank: boolean;
}

export function parseSentenceTemplate(template: string): ParsedSentence {
  const idx = template.indexOf(BLANK_TOKEN);
  if (idx === -1) {
    return { prefix: template, suffix: "", hasBlank: false };
  }
  return {
    prefix: template.slice(0, idx),
    suffix: template.slice(idx + BLANK_TOKEN.length),
    hasBlank: true,
  };
}

export interface BuildPromptArgs {
  subject: string;
  setting: string;
  adjective: string;
}

export function buildImagePrompt({ subject, setting, adjective }: BuildPromptArgs): string {
  const adj = adjective.trim();
  const cleanSubject = subject.trim().replace(/^A\s+/i, "");
  return [
    `A ${adj} ${cleanSubject}, set in ${setting.trim()}.`,
    `The ${cleanSubject} is visibly and unmistakably ${adj} — make this the clear focus of the image.`,
    `Flat pastel illustration, children's storybook style.`,
  ].join(" ");
}
