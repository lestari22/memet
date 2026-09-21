import { SocialAccount, VideoReel } from '../types';

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc_fb_1',
    platform: 'facebook',
    name: 'Media Kreasi Indonesia (Page)',
    accountType: 'fanpage',
    authMethod: 'token',
    accessToken: 'EAABw92a109823485721943_page_token_active',
    fbUserId: '100084920194812',
    pageId: '109823485721943',
    cookie: 'c_user=100084920194812; xs=29%3Afb892a_example; datr=X1AbcDefGhIjKlMn; fr=0abc123;',
    isActive: true,
    lastChecked: 'Baru saja',
    status: 'valid'
  },
  {
    id: 'acc_fb_2',
    platform: 'facebook',
    name: 'Pro Viral Reels ID (Personal)',
    accountType: 'personal',
    authMethod: 'cookie',
    fbUserId: '100072938491024',
    cookie: 'c_user=100072938491024; xs=41%3Axz982b_example; datr=Y2BcdEfGhIjKlMn;',
    isActive: true,
    lastChecked: '5 menit lalu',
    status: 'valid'
  },
  {
    id: 'acc_tt_1',
    platform: 'tiktok',
    name: '@kontenviral.id',
    accountType: 'personal',
    authMethod: 'token',
    accessToken: 'act.tiktok.creator_bearer_token_sample',
    cookie: 'sessionid=a98bf76c54d3e210fedcba9876543210; tt_csrf_token=xyz123;',
    isActive: true,
    lastChecked: '10 menit lalu',
    status: 'valid'
  }
];

export const INITIAL_REELS: VideoReel[] = [
  {
    id: 'reel_demo_1',
    title: 'Tips Editing Video Reels Cepat & Aesthetic 2026',
    caption: 'Trik rahasia bikin video pendek auto masuk for you page dan FYP Facebook Reels! Simak sampai habis 🔥',
    hashtags: ['#reelsviral', '#facebookreels', '#kontenkreator', '#tipsediting', '#fbreels2026'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    videoFileName: 'tips_editing_reels.mp4',
    videoFileSize: 15482910,
    duration: 15,
    width: 1080,
    height: 1920,
    targetAccounts: ['acc_fb_1', 'acc_tt_1'],
    platform: ['facebook', 'tiktok'],
    fanpageMode: true,
    status: 'published',
    uploadProgress: 100,
    waterfallId: 'wf_1726918291_fbk9a',
    createdAt: 'Hari ini, 09:30'
  },
  {
    id: 'reel_demo_2',
    title: 'Review Gadget Minimalis untuk Work From Anywhere',
    caption: 'Setup gear andalan buat kerja santai di cafe. Ringan, hemat daya, dan performa kencang! 💻✨',
    hashtags: ['#gadgetreview', '#wfa', '#setupminimalis', '#teknologi', '#reels'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    videoFileName: 'gadget_review_wfa.mp4',
    videoFileSize: 24194820,
    duration: 22,
    width: 1080,
    height: 1920,
    targetAccounts: ['acc_fb_1'],
    platform: ['facebook'],
    fanpageMode: true,
    status: 'draft',
    uploadProgress: 0,
    createdAt: 'Kemarin, 14:15'
  }
];
