import React, { useState } from 'react';
import { 
  ListOrdered, Play, CheckCircle2, AlertTriangle, Clock, 
  RotateCw, Trash2, ExternalLink, Activity, Layers, Check
} from 'lucide-react';
import { VideoReel } from '../types';

interface ReelQueueProps {
  reels: VideoReel[];
  onRetryUpload: (reel: VideoReel) => void;
  onDeleteReel: (id: string) => void;
}

export const ReelQueue: React.FC<ReelQueueProps> = ({
  reels,
  onRetryUpload,
  onDeleteReel
}) => {
  const [filter, setFilter] = useState<'all' | 'uploading' | 'published' | 'draft'>('all');
  const [selectedWaterfallReel, setSelectedWaterfallReel] = useState<VideoReel | null>(null);

  const filtered = reels.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Filter and stats header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ListOrdered className="w-5 h-5 text-orange-400" />
            <span>Antrean & Riwayat Publikasi Reels</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Pantau status proses pengunggahan video, chunk waterfall upload, dan riwayat tayang.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 self-start">
          {(['all', 'uploading', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Reel items list */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <Clock className="w-10 h-10 mx-auto text-neutral-600 mb-3" />
          <h3 className="text-sm font-semibold text-white">Belum Ada Video di Antrean</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Gunakan tab "Composer Reel" untuk membuat atau mengunggah video Reels baru.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reel) => {
            const isUploading = reel.status === 'uploading';
            const isSuccess = reel.status === 'published';
            const isFailed = reel.status === 'failed';

            return (
              <div
                key={reel.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 transition-all hover:border-neutral-700/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Video thumbnail info */}
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-16 rounded-xl bg-black flex-shrink-0 relative overflow-hidden border border-neutral-800 flex items-center justify-center">
                      <video src={reel.videoUrl} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white/80" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-semibold text-white line-clamp-1">{reel.title}</h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1">{reel.caption}</p>
                      
                      <div className="flex items-center space-x-2 text-[10px] text-neutral-500 pt-0.5">
                        <span>{reel.createdAt}</span>
                        <span>•</span>
                        <span>{(reel.videoFileSize / (1024 * 1024)).toFixed(1)} MB</span>
                        <span>•</span>
                        <span className="text-orange-400 font-mono">{reel.fanpageMode ? 'Fanpage' : 'Personal'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status badge & Actions */}
                  <div className="flex items-center space-x-3 self-end sm:self-center">
                    {/* Status Badge */}
                    <div>
                      {isUploading && (
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-medium">
                          <RotateCw className="w-3 h-3 animate-spin" />
                          <span>Mengunggah {reel.uploadProgress}%</span>
                        </div>
                      )}
                      {isSuccess && (
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Berhasil Terbit</span>
                        </div>
                      )}
                      {isFailed && (
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Gagal</span>
                        </div>
                      )}
                      {reel.status === 'draft' && (
                        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Draf</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-1">
                      {reel.waterfallId && (
                        <button
                          onClick={() => setSelectedWaterfallReel(reel)}
                          title="Inspeksi Waterfall Upload"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
                        >
                          <Layers className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {(isFailed || reel.status === 'draft') && (
                        <button
                          onClick={() => onRetryUpload(reel)}
                          title="Unggah Reels Sekarang"
                          className="p-1.5 rounded-lg text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteReel(reel.id)}
                        title="Hapus dari antrean"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar if uploading */}
                {isUploading && (
                  <div className="space-y-1 pt-1">
                    <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
                        style={{ width: `${reel.uploadProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Protokol: upload.facebook.com (Waterfall Chunk)</span>
                      <span>{reel.uploadProgress}% selesai</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Waterfall Inspector Modal */}
      {selectedWaterfallReel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Detail Waterfall Uploader Facebook</span>
              </h3>
              <button
                onClick={() => setSelectedWaterfallReel(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Video ID:</span>
                  <span className="text-white">{selectedWaterfallReel.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Waterfall ID:</span>
                  <span className="text-orange-400">{selectedWaterfallReel.waterfallId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Ukuran File:</span>
                  <span className="text-neutral-300">{(selectedWaterfallReel.videoFileSize / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Chunk Size:</span>
                  <span className="text-neutral-300">2,097,152 Bytes (2MB)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Status Response:</span>
                  <span className="text-emerald-400">200 OK Finished</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-400">
                Pengunggahan biner dipotong per chunk 2MB secara native langsung di browser menggunakan API <code className="text-orange-400">Blob.slice()</code> dan ditransmisikan ke endpoint penerbit tanpa memerlukan ekstensi tambahan.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWaterfallReel(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-800 text-white hover:bg-neutral-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
