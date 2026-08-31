import type { Cart, CartItem } from "@/types";
import { generateId } from "@/lib/utils";

const CART_KEY = "line_cart";

export function getCart(): Cart {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored) as Cart;
  } catch {
    console.error("Failed to parse cart from localStorage");
  }
  return { items: [], updatedAt: new Date().toISOString() };
}

export function saveCart(cart: Cart): void {
  localStorage.setItem(CART_KEY, JSON.stringify({ ...cart, updatedAt: new Date().toISOString() }));
}

export function addToCart(item: Omit<CartItem, "id">): Cart {
  const cart = getCart();
  const existingIndex = cart.items.findIndex(
    (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
  );
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    cart.items.push({ ...item, id: generateId() });
  }
  saveCart(cart);
  return cart;
}

export function updateCartItemQuantity(itemId: string, quantity: number): Cart {
  const cart = getCart();
  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.id !== itemId);
  } else {
    const idx = cart.items.findIndex((i) => i.id === itemId);
    if (idx >= 0) cart.items[idx].quantity = quantity;
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(itemId: string): Cart {
  const cart = getCart();
  cart.items = cart.items.filter((i) => i.id !== itemId);
  saveCart(cart);
  return cart;
}

export function clearCart(): Cart {
  const emptyCart: Cart = { items: [], updatedAt: new Date().toISOString() };
  saveCart(emptyCart);
  return emptyCart;
}

export function getCartTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartItemCount(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getShippingCost(subtotal: number): number {
  return subtotal >= 75 ? 0 : 7.99;
}
