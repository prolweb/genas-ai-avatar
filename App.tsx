
import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AvatarWizard } from './components/AvatarWizard';
import { Loader2 } from 'lucide-react';

const PagePlaceholder = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-zinc-500">
      <Loader2 className="animate-spin" size={24} />
    </div>
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    <p className="text-zinc-500 max-w-md">Esta funcionalidade está em desenvolvimento para a fase 2 do projeto.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
          </div>
        }>
          <Routes>
            <Route path="/" element={<AvatarWizard />} />
            <Route path="/generate-image" element={<PagePlaceholder title="Gerador de Imagens AI" />} />
            <Route path="/generate-video" element={<PagePlaceholder title="Criação de Vídeos Dinâmicos" />} />
            <Route path="/voice-clone" element={<PagePlaceholder title="Clonagem de Voz ElevenLabs" />} />
            <Route path="/history" element={<PagePlaceholder title="Histórico de Gerações" />} />
            <Route path="/settings" element={<PagePlaceholder title="Configurações da Conta" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
