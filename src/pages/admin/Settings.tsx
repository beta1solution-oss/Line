import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getPaymentConfig } from "@/lib/payment";
import { Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const config = getPaymentConfig();
  const [paystackKey, setPaystackKey] = useState(config.paystackPublicKey || "");
  const [flutterwaveKey, setFlutterwaveKey] = useState(config.flutterwavePublicKey || "");
  const [paystackEnabled, setPaystackEnabled] = useState(config.paystackEnabled);
  const [flutterwaveEnabled, setFlutterwaveEnabled] = useState(config.flutterwaveEnabled);
  const [showPaystack, setShowPaystack] = useState(false);
  const [showFlutterwave, setShowFlutterwave] = useState(false);

  const handleSave = () => {
    toast.info("Settings are managed via environment variables in production. Add keys to your .env file.");
  };

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">
        {/* Payment providers */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-4">Payment Providers</h2>

          {/* Paystack */}
          <div className="border border-border p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Paystack</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">Enabled</span>
                <button
                  onClick={() => setPaystackEnabled(!paystackEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${paystackEnabled ? "bg-[hsl(var(--brand-terracotta))]" : "bg-[hsl(var(--muted))]"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${paystackEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>
            <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Public Key</label>
            <div className="relative">
              <input
                type={showPaystack ? "text" : "password"}
                value={paystackKey}
                onChange={(e) => setPaystackKey(e.target.value)}
                placeholder="pk_live_xxxxxxxx or pk_test_xxxxxxxx"
                className="w-full border border-border px-4 py-2.5 text-sm pr-10 focus:outline-none font-mono"
              />
              <button onClick={() => setShowPaystack(!showPaystack)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPaystack ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Set via: <code className="bg-muted px-1">VITE_PAYSTACK_PUBLIC_KEY</code></p>
            <p className="text-xs text-muted-foreground mt-1">Apple Pay: requires domain verification file at <code className="bg-muted px-1">/.well-known/</code></p>
          </div>

          {/* Flutterwave */}
          <div className="border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-sm">Flutterwave</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-muted-foreground">Enabled</span>
                <button
                  onClick={() => setFlutterwaveEnabled(!flutterwaveEnabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${flutterwaveEnabled ? "bg-[hsl(var(--brand-terracotta))]" : "bg-[hsl(var(--muted))]"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${flutterwaveEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
            </div>
            <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Public Key</label>
            <div className="relative">
              <input
                type={showFlutterwave ? "text" : "password"}
                value={flutterwaveKey}
                onChange={(e) => setFlutterwaveKey(e.target.value)}
                placeholder="FLWPUBK_TEST-xxxxxxxx"
                className="w-full border border-border px-4 py-2.5 text-sm pr-10 focus:outline-none font-mono"
              />
              <button onClick={() => setShowFlutterwave(!showFlutterwave)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showFlutterwave ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Set via: <code className="bg-muted px-1">VITE_FLUTTERWAVE_PUBLIC_KEY</code></p>
          </div>
        </div>

        {/* CJ Dropshipping */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">CJ Dropshipping</h2>
          <p className="text-xs text-muted-foreground mb-3">CJ credentials must be stored server-side only. Never expose CJ API keys in frontend code.</p>
          <div className="space-y-2 text-xs text-muted-foreground font-mono bg-[hsl(var(--muted))]/30 p-3">
            <p>CJ_API_KEY=your_cj_api_key (server-side only)</p>
            <p>CJ_EMAIL=your_cj_email (server-side only)</p>
          </div>
        </div>

        {/* Vercel / .well-known */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">Apple Pay Domain Verification</h2>
          <p className="text-xs text-muted-foreground mb-3">
            The project is configured to serve files from <code className="bg-muted px-1">/.well-known/</code> on Vercel.
            After deploying, place your Paystack Apple Pay domain verification file in the <code className="bg-muted px-1">public/.well-known/</code> directory.
          </p>
          <div className="bg-[hsl(var(--muted))]/30 p-3 text-xs font-mono text-muted-foreground space-y-1">
            <p>File location: public/.well-known/[verification-file]</p>
            <p>Served at: https://yourdomain.com/.well-known/[verification-file]</p>
          </div>
        </div>

        {/* Environment variables guide */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">Environment Variables</h2>
          <div className="space-y-1 text-xs font-mono text-muted-foreground bg-[hsl(var(--muted))]/30 p-3">
            <p className="text-foreground font-semibold"># Frontend (safe to expose)</p>
            <p>VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxx</p>
            <p>VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_xxx</p>
            <p>VITE_PAYSTACK_ENABLED=true</p>
            <p>VITE_FLUTTERWAVE_ENABLED=true</p>
            <p className="text-foreground font-semibold mt-2"># Server-side only (NEVER expose to frontend)</p>
            <p>PAYSTACK_SECRET_KEY=sk_live_xxx</p>
            <p>FLUTTERWAVE_SECRET_KEY=FLWSECK_xxx</p>
            <p>CJ_API_KEY=xxx</p>
            <p>CJ_EMAIL=xxx</p>
          </div>
        </div>

        <button onClick={handleSave} className="btn-primary text-xs px-6 py-3 flex items-center gap-2">
          <Save className="w-3.5 h-3.5" /> Save Settings
        </button>
      </div>
    </AdminLayout>
  );
}
