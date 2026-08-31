import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getOrders } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  Paid: "bg-green-50 text-green-700",
  Pending: "bg-yellow-50 text-yellow-700",
  Failed: "bg-red-50 text-red-700",
  Refunded: "bg-blue-50 text-blue-700",
  "Awaiting Fulfillment": "bg-amber-50 text-amber-700",
  "Sent to CJ": "bg-blue-50 text-blue-700",
  "CJ Processing": "bg-blue-50 text-blue-700",
  Shipped: "bg-green-50 text-green-700",
  "In Transit": "bg-green-50 text-green-700",
  Delivered: "bg-green-100 text-green-800",
  "Fulfillment Error": "bg-red-50 text-red-700",
  Cancelled: "bg-gray-50 text-gray-600",
};

function statusBadge(status: string) {
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap ${STATUS_COLORS[status] || "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function AdminOrders() {
  const [orders] = useState<Order[]>(getOrders());
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("All");
  const [filterFulfillment, setFilterFulfillment] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(search.toLowerCase()) ||
      `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchPayment = filterPayment === "All" || o.paymentStatus === filterPayment;
    const matchFulfillment = filterFulfillment === "All" || o.fulfillmentStatus === filterFulfillment;
    return matchSearch && matchPayment && matchFulfillment;
  });

  return (
    <AdminLayout title="Orders">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, or email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-border focus:outline-none focus:border-[hsl(var(--brand-charcoal))] bg-white"
          />
        </div>
        <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}
          className="text-xs border border-border px-3 py-2.5 bg-white focus:outline-none min-h-[44px]">
          <option value="All">All Payments</option>
          {["Pending","Paid","Failed","Refunded"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filterFulfillment} onChange={(e) => setFilterFulfillment(e.target.value)}
          className="text-xs border border-border px-3 py-2.5 bg-white focus:outline-none min-h-[44px]">
          <option value="All">All Fulfillment</option>
          {["Awaiting Fulfillment","Sent to CJ","Shipped","Delivered","Fulfillment Error"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <span className="text-xs text-muted-foreground">{filtered.length} order(s)</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No orders found. Place a test order from the storefront.</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-border bg-[hsl(var(--muted))]/30">
              <tr>
                {["Order","Date","Customer","Amount","Payment","Fulfillment","CJ Order",""].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-[hsl(var(--muted))]/20 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs font-semibold">{order.orderNumber}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <p className="text-xs font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-[10px] text-muted-foreground">{order.customer.email}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-xs">{formatPrice(order.total)}</td>
                  <td className="py-3 px-4">{statusBadge(order.paymentStatus)}</td>
                  <td className="py-3 px-4">{statusBadge(order.fulfillmentStatus)}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">
                    {order.fulfillment.cjOrderId || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => setSelectedOrder(order)} className="text-xs text-[hsl(var(--brand-terracotta))] hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed inset-x-4 top-8 bottom-8 max-w-2xl mx-auto bg-white z-50 overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium">Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground text-xs">Close ✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer.email}</p>
                  <p className="text-xs text-muted-foreground">{selectedOrder.customer.phone}</p>
                </div>
                <div className="border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Shipping Address</p>
                  <p className="text-xs">{selectedOrder.customer.addressLine1}</p>
                  {selectedOrder.customer.addressLine2 && <p className="text-xs">{selectedOrder.customer.addressLine2}</p>}
                  <p className="text-xs">{selectedOrder.customer.city}, {selectedOrder.customer.state} {selectedOrder.customer.postalCode}</p>
                </div>
              </div>

              <div className="border border-border p-3">
                <p className="text-xs text-muted-foreground mb-2">Items</p>
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                    <span>{item.productName} — {item.color} / {item.size} × {item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-semibold pt-2 mt-1 border-t border-border">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Payment</p>
                  <p className="font-medium">{selectedOrder.paymentStatus}</p>
                  {selectedOrder.payment && (
                    <>
                      <p className="text-xs text-muted-foreground">{selectedOrder.payment.provider}</p>
                      <p className="text-xs font-mono text-muted-foreground">{selectedOrder.payment.reference}</p>
                      <p className="text-xs text-muted-foreground">Webhook verified: {selectedOrder.payment.webhookVerified ? "Yes" : "No"}</p>
                    </>
                  )}
                </div>
                <div className="border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-1">Fulfillment</p>
                  <p className="font-medium">{selectedOrder.fulfillmentStatus}</p>
                  {selectedOrder.fulfillment.cjOrderId && <p className="text-xs font-mono text-muted-foreground">CJ: {selectedOrder.fulfillment.cjOrderId}</p>}
                  {selectedOrder.fulfillment.trackingNumber && <p className="text-xs text-muted-foreground">Tracking: {selectedOrder.fulfillment.trackingNumber}</p>}
                  {selectedOrder.fulfillment.errorMessage && (
                    <div className="mt-1 flex items-start gap-1 text-red-600">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{selectedOrder.fulfillment.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.fulfillmentStatus === "Fulfillment Error" && (
                <button className="btn-primary text-xs w-full py-3 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Fulfillment (requires backend)
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
