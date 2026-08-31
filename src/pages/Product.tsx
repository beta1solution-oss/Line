import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Truck, RotateCcw, Shield, ChevronDown, ChevronUp } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import SizeGuide from "@/components/features/SizeGuide";
import { getProductBySlug, PRODUCTS } from "@/constants/products";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function Product() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = slug ? getProductBySlug(slug) : undefined;

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("details");
  const { addItem } = useCart();

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

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.status === "Active" || p.status === "Winner")
  ).slice(0, 4);

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

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
      price: product.price,
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

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;

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

        {/* Product section */}
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* ── Image Gallery ── */}
            <div className="relative">
              {/* Mobile: single image with arrows */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))] lg:hidden">
                <img
                  src={product.images[activeImage]}
                  alt={`${product.name} — view ${activeImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i === 0 ? product.images.length - 1 : i - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i === product.images.length - 1 ? 0 : i + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {product.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeImage ? "bg-white" : "bg-white/40"}`}
                          aria-label={`View image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Desktop: thumbnail strip + main image */}
              <div className="hidden lg:flex gap-3">
                <div className="flex flex-col gap-2 w-16 flex-shrink-0">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden border-2 transition-all ${
                        i === activeImage ? "border-[hsl(var(--brand-charcoal))]" : "border-transparent"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <div className="flex-1 aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))]">
                  <img
                    src={product.images[activeImage]}
                    alt={`${product.name} — view ${activeImage + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
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

              {/* Price */}
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-2xl font-semibold ${isOnSale ? "text-[hsl(var(--brand-terracotta))]" : ""}`}>
                  {formatPrice(product.price)}
                </span>
                {isOnSale && (
                  <span className="text-muted-foreground line-through text-base">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 border-b border-border pb-6">
                {product.shortDescription}
              </p>

              {/* Color selector */}
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

              {/* Size selector */}
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
                    const inStock = availableSizesForColor.includes(size);
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
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold tracking-wider uppercase">Quantity</span>
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 mb-8">
                <button onClick={handleAddToCart} className="btn-primary w-full py-4 text-xs">
                  Add to Bag
                </button>
                <button onClick={handleBuyNow} className="btn-secondary w-full py-4 text-xs">
                  Buy Now
                </button>
              </div>

              {/* Trust signals */}
              <div className="space-y-2.5 border-t border-border pt-5 mb-6">
                {[
                  { Icon: Truck, text: "Free shipping on orders over $75 — US delivery 7–14 days" },
                  { Icon: RotateCcw, text: "Free returns within 30 days of delivery" },
                  { Icon: Shield, text: "Secure payment — Paystack & Flutterwave encrypted checkout" },
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
                        <p><strong className="text-foreground">Material:</strong> {product.material}</p>
                        <p><strong className="text-foreground">Fit:</strong> {product.fit}</p>
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
                        <p>{product.shippingInfo}</p>
                        <p>{product.returnInfo}</p>
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
                      {expandedSection === id ? (
                        <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSection === id && (
                      <div className="pb-4 animate-fade-in">{content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── You Might Also Like ── */}
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
