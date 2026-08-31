import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Truck, Mail } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getOrderById } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <p className="font-display text-2xl font-light mb-4">Order not found</p>
            <Link to="/shop" className="btn-primary text-xs px-8">Continue Shopping</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-10 lg:py-16">
        <div className="max-w-2xl mx-auto px-4 lg:px-8">
          {/* Confirmation header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--brand-terracotta))]/10 mb-4">
              <CheckCircle className="w-8 h-8 text-[hsl(var(--brand-terracotta))]" />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-2">
              Order Confirmed
            </h1>
            <p className="text-muted-foreground text-sm">
              Thank you, {order.customer.firstName}. Your order has been received.
            </p>
            <p className="mt-2 font-medium text-sm">Order #{order.orderNumber}</p>
          </div>

          {/* What happens next */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-[hsl(var(--secondary))] border border-border">
            {[
              { Icon: Mail, label: "Confirmation email", sub: "Sent to " + order.customer.email },
              { Icon: Package, label: "We're preparing your order", sub: "Usually 1–2 business days" },
              { Icon: Truck, label: "Then it ships", sub: "7–14 business days to US" },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--brand-terracotta))]" />
                <p className="text-xs font-medium leading-tight">{label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Order details */}
          <div className="border border-border p-5 mb-5">
            <h2 className="font-display text-lg font-light tracking-wide mb-4">Order Details</h2>
            <div className="space-y-3 mb-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 py-3 border-b border-border last:border-0">
                  <div className="w-14 h-16 bg-muted overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.color} / {item.size} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-sm border-t border-border pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-1 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="border border-border p-5 mb-5">
            <h2 className="font-display text-lg font-light tracking-wide mb-3">Shipping To</h2>
            <div className="text-sm text-muted-foreground space-y-0.5">
              <p className="text-foreground font-medium">{order.customer.firstName} {order.customer.lastName}</p>
              <p>{order.customer.addressLine1}{order.customer.addressLine2 ? `, ${order.customer.addressLine2}` : ""}</p>
              <p>{order.customer.city}, {order.customer.state} {order.customer.postalCode}</p>
              <p>{order.customer.country}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="border border-border p-5 mb-8">
            <h2 className="font-display text-lg font-light tracking-wide mb-3">Payment</h2>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {order.payment?.provider || "Card"} — {order.payment?.reference?.slice(-8) || "—"}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 ${
                order.paymentStatus === "Paid"
                  ? "bg-green-50 text-green-700"
                  : "bg-[hsl(var(--muted))] text-muted-foreground"
              }`}>
                {order.paymentStatus}
              </span>
            </div>
            {!order.payment?.webhookVerified && order.paymentStatus === "Paid" && (
              <p className="text-xs text-muted-foreground mt-2">
                Payment verification pending. Your order will begin processing once confirmed.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/tracking?order=${order.orderNumber}`}
              className="btn-secondary flex-1 text-xs py-3.5"
            >
              Track Order
            </Link>
            <Link to="/shop" className="btn-primary flex-1 text-xs py-3.5">
              Continue Shopping
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Questions? <Link to="/contact" className="underline hover:text-foreground">Contact us</Link> or{" "}
            <Link to="/faq" className="underline hover:text-foreground">view FAQ</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
