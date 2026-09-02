// Site settings — stored in Supabase site_settings table
// Falls back to localStorage for offline/unauthenticated reads
import { supabase } from "@/lib/supabase";

export interface SiteSettings {
  heroImage?: string;
  editorial1Image?: string;
  editorial2Image?: string;
  tiktokBannerImage?: string;
  announcementMessages?: string[];
  socialLinks?: {
    tiktok?: string;
    instagram?: string;
    pinterest?: string;
    twitter?: string;
    facebook?: string;
  };
  tiktokHandle?: string;
}

const DEFAULTS: SiteSettings = {
  announcementMessages: [
    "Free US shipping on orders over $75 — no code needed",
    "New arrivals dropping weekly — follow us on TikTok",
    "Free returns within 30 days — no questions asked",
  ],
  socialLinks: {
    tiktok: "https://tiktok.com/@linedegree",
    instagram: "https://instagram.com/linedegree",
  },
  tiktokHandle: "@linedegree",
};

const LOCAL_KEY = "line_site_settings";

export async function getSiteSettings(): Promise<SiteSettings> {
  // Try Supabase first
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value");
  
  if (!error && data && data.length > 0) {
    const settings: SiteSettings = { ...DEFAULTS };
    data.forEach(({ key, value }: { key: string; value: string }) => {
      try {
        (settings as Record<string, unknown>)[key] = JSON.parse(value);
      } catch {
        (settings as Record<string, unknown>)[key] = value;
      }
    });
    // Cache locally
    localStorage.setItem(LOCAL_KEY, JSON.stringify(settings));
    return settings;
  }
  
  // Fall back to localStorage
  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw) {
    try {
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return DEFAULTS;
    }
  }
  
  return DEFAULTS;
}

export async function saveSiteSetting(key: string, value: unknown): Promise<void> {
  const serialized = JSON.stringify(value);
  
  await supabase
    .from("site_settings")
    .upsert({ key, value: serialized, updated_at: new Date().toISOString() });
  
  // Update local cache
  const raw = localStorage.getItem(LOCAL_KEY);
  const current: SiteSettings = raw ? JSON.parse(raw) : { ...DEFAULTS };
  (current as Record<string, unknown>)[key] = value;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(current));
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const upserts = Object.entries(settings).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
    updated_at: new Date().toISOString(),
  }));
  
  if (upserts.length > 0) {
    await supabase.from("site_settings").upsert(upserts);
  }
  
  const raw = localStorage.getItem(LOCAL_KEY);
  const current: SiteSettings = raw ? JSON.parse(raw) : { ...DEFAULTS };
  localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...current, ...settings }));
}

export function getSiteSettingsSync(): SiteSettings {
  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw) {
    try {
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return DEFAULTS;
    }
  }
  return DEFAULTS;
}
