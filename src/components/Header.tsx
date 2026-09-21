import React from 'react';
import { Globe, Sparkles, Plus, CheckCircle, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickUpload: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onQuickUpload
}) => {
  const tabs = [
    { id: 'composer', label: 'Composer Reel' },
    { id: 'accounts', label: 'Kelola Akun' },
    { id: 'queue', label: 'Antrean & Monitor' },
    { id: 'api', label: 'Web API Inspector' }
  ];

  return (
    <header className="border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/10 flex items-center justify-center">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" />
                  <path d="M 44 125 L 44 65 L 80 105 L 116 65 L 116 125" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">METUS WEB</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Tanpa Ekstensi</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">100% Web Uploader Facebook Reels & TikTok</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-neutral-950/60 p-1 rounded-xl border border-neutral-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                  activeTab === tab.id
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/60'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Web Engine Status & Quick Action */}
          <div className="flex items-center space-x-2.5">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800/80 text-neutral-300 border border-neutral-700/60">
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Browser Web Mode</span>
            </div>

            <button
              id="header-quick-upload-btn"
              onClick={onQuickUpload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:from-orange-600 hover:to-amber-700 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Reel</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-neutral-800/60">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 text-xs font-medium whitespace-nowrap rounded-lg ${
                activeTab === tab.id
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
