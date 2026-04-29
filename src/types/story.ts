export interface Story {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface Page {
  id: string;
  storyId: string;
  pageNumber: number;
  sentenceTemplate: string;
  basePromptSubject: string;
  basePromptSetting: string;
  createdAt: string;
}

export interface GenerateImageRequest {
  subject: string;
  setting: string;
  adjective: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  prompt: string;
}
