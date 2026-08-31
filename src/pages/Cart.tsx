import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, ArrowRight, ShoppingBag } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import { useCart } from "@/hooks/useCart";
import { PRODUCTS } from "@/constants/products";
import { formatPrice } from "@/lib/utils";

export default function Cart() {
  const { cart, updateQuantity, removeItem, subtotal, shipping, total, itemCount } = useCart();
  const navigate = useNavigate();

  const crossSellProducts = PRODUCTS.filter(
    (p) =>
      (p.status === "Active" || p.status === "Winner") &&
      !cart.items.some((i) => i.productId === p.id)
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-8">
            Your Bag {itemCount > 0 && <span className="text-muted-foreground text-xl font-light">({itemCount})</span>}
          </h1>

          {cart.items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground opacity-30 mb-4" />
              <p className="font-display text-2xl font-light mb-2">Your bag is empty</p>
              <p className="text-muted-foreground text-sm mb-8">Start exploring our collection</p>
              <Link to="/shop" className="btn-primary text-xs px-10">
                Shop the Collection
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart items */}
              <div className="lg:col-span-2">
                <div className="hidden lg:grid grid-cols-4 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground border-b border-border pb-3 mb-4">
                  <span className="col-span-2">Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>

                <div className="space-y-5">
                  {cart.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 lg:grid-cols-4 gap-4 py-5 border-b border-border">
                      <div className="col-span-2 flex gap-4">
                        <Link to={`/product/${item.productSlug}`} className="flex-shrink-0 w-20 h-24 lg:w-24 lg:h-28 bg-muted overflow-hidden">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.productSlug}`} className="font-body text-sm font-medium hover:text-[hsl(var(--brand-terracotta))] transition-colors leading-tight">
                            {item.productName}
                          </Link>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.colorHex }} />
                            <span className="text-xs text-muted-foreground">{item.color} / {item.size}</span>
                          </div>
                          <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-muted-foreground hover:text-destructive transition-colors mt-2 flex items-center gap-1"
                            aria-label="Remove item"
                          >
                            <X className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center lg:justify-center">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-9 h-9 flex items-center justify-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end">
                        <span className="lg:hidden text-xs text-muted-foreground">Item total</span>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cross-sell */}
                {crossSellProducts.length > 0 && (
                  <div className="mt-10">
                    <h3 className="font-display text-xl font-light tracking-wide mb-5">You Might Also Like</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {crossSellProducts.map((p) => (
                        <ProductCard key={p.id} product={p} showQuickAdd={false} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order summary */}
              <div>
                <div className="border border-border p-6 sticky top-24">
                  <h2 className="font-display text-xl font-light tracking-wide mb-5">Order Summary</h2>
                  
                  <div className="space-y-3 text-sm border-b border-border pb-4 mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-[hsl(var(--brand-terracotta))]">
                        You're {formatPrice(75 - subtotal)} away from free shipping
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between text-sm font-semibold mb-6">
                    <span>Estimated Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="btn-primary w-full py-4 text-xs flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="mt-4 text-center">
                    <Link to="/shop" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">
                      Continue Shopping
                    </Link>
                  </div>

                  <div className="mt-5 pt-5 border-t border-border space-y-1.5">
                    {[
                      "🔒 Secure SSL encrypted checkout",
                      "✓ Free returns within 30 days",
                      "📦 Free shipping over $75",
                    ].map((item) => (
                      <p key={item} className="text-xs text-muted-foreground">{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
