import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, Copy, Check, Play, RefreshCw, Globe } from 'lucide-react';
import { SocialAccount } from '../types';

interface ApiConsoleProps {
  accounts: SocialAccount[];
}

export const ApiConsole: React.FC<ApiConsoleProps> = ({ accounts }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'init' | 'chunk' | 'finish'>('init');
  const [pageId, setPageId] = useState(accounts[0]?.pageId || '109823485721943');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const getCurlSnippet = () => {
    switch (selectedEndpoint) {
      case 'init':
        return `# 1. Inisialisasi Upload Sesi Reel Facebook Graph API
curl -X POST "https://graph.facebook.com/v20.0/${pageId}/video_reels" \\
  -H "Authorization: OAuth YOUR_PAGE_ACCESS_TOKEN" \\
  -d "upload_phase=start"`;

      case 'chunk':
        return `# 2. Upload Chunk Binary Video ke Facebook Waterfall
curl -X POST "https://rupload.facebook.com/video-upload/v20.0/REEL_VIDEO_ID" \\
  -H "Authorization: OAuth YOUR_PAGE_ACCESS_TOKEN" \\
  -H "offset: 0" \\
  -H "file_size: 15482910" \\
  -H "x_fb_video_waterfall_id: wf_1726918291_fbk9a" \\
  -H "Content-Type: application/octet-stream" \\
  --data-binary "@video_reel.mp4"`;

      case 'finish':
        return `# 3. Finalisasi Publikasi Reel Facebook
curl -X POST "https://graph.facebook.com/v20.0/${pageId}/video_reels" \\
  -H "Authorization: OAuth YOUR_PAGE_ACCESS_TOKEN" \\
  -d "upload_phase=finish" \\
  -d "video_id=REEL_VIDEO_ID" \\
  -d "video_state=PUBLISHED" \\
  -d "description=Video Reel Viral Terbaru 2026 #reels #fyp"`;
    }
  };

  const handleTestCall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (selectedEndpoint === 'init') {
        setResponseLog(JSON.stringify({
          video_id: 'vid_' + Date.now(),
          upload_url: `https://rupload.facebook.com/video-upload/v20.0/vid_${Date.now()}`,
          status: 'ready_to_upload',
          waterfall_id: 'wf_' + Math.random().toString(36).slice(2, 9),
          server_timestamp: new Date().toISOString()
        }, null, 2));
      } else if (selectedEndpoint === 'chunk') {
        setResponseLog(JSON.stringify({
          start_offset: 0,
          end_offset: 2097152,
          received_bytes: 2097152,
          total_file_size: 15482910,
          status: 'chunk_accepted',
          h: 'fb_upload_stream_ok'
        }, null, 2));
      } else {
        setResponseLog(JSON.stringify({
          success: true,
          video_id: 'vid_final_ok',
          post_id: `${pageId}_${Date.now()}`,
          published: true,
          reach_scope: 'public'
        }, null, 2));
      }
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Terminal className="w-5 h-5 text-orange-400" />
          <span>API & Protocol Inspector</span>
        </h2>
        <p className="text-xs text-neutral-400">
          Pelajari dan uji alur kerja protokol unggah video Reels Facebook (Meta Graph API & Waterfall Endpoint) secara mandiri.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Endpoint Selector & Request Config */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-white">Tahapan Protokol Reels Facebook</h3>

            <div className="space-y-2">
              {[
                { id: 'init', name: 'Tahap 1: Inisialisasi Upload Sesi (Start Phase)', method: 'POST', endpoint: '/video_reels?upload_phase=start' },
                { id: 'chunk', name: 'Tahap 2: Upload Data Biner (Waterfall Chunk)', method: 'POST', endpoint: 'rupload.facebook.com/video-upload' },
                { id: 'finish', name: 'Tahap 3: Finalisasi & Publikasi (Finish Phase)', method: 'POST', endpoint: '/video_reels?upload_phase=finish' }
              ].map((ep) => (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEndpoint(ep.id as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedEndpoint === ep.id
                      ? 'bg-orange-500/10 border-orange-500/40 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{ep.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold">
                      {ep.method}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-neutral-500 truncate">{ep.endpoint}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Page ID Target</label>
              <input
                type="text"
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                placeholder="Page ID Facebook"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={handleTestCall}
                disabled={isLoading}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-2 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoading ? 'Menguji API...' : 'Jalankan Uji Coba Endpoint'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="py-2.5 px-3.5 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center space-x-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Disalin' : 'Salin cURL'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: cURL Snippet & Response Simulation */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden space-y-0">
            <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">cURL Request Preview</span>
            </div>
            <div className="p-4 font-mono text-xs text-neutral-300 bg-neutral-950 overflow-x-auto">
              <pre className="whitespace-pre">{getCurlSnippet()}</pre>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-neutral-400">Response Data</span>
              {responseLog && (
                <span className="text-[10px] text-emerald-400 font-mono">200 OK</span>
              )}
            </div>
            <div className="p-4 font-mono text-xs text-emerald-400 bg-neutral-950 max-h-[220px] overflow-auto">
              {responseLog ? (
                <pre>{responseLog}</pre>
              ) : (
                <span className="text-neutral-500 italic">Klik "Jalankan Uji Coba Endpoint" untuk melihat simulasi respon server...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
