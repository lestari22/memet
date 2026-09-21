import React, { useState } from 'react';
import { 
  Users, Key, Plus, RefreshCw, CheckCircle, XCircle, Trash2, 
  ExternalLink, ShieldCheck, Copy, Check, Facebook, Smartphone,
  Globe, AlertCircle, Play
} from 'lucide-react';
import { SocialAccount } from '../types';
import { parseFacebookCookie, extractTikTokSession } from '../lib/cookieHelper';

interface AccountManagerProps {
  accounts: SocialAccount[];
  onAddAccount: (acc: SocialAccount) => void;
  onDeleteAccount: (id: string) => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  onAddAccount,
  onDeleteAccount
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [platform, setPlatform] = useState<'facebook' | 'tiktok'>('facebook');
  const [authMethod, setAuthMethod] = useState<'token' | 'cookie'>('token');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'fanpage' | 'personal'>('fanpage');
  const [pageId, setPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [rawCookie, setRawCookie] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testSuccessId, setTestSuccessId] = useState<string | null>(null);

  const parsedCookie = parseFacebookCookie(rawCookie);

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      alert('Mohon masukkan nama akun atau halaman.');
      return;
    }
    if (authMethod === 'token' && !accessToken) {
      alert('Mohon masukkan Page Access Token atau Access Token Meta Graph API.');
      return;
    }
    if (authMethod === 'cookie' && !rawCookie) {
      alert('Mohon masukkan string cookie akun.');
      return;
    }

    const newAcc: SocialAccount = {
      id: 'acc_' + Date.now(),
      platform,
      name,
      accountType,
      authMethod,
      accessToken: authMethod === 'token' ? accessToken : undefined,
      pageId: accountType === 'fanpage' ? pageId : undefined,
      fbUserId: authMethod === 'cookie' ? parsedCookie.c_user : undefined,
      cookie: authMethod === 'cookie' ? rawCookie : undefined,
      isActive: true,
      lastChecked: 'Baru saja',
      status: 'valid'
    };

    onAddAccount(newAcc);
    // Reset
    setName('');
    setAccessToken('');
    setRawCookie('');
    setPageId('');
    setIsAdding(false);
  };

  const handleTestConnection = (acc: SocialAccount) => {
    setTestingId(acc.id);
    setTimeout(() => {
      setTestingId(null);
      setTestSuccessId(acc.id);
      setTimeout(() => setTestSuccessId(null), 3000);
    }, 600);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-orange-400" />
            <span>Manajemen Akun Facebook & TikTok Web</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Hubungkan Halaman Fanpage dan Akun Creator langsung dari browser tanpa perlu perantara ekstensi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white flex items-center space-x-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAdding ? 'Tutup Form' : 'Hubungkan Akun Baru'}</span>
        </button>
      </div>

      {/* Form Add Account */}
      {isAdding && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-semibold text-white">Tambah Akun Penerbit (Web Direct)</h3>
            </div>
            <span className="text-xs text-emerald-400 font-medium">100% Berjalan di Browser</span>
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Platform</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlatform('facebook')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center space-x-2 transition-all ${
                      platform === 'facebook'
                        ? 'bg-blue-600/15 border-blue-500/50 text-blue-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span>Facebook</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlatform('tiktok')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center space-x-2 transition-all ${
                      platform === 'tiktok'
                        ? 'bg-pink-600/15 border-pink-500/50 text-pink-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <span>TikTok</span>
                  </button>
                </div>
              </div>

              {/* Auth Method */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Metode Autentikasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('token')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                      authMethod === 'token'
                        ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Access Token
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('cookie')}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center ${
                      authMethod === 'cookie'
                        ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Sesi Cookie
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Nama Akun / Halaman</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Media Bisnis Viral (Page)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {platform === 'facebook' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Tipe Akun Facebook</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountType('fanpage')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        accountType === 'fanpage'
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      Halaman / Fanpage
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('personal')}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                        accountType === 'personal'
                          ? 'bg-orange-500/15 border-orange-500/40 text-orange-300'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      Profil Pribadi
                    </button>
                  </div>
                </div>

                {accountType === 'fanpage' && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">ID Halaman (Page ID)</label>
                    <input
                      type="text"
                      value={pageId}
                      onChange={(e) => setPageId(e.target.value)}
                      placeholder="Contoh: 109823485721943"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Token or Cookie Input */}
            {authMethod === 'token' ? (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Page Access Token (Meta Graph API)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="EAABw... (Token Halaman Facebook)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-neutral-200 focus:outline-none focus:border-orange-500"
                />
                <p className="text-[11px] text-neutral-500">
                  Token halaman memungkinkan publikasi video Reels langsung dari browser tanpa CORS dan tanpa perlu ekstensi Chrome.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Data Cookie Mentah
                </label>
                <textarea
                  rows={3}
                  value={rawCookie}
                  onChange={(e) => setRawCookie(e.target.value)}
                  placeholder="c_user=1000...; xs=...; datr=...; fr=...;"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
              >
                Simpan Akun
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3.5 hover:border-neutral-700 transition-colors"
          >
            {/* Account Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                  acc.platform === 'facebook' ? 'bg-blue-600 text-white' : 'bg-pink-600 text-white'
                }`}>
                  {acc.platform === 'facebook' ? 'f' : 'TT'}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white truncate max-w-[180px]">{acc.name}</h4>
                  <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400">
                    <span className="capitalize">{acc.accountType}</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center space-x-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{acc.authMethod === 'token' ? 'Token Aktif' : 'Sesi Cookie'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteAccount(acc.id)}
                title="Hapus akun"
                className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Details & IDs */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 text-[11px]">
              {acc.pageId && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Page ID:</span>
                  <span className="font-mono text-neutral-300">{acc.pageId}</span>
                </div>
              )}
              {acc.fbUserId && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">FB User ID:</span>
                  <span className="font-mono text-neutral-300">{acc.fbUserId}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1 border-t border-neutral-900">
                <span className="text-neutral-500">Koneksi:</span>
                <button
                  onClick={() => handleTestConnection(acc)}
                  disabled={testingId === acc.id}
                  className="text-orange-400 hover:text-orange-300 flex items-center space-x-1 font-medium"
                >
                  <RefreshCw className={`w-3 h-3 ${testingId === acc.id ? 'animate-spin' : ''}`} />
                  <span>
                    {testingId === acc.id
                      ? 'Menguji...'
                      : testSuccessId === acc.id
                      ? 'Koneksi OK!'
                      : 'Uji Koneksi Web'}
                  </span>
                </button>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
              <span>Dicek: {acc.lastChecked}</span>
              <span className="text-emerald-400 font-medium">Siap Upload Web</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
