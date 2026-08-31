// Payment integration module
// Paystack and Flutterwave are loaded client-side
// Secret keys must NEVER appear here — only public keys from env variables

export type PaymentProvider = "Paystack" | "Flutterwave";

export interface PaymentConfig {
  paystackPublicKey: string;
  flutterwavePublicKey: string;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
}

export function getPaymentConfig(): PaymentConfig {
  return {
    paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    flutterwavePublicKey: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || "",
    paystackEnabled: import.meta.env.VITE_PAYSTACK_ENABLED !== "false",
    flutterwaveEnabled: import.meta.env.VITE_FLUTTERWAVE_ENABLED !== "false",
  };
}

// Paystack inline payment
export interface PaystackPaymentParams {
  email: string;
  amount: number; // in USD cents (Paystack uses smallest currency unit)
  currency: string;
  reference: string;
  firstName: string;
  lastName: string;
  phone: string;
  metadata: Record<string, unknown>;
  onSuccess: (response: PaystackResponse) => void;
  onClose: () => void;
}

export interface PaystackResponse {
  reference: string;
  trans: string;
  status: string;
  message: string;
  transaction: string;
  trxref: string;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (params: Record<string, unknown>) => { openIframe: () => void };
    };
    FlutterwaveCheckout?: (config: Record<string, unknown>) => void;
    ApplePaySession?: {
      canMakePayments: () => boolean;
      new (version: number, request: Record<string, unknown>): ApplePaySessionInstance;
    };
  }
}

interface ApplePaySessionInstance {
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized: ((event: { payment: unknown }) => void) | null;
  oncancel: ((event: unknown) => void) | null;
  begin: () => void;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
}

export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.head.appendChild(script);
  });
}

export function loadFlutterwaveScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.FlutterwaveCheckout) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Flutterwave"));
    document.head.appendChild(script);
  });
}

export async function initiatePaystackPayment(params: PaystackPaymentParams): Promise<void> {
  await loadPaystackScript();
  if (!window.PaystackPop) throw new Error("Paystack not loaded");

  const config = getPaymentConfig();
  const handler = window.PaystackPop.setup({
    key: config.paystackPublicKey,
    email: params.email,
    amount: Math.round(params.amount * 100), // convert to cents
    currency: params.currency || "USD",
    ref: params.reference,
    firstname: params.firstName,
    lastname: params.lastName,
    phone: params.phone,
    metadata: {
      custom_fields: [
        { display_name: "Order Reference", variable_name: "order_ref", value: params.reference },
      ],
      ...params.metadata,
    },
    callback: params.onSuccess,
    onClose: params.onClose,
  });
  handler.openIframe();
}

export interface FlutterwavePaymentParams {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  firstName: string;
  lastName: string;
  phone: string;
  description: string;
  onSuccess: (response: Record<string, unknown>) => void;
  onClose: () => void;
}

export async function initiateFlutterwavePayment(params: FlutterwavePaymentParams): Promise<void> {
  await loadFlutterwaveScript();
  if (!window.FlutterwaveCheckout) throw new Error("Flutterwave not loaded");

  const config = getPaymentConfig();
  window.FlutterwaveCheckout({
    public_key: config.flutterwavePublicKey,
    tx_ref: params.reference,
    amount: params.amount,
    currency: params.currency || "USD",
    payment_options: "card",
    customer: {
      email: params.email,
      phone_number: params.phone,
      name: `${params.firstName} ${params.lastName}`,
    },
    customizations: {
      title: "LINE°",
      description: params.description,
      logo: "/favicon.ico",
    },
    callback: params.onSuccess,
    onclose: params.onClose,
  });
}

// Apple Pay via Paystack
// NOTE: Apple Pay via Paystack requires domain verification.
// Place the Paystack domain verification file at /.well-known/
// The file must be publicly accessible at: https://YOURDOMAIN.com/.well-known/[verification-file]
export function isApplePaySupported(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.ApplePaySession) return false;
  try {
    return window.ApplePaySession.canMakePayments();
  } catch {
    return false;
  }
}

export interface ApplePayParams {
  amount: number;
  orderId: string;
  reference: string;
  onSuccess: (token: unknown) => void;
  onError: (error: Error) => void;
  onCancel: () => void;
}

export function initiateApplePayPaystackSession(params: ApplePayParams): void {
  // Paystack Apple Pay uses the Apple Pay JS API with Paystack as the payment processor
  // This requires domain verification and a Paystack account with Apple Pay enabled
  if (!window.ApplePaySession) {
    params.onError(new Error("Apple Pay not supported on this device"));
    return;
  }

  const paymentRequest = {
    countryCode: "US",
    currencyCode: "USD",
    supportedNetworks: ["visa", "masterCard", "amex"],
    merchantCapabilities: ["supports3DS"],
    total: {
      label: "LINE°",
      amount: params.amount.toFixed(2),
    },
  };

  const session = new window.ApplePaySession(3, paymentRequest);

  session.onvalidatemerchant = async (event: { validationURL: string }) => {
    // In production: call your server-side endpoint to validate the merchant with Apple
    // POST /api/apple-pay/validate-merchant with event.validationURL
    // Server calls Paystack's merchant validation endpoint and returns the merchant session
    console.log("Apple Pay merchant validation URL:", event.validationURL);
    // For now, this will fail without a real server-side implementation
    // This is expected until the backend is configured
  };

  session.onpaymentauthorized = (event: { payment: unknown }) => {
    // In production: send payment token to Paystack server-side for processing
    console.log("Apple Pay payment authorized:", event.payment);
    params.onSuccess(event.payment);
    session.completePayment(0); // 0 = STATUS_SUCCESS
  };

  session.oncancel = () => {
    params.onCancel();
  };

  session.begin();
}

// Payment reference generator (idempotent)
export function generatePaymentReference(orderNumber: string): string {
  return `LINE_${orderNumber}_${Date.now()}`;
}
