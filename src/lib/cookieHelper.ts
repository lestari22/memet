export interface ParsedCookie {
  c_user?: string;
  xs?: string;
  datr?: string;
  fr?: string;
  sb?: string;
  raw: string;
  isValidFb: boolean;
  estimatedUserId?: string;
}

export function parseFacebookCookie(rawCookie: string): ParsedCookie {
  if (!rawCookie || typeof rawCookie !== 'string') {
    return { raw: '', isValidFb: false };
  }

  const clean = rawCookie.trim();
  const pairs = clean.split(';').map(s => s.trim());
  
  const map: Record<string, string> = {};
  for (const pair of pairs) {
    const [k, ...v] = pair.split('=');
    if (k) {
      map[k.trim()] = v.join('=').trim();
    }
  }

  const c_user = map['c_user'];
  const xs = map['xs'];
  const datr = map['datr'];
  const fr = map['fr'];
  const sb = map['sb'];

  const isValidFb = Boolean(c_user && xs);

  return {
    c_user,
    xs,
    datr,
    fr,
    sb,
    raw: clean,
    isValidFb,
    estimatedUserId: c_user
  };
}

export function formatCookieString(map: Record<string, string>): string {
  return Object.entries(map)
    .filter(([_, v]) => Boolean(v))
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

export function extractTikTokSession(cookie: string): { sessionId?: string; isValid: boolean } {
  const match = cookie.match(/sessionid=([^;]+)/i);
  return {
    sessionId: match ? match[1] : undefined,
    isValid: Boolean(match)
  };
}
