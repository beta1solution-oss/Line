import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getSiteSettingsSync } from "@/lib/siteSettings";

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const settings = getSiteSettingsSync();
  const messages = settings.announcementMessages || [
    "Free US shipping on orders over $75 — no code needed",
    "New arrivals dropping weekly — follow us on TikTok",
    "Free returns within 30 days — no questions asked",
  ];

  if (dismissed) return null;

  return (
    <div className="bg-[hsl(var(--brand-charcoal))] text-[hsl(var(--brand-warm-white))] py-2.5 px-8 relative overflow-hidden">
      <div className="announcement-marquee whitespace-nowrap flex">
        <span className="announcement-track inline-flex gap-0">
          {[...messages, ...messages].map((msg, i) => (
            <span key={i} className="text-xs font-medium tracking-widest uppercase px-8 flex-shrink-0">
              {msg}
              <span className="mx-6 opacity-40">✦</span>
            </span>
          ))}
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
