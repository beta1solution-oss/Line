import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  showQuickAdd?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wished, setWished] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();

  const defaultColor = product.colors[0];
  const secondImage = product.images[1] || product.images[0];

  const handleQuickAdd = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    const variant = product.variants.find(
      (v) => v.color === defaultColor.name && v.size === selectedSize
    );
    if (!variant || variant.stock === 0) {
      toast.error("This size is out of stock");
      return;
    }
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      image: product.images[0],
      color: defaultColor.name,
      colorHex: defaultColor.hex,
      size: selectedSize,
      sku: variant.sku,
      price: product.price,
      quantity: 1,
    });
    toast.success(`${product.name} added to bag`);
    setQuickAddOpen(false);
    setSelectedSize("");
  };

  const isOnSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = isOnSale
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setQuickAddOpen(false); }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[hsl(var(--muted))]">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={hovered && secondImage !== product.images[0] ? secondImage : product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.status === "Winner" && (
            <span className="bg-[hsl(var(--brand-terracotta))] text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
              Bestseller
            </span>
          )}
          {isOnSale && (
            <span className="bg-[hsl(var(--brand-charcoal))] text-white text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 ${
            hovered ? "opacity-100" : "opacity-0 lg:opacity-0"
          }`}
          onClick={() => setWished(!wished)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${wished ? "fill-[hsl(var(--brand-terracotta))] text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-charcoal))] fill-white/80"}`}
          />
        </button>

        {/* Quick Add */}
        {showQuickAdd && (
          <div
            className={`absolute bottom-0 left-0 right-0 bg-white transition-all duration-300 ${
              hovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            }`}
          >
            {!quickAddOpen ? (
              <button
                onClick={() => setQuickAddOpen(true)}
                className="w-full py-3 text-[10px] font-semibold tracking-widest uppercase text-[hsl(var(--brand-charcoal))] hover:bg-[hsl(var(--brand-charcoal))] hover:text-white transition-colors border-t border-border"
              >
                Quick Add
              </button>
            ) : (
              <div className="p-3 border-t border-border">
                <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground mb-2">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {product.sizes.map((size) => {
                    const hasStock = product.variants.some(
                      (v) => v.color === defaultColor.name && v.size === size && v.stock > 0
                    );
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`w-8 h-8 text-xs font-medium transition-all ${
                          selectedSize === size
                            ? "bg-[hsl(var(--brand-charcoal))] text-white"
                            : hasStock
                            ? "border border-border hover:border-[hsl(var(--brand-charcoal))]"
                            : "border border-border text-muted-foreground/40 line-through cursor-not-allowed"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleQuickAdd}
                  className="w-full py-2 bg-[hsl(var(--brand-charcoal))] text-white text-[10px] font-semibold tracking-widest uppercase hover:bg-[hsl(var(--brand-terracotta))] transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3 pb-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-[hsl(var(--brand-charcoal))] hover:text-[hsl(var(--brand-terracotta))] transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 mt-1.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-sm font-semibold ${isOnSale ? "text-[hsl(var(--brand-terracotta))]" : "text-[hsl(var(--brand-charcoal))]"}`}>
            {formatPrice(product.price)}
          </span>
          {isOnSale && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-[10px] ${star <= Math.round(product.rating) ? "text-[hsl(var(--brand-terracotta))]" : "text-muted-foreground/30"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
          </div>
        )}
      </div>
    </div>
  );
}
