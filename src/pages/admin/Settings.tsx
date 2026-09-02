import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { getSiteSettings, saveSiteSettings, type SiteSettings } from "@/lib/siteSettings";
import { getPaymentConfig } from "@/lib/payment";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff, Save, Loader2, Upload, Plus, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";

type PaymentProviderConfig = {
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  paystackPublicKey: string;
  flutterwavePublicKey: string;
};

export default function AdminSettings() {
  const config = getPaymentConfig();
  const [paystackEnabled, setPaystackEnabled] = useState(config.paystackEnabled);
  const [flutterwaveEnabled, setFlutterwaveEnabled] = useState(config.flutterwaveEnabled);
  const [showPaystack, setShowPaystack] = useState(false);
  const [showFlutterwave, setShowFlutterwave] = useState(false);

  // Site settings
  const [settings, setSettings] = useState<SiteSettings>({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Social links
  const [tiktok, setTiktok] = useState("");
  const [instagram, setInstagram] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");

  // Announcement messages
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // Site images
  const [heroImage, setHeroImage] = useState("");
  const [editorial1, setEditorial1] = useState("");
  const [editorial2, setEditorial2] = useState("");
  const [tiktokBanner, setTiktokBanner] = useState("");

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      setTiktok(s.socialLinks?.tiktok || "");
      setInstagram(s.socialLinks?.instagram || "");
      setPinterest(s.socialLinks?.pinterest || "");
      setFacebook(s.socialLinks?.facebook || "");
      setTiktokHandle(s.tiktokHandle || "@linedegree");
      setMessages(s.announcementMessages || [
        "Free US shipping on orders over $75 — no code needed",
        "New arrivals dropping weekly — follow us on TikTok",
        "Free returns within 30 days — no questions asked",
      ]);
      setHeroImage(s.heroImage || "");
      setEditorial1(s.editorial1Image || "");
      setEditorial2(s.editorial2Image || "");
      setTiktokBanner(s.tiktokBannerImage || "");
      setSettingsLoading(false);
    });
  }, []);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    await saveSiteSettings({
      socialLinks: { tiktok, instagram, pinterest, facebook },
      tiktokHandle,
      announcementMessages: messages,
      heroImage: heroImage || undefined,
      editorial1Image: editorial1 || undefined,
      editorial2Image: editorial2 || undefined,
      tiktokBannerImage: tiktokBanner || undefined,
    });
    toast.success("Settings saved — refresh the storefront to see changes");
    setSettingsSaving(false);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop() || "jpg";
    const path = `site/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type });
    if (error) { toast.error("Upload failed"); return; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setter(data.publicUrl);
    toast.success("Image uploaded");
    e.target.value = "";
  };

  const inputCls = "w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors bg-white";

  const ImageField = ({
    label, value, setter, hint
  }: { label: string; value: string; setter: (v: string) => void; hint?: string }) => (
    <div>
      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">{label}</label>
      {hint && <p className="text-xs text-muted-foreground mb-2">{hint}</p>}
      {value && (
        <div className="relative w-full aspect-video bg-muted overflow-hidden mb-2 max-h-32">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button onClick={() => setter("")} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <input value={value} onChange={(e) => setter(e.target.value)} placeholder="Paste image URL…" className={`${inputCls} flex-1`} />
        <label className="border border-border px-3 py-2.5 text-xs cursor-pointer hover:border-[hsl(var(--brand-charcoal))] transition-colors flex items-center gap-1.5 flex-shrink-0">
          <Upload className="w-3.5 h-3.5" /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setter)} />
        </label>
      </div>
    </div>
  );

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl space-y-6">

        {/* Social Links */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-4">Social Links</h2>
          <p className="text-xs text-muted-foreground mb-4">
            These update instantly in the footer and TikTok section when saved.
          </p>
          <div className="space-y-3">
            {[
              { label: "TikTok URL", value: tiktok, setter: setTiktok, placeholder: "https://tiktok.com/@yourhandle" },
              { label: "TikTok Handle", value: tiktokHandle, setter: setTiktokHandle, placeholder: "@yourhandle" },
              { label: "Instagram URL", value: instagram, setter: setInstagram, placeholder: "https://instagram.com/yourhandle" },
              { label: "Pinterest URL", value: pinterest, setter: setPinterest, placeholder: "https://pinterest.com/yourhandle" },
              { label: "Facebook URL", value: facebook, setter: setFacebook, placeholder: "https://facebook.com/yourpage" },
            ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">{label}</label>
                <input value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className={inputCls} />
              </div>
            ))}
          </div>
        </div>

        {/* Announcement Bar Messages */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">Announcement Bar Messages</h2>
          <p className="text-xs text-muted-foreground mb-4">These scroll in a marquee across the top of every page.</p>
          <div className="space-y-2 mb-3">
            {messages.map((msg, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={msg}
                  onChange={(e) => setMessages(messages.map((m, idx) => idx === i ? e.target.value : m))}
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={() => setMessages(messages.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-red-500 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add a new message…"
              className={`${inputCls} flex-1`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newMessage.trim()) {
                  setMessages([...messages, newMessage.trim()]);
                  setNewMessage("");
                }
              }}
            />
            <button
              onClick={() => { if (newMessage.trim()) { setMessages([...messages, newMessage.trim()]); setNewMessage(""); } }}
              className="btn-primary text-xs px-4 py-2.5"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Homepage Images */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">Homepage Images</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Upload or paste URLs to replace images across the homepage. Changes take effect after saving.
          </p>
          <div className="space-y-5">
            <ImageField
              label="Hero Banner (main background)"
              value={heroImage}
              setter={setHeroImage}
              hint="Large 16:9 image shown in the hero section"
            />
            <ImageField
              label="Left Editorial Image"
              value={editorial1}
              setter={setEditorial1}
              hint="Large 4:3 editorial image on the left"
            />
            <ImageField
              label="Right Editorial Image"
              value={editorial2}
              setter={setEditorial2}
              hint="Smaller 3:4 image on the right"
            />
            <ImageField
              label="TikTok Section Banner"
              value={tiktokBanner}
              setter={setTiktokBanner}
              hint="Background for the TikTok/social section"
            />
          </div>
        </div>

        {/* Payment providers */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-4">Payment Providers</h2>

          {/* Paystack */}
          <div className="border border-border p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-sm">Paystack</h3>
                <span className="text-[10px] font-bold text-[#00C3F7] bg-[#00C3F7]/10 px-2 py-0.5 mt-0.5 inline-block">PAYSTACK</span>
              </div>
              <button
                onClick={() => setPaystackEnabled(!paystackEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${paystackEnabled ? "bg-[hsl(var(--brand-terracotta))]" : "bg-[hsl(var(--muted))]"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${paystackEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <label className="text-xs font-semibold tracking-wider uppercase block mb-1.5 text-muted-foreground">Public Key</label>
            <div className="relative">
              <input
                type={showPaystack ? "text" : "password"}
                defaultValue={config.paystackPublicKey}
                readOnly
                placeholder="Set via VITE_PAYSTACK_PUBLIC_KEY env var"
                className="w-full border border-border px-4 py-2.5 text-sm pr-10 focus:outline-none font-mono bg-[hsl(var(--muted))]/30"
              />
              <button onClick={() => setShowPaystack(!showPaystack)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPaystack ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Set via: <code className="bg-muted px-1">VITE_PAYSTACK_PUBLIC_KEY</code> in your .env file</p>
            <p className="text-xs text-muted-foreground mt-1">Apple Pay: verified domain at <code className="bg-muted px-1">/.well-known/</code> (already configured)</p>
          </div>

          {/* Flutterwave */}
          <div className="border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-medium text-sm">Flutterwave</h3>
                <span className="text-[10px] font-bold text-[#F5A623] bg-[#F5A623]/10 px-2 py-0.5 mt-0.5 inline-block">FLUTTERWAVE</span>
              </div>
              <button
                onClick={() => setFlutterwaveEnabled(!flutterwaveEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${flutterwaveEnabled ? "bg-[hsl(var(--brand-terracotta))]" : "bg-[hsl(var(--muted))]"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${flutterwaveEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <label className="text-xs font-semibold tracking-wider uppercase block mb-1.5 text-muted-foreground">Public Key</label>
            <div className="relative">
              <input
                type={showFlutterwave ? "text" : "password"}
                defaultValue={config.flutterwavePublicKey}
                readOnly
                placeholder="Set via VITE_FLUTTERWAVE_PUBLIC_KEY env var"
                className="w-full border border-border px-4 py-2.5 text-sm pr-10 focus:outline-none font-mono bg-[hsl(var(--muted))]/30"
              />
              <button onClick={() => setShowFlutterwave(!showFlutterwave)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showFlutterwave ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Set via: <code className="bg-muted px-1">VITE_FLUTTERWAVE_PUBLIC_KEY</code> in your .env file</p>
          </div>
        </div>

        {/* Environment variables guide */}
        <div className="bg-white border border-border p-5">
          <h2 className="font-medium text-sm mb-3">Environment Variables Guide</h2>
          <div className="space-y-1 text-xs font-mono text-muted-foreground bg-[hsl(var(--muted))]/30 p-3 rounded">
            <p className="text-foreground font-semibold"># Add to your .env file (frontend — safe to expose)</p>
            <p>VITE_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx</p>
            <p>VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxxxxxxxxx</p>
            <p>VITE_PAYSTACK_ENABLED=true</p>
            <p>VITE_FLUTTERWAVE_ENABLED=true</p>
            <p className="text-foreground font-semibold mt-2"># Server-side only — NEVER expose to frontend</p>
            <p>PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx</p>
            <p>FLUTTERWAVE_SECRET_KEY=FLWSECK-xxxxxxxxxx</p>
            <p>CJ_API_KEY=your_cj_api_key</p>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={settingsSaving}
          className="btn-primary text-xs px-6 py-3 flex items-center gap-2 disabled:opacity-60"
        >
          {settingsSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save All Settings
        </button>
      </div>
    </AdminLayout>
  );
}
