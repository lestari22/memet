import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ReelUploader } from './components/ReelUploader';
import { AccountManager } from './components/AccountManager';
import { ReelQueue } from './components/ReelQueue';
import { ApiConsole } from './components/ApiConsole';
import { SocialAccount, VideoReel } from './types';
import { INITIAL_ACCOUNTS, INITIAL_REELS } from './lib/mockData';
import { executeWebReelUpload } from './lib/uploadEngine';
import { Globe, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('composer');
  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    const saved = localStorage.getItem('metus_web_accounts');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });
  const [reels, setReels] = useState<VideoReel[]>(() => {
    const saved = localStorage.getItem('metus_web_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('metus_web_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('metus_web_reels', JSON.stringify(reels));
  }, [reels]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddAccount = (acc: SocialAccount) => {
    setAccounts((prev) => [acc, ...prev]);
    showToast(`✅ Akun "${acc.name}" berhasil dihubungkan.`);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    showToast('Akun telah dihapus.');
  };

  const handleAddReel = (reel: VideoReel) => {
    setReels((prev) => [reel, ...prev]);
  };

  const handleDeleteReel = (id: string) => {
    setReels((prev) => prev.filter((r) => r.id !== id));
    showToast('Reel dihapus dari antrean.');
  };

  const handleStartUpload = async (reel: VideoReel, file: File | null = null) => {
    setActiveTab('queue');
    showToast(`🚀 Memulai pengunggahan Reel "${reel.title}" via Web...`);

    const targetAccount = accounts.find((a) => reel.targetAccounts.includes(a.id)) || accounts[0];

    try {
      const res = await executeWebReelUpload(reel, targetAccount, file, (progress, log, status) => {
        setReels((prev) =>
          prev.map((r) =>
            r.id === reel.id
              ? {
                  ...r,
                  uploadProgress: progress,
                  status: status || r.status,
                  waterfallId: log?.waterfallId || r.waterfallId,
                  currentChunk: log?.chunkIndex,
                  totalChunks: log?.totalChunks
                }
              : r
          )
        );
      });

      if (res.success) {
        showToast(`🎉 Reel "${reel.title}" berhasil diunggah langsung ke platform!`);
      }
    } catch (err: any) {
      setReels((prev) =>
        prev.map((r) =>
          r.id === reel.id
            ? { ...r, status: 'failed', error: err.message || 'Upload gagal' }
            : r
        )
      );
      showToast(`❌ Pengunggahan gagal: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickUpload={() => setActiveTab('composer')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'composer' && (
          <ReelUploader
            accounts={accounts}
            onAddReel={handleAddReel}
            onStartUpload={handleStartUpload}
          />
        )}

        {activeTab === 'accounts' && (
          <AccountManager
            accounts={accounts}
            onAddAccount={handleAddAccount}
            onDeleteAccount={handleDeleteAccount}
          />
        )}

        {activeTab === 'queue' && (
          <ReelQueue
            reels={reels}
            onRetryUpload={(reel) => handleStartUpload(reel, null)}
            onDeleteReel={handleDeleteReel}
          />
        )}

        {activeTab === 'api' && (
          <ApiConsole accounts={accounts} />
        )}
      </main>

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-200 flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-neutral-300">METUS Web Studio</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Web Native (Tanpa Ekstensi)</span>
            </span>
          </div>
          <p className="text-neutral-500 text-[11px]">
            Platform web mandiri untuk publikasi Facebook Reels & TikTok Creator tanpa sistem langganan.
          </p>
        </div>
      </footer>
    </div>
  );
}
