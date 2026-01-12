
export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface VideoModel {
  id: string;
  name: string;
  thumbnail: string;
  previewUrl: string;
}

export interface VoiceOption {
  id: string;
  name: string;
  provider: 'ElevenLabs' | 'Gemini';
  gender: 'Male' | 'Female' | 'Neutral';
}

export interface AvatarJob {
  id: string;
  status: JobStatus;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  voiceId: string;
  createdAt: Date;
}

export interface VoiceSettings {
  stability: number;
  clarity: number;
  speed: number;
  pitch: number;
}
