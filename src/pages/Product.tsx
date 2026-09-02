import { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Star, Truck, RotateCcw, Shield, ChevronDown, ChevronUp, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import SizeGuide from "@/components/features/SizeGuide";
import { getProductBySlug, PRODUCTS as STATIC_PRODUCTS } from "@/constants/products";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/types";

// Payment logos inline SVGs
const PaystackLogo = () => (
  <span className="inline-flex items-center gap-1 bg-[#00C3F7]/10 border border-[#00C3F7]/30 px-2 py-0.5 text-[10px] font-bold text-[#00C3F7] tracking-wider">
    PAYSTACK
  </span>
);
const FlutterwaveLogo = () => (
  <span className="inline-flex items-center gap-1 bg-[#F5A623]/10 border border-[#F5A623]/30 px-2 py-0.5 text-[10px] font-bold text-[#F5A623] tracking-wider">
    FLUTTERWAVE
  </span>
);
const ApplePayLogo = () => (
  <span className="inline-flex items-center gap-1 bg-black border border-black/20 px-2 py-0.5 text-[10px] font-bold text-white tracking-wider">
    ⌘ PAY
  </span>
);

// Touch-gesture image gallery with pinch-zoom
function TouchGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current || 0));
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx < 0) setActiveIndex((i) => (i + 1) % images.length);
      else setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
    }
    touchStartX.current = null;
  };

  // Desktop mouse zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))] cursor-zoom-in select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onClick={() => setZoomed(!zoomed)}
      >
        <img
          ref={imgRef}
          src={images[activeIndex]}
          alt={`${productName} — view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300"
          style={zoomed ? {
            transform: "scale(2)",
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            cursor: "zoom-out",
          } : {}}
          draggable={false}
        />

        {!zoomed && (
          <button
            className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 text-xs text-muted-foreground hover:bg-white transition-colors"
            onClick={(e) => { e.stopPropagation(); setZoomed(true); }}
            aria-label="Zoom image"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        )}

        {images.length > 1 && !zoomed && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1)); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/40"}`}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-3 left-3 text-[10px] text-white/60 bg-black/30 px-1.5 py-0.5">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-20 overflow-hidden border-2 transition-all ${
                i === activeIndex ? "border-[hsl(var(--brand-charcoal))]" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(
    slug ? getProductBySlug(slug) : undefined
  );
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("details");
  const { addItem } = useCart();

  // Load from DB on mount
  useEffect(() => {
    if (!slug) return;
    import("@/lib/productsDB").then(({ getProductBySlug: dbGet }) => {
      dbGet(slug).then((p) => {
        if (p) {
          setProduct(p);
          setSelectedColor(p.colors[0]?.name || "");
        }
      });
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <h1 className="font-display text-3xl font-light mb-4">Product not found</h1>
            <Link to="/shop" className="btn-primary text-xs px-8">Back to Shop</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = STATIC_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.status === "Active" || p.status === "Winner")
  ).slice(0, 4);

  // Find variant — match by color+size, or just color if size not selected
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  // Variant pricing support
  const variantPrice = selectedVariant && (selectedVariant as unknown as { price?: number }).price
    ? (selectedVariant as unknown as { price: number }).price
    : product.price;

  const availableSizesForColor = product.variants
    .filter((v) => v.color === selectedColor && v.stock > 0)
    .map((v) => v.size);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to bag");
      return;
    }
    if (!selectedVariant || selectedVariant.stock === 0) {
      toast.error("Sorry, this size is out of stock");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: product.images[0],
      color: selectedColor,
      colorHex: product.colors.find((c) => c.name === selectedColor)?.hex || "#000",
      size: selectedSize,
      sku: selectedVariant.sku,
      price: variantPrice,
      quantity,
    });
    toast.success(`${product.name} (${selectedColor} / ${selectedSize}) added to bag`);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size before continuing");
      return;
    }
    handleAddToCart();
    navigate("/checkout");
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isOnSale = product.compareAtPrice && product.compareAtPrice > variantPrice;

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* ── Image Gallery ── */}
            <div>
              <TouchGallery images={product.images} productName={product.name} />
            </div>

            {/* ── Product Info ── */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              {product.status === "Winner" && (
                <span className="inline-block bg-[hsl(var(--brand-terracotta))] text-white text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 mb-3">
                  Bestseller
                </span>
              )}

              <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide leading-tight mb-2">
                {product.name}
              </h1>

              {/* Rating */}
              {product.reviewCount > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(product.rating)
                            ? "fill-[hsl(var(--brand-terracotta))] text-[hsl(var(--brand-terracotta))]"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-2xl font-semibold ${isOnSale ? "text-[hsl(var(--brand-terracotta))]" : ""}`}>
                  {formatPrice(variantPrice)}
                </span>
                {isOnSale && (
                  <span className="text-muted-foreground line-through text-base">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
                {isOnSale && (
                  <span className="bg-[hsl(var(--brand-terracotta))] text-white text-[10px] font-bold px-2 py-0.5">
                    SALE
                  </span>
                )}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-b border-border pb-6">
                {product.shortDescription}
              </p>

              {/* Color selector */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      Color: <span className="font-normal text-muted-foreground normal-case tracking-normal">{selectedColor}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => { setSelectedColor(color.name); setSelectedSize(""); }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? "border-[hsl(var(--brand-charcoal))] scale-110"
                            : "border-transparent hover:border-[hsl(var(--brand-stone))]"
                        }`}
                        style={{ backgroundColor: color.hex, boxShadow: "0 0 0 1px rgba(0,0,0,0.15)" }}
                        title={color.name}
                        aria-label={`Select color ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-semibold tracking-wider uppercase">
                      Size: <span className="font-normal text-muted-foreground normal-case tracking-normal">{selectedSize || "Select"}</span>
                    </span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const inStock = availableSizesForColor.includes(size) || availableSizesForColor.length === 0;
                      // Check if this size has a different price
                      const sizeVariant = product.variants.find(
                        (v) => v.color === selectedColor && v.size === size
                      );
                      const sizePrice = sizeVariant && (sizeVariant as unknown as { price?: number }).price
                        ? (sizeVariant as unknown as { price: number }).price
                        : null;
                      return (
                        <button
                          key={size}
                          onClick={() => inStock && setSelectedSize(size)}
                          disabled={!inStock}
                          className={`h-10 min-w-[44px] px-3 text-xs font-medium border transition-all ${
                            selectedSize === size
                              ? "bg-[hsl(var(--brand-charcoal))] text-white border-[hsl(var(--brand-charcoal))]"
                              : inStock
                              ? "border-border hover:border-[hsl(var(--brand-charcoal))] bg-white"
                              : "border-border text-muted-foreground/40 bg-[hsl(var(--muted))] cursor-not-allowed line-through"
                          }`}
                          aria-label={`Size ${size}${!inStock ? " — out of stock" : ""}`}
                        >
                          <span>{size}</span>
                          {sizePrice && sizePrice !== product.price && (
                            <span className="block text-[9px] opacity-70">{formatPrice(sizePrice)}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold tracking-wider uppercase">Quantity</span>
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-lg"
                    aria-label="Decrease quantity"
                  >−</button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors text-lg"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mb-8">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-xs">
                  Add to Bag — {formatPrice(variantPrice * quantity)}
                </button>
                <button onClick={handleBuyNow} className="btn-secondary w-full py-4 text-xs">
                  Buy Now
                </button>
              </div>

              {/* Payment logos */}
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                <span className="text-[10px] text-muted-foreground">Accepted:</span>
                <PaystackLogo />
                <FlutterwaveLogo />
                <ApplePayLogo />
              </div>

              {/* Trust signals */}
              <div className="space-y-2.5 border-t border-border pt-5 mb-6">
                {[
                  { Icon: Truck, text: "Free shipping on orders over $75 — US delivery 7–14 days" },
                  { Icon: RotateCcw, text: "Free returns within 30 days of delivery" },
                  { Icon: Shield, text: "Secure payment — encrypted checkout" },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-[hsl(var(--brand-terracotta))] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-muted-foreground leading-relaxed">{text}</span>
                  </div>
                ))}
              </div>

              {/* Accordion details */}
              <div className="space-y-0 border-t border-border">
                {[
                  {
                    id: "details",
                    label: "Product Details",
                    content: (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>{product.description}</p>
                        {product.material && <p><strong className="text-foreground">Material:</strong> {product.material}</p>}
                        {product.fit && <p><strong className="text-foreground">Fit:</strong> {product.fit}</p>}
                      </div>
                    ),
                  },
                  {
                    id: "care",
                    label: "Care Instructions",
                    content: (
                      <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {product.careInstructions.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[hsl(var(--brand-terracotta))] mt-0.5">—</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                  {
                    id: "shipping",
                    label: "Shipping & Returns",
                    content: (
                      <div className="space-y-3 text-sm text-muted-foreground">
                        {product.shippingInfo && <p>{product.shippingInfo}</p>}
                        {product.returnInfo && <p>{product.returnInfo}</p>}
                      </div>
                    ),
                  },
                ].map(({ id, label, content }) => (
                  <div key={id} className="border-b border-border">
                    <button
                      onClick={() => toggleSection(id)}
                      className="w-full flex items-center justify-between py-4 text-left hover:text-[hsl(var(--brand-terracotta))] transition-colors min-h-[44px]"
                      aria-expanded={expandedSection === id}
                    >
                      <span className="text-xs font-semibold tracking-wider uppercase">{label}</span>
                      {expandedSection === id ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                    </button>
                    {expandedSection === id && <div className="pb-4 animate-fade-in">{content}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="bg-[hsl(var(--secondary))] py-14 lg:py-20">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
              <h2 className="section-heading mb-8 lg:mb-12">Complete the Look</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <Footer />
    </div>
  );
}
