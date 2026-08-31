import { useState } from "react";
import { X } from "lucide-react";

const messages = [
  "Free US shipping on orders over $75 — no code needed",
  "New arrivals dropping weekly — follow us on TikTok",
  "Returns made easy — free returns within 30 days",
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [msgIndex] = useState(0);

  if (dismissed) return null;

  return (
    <div className="bg-[hsl(var(--brand-charcoal))] text-[hsl(var(--brand-warm-white))] py-2.5 px-4 text-center relative">
      <p className="text-xs font-medium tracking-widest uppercase">
        {messages[msgIndex % messages.length]}
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
