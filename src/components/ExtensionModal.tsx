import React, { useState } from 'react';
import { Download, X, Check, ShieldCheck, Sparkles, FolderArchive, ArrowRight } from 'lucide-react';
import { generateExtensionZip } from '../lib/extensionCode';

interface ExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToHub: () => void;
}

export const ExtensionModal: React.FC<ExtensionModalProps> = ({
  isOpen,
  onClose,
  onGoToHub
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
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
      setDownloaded(true);
    } catch (err) {
      alert('Gagal mendownload zip: ' + err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Unduh Ekstensi Chrome Metus V2 Free</h3>
              <p className="text-[11px] text-emerald-400 font-medium">100% Gratis • Tanpa Lisensi / Bayar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
          <p className="text-neutral-300">
            Ekstensi ini bertindak sebagai jembatan lokal untuk:
          </p>
          <ul className="space-y-1 text-[11px] text-neutral-400 list-disc pl-4">
            <li>Sinkronisasi otomatis cookies Facebook (c_user, xs, datr).</li>
            <li>Bypass CORS & modifikasi header video chunking untuk upload.facebook.com.</li>
            <li>Bebas dari skrip pelacakan & tanpa sistem pembayaran berbayar.</li>
          </ul>
        </div>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>File Telah Diunduh!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Menyiapkan Zip...' : 'Download Ekstensi (.zip) Sekarang'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToHub();
            }}
            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-neutral-400 hover:text-white flex items-center justify-center space-x-1"
          >
            <span>Lihat Panduan Pemasangan & Kode Sumber</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
