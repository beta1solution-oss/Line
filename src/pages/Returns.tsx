import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

export default function Returns() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-2">Returns & Refunds</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 1, 2026</p>

          <div className="bg-[hsl(var(--brand-terracotta))]/10 border border-[hsl(var(--brand-terracotta))]/20 p-5 mb-8 text-sm">
            <p className="font-medium mb-1">Our Return Promise</p>
            <p className="text-muted-foreground">We offer free returns within 30 days of delivery. No hassle, no questions asked.</p>
          </div>

          {[
            {
              title: "Return Eligibility",
              content: ["Items must be returned within 30 days of the delivery date.", "Items must be unworn, unwashed, and in original condition.", "All original tags must still be attached.", "Items that have been worn, washed, or damaged are not eligible for return."],
            },
            {
              title: "How to Start a Return",
              content: ["Email returns@linedegree.com with your order number and the reason for your return.", "We'll send you a prepaid return shipping label within 1–2 business days.", "Pack your item(s) securely and attach the label.", "Drop your package off at any authorized carrier location.", "You'll receive a confirmation email once we receive your return."],
            },
            {
              title: "Refund Timeline",
              content: ["Refunds are processed within 3–5 business days of us receiving your return.", "The refund will be applied to your original payment method.", "Please allow 5–10 business days for the refund to appear on your statement, depending on your bank.", "Original shipping fees are non-refundable unless the return is due to our error or a defective item."],
            },
            {
              title: "Exchanges",
              content: ["We're happy to exchange items for a different size or color, subject to availability.", "Contact us at returns@linedegree.com to arrange an exchange.", "Exchanges are processed once we receive your original item."],
            },
            {
              title: "Defective or Incorrect Items",
              content: ["If you received a defective or incorrect item, we sincerely apologize. Please email us at support@linedegree.com with your order number and a photo of the issue.", "We'll resolve this promptly with either a full refund, replacement, or store credit — your choice."],
            },
          ].map((sec) => (
            <div key={sec.title} className="mb-7">
              <h2 className="font-display text-xl font-light tracking-wide mb-3">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.content.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-[hsl(var(--brand-terracotta))] mt-1 flex-shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="border border-border p-5 bg-[hsl(var(--secondary))]">
            <p className="text-sm font-medium mb-1">Still have questions?</p>
            <p className="text-sm text-muted-foreground">
              <Link to="/contact" className="underline hover:text-foreground">Contact our team</Link> or email us at{" "}
              <a href="mailto:support@linedegree.com" className="underline hover:text-foreground">support@linedegree.com</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
