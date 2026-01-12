
import React, { useState, useEffect } from 'react';
import { Upload, Type, Mic2, Play, Send, CheckCircle2, Loader2, Sparkles, Wand2, Image, Download, AlertCircle, Key } from 'lucide-react';
import { VIDEO_MODELS, VOICE_OPTIONS } from '../constants';
import { VideoModel, VoiceOption, JobStatus } from '../types';
import { geminiService } from '../services/geminiService';

// The 'aistudio' property on window is already defined by the environment as 'AIStudio'. 
// We removed the local declaration to resolve duplicate declaration and type conflict errors.

export const AvatarWizard: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>(VIDEO_MODELS[0].id);
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICE_OPTIONS[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<JobStatus>(JobStatus.PENDING);
  const [progressMsg, setProgressMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    // @ts-ignore - window.aistudio is globally available via AIStudio type in this context
    if (window.aistudio) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleOpenKeyModal = async () => {
    // @ts-ignore - window.aistudio is globally available via AIStudio type in this context
    if (window.aistudio) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume the key selection was successful to avoid race conditions as per guidelines
      setHasApiKey(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateAudioPreview = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const base64Audio = await geminiService.generateSpeech(text, selectedVoice);
      if (base64Audio) {
        alert("Áudio pré-visualizado com sucesso! (PCM Data)");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar áudio. Verifique sua chave de API.");
    } finally {
      setIsGenerating(false);
    }
  };

  const startJob = async () => {
    if (!hasApiKey) {
      handleOpenKeyModal();
      return;
    }
    
    setIsGenerating(true);
    setStatus(JobStatus.PROCESSING);
    setVideoUrl(null);
    
    try {
      const modelName = VIDEO_MODELS.find(m => m.id === selectedModel)?.name || "Studio";
      const prompt = `A realistic video of the person in the provided image speaking naturally in a ${modelName} setting. Realistic lip movements, professional lighting, cinematic quality. The person says: ${text}`;
      
      const url = await geminiService.generateTalkingVideo(prompt, image!, (msg) => setProgressMsg(msg));
      
      if (url) {
        setVideoUrl(url);
        setStatus(JobStatus.COMPLETED);
      }
    } catch (err: any) {
      console.error(err);
      setStatus(JobStatus.FAILED);
      // Reset key selection state if the request fails due to missing project/billing
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
      {/* Left Column */}
      <div className="xl:col-span-8 space-y-6">
        
        {!hasApiKey && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-500" size={20} />
              <p className="text-sm text-amber-200">Para usar o motor de vídeo Veo, você precisa selecionar uma chave de API paga.</p>
            </div>
            <button 
              onClick={handleOpenKeyModal}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-lg transition-colors"
            >
              <Key size={14} />
              Configurar Chave
            </button>
          </div>
        )}

        {/* Model Selection */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Play size={18} />
            </div>
            <h2 className="text-lg font-semibold">Cenário do Avatar</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {VIDEO_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                  selectedModel === model.id ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-transparent hover:border-zinc-700'
                }`}
              >
                <img src={model.thumbnail} alt={model.name} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-bold uppercase text-zinc-300">{model.name}</span>
                </div>
                {selectedModel === model.id && (
                  <div className="absolute top-2 right-2 bg-indigo-500 rounded-full p-1">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Image Upload */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Upload size={18} />
            </div>
            <h2 className="text-lg font-semibold">Imagem do Personagem</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-700 hover:border-indigo-500/50 rounded-2xl bg-zinc-900/50 cursor-pointer transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <p className="mb-2 text-sm text-zinc-400 font-medium">Arraste a foto do rosto aqui</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Formatos aceitos: JPG, PNG</p>
                </div>
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
            <div className="w-full md:w-48 flex items-center justify-center">
              {image ? (
                <div className="relative group">
                   <img src={image} className="w-40 h-40 object-cover rounded-2xl border border-zinc-700 shadow-2xl" />
                   <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                     <Type size={12} />
                   </button>
                </div>
              ) : (
                <div className="w-40 h-40 bg-zinc-800/30 border border-zinc-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-zinc-700">
                  <Image size={32} />
                  <span className="text-[10px] mt-2 font-bold uppercase">Sem Preview</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Text Input */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
                <Type size={18} />
              </div>
              <h2 className="text-lg font-semibold">Roteiro da Fala</h2>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-mono text-zinc-500">{text.length}/5000</span>
               <button className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <Sparkles size={12} />
                AI SCRIPT
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            placeholder="O que o seu avatar deve dizer?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </section>
      </div>

      {/* Right Column */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Output & Control Panel */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
              <Mic2 size={18} />
            </div>
            <h2 className="text-lg font-semibold">Configuração & Preview</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">Estilo de Voz</label>
              <select 
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-sm text-zinc-200 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                {VOICE_OPTIONS.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.provider})</option>
                ))}
              </select>
            </div>

            {/* Video Result Preview */}
            <div className="aspect-video bg-black rounded-xl border border-zinc-800 overflow-hidden flex items-center justify-center group relative">
              {videoUrl ? (
                <video src={videoUrl} controls className="w-full h-full object-contain" />
              ) : status === JobStatus.PROCESSING ? (
                <div className="flex flex-col items-center gap-4 px-6 text-center">
                  <div className="relative">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                    <div className="absolute inset-0 blur-xl bg-indigo-500/20 animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-100">{progressMsg || "Processando..."}</p>
                    <p className="text-[10px] text-zinc-500">Isso pode levar de 1 a 3 minutos</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-zinc-700">
                  <Play size={48} className="opacity-20 mb-2" />
                  <p className="text-xs font-bold uppercase">Aguardando geração</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800 space-y-3">
              <button 
                onClick={generateAudioPreview}
                disabled={!text || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded-xl text-xs font-bold transition-all border border-zinc-700"
              >
                <Play size={14} />
                PRÉVIA DO ÁUDIO
              </button>

              <button 
                onClick={startJob}
                disabled={!text || !image || isGenerating}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-sm font-black transition-all shadow-lg hover:-translate-y-0.5"
              >
                {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                GERAR VÍDEO COMPLETO
              </button>

              {videoUrl && (
                <a 
                  href={videoUrl} 
                  download="avatar-flow-video.mp4"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-xs font-bold transition-all"
                >
                  <Download size={14} />
                  BAIXAR VÍDEO FINAL
                </a>
              )}
            </div>

            {status === JobStatus.FAILED && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500">
                <AlertCircle size={16} />
                <span className="text-[10px] font-bold">Ocorreu um erro na geração. Verifique os créditos.</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
