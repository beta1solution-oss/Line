import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Package, CheckCircle, Truck, MapPin, Clock, ExternalLink } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order } from "@/types";

const TRACKING_STEPS = [
  { key: "Order Confirmed", icon: CheckCircle, label: "Order Confirmed" },
  { key: "Processing", icon: Package, label: "Processing" },
  { key: "Shipped", icon: Truck, label: "Shipped" },
  { key: "In Transit", icon: MapPin, label: "In Transit" },
  { key: "Delivered", icon: CheckCircle, label: "Delivered" },
];

function getStepIndex(fulfillmentStatus: string): number {
  switch (fulfillmentStatus) {
    case "Awaiting Fulfillment": return 0;
    case "Sent to CJ":
    case "CJ Processing": return 1;
    case "Shipped": return 2;
    case "In Transit": return 3;
    case "Delivered": return 4;
    default: return 0;
  }
}

function OrderTrackingCard({ order }: { order: Order }) {
  const currentStep = getStepIndex(order.fulfillmentStatus);

  return (
    <div className="border border-border p-5 lg:p-7 mb-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="font-display text-xl font-light tracking-wide">
            Order #{order.orderNumber}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 ${
            order.paymentStatus === "Paid" ? "bg-green-50 text-green-700" :
            order.paymentStatus === "Pending" ? "bg-yellow-50 text-yellow-700" :
            "bg-red-50 text-red-700"
          }`}>
            Payment: {order.paymentStatus}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-[hsl(var(--muted))] text-muted-foreground">
            {order.fulfillmentStatus}
          </span>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="mb-7">
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-border" />
          <div
            className="absolute top-5 left-5 h-0.5 bg-[hsl(var(--brand-terracotta))] transition-all duration-700"
            style={{ width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
          />

          <div className="relative flex justify-between">
            {TRACKING_STEPS.map((step, i) => {
              const Icon = step.icon;
              const completed = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step.key} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all ${
                    completed
                      ? "bg-[hsl(var(--brand-terracotta))] border-[hsl(var(--brand-terracotta))]"
                      : "bg-white border-border"
                  } ${active ? "ring-4 ring-[hsl(var(--brand-terracotta))]/20" : ""}`}>
                    <Icon className={`w-4 h-4 ${completed ? "text-white" : "text-muted-foreground"}`} />
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${
                    completed ? "text-[hsl(var(--brand-terracotta))]" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tracking info */}
      {order.fulfillment.trackingNumber ? (
        <div className="bg-[hsl(var(--secondary))] p-4 mb-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono text-sm font-semibold">{order.fulfillment.trackingNumber}</p>
              {order.fulfillment.carrier && (
                <p className="text-xs text-muted-foreground mt-0.5">Carrier: {order.fulfillment.carrier}</p>
              )}
            </div>
            {order.fulfillment.trackingUrl && (
              <a
                href={order.fulfillment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--brand-terracotta))] hover:underline"
              >
                Track on carrier site <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          {order.fulfillment.estimatedDelivery && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Estimated delivery: {order.fulfillment.estimatedDelivery}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[hsl(var(--secondary))] p-4 mb-5 text-center">
          <p className="text-sm text-muted-foreground">
            {order.fulfillmentStatus === "Awaiting Fulfillment"
              ? "Your order is being prepared. Tracking information will appear here once your order ships."
              : order.fulfillmentStatus === "Fulfillment Error"
              ? "There was an issue with your order. Our team has been notified and will resolve this shortly."
              : "Tracking information will be updated once your order ships."}
          </p>
        </div>
      )}

      {/* Items */}
      <div>
        <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
          Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
        </h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-border last:border-0">
              <div className="w-12 h-14 bg-muted overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{item.productName}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping address */}
      <div className="mt-5 pt-4 border-t border-border">
        <h3 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-2">Shipping To</h3>
        <p className="text-sm">{order.customer.firstName} {order.customer.lastName}</p>
        <p className="text-sm text-muted-foreground">
          {order.customer.addressLine1}, {order.customer.city}, {order.customer.state} {order.customer.postalCode}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-sm font-semibold">Order Total</span>
        <span className="text-lg font-semibold">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const initialOrder = searchParams.get("order") || "";
  const [query, setQuery] = useState(initialOrder);
  const [searched, setSearched] = useState(!!initialOrder);
  const [result, setResult] = useState<Order | null | undefined>(
    initialOrder ? getOrderByNumber(initialOrder) : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = getOrderByNumber(query.trim().toUpperCase());
    setResult(order);
    setSearched(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide text-center mb-3">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-8">
            Enter your order number to see the latest status and tracking information.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. LNE-123456-001"
              className="flex-1 border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
            />
            <button type="submit" className="btn-primary text-xs px-6 flex items-center gap-2 min-w-[44px]">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Track</span>
            </button>
          </form>

          {searched && result && <OrderTrackingCard order={result} />}
          {searched && result === null && (
            <div className="text-center py-10 border border-border p-6 animate-fade-in">
              <p className="font-display text-xl font-light mb-2">Order not found</p>
              <p className="text-sm text-muted-foreground mb-4">
                Please check your order number and try again. Order numbers look like: LNE-123456-001
              </p>
              <Link to="/contact" className="btn-ghost text-xs">Contact Support</Link>
            </div>
          )}

          {!searched && (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Your order details will appear here</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
