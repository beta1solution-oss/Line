import { Link } from "react-router-dom";
import { Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    toast.success("You're on the list — welcome to LINE°");
    setEmail("");
  };

  return (
    <footer className="bg-[hsl(var(--brand-charcoal))] text-[hsl(var(--brand-warm-white))]">
      {/* Newsletter */}
      <div className="border-b border-white/10 py-14 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
          <h3 className="font-display text-2xl lg:text-3xl font-light tracking-wide mb-2">
            Stay in the loop
          </h3>
          <p className="text-white/60 text-sm mb-8">
            New arrivals, exclusive access, and style notes — straight to your inbox.
          </p>
          {subscribed ? (
            <p className="text-[hsl(var(--brand-terracotta))] text-sm font-medium tracking-wider">
              You're subscribed. Talk soon.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-white/60 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-[hsl(var(--brand-charcoal))] px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-[hsl(var(--brand-terracotta))] hover:text-white transition-colors whitespace-nowrap min-h-[44px]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <span className="brand-name text-2xl text-white tracking-[0.2em]">
                LINE<sup className="text-[0.55em] align-super">°</sup>
              </span>
              <p className="mt-4 text-white/50 text-sm leading-relaxed max-w-[200px]">
                Premium women's fashion. Designed for movement. Made to last.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <a href="https://tiktok.com" target="_blank" rel="noreferrer"
                  className="p-2 border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="TikTok">
                  <TikTokIcon />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer"
                  className="p-2 border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"
                  className="p-2 border border-white/20 text-white/60 hover:text-white hover:border-white/60 transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">Shop</h4>
              <ul className="space-y-3">
                {[
                  { label: "New In", href: "/shop?filter=new" },
                  { label: "Dresses", href: "/shop?category=dresses" },
                  { label: "Tops", href: "/shop?category=tops" },
                  { label: "Bottoms", href: "/shop?category=bottoms" },
                  { label: "All Products", href: "/shop" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">Help</h4>
              <ul className="space-y-3">
                {[
                  { label: "Track Order", href: "/tracking" },
                  { label: "FAQ", href: "/faq" },
                  { label: "Shipping Policy", href: "/shipping-policy" },
                  { label: "Returns", href: "/returns" },
                  { label: "Contact Us", href: "/contact" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-white mb-5">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About LINE°", href: "/about" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "My Account", href: "/account" },
                ].map((l) => (
                  <li key={l.label}>
                    <Link to={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} LINE°. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-white/30 text-xs">Secure payments by</span>
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-xs font-medium border border-white/20 px-2 py-0.5">Paystack</span>
              <span className="text-white/50 text-xs font-medium border border-white/20 px-2 py-0.5">Flutterwave</span>
              <span className="text-white/50 text-xs font-medium border border-white/20 px-2 py-0.5"> Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
