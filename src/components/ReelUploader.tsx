import React, { useState, useRef } from 'react';
import { 
  Upload, Film, Check, AlertCircle, Sparkles, Hash, 
  Calendar, Clock, Send, Play, Layers, ArrowRight, ShieldCheck, Globe
} from 'lucide-react';
import { SocialAccount, VideoReel } from '../types';

interface ReelUploaderProps {
  accounts: SocialAccount[];
  onAddReel: (reel: VideoReel) => void;
  onStartUpload: (reel: VideoReel, file: File | null) => void;
}

export const ReelUploader: React.FC<ReelUploaderProps> = ({
  accounts,
  onAddReel,
  onStartUpload
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(
    accounts.length > 0 ? [accounts[0].id] : []
  );
  const [isFanpageMode, setIsFanpageMode] = useState(true);
  const [uploadMode, setUploadMode] = useState<'web_direct' | 'graph_api'>('web_direct');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [videoResolution, setVideoResolution] = useState<{ w: number; h: number }>({ w: 1080, h: 1920 });
  const [isSchedule, setIsSchedule] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hashtagPresets = [
    { label: '🔥 Trending Reels', tags: ['#reelsviral', '#fbreels', '#trending2026', '#fyp'] },
    { label: '💡 Edukasi & Tips', tags: ['#tipsbisnis', '#edukasi', '#tutorial', '#berfaedah'] },
    { label: '🚀 Viral TikTok', tags: ['#tiktokindonesia', '#viralditiktok', '#fypindonesia'] },
    { label: '🎬 Kreator', tags: ['#kontenkreator', '#videopendek', '#reelsindonesia'] }
  ];

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Mohon pilih file video yang valid (MP4, MOV, WebM)');
      return;
    }
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreviewUrl(url);

    // Read metadata
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      setVideoDuration(Math.round(video.duration));
      setVideoResolution({ w: video.videoWidth || 1080, h: video.videoHeight || 1920 });
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const addTags = (tags: string[]) => {
    const existing = caption ? caption + ' ' : '';
    setCaption(existing + tags.join(' '));
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = (startImmediately: boolean) => {
    if (!caption && !title) {
      alert('Mohon isi judul atau caption video');
      return;
    }
    if (selectedAccounts.length === 0) {
      alert('Pilih minimal 1 akun tujuan publikasi');
      return;
    }

    const tagsInCaption = caption.match(/#[a-zA-Z0-9_]+/g) || [];

    const newReel: VideoReel = {
      id: 'reel_' + Date.now(),
      title: title || caption.slice(0, 40) + '...',
      caption: caption,
      hashtags: tagsInCaption,
      videoUrl: videoPreviewUrl,
      videoFileName: videoFile ? videoFile.name : 'sample_video.mp4',
      videoFileSize: videoFile ? videoFile.size : 14859200,
      duration: videoDuration,
      width: videoResolution.w,
      height: videoResolution.h,
      targetAccounts: selectedAccounts,
      platform: selectedAccounts.some(id => accounts.find(a => a.id === id)?.platform === 'tiktok') 
        ? ['facebook', 'tiktok'] 
        : ['facebook'],
      fanpageMode: isFanpageMode,
      scheduledTime: isSchedule ? scheduleTime : undefined,
      status: startImmediately ? 'uploading' : 'draft',
      uploadProgress: startImmediately ? 5 : 0,
      createdAt: 'Baru saja',
      uploadMode
    };

    onAddReel(newReel);
    if (startImmediately) {
      onStartUpload(newReel, videoFile);
    }

    // Reset fields
    setTitle('');
    setCaption('');
  };

  const isVerticalRatio = videoResolution.h >= videoResolution.w;

  return (
    <div className="space-y-6">
      {/* Top Banner explaining web native / no extension required */}
      <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-white">Upload Reels Langsung dari Website</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tanpa Ekstensi
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Browser Anda memotong biner video via chunking 2MB secara native dan mengirimkannya langsung ke server penerbit Facebook & TikTok.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-medium whitespace-nowrap self-start sm:self-center">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Gratis & Tanpa Software Tambahan</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Video Dropzone & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Film className="w-4 h-4 text-orange-400" />
                <span>Media Video Reel</span>
              </h2>
              {isVerticalRatio ? (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  9:16 Optimal Vertikal
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Landscape ({videoResolution.w}x{videoResolution.h})
                </span>
              )}
            </div>

            {/* Video Player Preview */}
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[420px] flex items-center justify-center border border-neutral-800 group">
              <video 
                src={videoPreviewUrl} 
                controls 
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[11px] text-neutral-200">
                {videoDuration}s • {(videoFile ? (videoFile.size / (1024 * 1024)).toFixed(1) : '14.2')} MB
              </div>
            </div>

            {/* Drag & Drop File Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                isDragging 
                  ? 'border-orange-500 bg-orange-500/5' 
                  : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40'
              }`}
            >
              <input 
                ref={fileInputRef} 
                type="file" 
                accept="video/mp4,video/quicktime,video/webm" 
                className="hidden" 
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />
              <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-2" />
              <p className="text-xs font-medium text-neutral-200">
                {videoFile ? videoFile.name : 'Tarik video ke sini atau klik untuk memilih file'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                Format didukung: MP4, MOV, WebM (Maksimal 150MB)
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata, Accounts & Upload Settings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-5">
            {/* Title & Caption */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Judul Video (Opsional)
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Tutorial Praktis Reels Facebook 2026"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Deskripsi & Hashtag Reels
                  </label>
                  <span className="text-[11px] text-neutral-500">
                    {caption.length}/2200 karakter
                  </span>
                </div>
                <textarea 
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tuliskan caption yang memancing interaksi dan tagar relevan..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>

              {/* Hashtag Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-neutral-400 font-medium">Preset Tagar Cepat:</span>
                <div className="flex flex-wrap gap-1.5">
                  {hashtagPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => addTags(preset.tags)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white hover:border-orange-500/50 transition-colors flex items-center space-x-1"
                    >
                      <Hash className="w-3 h-3 text-orange-400" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Accounts Selector */}
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <label className="block text-xs font-semibold text-neutral-300">
                Pilih Akun Tujuan ({selectedAccounts.length} terpilih)
              </label>
              {accounts.length === 0 ? (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>Belum ada akun terdaftar. Tambahkan akun di tab "Kelola Akun".</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {accounts.map((acc) => {
                    const isSelected = selectedAccounts.includes(acc.id);
                    return (
                      <div
                        key={acc.id}
                        onClick={() => toggleAccount(acc.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500/40 text-white'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            acc.platform === 'facebook' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                          }`}>
                            {acc.platform === 'facebook' ? 'f' : 'TT'}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium truncate text-white">{acc.name}</p>
                            <p className="text-[10px] text-neutral-400 truncate">
                              {acc.authMethod === 'token' ? 'Page Access Token' : 'Session Cookie'}
                            </p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-neutral-700'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upload Method & Mode */}
            <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Upload Protocol Mode */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5">
                <p className="text-xs font-semibold text-white">Metode Protokol Web</p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUploadMode('web_direct')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                      uploadMode === 'web_direct'
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300 font-medium'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Web Chunking
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('graph_api')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                      uploadMode === 'graph_api'
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 font-medium'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Meta Graph API
                  </button>
                </div>
              </div>

              {/* Fanpage Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <p className="text-xs font-semibold text-white">Mode Fanpage</p>
                  <p className="text-[11px] text-neutral-400">Gunakan ID Halaman saat rilis</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFanpageMode(!isFanpageMode)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    isFanpageMode ? 'bg-orange-500' : 'bg-neutral-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isFanpageMode ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Schedule Posting Option */}
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">Jadwalkan Posting Otomatis</p>
                  <p className="text-[11px] text-neutral-400">Atur tanggal dan jam tayang tayangan Reel</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSchedule(!isSchedule)}
                  className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                    isSchedule ? 'bg-orange-500' : 'bg-neutral-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    isSchedule ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
              {isSchedule && (
                <input 
                  type="datetime-local" 
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-orange-500"
                />
              )}
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                id="btn-upload-now"
                onClick={() => handleSubmit(true)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Upload Reels Langsung ke Facebook & TikTok</span>
              </button>

              <button
                type="button"
                id="btn-save-draft"
                onClick={() => handleSubmit(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl font-medium text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
              >
                Simpan Draf
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
