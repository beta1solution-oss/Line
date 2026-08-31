import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function generateOrderNumber(): string {
  const prefix = "LNE";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateIdempotencyKey(orderRef: string): string {
  return `idk_${orderRef}_${Date.now()}`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function isApplePayAvailable(): boolean {
  // Check if Apple Pay is available
  if (typeof window === "undefined") return false;
  // Apple Pay JS API check
  if ("ApplePaySession" in window) {
    try {
      return (window as unknown as { ApplePaySession: { canMakePayments: () => boolean } }).ApplePaySession.canMakePayments();
    } catch {
      return false;
    }
  }
  return false;
}

export function calcMargin(price: number, supplierCost: number, shippingCost: number): number {
  return price - supplierCost - shippingCost;
}

export function calcMarginPercent(price: number, supplierCost: number, shippingCost: number): number {
  const margin = calcMargin(price, supplierCost, shippingCost);
  return Math.round((margin / price) * 100);
}

export const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
];
