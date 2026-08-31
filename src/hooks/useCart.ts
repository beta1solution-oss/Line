import { useState, useEffect, useCallback } from "react";
import type { Cart } from "@/types";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  getCartItemCount,
  getShippingCost,
} from "@/lib/cart";
import type { CartItem } from "@/types";

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => getCart());

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    const handleStorage = () => setCart(getCart());
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-updated", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-updated", handleStorage);
    };
  }, []);

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    const updated = addToCart(item);
    setCart({ ...updated });
    dispatchUpdate();
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    const updated = updateCartItemQuantity(itemId, quantity);
    setCart({ ...updated });
    dispatchUpdate();
  }, []);

  const removeItem = useCallback((itemId: string) => {
    const updated = removeFromCart(itemId);
    setCart({ ...updated });
    dispatchUpdate();
  }, []);

  const clear = useCallback(() => {
    const updated = clearCart();
    setCart({ ...updated });
    dispatchUpdate();
  }, []);

  const subtotal = getCartTotal(cart);
  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const itemCount = getCartItemCount(cart);

  return { cart, addItem, updateQuantity, removeItem, clear, subtotal, shipping, total, itemCount };
}
