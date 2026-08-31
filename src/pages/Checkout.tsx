import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronDown, Lock, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { formatPrice, US_STATES } from "@/lib/utils";
import {
  initiatePaystackPayment,
  initiateFlutterwavePayment,
  initiateApplePayPaystackSession,
  getPaymentConfig,
  isApplePaySupported,
  generatePaymentReference,
} from "@/lib/payment";
import { saveAddress, getSavedAddress } from "@/lib/orders";
import type { ShippingAddress } from "@/types";
import { toast } from "sonner";

const checkoutSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  country: z.string().min(2, "Country is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "ZIP code is required").max(10),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, total, clear } = useCart();
  const { placeOrder, recordPayment } = useOrders();
  const [paymentStep, setPaymentStep] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"Paystack" | "Flutterwave" | null>(null);
  const [processing, setProcessing] = useState(false);
  const [applePayAvailable] = useState(isApplePaySupported());
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const config = getPaymentConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "United States" },
  });

  // Prefill saved address
  useEffect(() => {
    const saved = getSavedAddress();
    if (saved) {
      setValue("email", saved.email);
      setValue("firstName", saved.firstName);
      setValue("lastName", saved.lastName);
      setValue("phone", saved.phone || "");
      setValue("addressLine1", saved.addressLine1);
      setValue("addressLine2", saved.addressLine2 || "");
      setValue("city", saved.city);
      setValue("state", saved.state);
      setValue("postalCode", saved.postalCode);
    }
  }, [setValue]);

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="font-display text-2xl font-light mb-4">Your bag is empty</p>
            <Link to="/shop" className="btn-primary text-xs px-8">Shop the Collection</Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmitAddress = (data: CheckoutFormData) => {
    const address: ShippingAddress = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      country: data.country,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
    };
    saveAddress(address);

    // Create pending order
    const order = placeOrder(cart.items, address, subtotal);
    setCurrentOrderId(order.id);
    setPaymentStep(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaystackPayment = async () => {
    if (!currentOrderId) return;
    setProcessing(true);
    const ref = generatePaymentReference(`ORD-${currentOrderId.slice(-8)}`);
    const { placeOrder: _p, ..._ } = { placeOrder: null }; // suppress unused
    void _;

    // Get order from state
    const orders = JSON.parse(localStorage.getItem("line_orders") || "[]");
    const order = orders.find((o: { id: string }) => o.id === currentOrderId);
    if (!order) { setProcessing(false); return; }

    try {
      await initiatePaystackPayment({
        email: order.customer.email,
        amount: total,
        currency: "USD",
        reference: ref,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        phone: order.customer.phone,
        metadata: { orderId: currentOrderId, orderNumber: order.orderNumber },
        onSuccess: (response) => {
          // NOTE: In production, payment verification MUST happen server-side via webhook.
          // The frontend success callback alone is NOT sufficient to mark an order as paid.
          // This mock records the payment — the real flow requires webhook verification.
          recordPayment(currentOrderId, {
            provider: "Paystack",
            transactionId: response.transaction || response.trans,
            reference: response.reference,
            amount: total,
            currency: "USD",
            status: "Paid",
            webhookVerified: false, // Will be set true after server-side webhook verification
            createdAt: new Date().toISOString(),
          });
          clear();
          navigate(`/order-confirmation/${currentOrderId}`);
        },
        onClose: () => {
          setProcessing(false);
          toast.info("Payment cancelled");
        },
      });
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to load payment. Please try again.");
      console.error("Paystack error:", error);
    }
  };

  const handleFlutterwavePayment = async () => {
    if (!currentOrderId) return;
    setProcessing(true);
    const ref = generatePaymentReference(`ORD-${currentOrderId.slice(-8)}`);

    const orders = JSON.parse(localStorage.getItem("line_orders") || "[]");
    const order = orders.find((o: { id: string }) => o.id === currentOrderId);
    if (!order) { setProcessing(false); return; }

    try {
      await initiateFlutterwavePayment({
        email: order.customer.email,
        amount: total,
        currency: "USD",
        reference: ref,
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        phone: order.customer.phone,
        description: `LINE° Order — ${cart.items.length} item(s)`,
        onSuccess: (response) => {
          recordPayment(currentOrderId, {
            provider: "Flutterwave",
            transactionId: String((response as { transaction_id?: string | number }).transaction_id || ref),
            reference: ref,
            amount: total,
            currency: "USD",
            status: "Paid",
            webhookVerified: false,
            createdAt: new Date().toISOString(),
          });
          clear();
          navigate(`/order-confirmation/${currentOrderId}`);
        },
        onClose: () => {
          setProcessing(false);
          toast.info("Payment cancelled");
        },
      });
    } catch (error) {
      setProcessing(false);
      toast.error("Failed to load payment. Please try again.");
      console.error("Flutterwave error:", error);
    }
  };

  const handleApplePay = () => {
    if (!currentOrderId) return;
    setProcessing(true);
    const ref = generatePaymentReference(`ORD-${currentOrderId.slice(-8)}`);
    initiateApplePayPaystackSession({
      amount: total,
      orderId: currentOrderId,
      reference: ref,
      onSuccess: (token) => {
        console.log("Apple Pay token received:", token);
        // In production: send token to server for Paystack processing
        toast.info("Apple Pay requires domain verification in production. Redirecting to card payment.");
        setProcessing(false);
        setSelectedProvider("Paystack");
      },
      onError: (error) => {
        setProcessing(false);
        toast.error(error.message || "Apple Pay failed. Please use card payment.");
      },
      onCancel: () => {
        setProcessing(false);
        toast.info("Apple Pay cancelled");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 py-8 lg:py-12">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
          {/* Brand */}
          <div className="text-center mb-8">
            <Link to="/">
              <span className="brand-name text-2xl tracking-[0.2em]">
                LINE<sup className="text-[0.55em] align-super">°</sup>
              </span>
            </Link>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            {/* ── Left: form ── */}
            <div className="lg:col-span-3">
              {!paymentStep ? (
                <form onSubmit={handleSubmit(onSubmitAddress)} noValidate>
                  <h2 className="font-display text-xl font-light tracking-wide mb-5">Shipping Information</h2>

                  {/* Email */}
                  <div className="mb-4">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                    />
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { field: "firstName" as const, label: "First Name", placeholder: "Jane" },
                      { field: "lastName" as const, label: "Last Name", placeholder: "Smith" },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">{label} *</label>
                        <input
                          {...register(field)}
                          placeholder={placeholder}
                          className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                        />
                        {errors[field] && (
                          <p className="text-destructive text-xs mt-1">{errors[field]?.message}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Phone *</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div className="mb-4">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Country *</label>
                    <div className="relative">
                      <select
                        {...register("country")}
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors appearance-none bg-white"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground" />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Address *</label>
                    <input
                      {...register("addressLine1")}
                      placeholder="123 Main Street"
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                    />
                    {errors.addressLine1 && (
                      <p className="text-destructive text-xs mt-1">{errors.addressLine1.message}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Apartment, Suite, etc. (optional)</label>
                    <input
                      {...register("addressLine2")}
                      placeholder="Apt 4B"
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">City *</label>
                      <input
                        {...register("city")}
                        placeholder="New York"
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                      />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">State *</label>
                      <div className="relative">
                        <select
                          {...register("state")}
                          className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors appearance-none bg-white"
                        >
                          <option value="">Select state</option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground" />
                      </div>
                      {errors.state && <p className="text-destructive text-xs mt-1">{errors.state.message}</p>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">ZIP / Postal Code *</label>
                    <input
                      {...register("postalCode")}
                      placeholder="10001"
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                    />
                    {errors.postalCode && <p className="text-destructive text-xs mt-1">{errors.postalCode.message}</p>}
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-xs">
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="animate-fade-in">
                  <h2 className="font-display text-xl font-light tracking-wide mb-5">Payment</h2>

                  <div className="border border-border p-4 mb-6 bg-[hsl(var(--muted))]/30">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3 text-[hsl(var(--brand-terracotta))]" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                  </div>

                  {/* Apple Pay - only shown when available */}
                  {applePayAvailable && config.paystackEnabled && (
                    <div className="mb-4">
                      <button
                        onClick={handleApplePay}
                        disabled={processing}
                        className="apple-pay-btn w-full"
                        aria-label="Pay with Apple Pay"
                      >
                        <svg viewBox="0 0 36 15" className="h-5 fill-white" aria-hidden="true">
                          <path d="M7.2 1.5c-.4.5-1.1.9-1.8.8-.1-.7.2-1.4.6-1.9.4-.5 1.2-.9 1.8-.9.1.8-.2 1.5-.6 2zM8 2.3c-1-.1-1.8.6-2.3.6S4.5 2.4 3.6 2.4C2.4 2.4 1.3 3.1.7 4.2c-1.3 2.2-.3 5.5.9 7.3.6.9 1.3 1.9 2.3 1.8.9 0 1.2-.6 2.3-.6s1.3.6 2.3.6c1 0 1.6-1 2.2-1.8.5-.8.8-1.5.9-1.6-.1 0-1.7-.7-1.7-2.5 0-1.6 1.3-2.4 1.4-2.4-.8-1.1-2-1.2-2.3-1.3zM15.3 1.3v11.4h1.8V9.2h2.5c2.3 0 3.9-1.6 3.9-3.9s-1.6-3.9-3.9-3.9h-4.3zm1.8 1.5h2.1c1.6 0 2.5.9 2.5 2.4 0 1.6-.9 2.4-2.5 2.4h-2.1V2.8zM28.5 12.8c1.1 0 2.1-.6 2.5-1.5h.1v1.4h1.6V7c0-1.7-1.3-2.7-3.2-2.7-1.8 0-3.2 1-3.2 2.5h1.5c.1-.7.7-1.2 1.6-1.2 1 0 1.5.5 1.5 1.4v.6l-2.1.1c-1.9.1-2.9.9-2.9 2.3.1 1.4 1.1 2.2 2.6 2.2-.1.6-.1.6 0 .6zm.5-1.3c-.9 0-1.4-.4-1.4-1.1s.5-1.1 1.7-1.2l1.8-.1v.6c0 1-.8 1.8-2.1 1.8zM33.6 16c1.7 0 2.5-.7 3.2-2.5l3.1-8.2h-1.8l-2.1 6.4h-.1l-2.1-6.4H32l3 8.4-.2.5c-.3.9-.7 1.2-1.5 1.2-.1 0-.4 0-.5 0v1.5c.2.1.5.1.8.1z" />
                        </svg>
                        &nbsp;Pay
                      </button>

                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-xs text-muted-foreground">or</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    </div>
                  )}

                  {/* Payment provider selection */}
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">
                      Pay with Card
                    </p>

                    {config.paystackEnabled && (
                      <button
                        onClick={() => setSelectedProvider("Paystack")}
                        className={`w-full border-2 p-4 text-left transition-all ${
                          selectedProvider === "Paystack"
                            ? "border-[hsl(var(--brand-charcoal))]"
                            : "border-border hover:border-[hsl(var(--brand-stone))]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedProvider === "Paystack" ? "border-[hsl(var(--brand-charcoal))]" : "border-border"
                            }`}>
                              {selectedProvider === "Paystack" && (
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand-charcoal))]" />
                              )}
                            </div>
                            <span className="text-sm font-medium">Pay with Paystack</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-[hsl(var(--muted))] px-2 py-0.5">
                            Visa · MC · Amex{applePayAvailable ? " ·  Pay" : ""}
                          </span>
                        </div>
                      </button>
                    )}

                    {config.flutterwaveEnabled && (
                      <button
                        onClick={() => setSelectedProvider("Flutterwave")}
                        className={`w-full border-2 p-4 text-left transition-all ${
                          selectedProvider === "Flutterwave"
                            ? "border-[hsl(var(--brand-charcoal))]"
                            : "border-border hover:border-[hsl(var(--brand-stone))]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              selectedProvider === "Flutterwave" ? "border-[hsl(var(--brand-charcoal))]" : "border-border"
                            }`}>
                              {selectedProvider === "Flutterwave" && (
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--brand-charcoal))]" />
                              )}
                            </div>
                            <span className="text-sm font-medium">Pay with Flutterwave</span>
                          </div>
                          <span className="text-xs text-muted-foreground bg-[hsl(var(--muted))] px-2 py-0.5">
                            Visa · MC · Amex
                          </span>
                        </div>
                      </button>
                    )}

                    {!config.paystackEnabled && !config.flutterwaveEnabled && (
                      <div className="border border-border p-4 bg-[hsl(var(--muted))]/30">
                        <p className="text-sm text-muted-foreground">
                          No payment providers are currently enabled. Please contact support.
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedProvider && (
                    <button
                      onClick={selectedProvider === "Paystack" ? handlePaystackPayment : handleFlutterwavePayment}
                      disabled={processing}
                      className="btn-primary w-full py-4 text-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {processing ? "Processing…" : `Pay ${formatPrice(total)} with ${selectedProvider}`}
                    </button>
                  )}

                  <button
                    onClick={() => setPaymentStep(false)}
                    className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                  >
                    ← Back to shipping
                  </button>
                </div>
              )}
            </div>

            {/* ── Right: Order summary ── */}
            <div className="lg:col-span-2">
              <div className="border border-border p-5 sticky top-24">
                <h3 className="font-display text-lg font-light tracking-wide mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-16 bg-muted overflow-hidden">
                          <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[hsl(var(--brand-charcoal))] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight line-clamp-2">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.color} / {item.size}</p>
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
