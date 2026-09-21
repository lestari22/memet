import { ExtensionStatus } from '../types';

type MessageCallback = (data: any) => void;
const pendingRequests = new Map<string, { resolve: (val: any) => void; reject: (err: any) => void }>();

class ExtensionBridgeService {
  private status: ExtensionStatus = {
    isInstalled: false,
    fbLoggedIn: false,
    isFanpageMode: false,
  };
  private listeners: Set<(status: ExtensionStatus) => void> = new Set();

  constructor() {
    this.initListeners();
    this.checkInstallation();
  }

  private initListeners() {
    if (typeof window === 'undefined') return;

    // Listen to messages from content.js
    window.addEventListener('message', (event) => {
      if (event.source !== window || !event.data) return;

      if (event.data.type === 'METUS_EXTENSION_INSTALLED') {
        this.status.isInstalled = true;
        this.status.version = event.data.version || '2.1.0-free';
        this.notify();
      }

      if (event.data.type === 'METUS_RESPONSE') {
        const { requestId, data, error, success } = event.data;
        if (requestId && pendingRequests.has(requestId)) {
          const req = pendingRequests.get(requestId)!;
          pendingRequests.delete(requestId);
          if (success) {
            req.resolve(data);
          } else {
            req.reject(new Error(error || 'Extension request failed'));
          }
        }
      }
    });

    // Custom DOM events from content script
    window.addEventListener('metus:need-login-facebook', ((e: CustomEvent) => {
      this.status.fbLoggedIn = !e.detail?.needLogin;
      if (e.detail?.cookie) {
        const match = e.detail.cookie.match(/c_user=(\d+)/);
        if (match) this.status.fbUserId = match[1];
      }
      this.notify();
    }) as EventListener);

    window.addEventListener('metus:fanpage-mode-changed', ((e: CustomEvent) => {
      this.status.isFanpageMode = Boolean(e.detail?.isFanpageMode);
      this.notify();
    }) as EventListener);
  }

  public subscribe(cb: (status: ExtensionStatus) => void): () => void {
    this.listeners.add(cb);
    cb(this.status);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb({ ...this.status }));
  }

  public async checkInstallation(): Promise<boolean> {
    const hasAttr = document.documentElement.getAttribute('data-metus-extension-active') === 'true';
    if (hasAttr) {
      this.status.isInstalled = true;
      this.notify();
      return true;
    }

    try {
      const res = await this.sendMessage('PING', null, 800);
      if (res?.pong) {
        this.status.isInstalled = true;
        this.status.version = res.version || '2.1.0-free';
        this.status.lastPing = new Date().toLocaleTimeString();
        this.notify();
        return true;
      }
    } catch {
      // Extension not responding
    }
    return false;
  }

  public sendMessage(type: string, body: any = null, timeoutMs = 5000): Promise<any> {
    return new Promise((resolve, reject) => {
      const requestId = 'req_' + Math.random().toString(36).substring(2, 9);

      const timer = setTimeout(() => {
        pendingRequests.delete(requestId);
        reject(new Error(`Timeout menunggu respon dari ekstensi (${type})`));
      }, timeoutMs);

      pendingRequests.set(requestId, {
        resolve: (val) => {
          clearTimeout(timer);
          resolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        }
      });

      window.postMessage({ type: 'METUS_' + type, requestId, body }, '*');
    });
  }

  public async syncFacebookCookies(): Promise<string | null> {
    try {
      const res = await this.sendMessage('INIT_SET_COOKIE');
      if (res?.cookie) {
        return res.cookie;
      }
    } catch (err) {
      console.warn('Sync cookies error:', err);
    }
    return null;
  }

  public async openFacebookLogin(): Promise<void> {
    try {
      await this.sendMessage('LOGIN_NEW_ACC');
    } catch {
      window.open('https://www.facebook.com/login.php', '_blank');
    }
  }

  public async applyReelWaterfallRules(reelData: {
    vid: string;
    file_size: number;
    start_offset: number;
    end_offset: number;
    x_fb_video_waterfall_id: string;
  }): Promise<boolean> {
    try {
      const res = await this.sendMessage('SET_REEL_DATA', reelData);
      return Boolean(res?.success);
    } catch {
      return false;
    }
  }

  public getStatus(): ExtensionStatus {
    return { ...this.status };
  }
}

export const extensionBridge = new ExtensionBridgeService();
