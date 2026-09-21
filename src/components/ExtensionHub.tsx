import React, { useState } from 'react';
import { 
  Download, Code, Check, Copy, ExternalLink, ShieldCheck, 
  Terminal, Sparkles, AlertCircle, RefreshCw, Layers
} from 'lucide-react';
import { 
  EXTENSION_MANIFEST, 
  EXTENSION_BACKGROUND_JS, 
  EXTENSION_CONTENT_JS, 
  EXTENSION_README,
  generateExtensionZip 
} from '../lib/extensionCode';
import { ExtensionStatus } from '../types';

interface ExtensionHubProps {
  extensionStatus: ExtensionStatus;
  onCheckConnection: () => void;
  isChecking: boolean;
}

export const ExtensionHub: React.FC<ExtensionHubProps> = ({
  extensionStatus,
  onCheckConnection,
  isChecking
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'manifest' | 'background' | 'content' | 'readme'>('manifest');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getCode = () => {
    switch (activeCodeTab) {
      case 'manifest':
        return EXTENSION_MANIFEST;
      case 'background':
        return EXTENSION_BACKGROUND_JS;
      case 'content':
        return EXTENSION_CONTENT_JS;
      case 'readme':
        return EXTENSION_README;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopiedTab(activeCodeTab);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
    try {
      const blob = await generateExtensionZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metus-v2-free-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Gagal membuat file zip ekstensi: ' + err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Ekstensi Chrome Metus V2 Free (Bebas Biaya)</h2>
              <p className="text-xs text-neutral-300 mt-0.5">
                Versi bersih tanpa sistem pembayaran, tanpa pengecekan lisensi server, dan tanpa batasan durasi langganan.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Membuat Zip...' : 'Unduh Ekstensi (.zip)'}</span>
            </button>

            <button
              onClick={onCheckConnection}
              disabled={isChecking}
              className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-orange-400' : ''}`} />
              <span>Cek Status</span>
            </button>
          </div>
        </div>

        {/* Current status pill */}
        <div className="flex items-center space-x-2 pt-2 border-t border-neutral-800/80 text-xs">
          <span className="text-neutral-400">Status Ekstensi Saat Ini:</span>
          {extensionStatus.isInstalled ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Aktif & Terhubung (v{extensionStatus.version || '2.1.0-free'})</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-medium">
              Belum terpasang di browser ini
            </span>
          )}
        </div>
      </div>

      {/* 3-Step Setup Guide */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>Panduan Pemasangan 3 Langkah (Sangat Mudah)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-semibold text-white">Unduh & Ekstrak</h4>
            <p className="text-[11px] text-neutral-400">
              Klik tombol <strong>"Unduh Ekstensi (.zip)"</strong> di atas, lalu ekstrak file zip tersebut ke salah satu folder di komputer Anda.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-semibold text-white">Buka chrome://extensions</h4>
            <p className="text-[11px] text-neutral-400">
              Buka tab baru di browser Google Chrome, ketik <code className="text-orange-400 font-mono">chrome://extensions</code> dan aktifkan tombol <strong>Developer Mode</strong> di pojok kanan atas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-semibold text-white">Muat Ekstensi (Load unpacked)</h4>
            <p className="text-[11px] text-neutral-400">
              Klik tombol <strong>"Load unpacked"</strong> (Muat yang belum dibongkar) lalu pilih folder hasil ekstrak. Selesai! Ekstensi langsung aktif.
            </p>
          </div>
        </div>
      </div>

      {/* Code Inspector & Viewer */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-orange-400" />
            <h3 className="text-xs font-semibold text-white">Inspeksi Kode Sumber Ekstensi (100% Bersih & Transparan)</h3>
          </div>

          <div className="flex items-center space-x-2">
            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800">
              {(['manifest', 'background', 'content', 'readme'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize transition-colors ${
                    activeCodeTab === tab
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab === 'manifest' ? 'manifest.json' : tab === 'background' ? 'background.js' : tab === 'content' ? 'content.js' : 'README.md'}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center space-x-1 transition-colors"
            >
              {copiedTab === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Code Block Container */}
        <div className="p-4 bg-neutral-950 font-mono text-xs text-neutral-300 max-h-[420px] overflow-auto">
          <pre className="whitespace-pre">{getCode()}</pre>
        </div>
      </div>
    </div>
  );
};
