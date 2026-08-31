// ─── Product Types ────────────────────────────────────────────────────────────
export type ProductStatus = "Draft" | "Testing" | "Active" | "Paused" | "Winner" | "Discontinued";

export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  stock: number;
  cjVariantId?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  supplierCost: number;
  shippingCost: number;
  estimatedMargin: number;
  images: string[];
  videos?: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  material: string;
  fit: string;
  careInstructions: string[];
  shippingInfo: string;
  returnInfo: string;
  cjProductId?: string;
  cjVariantIds?: Record<string, string>;
  variants: ProductVariant[];
  status: ProductStatus;
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

// ─── Cart Types ───────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  image: string;
  color: string;
  colorHex: string;
  size: string;
  sku: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

// ─── Order Types ──────────────────────────────────────────────────────────────
export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded" | "Partially Refunded" | "Chargeback";
export type FulfillmentStatus =
  | "Awaiting Fulfillment"
  | "Sent to CJ"
  | "CJ Processing"
  | "Shipped"
  | "In Transit"
  | "Delivered"
  | "Fulfillment Error"
  | "Cancelled";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  supplierCost: number;
  shippingCost: number;
  image: string;
  cjProductId?: string;
  cjVariantId?: string;
}

export interface PaymentRecord {
  provider: "Paystack" | "Flutterwave";
  transactionId: string;
  reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  webhookVerified: boolean;
  webhookReceivedAt?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CJFulfillment {
  cjOrderId?: string;
  status: FulfillmentStatus;
  trackingNumber?: string;
  carrier?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  errorMessage?: string;
  retryCount: number;
  lastAttemptAt?: string;
  sentAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  payment?: PaymentRecord;
  fulfillment: CJFulfillment;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  idempotencyKey: string;
}

// ─── Customer Account ─────────────────────────────────────────────────────────
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: ShippingAddress[];
  defaultAddressIndex: number;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

// ─── Payment Provider Config ──────────────────────────────────────────────────
export interface PaymentProviderConfig {
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  paystackPublicKey: string;
  flutterwavePublicKey: string;
}

// ─── TikTok Content ───────────────────────────────────────────────────────────
export interface TikTokVideo {
  id: string;
  videoUrl: string;
  thumbnail: string;
  productId: string;
  productName: string;
  hook: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  profileVisits: number;
  linkClicks: number;
  orders: number;
  revenue: number;
}

// ─── Admin Analytics ──────────────────────────────────────────────────────────
export interface DashboardMetrics {
  revenue: number;
  orders: number;
  unitsSold: number;
  averageOrderValue: number;
  pendingFulfillment: number;
  refunds: number;
  estimatedMargin: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
}
