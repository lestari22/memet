import JSZip from 'jszip';

export const EXTENSION_MANIFEST = JSON.stringify(
  {
    manifest_version: 3,
    name: "Metus V2 Free (No Paywall)",
    version: "2.1.0",
    description: "Ekstensi pendukung bebas bayar untuk manajemen akun, cookies, dan upload Reels Facebook & TikTok",
    background: {
      service_worker: "background.js"
    },
    action: {
      default_title: "Metus V2 Free Studio"
    },
    icons: {
      "16": "icon.png",
      "48": "icon.png",
      "128": "icon.png"
    },
    content_scripts: [
      {
        matches: [
          "http://localhost:3000/*",
          "https://*.run.app/*",
          "https://*.metus.vn/*",
          "https://metus.netlify.app/*",
          "https://*.facebook.com/*"
        ],
        js: ["content.js"],
        all_frames: true,
        run_at: "document_idle"
      }
    ],
    permissions: [
      "declarativeNetRequest",
      "declarativeNetRequestFeedback",
      "cookies",
      "tabs",
      "scripting",
      "storage",
      "alarms"
    ],
    host_permissions: [
      "*://*.facebook.com/*",
      "*://*.tiktok.com/*",
      "*://*.google.com/*",
      "*://*/*"
    ],
    web_accessible_resources: [
      {
        resources: ["icon.png", "manifest.json", "background.js", "content.js"],
        matches: ["<all_urls>"]
      }
    ]
  },
  null,
  2
);

export const EXTENSION_BACKGROUND_JS = `/**
 * Metus V2 Free - Chrome Extension Background Service Worker
 * 100% De-obfuscated & Clean (No payment checks, no DRM, no telemetry)
 */

const INITIATOR_DOMAINS = [
  "localhost",
  "run.app",
  "metus.vn",
  "metus.netlify.app"
];

// Base CORS & Header Rules
const BASE_RULES = [
  {
    id: 1,
    priority: 1,
    condition: {
      resourceTypes: ["xmlhttprequest"],
      regexFilter: "^https://([^/]+\\\\.)?(facebook\\\\.com|fbcdn\\\\.net)/"
    },
    action: {
      type: "modifyHeaders",
      responseHeaders: [
        { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
        { header: "Access-Control-Allow-Credentials", operation: "set", value: "true" },
        { header: "Access-Control-Allow-Methods", operation: "set", value: "GET, POST, OPTIONS, PUT, DELETE" },
        { header: "Access-Control-Expose-Headers", operation: "set", value: "*" }
      ],
      requestHeaders: [
        { header: "Origin", operation: "set", value: "https://www.facebook.com" },
        { header: "Referer", operation: "set", value: "https://www.facebook.com/" },
        { header: "Sec-Fetch-Site", operation: "set", value: "same-origin" },
        { header: "Sec-Fetch-Mode", operation: "set", value: "cors" }
      ]
    }
  },
  {
    id: 2,
    priority: 1,
    condition: {
      resourceTypes: ["xmlhttprequest"],
      urlFilter: "upload.facebook.com"
    },
    action: {
      type: "modifyHeaders",
      responseHeaders: [
        { header: "Access-Control-Allow-Origin", operation: "set", value: "*" },
        { header: "Access-Control-Allow-Credentials", operation: "set", value: "true" },
        { header: "Access-Control-Allow-Methods", operation: "set", value: "*" }
      ],
      requestHeaders: [
        { header: "Origin", operation: "set", value: "https://www.facebook.com" },
        { header: "Referer", operation: "set", value: "https://www.facebook.com/" },
        { header: "Sec-Fetch-Site", operation: "set", value: "same-origin" }
      ]
    }
  }
];

let dynamicReelRules = [];

// Helper: Apply declarativeNetRequest rules
async function applyRules() {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingRules.map(r => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: [...BASE_RULES, ...dynamicReelRules]
    });
  } catch (err) {
    console.warn("Rules update notice:", err);
  }
}

// Helper: Get Facebook Cookies formatted as a raw string
async function getFacebookCookies() {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain: ".facebook.com" }, (cookies) => {
      if (!cookies || cookies.length === 0) {
        resolve("");
        return;
      }
      const cookieString = cookies.map(c => \`\${c.name}=\${c.value}\`).join("; ");
      resolve(cookieString);
    });
  });
}

// Helper: Clear Facebook Cookies
async function clearFacebookCookies() {
  return new Promise((resolve) => {
    chrome.cookies.getAll({ domain: ".facebook.com" }, async (cookies) => {
      for (const c of cookies) {
        const protocol = c.secure ? "https" : "http";
        const url = \`\${protocol}://\${c.domain.startsWith(".") ? c.domain.slice(1) : c.domain}\${c.path}\`;
        await chrome.cookies.remove({ url, name: c.name });
      }
      resolve(true);
    });
  });
}

// Helper: Inject Raw Cookie string into .facebook.com
async function setRawFacebookCookie(cookieString) {
  if (!cookieString) return false;
  const parts = cookieString.split("; ");
  for (const part of parts) {
    const [name, ...valParts] = part.replace(/;$/, "").split("=");
    const value = valParts.join("=");
    if (name && value) {
      await chrome.cookies.set({
        url: "https://www.facebook.com",
        domain: ".facebook.com",
        path: "/",
        name: name.trim(),
        value: value.trim(),
        secure: true
      });
    }
  }
  return true;
}

// Initialize on install or startup
chrome.runtime.onInstalled.addListener(() => {
  applyRules();
  console.log("Metus V2 Free Extension installed successfully (No Paywall)");
});

chrome.runtime.onStartup.addListener(() => {
  applyRules();
});

// Main Message Router
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      const type = request.type || request.action;
      switch (type) {
        case "PING":
        case "ping":
          sendResponse({ pong: true, status: "ready", version: "2.1.0-free" });
          break;

        case "INIT_SET_COOKIE": {
          const cookieStr = await getFacebookCookies();
          const hasUser = /c_user=/.test(cookieStr);
          sendResponse({
            success: true,
            cookie: cookieStr,
            hasUser,
            c_user: cookieStr.match(/c_user=(\\d+)/)?.[1] || null
          });
          break;
        }

        case "SET_RAW_COOKIE": {
          const data = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
          const mainCookie = data?.main_cookie || data?.cookie || "";
          await clearFacebookCookies();
          await setRawFacebookCookie(mainCookie);
          const newCookie = await getFacebookCookies();
          sendResponse({ success: true, cookie: newCookie });
          break;
        }

        case "LOGIN_NEW_ACC": {
          await clearFacebookCookies();
          await chrome.tabs.create({ url: "https://www.facebook.com/login.php", active: true });
          sendResponse({ success: true, message: "Tab login Facebook telah dibuka." });
          break;
        }

        case "WIPE_REELS": {
          dynamicReelRules = [];
          await applyRules();
          sendResponse({ success: true, message: "Reel rules cleared." });
          break;
        }

        case "SET_REEL_DATA": {
          // Dynamic header manipulation for Facebook video upload waterfall
          const payload = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
          const videoId = payload.vid || payload.id || "reel_temp";
          const startOffset = payload.start_offset || 0;
          const endOffset = payload.end_offset || 0;
          const fileSize = payload.file_size || 0;
          const waterfallId = payload.x_fb_video_waterfall_id || String(Date.now());

          const ruleId = Math.abs(Number(String(videoId).slice(-4)) || 101);
          dynamicReelRules = [
            {
              id: ruleId,
              priority: 2,
              condition: {
                resourceTypes: ["xmlhttprequest"],
                urlFilter: "upload.facebook.com"
              },
              action: {
                type: "modifyHeaders",
                requestHeaders: [
                  { header: "Origin", operation: "set", value: "https://www.facebook.com" },
                  { header: "Referer", operation: "set", value: "https://www.facebook.com/" },
                  { header: "x-entity-name", operation: "set", value: \`fb_reel_\${videoId}.mp4\` },
                  { header: "x-entity-length", operation: "set", value: String(fileSize) },
                  { header: "offset", operation: "set", value: String(startOffset) },
                  { header: "x_fb_video_waterfall_id", operation: "set", value: waterfallId }
                ]
              }
            }
          ];
          await applyRules();
          sendResponse({ success: true, waterfallId });
          break;
        }

        case "EX_FETCH": {
          // Direct cross-origin fetch proxy
          const fetchParams = request.body || request.data || {};
          const response = await fetch(fetchParams.url, {
            method: fetchParams.method || "GET",
            headers: fetchParams.headers || {},
            body: fetchParams.body ? (typeof fetchParams.body === "string" ? fetchParams.body : JSON.stringify(fetchParams.body)) : undefined,
            credentials: "include"
          });
          const text = await response.text();
          let parsed;
          try {
            parsed = JSON.parse(text);
          } catch {
            parsed = text;
          }
          sendResponse({
            type: "EX_FETCH_RESPONSE",
            status: response.status,
            data: parsed,
            requestId: request.requestId
          });
          break;
        }

        default:
          sendResponse({ error: "Unknown action: " + type });
      }
    } catch (err) {
      sendResponse({ error: err.message });
    }
  })();
  return true;
});

// Periodically check session status
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  if (changeInfo.cookie.domain.includes("facebook.com") && changeInfo.cookie.name === "c_user") {
    const cookies = await getFacebookCookies();
    const hasLogin = /c_user=/.test(cookies);
    const tabs = await chrome.tabs.query({});
    for (const t of tabs) {
      if (t.id) {
        chrome.tabs.sendMessage(t.id, {
          type: "NEED_LOGIN_FACEBOOK",
          body: { needLogin: !hasLogin }
        }).catch(() => {});
      }
    }
  }
});
`;

export const EXTENSION_CONTENT_JS = `/**
 * Metus V2 Free - Content Script Bridge
 * Provides transparent communication between Web Dashboard and Background Worker
 */

(function () {
  console.log("[Metus V2 Free] Content script loaded on:", window.location.href);

  // Send message helper to background
  function sendToBg(type, body = null) {
    return new Promise((resolve, reject) => {
      if (!chrome.runtime?.sendMessage) {
        return reject(new Error("Extension runtime not available"));
      }
      chrome.runtime.sendMessage({ type, body }, (res) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(res);
        }
      });
    });
  }

  // Check login on startup
  async function checkInit() {
    try {
      const res = await sendToBg("INIT_SET_COOKIE");
      const hasUser = /c_user=/.test(res?.cookie || "");
      window.dispatchEvent(
        new CustomEvent("metus:need-login-facebook", {
          detail: { needLogin: !hasUser, cookie: res?.cookie }
        })
      );
    } catch (err) {
      // Ignored if background not ready yet
    }
  }

  checkInit();

  // Listen for messages from background (e.g. login state changes)
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "NEED_LOGIN_FACEBOOK") {
      window.dispatchEvent(
        new CustomEvent("metus:need-login-facebook", {
          detail: { needLogin: Boolean(msg.body?.needLogin) }
        })
      );
      sendResponse({ success: true });
    } else if (msg.type === "FANPAGE_MODE_CHANGED") {
      window.dispatchEvent(
        new CustomEvent("metus:fanpage-mode-changed", {
          detail: { isFanpageMode: Boolean(msg.body?.isFanpageMode) }
        })
      );
      sendResponse({ success: true });
    }
  });

  // Listen to window postMessage from Web App
  window.addEventListener("message", async (event) => {
    if (event.source !== window || !event.data || !event.data.type) return;

    const { type, requestId, body } = event.data;

    // Handle Metus Bridge commands
    if (type.startsWith("METUS_") || ["PING", "INIT_SET_COOKIE", "SET_RAW_COOKIE", "LOGIN_NEW_ACC", "WIPE_REELS", "SET_REEL_DATA", "EX_FETCH"].includes(type)) {
      try {
        const bgAction = type.replace("METUS_", "");
        const res = await sendToBg(bgAction, body);
        window.postMessage(
          {
            type: "METUS_RESPONSE",
            requestId,
            action: type,
            data: res,
            success: true
          },
          "*"
        );
      } catch (err) {
        window.postMessage(
          {
            type: "METUS_RESPONSE",
            requestId,
            action: type,
            error: err.message,
            success: false
          },
          "*"
        );
      }
    }
  });

  // Signal web page that extension is present
  window.postMessage({ type: "METUS_EXTENSION_INSTALLED", version: "2.1.0-free" }, "*");
  document.documentElement.setAttribute("data-metus-extension-active", "true");
})();
`;

export const EXTENSION_README = `# Metus V2 Free Extension (Tanpa Biaya Langganan)

Ekstensi Chrome gratis untuk otomatisasi Facebook Reels, TikTok API, bypass CORS, dan manajemen cookie akun.

## Fitur:
- 100% Gratis: Semua batasan pembayaran, license check, dan telemetry telah dihapus.
- Cookie Sync: Membaca dan menginjeksi cookies Facebook (.facebook.com).
- Upload Reels Header Modifier: Mengatur waterfall ID, start_offset, end_offset, dan x-entity-length langsung ke upload.facebook.com.
- CORS Bypass: Memungkinkan aplikasi web memanggil endpoint Facebook & TikTok tanpa kendala CORS.

## Cara Pasang di Browser (Chrome / Edge / Brave):
1. Unduh file zip ekstensi ini dari tombol "Download Extension (.zip)".
2. Ekstrak file zip ke sebuah folder di komputer Anda (misal: \`C:\\metus-free-extension\`).
3. Buka browser, kunjungi: \`chrome://extensions\` (atau \`edge://extensions\` jika memakai Microsoft Edge).
4. Aktifkan saklar **"Developer mode"** di pojok kanan atas.
5. Klik tombol **"Load unpacked"** (Muat yang belum dibongkar).
6. Pilih folder hasil ekstrak tadi.
7. Selesai! Ekstensi kini aktif dan terhubung ke studio.
`;

export async function generateExtensionZip(): Promise<Blob> {
  const zip = new JSZip();

  zip.file("manifest.json", EXTENSION_MANIFEST);
  zip.file("background.js", EXTENSION_BACKGROUND_JS);
  zip.file("content.js", EXTENSION_CONTENT_JS);
  zip.file("README.md", EXTENSION_README);

  // Add standard icon SVG as icon.png or icon.svg
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="128" height="128">
  <circle cx="80" cy="80" r="70" fill="#18181b" stroke="#f97316" stroke-width="12" />
  <path d="M 44 125 L 44 65 L 80 105 L 116 65 L 116 125" fill="none" stroke="#f97316" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;
  zip.file("icon.svg", iconSvg);

  return await zip.generateAsync({ type: "blob" });
}
