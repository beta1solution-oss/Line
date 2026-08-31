import { useState } from "react";
import { Mail, MessageSquare, Clock } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-[900px] mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide text-center mb-2">Contact Us</h1>
          <p className="text-muted-foreground text-sm text-center mb-10">We're here to help. Expect a response within 24 hours.</p>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact info */}
            <div className="space-y-5">
              {[
                { Icon: Mail, label: "Email", value: "support@linedegree.com", sub: "For general inquiries" },
                { Icon: Mail, label: "Returns", value: "returns@linedegree.com", sub: "For return requests" },
                { Icon: Clock, label: "Hours", value: "Mon–Fri, 9am–5pm ET", sub: "Response within 24 hrs" },
                { Icon: MessageSquare, label: "TikTok DMs", value: "@linedegree", sub: "For styling questions" },
              ].map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex gap-3">
                  <div className="w-9 h-9 flex-shrink-0 bg-[hsl(var(--brand-terracotta))]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[hsl(var(--brand-terracotta))]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider uppercase">{label}</p>
                    <p className="text-sm font-medium mt-0.5">{value}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="border border-border p-8 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-[hsl(var(--brand-terracotta))]/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-5 h-5 text-[hsl(var(--brand-terracotta))]" />
                  </div>
                  <h2 className="font-display text-xl font-light mb-2">Message received</h2>
                  <p className="text-sm text-muted-foreground">We'll get back to you at {form.email} within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Name *</label>
                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Email *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Subject</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option>Order inquiry</option>
                      <option>Return or exchange</option>
                      <option>Product question</option>
                      <option>Shipping question</option>
                      <option>Payment issue</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wider uppercase block mb-1.5">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help…"
                      rows={5}
                      className="w-full border border-border px-4 py-3 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary text-xs px-8 py-3.5 disabled:opacity-60">
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
