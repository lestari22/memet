export interface SocialAccount {
  id: string;
  platform: 'facebook' | 'tiktok';
  name: string;
  avatarUrl?: string;
  accountType: 'fanpage' | 'personal';
  authMethod: 'token' | 'cookie';
  accessToken?: string; // Facebook Page Access Token or TikTok Bearer
  fbUserId?: string; // c_user
  pageId?: string;
  cookie?: string;
  isActive: boolean;
  lastChecked: string;
  status: 'valid' | 'expired' | 'unverified';
}

export interface VideoReel {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  videoUrl: string;
  videoFileName: string;
  videoFileSize: number;
  duration?: number;
  width?: number;
  height?: number;
  targetAccounts: string[]; // account IDs
  platform: ('facebook' | 'tiktok')[];
  fanpageMode: boolean;
  scheduledTime?: string;
  status: 'draft' | 'queued' | 'uploading' | 'published' | 'failed';
  uploadProgress: number;
  waterfallId?: string;
  currentChunk?: number;
  totalChunks?: number;
  createdAt: string;
  error?: string;
  uploadMode?: 'web_direct' | 'graph_api';
}

export interface ExtensionStatus {
  isInstalled: boolean;
  version?: string;
  fbLoggedIn: boolean;
  fbUserId?: string;
  isFanpageMode: boolean;
  lastPing?: string;
}

export interface ChunkUploadLog {
  id: string;
  timestamp: string;
  chunkIndex: number;
  totalChunks: number;
  startOffset: number;
  endOffset: number;
  chunkSize: number;
  waterfallId: string;
  status: 'pending' | 'success' | 'failed';
  responseDetails?: string;
}
