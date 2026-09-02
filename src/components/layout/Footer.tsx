import { Link } from "react-router-dom";
import { getSiteSettingsSync } from "@/lib/siteSettings";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  tiktok: <TikTokIcon />,
  instagram: <InstagramIcon />,
  pinterest: <PinterestIcon />,
  facebook: <FacebookIcon />,
};

export default function Footer() {
  const settings = getSiteSettingsSync();
  const socialLinks = settings.socialLinks || {};

  return (
    <footer className="bg-[hsl(var(--brand-charcoal))] text-[hsl(var(--brand-warm-white))]">
      {/* Newsletter */}
      <div className="border-b border-white/10 py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
          <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-3 block">
            Stay in the Loop
          </span>
          <h3 className="font-display text-3xl lg:text-4xl font-light tracking-wide text-white mb-3">
            First to know. First to wear.
          </h3>
          <p className="text-white/50 text-sm mb-6 max-w-md mx-auto">
            New drops, exclusive edits, and styling ideas — straight to your inbox.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-white/50 transition-colors"
            />
            <button type="submit" className="bg-[hsl(var(--brand-terracotta))] text-white px-6 py-3 text-xs font-semibold tracking-widest uppercase hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <span className="brand-name text-2xl text-white tracking-[0.2em] block mb-4">
              LINE<sup className="text-[0.55em] align-super">°</sup>
            </span>
            <p className="text-white/40 text-xs leading-relaxed max-w-[220px] mb-5">
              Premium women's fashion designed for women who move through the world with intention.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {Object.entries(SOCIAL_ICONS).map(([platform, icon]) => {
                const url = (socialLinks as Record<string, string>)[platform];
                if (!url) return null;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/50 hover:text-white hover:border-white transition-colors"
                    aria-label={platform}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/80">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: "New In", href: "/shop?filter=new" },
                { label: "Dresses", href: "/shop?category=dresses" },
                { label: "Tops", href: "/shop?category=tops" },
                { label: "Bottoms", href: "/shop?category=bottoms" },
                { label: "Sale", href: "/shop?filter=sale" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-xs text-white/40 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/80">Help</h4>
            <ul className="space-y-2.5">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Returns & Refunds", href: "/returns" },
                { label: "Track Your Order", href: "/tracking" },
                { label: "Contact Us", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-xs text-white/40 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 text-white/80">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Our Story", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "My Account", href: "/account" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.href} className="text-xs text-white/40 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
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
            {/* Payment badges */}
            <div className="flex items-center gap-2 text-white/20">
              <span className="text-[10px] tracking-widest uppercase">Secured by</span>
              {/* Paystack badge */}
              <span className="bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white/60">PAYSTACK</span>
              {/* Flutterwave badge */}
              <span className="bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white/60">FLUTTERWAVE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
