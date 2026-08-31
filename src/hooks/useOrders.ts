import { useState, useCallback } from "react";
import type { Order, ShippingAddress } from "@/types";
import {
  getOrders,
  getOrderById,
  getOrderByNumber,
  createOrder,
  updateOrderPayment,
  updateOrderFulfillment,
  getCustomerOrders,
} from "@/lib/orders";
import type { CartItem, PaymentRecord } from "@/types";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() => getOrders());

  const refresh = useCallback(() => {
    setOrders(getOrders());
  }, []);

  const placeOrder = useCallback(
    (cartItems: CartItem[], address: ShippingAddress, subtotal: number): Order => {
      const order = createOrder(cartItems, address, subtotal);
      setOrders(getOrders());
      return order;
    },
    []
  );

  const recordPayment = useCallback((orderId: string, payment: PaymentRecord): Order | null => {
    const updated = updateOrderPayment(orderId, payment);
    setOrders(getOrders());
    return updated;
  }, []);

  const updateFulfillment = useCallback(
    (orderId: string, updates: Parameters<typeof updateOrderFulfillment>[1]): Order | null => {
      const updated = updateOrderFulfillment(orderId, updates);
      setOrders(getOrders());
      return updated;
    },
    []
  );

  return {
    orders,
    refresh,
    placeOrder,
    recordPayment,
    updateFulfillment,
    getOrderById,
    getOrderByNumber,
    getCustomerOrders,
  };
}
