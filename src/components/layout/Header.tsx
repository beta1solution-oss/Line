import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "@/components/features/CartDrawer";

const navLinks = [
  { label: "New In", href: "/shop?filter=new" },
  { label: "Dresses", href: "/shop?category=dresses" },
  { label: "Tops", href: "/shop?category=tops" },
  { label: "Bottoms", href: "/shop?category=bottoms" },
  { label: "Collections", href: "/shop" },
  { label: "Sale", href: "/shop?filter=sale", accent: true },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[hsl(var(--brand-charcoal))]/98 backdrop-blur-sm shadow-lg" : "bg-[hsl(var(--brand-charcoal))]"
        }`}
      >
        {/* Desktop header */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 text-white min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="brand-name text-2xl lg:text-3xl text-white tracking-[0.2em] font-medium">
                LINE<sup className="text-[0.55em] align-super">°</sup>
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`nav-link ${link.accent ? "text-[hsl(var(--brand-terracotta))]" : ""}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <button
                className="p-2 text-white hover:text-[hsl(var(--brand-terracotta))] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5" strokeWidth={1.5} />
              </button>
              <Link
                to="/account"
                className="p-2 text-white hover:text-[hsl(var(--brand-terracotta))] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Account"
              >
                <User className="w-4.5 h-4.5" strokeWidth={1.5} />
              </Link>
              <button
                className="p-2 text-white hover:text-[hsl(var(--brand-terracotta))] transition-colors relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                onClick={() => setCartOpen(true)}
                aria-label={`Shopping bag (${itemCount} items)`}
              >
                <ShoppingBag className="w-4.5 h-4.5" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[hsl(var(--brand-terracotta))] text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] min-h-[18px] leading-none">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-4 animate-fade-in">
              <form onSubmit={handleSearch} className="relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for styles, products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-2.5 text-sm focus:outline-none focus:border-white/50 rounded-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="lg:hidden bg-[hsl(var(--brand-charcoal))] border-t border-white/10 animate-slide-in-up">
            <nav className="px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`block py-3 px-2 text-sm font-medium tracking-widest uppercase border-b border-white/10 ${
                    link.accent ? "text-[hsl(var(--brand-terracotta))]" : "text-white hover:text-[hsl(var(--brand-terracotta))]"
                  } transition-colors`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
