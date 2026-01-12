
import React from 'react';
import { VideoModel, VoiceOption } from './types';
import { Video, Image, Mic, History, Settings, Film } from 'lucide-react';

export const NAV_ITEMS = [
  { label: "Gerar Avatar", icon: <Video size={20} />, path: "/" },
  { label: "Gerar Imagem", icon: <Image size={20} />, path: "/generate-image" },
  { label: "Gerar Vídeo", icon: <Film size={20} />, path: "/generate-video" },
  { label: "Clonar Voz", icon: <Mic size={20} />, path: "/voice-clone" },
  { label: "Histórico", icon: <History size={20} />, path: "/history" },
  { label: "Configurações", icon: <Settings size={20} />, path: "/settings" }
];

export const VIDEO_MODELS: VideoModel[] = [
  { id: 'm1', name: 'Cinematic Studio', thumbnail: 'https://picsum.photos/seed/m1/400/225', previewUrl: '' },
  { id: 'm2', name: 'Corporate Office', thumbnail: 'https://picsum.photos/seed/m2/400/225', previewUrl: '' },
  { id: 'm3', name: 'Casual Home', thumbnail: 'https://picsum.photos/seed/m3/400/225', previewUrl: '' },
  { id: 'm4', name: 'Green Screen', thumbnail: 'https://picsum.photos/seed/m4/400/225', previewUrl: '' },
];

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'Kore', name: 'Kore (Enérgico)', provider: 'Gemini', gender: 'Male' },
  { id: 'Puck', name: 'Puck (Amigável)', provider: 'Gemini', gender: 'Female' },
  { id: 'Charon', name: 'Charon (Sério)', provider: 'Gemini', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir (Profundo)', provider: 'Gemini', gender: 'Male' },
  { id: 'eleven_bella', name: 'Bella (Natural)', provider: 'ElevenLabs', gender: 'Female' },
  { id: 'eleven_adam', name: 'Adam (Narrador)', provider: 'ElevenLabs', gender: 'Male' },
];
