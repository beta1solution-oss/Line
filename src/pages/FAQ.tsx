import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const FAQ_DATA = [
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does shipping take?", a: "Standard delivery to US addresses takes 7–14 business days from the date your order is placed. Once your order ships, you'll receive tracking information via email." },
      { q: "Do you offer free shipping?", a: "Yes — free standard shipping on all US orders over $75. Orders under $75 ship for a flat $7.99." },
      { q: "Can I change or cancel my order?", a: "We process orders quickly. Please contact us within 1 hour of placing your order if you need to make changes. Once an order is in fulfillment, we're unable to make changes." },
      { q: "Do you ship internationally?", a: "Currently we ship to the United States and Canada. We're expanding to more countries soon — follow us on TikTok for updates." },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "What is your return policy?", a: "We offer free returns within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached." },
      { q: "How do I start a return?", a: "Contact us at returns@linedegree.com with your order number and reason for return. We'll send you a prepaid return label within 1–2 business days." },
      { q: "When will I get my refund?", a: "Refunds are processed within 3–5 business days of receiving your return. You'll see the credit on your original payment method within 5–10 business days." },
      { q: "Can I exchange for a different size?", a: "Yes, exchanges are available for the same item in a different size or color, subject to availability. Contact us to arrange an exchange." },
    ],
  },
  {
    category: "Products & Sizing",
    items: [
      { q: "How do I find my size?", a: "We have a detailed size guide available on every product page. We recommend measuring yourself and comparing to our size chart. When between sizes, we note whether to size up or down on each product." },
      { q: "Are your products true to size?", a: "Each product page includes specific fit notes. Most of our oversized pieces are intentionally cut larger — we always describe the fit clearly so you know what to expect." },
      { q: "What materials do you use?", a: "Each product lists its exact material composition on the product page. We focus on fabrics that feel good and hold their shape: viscose blends, linen-look fabrics, and structured polyester-viscose mixes." },
      { q: "How do I care for my LINE° pieces?", a: "Full care instructions are on every product page and on the garment's care label. Most pieces are hand wash or gentle machine wash cold." },
    ],
  },
  {
    category: "Payments & Security",
    items: [
      { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express) via Paystack and Flutterwave. Apple Pay is available on supported devices." },
      { q: "Is my payment information secure?", a: "Absolutely. We never store your card details. All payments are processed through Paystack or Flutterwave using bank-level encryption. We are PCI DSS compliant." },
      { q: "Why was my payment declined?", a: "Payment declines can happen for several reasons — incorrect card details, insufficient funds, or your bank's security checks. Try a different card or contact your bank. You can also contact us for help." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left min-h-[52px]"
        aria-expanded={open}
      >
        <span className="text-sm font-medium pr-4">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-[hsl(var(--brand-terracotta))]" /> : <ChevronDown className="w-4 h-4 flex-shrink-0 text-muted-foreground" />}
      </button>
      {open && <p className="pb-4 text-sm text-muted-foreground leading-relaxed animate-fade-in">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide text-center mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-sm text-center mb-10">Can't find your answer? <Link to="/contact" className="underline hover:text-foreground">Contact us</Link></p>
          {FAQ_DATA.map((section) => (
            <div key={section.category} className="mb-8">
              <h2 className="font-display text-xl font-light tracking-wide mb-3 text-[hsl(var(--brand-terracotta))]">{section.category}</h2>
              <div className="border-t border-border">
                {section.items.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
