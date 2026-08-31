import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { PRODUCTS } from "@/constants/products";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem, subtotal, shipping, total, itemCount } = useCart();
  const navigate = useNavigate();

  const crossSellProducts = PRODUCTS.filter(
    (p) =>
      (p.status === "Active" || p.status === "Winner") &&
      !cart.items.some((i) => i.productId === p.id)
  ).slice(0, 2);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5" />
            <span className="font-body text-sm font-semibold tracking-wider uppercase">
              Your Bag {itemCount > 0 && `(${itemCount})`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:opacity-60 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close cart"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm mb-6">Your bag is empty</p>
              <button
                onClick={onClose}
                className="btn-primary text-xs px-8"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-3.5 py-3 border-b border-border last:border-0">
                  {/* Image */}
                  <Link
                    to={`/product/${item.productSlug}`}
                    onClick={onClose}
                    className="flex-shrink-0 w-20 h-24 bg-muted overflow-hidden"
                  >
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item.productSlug}`}
                      onClick={onClose}
                      className="font-body text-sm font-medium leading-tight hover:text-[hsl(var(--brand-terracotta))] transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="w-3 h-3 rounded-full border border-border flex-shrink-0"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.color}
                      />
                      <span className="text-muted-foreground text-xs">{item.color} / {item.size}</span>
                    </div>
                    <p className="text-sm font-semibold mt-1">{formatPrice(item.price)}</p>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground text-xs hover:text-destructive transition-colors underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cross-sell */}
              {crossSellProducts.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
                    You might also like
                  </p>
                  <div className="space-y-3">
                    {crossSellProducts.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={onClose}
                        className="flex gap-3 group"
                      >
                        <div className="w-14 h-16 bg-muted overflow-hidden flex-shrink-0">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-[hsl(var(--brand-terracotta))] transition-colors">
                            {p.name}
                          </p>
                          <p className="text-xs font-semibold mt-1">{formatPrice(p.price)}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-muted-foreground self-center flex-shrink-0 group-hover:text-[hsl(var(--brand-terracotta))] transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t border-border px-5 py-5 bg-white">
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(75 - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              onClick={() => { navigate("/checkout"); onClose(); }}
              className="btn-primary w-full text-xs"
            >
              Checkout — {formatPrice(total)}
            </button>
            <Link
              to="/cart"
              onClick={onClose}
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
