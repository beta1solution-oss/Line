import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import { getFeaturedProducts } from "@/constants/products";
import { getSiteSettingsSync, getSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import heroImgDefault from "@/assets/hero-main.jpg";
import editorial1Default from "@/assets/editorial-1.jpg";
import editorial2Default from "@/assets/editorial-2.jpg";
import tiktokBannerDefault from "@/assets/tiktok-banner.jpg";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.73a4.85 4.85 0 01-1.01-.04z" />
  </svg>
);

const featuredProductsStatic = getFeaturedProducts();

export default function Index() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettingsSync());
  const [featuredProducts] = useState(featuredProductsStatic);

  useEffect(() => {
    getSiteSettings().then(setSiteSettings);
  }, []);

  const heroImg = siteSettings.heroImage || heroImgDefault;
  const editorial1 = siteSettings.editorial1Image || editorial1Default;
  const editorial2 = siteSettings.editorial2Image || editorial2Default;
  const tiktokBanner = siteSettings.tiktokBannerImage || tiktokBannerDefault;
  const tiktokHandle = siteSettings.tiktokHandle || "@linedegree";
  const tiktokUrl = siteSettings.socialLinks?.tiktok || "https://tiktok.com";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative w-full min-h-[70vh] lg:min-h-[88vh] overflow-hidden bg-[hsl(var(--brand-charcoal))]">
          <img
            src={heroImg}
            alt="LINE° — New Collection"
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />
          {/* Layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="relative z-10 flex items-end lg:items-center h-full min-h-[70vh] lg:min-h-[88vh] px-5 lg:px-16 pb-14 lg:pb-0">
            <div className="max-w-xl">
              <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.4em] uppercase mb-5 block">
                New Collection — SS '26
              </span>

              {/* Bold hero headline — Bebas Neue with shadow shading */}
              <h1 className="display-hero-white text-[72px] lg:text-[110px] mb-6 leading-none">
                WEAR<br />
                <span className="text-[hsl(var(--brand-terracotta))]">WHAT</span><br />
                SPEAKS.
              </h1>

              <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-8 max-w-xs font-body">
                Four essentials. Endless combinations. Designed for women who move through the world with intention.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="btn-primary text-xs px-8 py-3.5 bg-white text-[hsl(var(--brand-charcoal))] hover:bg-[hsl(var(--brand-terracotta))] hover:text-white">
                  Shop the Collection
                </Link>
                <Link to="/about" className="text-white/80 text-xs font-medium tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors self-center">
                  Our Story <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/30">
            <div className="w-px h-14 bg-white/20 animate-pulse" />
            <span className="text-[10px] tracking-[0.4em] uppercase mt-1">Scroll</span>
          </div>
        </section>

        {/* ── CATEGORY STRIP ───────────────────────────────────────────────── */}
        <section className="bg-[hsl(var(--brand-charcoal))] border-t border-white/10">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex overflow-x-auto scrollbar-hide divide-x divide-white/10">
              {[
                { label: "New In", href: "/shop?filter=new", desc: "Just dropped" },
                { label: "Dresses", href: "/shop?category=dresses", desc: "Statement pieces" },
                { label: "Tops", href: "/shop?category=tops", desc: "Versatile essentials" },
                { label: "Bottoms", href: "/shop?category=bottoms", desc: "Elevated basics" },
              ].map((cat) => (
                <Link
                  key={cat.label}
                  to={cat.href}
                  className="flex-1 min-w-[140px] py-5 px-5 lg:px-8 text-center hover:bg-white/5 transition-colors group"
                >
                  <p className="text-white text-xs font-semibold tracking-widest uppercase group-hover:text-[hsl(var(--brand-terracotta))] transition-colors">
                    {cat.label}
                  </p>
                  <p className="text-white/40 text-[10px] mt-0.5">{cat.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCT HIGHLIGHT ───────────────────────────────────── */}
        {featuredProducts[1] && (
          <section className="py-16 lg:py-24">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                <div className="relative">
                  <div className="aspect-[4/5] overflow-hidden bg-[hsl(var(--muted))]">
                    <img
                      src={featuredProducts[1].images[0]}
                      alt={featuredProducts[1].name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-[hsl(var(--brand-terracotta))] text-white px-4 py-3 hidden lg:block">
                    <p className="text-[10px] font-semibold tracking-widest uppercase">Bestseller</p>
                    <p className="font-display text-xl font-light">{featuredProducts[1].reviewCount}+ reviews</p>
                  </div>
                </div>

                <div className="lg:pl-8">
                  <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-3 block">
                    Featured Piece
                  </span>
                  <h2 className="font-display text-4xl lg:text-5xl font-light tracking-wide leading-tight mb-4">
                    {featuredProducts[1].name}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                    {featuredProducts[1].shortDescription}
                  </p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-semibold text-[hsl(var(--brand-terracotta))]">
                      ${featuredProducts[1].price}
                    </span>
                    {featuredProducts[1].compareAtPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${featuredProducts[1].compareAtPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-8">
                    {featuredProducts[1].colors.map((c) => (
                      <span
                        key={c.name}
                        className="w-5 h-5 rounded-full border-2 border-border cursor-pointer hover:border-[hsl(var(--brand-charcoal))] transition-colors"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      {featuredProducts[1].colors.length} colors
                    </span>
                  </div>

                  <Link to={`/product/${featuredProducts[1].slug}`} className="btn-primary inline-flex text-xs px-10 py-3.5">
                    Shop Now
                  </Link>
                  <Link to="/shop" className="ml-5 btn-ghost text-xs">View All →</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── FOUR-PRODUCT COLLECTION GRID ─────────────────────────────────── */}
        <section className="py-14 lg:py-20 bg-[hsl(var(--secondary))]">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-8 lg:mb-12">
              <div>
                <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-2 block">
                  The Edit
                </span>
                <h2 className="section-heading">Four Pieces.<br />Infinite Looks.</h2>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs font-medium tracking-widest uppercase hover:text-[hsl(var(--brand-terracotta))] transition-colors">
                Shop All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/shop" className="btn-secondary text-xs px-8">View All Products</Link>
            </div>
          </div>
        </section>

        {/* ── EDITORIAL SECTION ────────────────────────────────────────────── */}
        <section className="py-14 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-4 lg:gap-8">
              {/* Large left image */}
              <div className="lg:col-span-2 relative group overflow-hidden">
                <div className="aspect-[4/3] lg:aspect-auto lg:h-[560px] overflow-hidden bg-[hsl(var(--muted))]">
                  <img
                    src={editorial1}
                    alt="LINE° editorial"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 lg:p-8">
                  <span className="text-white/60 text-[10px] font-semibold tracking-[0.3em] uppercase mb-1 block">
                    The Oversized Edit
                  </span>
                  <h3 className="display-hero-white text-4xl lg:text-5xl mb-3">MOVEMENT,<br />ELEVATED.</h3>
                  <Link to="/shop?category=tops" className="text-white text-xs font-medium tracking-widest uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                    Shop Tops →
                  </Link>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-4 lg:gap-6">
                <div className="relative group overflow-hidden flex-1">
                  <div className="aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))]">
                    <img
                      src={editorial2}
                      alt="LINE° editorial — structured silhouettes"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="text-white/60 text-[10px] font-semibold tracking-[0.3em] uppercase mb-1 block">
                      The Dress Edit
                    </span>
                    <h3 className="display-hero-white text-3xl mb-2">DEFINE<br />YOUR FORM.</h3>
                    <Link to="/shop?category=dresses" className="text-white text-xs font-medium tracking-widest uppercase border-b border-white/50 pb-0.5 hover:border-white transition-colors">
                      Shop Dresses →
                    </Link>
                  </div>
                </div>

                <div className="bg-[hsl(var(--brand-charcoal))] p-6 lg:p-8 flex flex-col justify-center">
                  <span className="text-[hsl(var(--brand-terracotta))] text-[10px] font-semibold tracking-[0.3em] uppercase mb-2 block">
                    Our Promise
                  </span>
                  <h3 className="font-display text-xl font-light text-white mb-3 leading-tight">
                    Thoughtfully made.<br />Effortlessly worn.
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-4">
                    Every piece is designed to work harder, last longer, and feel better — season after season.
                  </p>
                  <Link to="/about" className="text-white text-xs font-medium tracking-widest uppercase border-b border-white/30 pb-0.5 hover:border-white transition-colors self-start">
                    Our Story →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SHOP THE LOOK ────────────────────────────────────────────────── */}
        <section className="py-14 lg:py-20 bg-[hsl(var(--brand-blush))]/30">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="text-center mb-10 lg:mb-14">
              <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-3 block">Style Guide</span>
              <h2 className="section-heading">Shop the Look</h2>
              <p className="text-muted-foreground text-sm mt-3 max-w-sm mx-auto">
                Three ways to style the collection — from morning to night.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { outfit: "The Day Look", desc: "Wide-Leg Pants + Linen Shirt", products: [featuredProducts[0], featuredProducts[2]], href: "/shop" },
                { outfit: "The Evening Look", desc: "Corset Mini Dress, styled solo", products: [featuredProducts[1]], href: `/product/${featuredProducts[1]?.slug}` },
                { outfit: "The Office Look", desc: "Tailored Trousers + Linen Shirt", products: [featuredProducts[3], featuredProducts[2]], href: "/shop" },
              ].map((look) => (
                <div key={look.outfit} className="group">
                  <div className="aspect-[3/4] relative overflow-hidden mb-4 bg-[hsl(var(--muted))]">
                    <div className="grid grid-cols-2 h-full">
                      {look.products.filter(Boolean).slice(0, 2).map((p) => p && (
                        <div key={p.id} className="overflow-hidden">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ))}
                      {look.products.length === 1 && look.products[0] && (
                        <div className="col-span-2 overflow-hidden -mt-full">
                          <img src={look.products[0].images[0]} alt={look.products[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                      <Link to={look.href} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[hsl(var(--brand-charcoal))] text-xs font-semibold tracking-widest uppercase px-5 py-2.5">
                        Shop Look
                      </Link>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm">{look.outfit}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{look.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRAND STORY ──────────────────────────────────────────────────── */}
        <section className="py-16 lg:py-24 bg-[hsl(var(--brand-charcoal))] overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <div>
                <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">
                  About LINE°
                </span>
                <h2 className="display-hero-white text-6xl lg:text-8xl mb-6">
                  FASHION<br />
                  <span className="text-[hsl(var(--brand-terracotta))]">BUILT ON</span><br />
                  INTENTION.
                </h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4 max-w-md font-body">
                  LINE° was born from a simple belief — that getting dressed should feel like a decision, not a distraction. We design pieces that have a reason to exist in your wardrobe and a reason to stay.
                </p>
                <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md font-body">
                  Every silhouette is considered. Every fabric is chosen with care. From the wide-leg cut that makes you walk differently to the shirt you'll reach for every single week.
                </p>
                <Link to="/about" className="btn-secondary border-white/40 text-white hover:bg-white hover:text-[hsl(var(--brand-charcoal))] text-xs px-8">
                  Read Our Story
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "4 Hero Products", sub: "Curated, not overwhelming" },
                  { label: "Free Returns", sub: "30-day hassle-free policy" },
                  { label: "US Shipping", sub: "Standard 7–14 days" },
                  { label: "Real Materials", sub: "Fabrics chosen with care" },
                ].map((stat) => (
                  <div key={stat.label} className="border border-white/10 p-5 lg:p-6 hover:border-[hsl(var(--brand-terracotta))]/50 transition-colors">
                    <p className="font-display text-xl lg:text-2xl font-medium text-white mb-1">{stat.label}</p>
                    <p className="text-white/40 text-xs">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── TIKTOK SECTION ───────────────────────────────────────────────── */}
        <section className="py-14 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={tiktokBanner} alt="LINE° on TikTok" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-[hsl(var(--secondary))]/80" />
          </div>
          <div className="relative max-w-[1400px] mx-auto px-4 lg:px-8 text-center">
            <TikTokIcon />
            <h2 className="display-hero text-[hsl(var(--brand-charcoal))] text-5xl lg:text-7xl mt-4 mb-3">
              {tiktokHandle.toUpperCase()} ON TIKTOK
            </h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 font-body">
              Watch how real women style LINE° pieces. Follow us for new drops, styling ideas, and behind the scenes.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {[
                "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&auto=format&fit=crop&q=80",
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=80",
              ].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden relative group cursor-pointer">
                  <img src={src} alt={`TikTok content ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                  </div>
                </div>
              ))}
            </div>
            <a href={tiktokUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs px-8">
              Follow LINE° on TikTok
            </a>
          </div>
        </section>

        {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
        <section className="py-10 bg-[hsl(var(--secondary))] border-y border-border">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { icon: "🚚", title: "Free Shipping Over $75", sub: "Delivered to your door" },
                { icon: "↩️", title: "Free 30-Day Returns", sub: "No questions asked" },
                { icon: "🔒", title: "Secure Checkout", sub: "Paystack & Flutterwave" },
                { icon: "✨", title: "Real Materials", sub: "Designed to last" },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-xs font-semibold tracking-wide">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
