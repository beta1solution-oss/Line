import type { Order, OrderItem, ShippingAddress, PaymentRecord, FulfillmentStatus } from "@/types";
import { generateOrderNumber, generateId, generateIdempotencyKey } from "@/lib/utils";
import { getShippingCost } from "@/lib/cart";
import type { CartItem } from "@/types";

const ORDERS_KEY = "line_orders";
const CUSTOMER_KEY = "line_customer";

export function getOrders(): Order[] {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    if (stored) return JSON.parse(stored) as Order[];
  } catch {
    console.error("Failed to parse orders");
  }
  return [];
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find((o) => o.id === id);
}

export function getOrderByNumber(orderNumber: string): Order | undefined {
  return getOrders().find((o) => o.orderNumber === orderNumber);
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(
  cartItems: CartItem[],
  shippingAddress: ShippingAddress,
  subtotal: number
): Order {
  const orderNumber = generateOrderNumber();
  const shippingCost = getShippingCost(subtotal);
  const total = subtotal + shippingCost;
  const idempotencyKey = generateIdempotencyKey(orderNumber);

  const orderItems: OrderItem[] = cartItems.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    color: item.color,
    size: item.size,
    quantity: item.quantity,
    unitPrice: item.price,
    supplierCost: 0,
    shippingCost: 0,
    image: item.image,
  }));

  const order: Order = {
    id: generateId(),
    orderNumber,
    customer: shippingAddress,
    items: orderItems,
    subtotal,
    shippingCost,
    total,
    paymentStatus: "Pending",
    fulfillmentStatus: "Awaiting Fulfillment",
    fulfillment: {
      status: "Awaiting Fulfillment",
      retryCount: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    idempotencyKey,
  };

  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function updateOrderPayment(orderId: string, payment: PaymentRecord): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx < 0) return null;

  orders[idx].payment = payment;
  orders[idx].paymentStatus = payment.status;
  orders[idx].updatedAt = new Date().toISOString();

  // If paid, update fulfillment status
  if (payment.status === "Paid" && payment.webhookVerified) {
    orders[idx].fulfillmentStatus = "Awaiting Fulfillment";
  }

  saveOrders(orders);
  return orders[idx];
}

export function updateOrderFulfillment(
  orderId: string,
  updates: Partial<Order["fulfillment"]> & { fulfillmentStatus?: FulfillmentStatus }
): Order | null {
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx < 0) return null;

  orders[idx].fulfillment = { ...orders[idx].fulfillment, ...updates };
  if (updates.fulfillmentStatus) {
    orders[idx].fulfillmentStatus = updates.fulfillmentStatus;
    orders[idx].fulfillment.status = updates.fulfillmentStatus;
  }
  orders[idx].updatedAt = new Date().toISOString();
  saveOrders(orders);
  return orders[idx];
}

export function getCustomerOrders(email: string): Order[] {
  return getOrders().filter(
    (o) => o.customer.email.toLowerCase() === email.toLowerCase()
  );
}

// Mock: simulate CJ fulfillment submission
export function submitToCJ(order: Order): { success: boolean; cjOrderId?: string; error?: string } {
  // In production, this would call the CJ Dropshipping API server-side
  // This is a mock that always succeeds for demo
  if (!order.payment || order.paymentStatus !== "Paid") {
    return { success: false, error: "Order is not paid — cannot submit to CJ" };
  }
  const mockCJOrderId = `CJ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  return { success: true, cjOrderId: mockCJOrderId };
}

// Saved address management
export function getSavedAddress(): ShippingAddress | null {
  try {
    const stored = localStorage.getItem(CUSTOMER_KEY);
    if (stored) return JSON.parse(stored) as ShippingAddress;
  } catch { /* empty */ }
  return null;
}

export function saveAddress(address: ShippingAddress): void {
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(address));
}
