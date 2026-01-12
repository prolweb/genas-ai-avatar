
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { User, Bell, ChevronRight, Zap } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg">A</div>
            <span className="text-xl font-bold tracking-tight">AvatarFlow <span className="text-indigo-500">AI</span></span>
          </div>
          
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-zinc-800">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">CRÉDITOS DISPONÍVEIS</span>
              <Zap size={14} className="text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-bold">1,240</div>
            <button className="w-full mt-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold transition-colors">
              RECARREGAR
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-zinc-100 font-medium">Criador de Avatar</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-zinc-800"></div>
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors">
              <span className="text-xs font-medium px-2">vitor.dev</span>
              <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center">
                <User size={14} />
              </div>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};
