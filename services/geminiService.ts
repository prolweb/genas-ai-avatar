
import { GoogleGenAI, Modality } from "@google/genai";

export class GeminiService {
  /**
   * Gera áudio PCM bruto a partir de texto.
   */
  async generateSpeech(text: string, voiceName: string): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    } catch (error) {
      console.error("Gemini TTS Error:", error);
      throw error;
    }
  }

  /**
   * Gera um vídeo de avatar falando usando o modelo Veo.
   * Utiliza a imagem fornecida como base (frame inicial).
   */
  async generateTalkingVideo(prompt: string, base64Image: string, onProgress?: (msg: string) => void): Promise<string | undefined> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    try {
      onProgress?.("Iniciando motor de animação Veo...");
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: cleanBase64,
          mimeType: 'image/png',
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      const messages = [
        "Analisando expressões faciais...",
        "Sintetizando movimentos labiais...",
        "Renderizando ambiente e iluminação...",
        "Finalizando composição do avatar...",
        "Quase pronto! Preparando link de download..."
      ];
      let msgIndex = 0;

      while (!operation.done) {
        onProgress?.(messages[msgIndex % messages.length]);
        msgIndex++;
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Falha ao obter link do vídeo");

      // O link de download requer a chave de API
      return `${downloadLink}&key=${process.env.API_KEY}`;
    } catch (error) {
      console.error("Veo Video Gen Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
