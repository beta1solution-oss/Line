import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const sections = [
  {
    title: "Acceptance of Terms",
    body: 'By accessing or using the LINE° website (linedegree.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.',
  },
  {
    title: "Products and Pricing",
    body: "All prices are listed in US Dollars (USD). We reserve the right to modify prices at any time without prior notice. Product descriptions are as accurate as possible. We reserve the right to limit quantities and to refuse or cancel orders at our discretion.",
  },
  {
    title: "Orders and Payment",
    body: "By placing an order, you confirm that the information you provide is accurate and that you are authorized to use the payment method provided. All orders are subject to acceptance and availability. We reserve the right to cancel any order for any reason, including suspected fraud.",
  },
  {
    title: "Shipping and Delivery",
    body: "Delivery times are estimates only. LINE° is not responsible for delays caused by carriers, customs, or events outside our control. Risk of loss and title for products passes to you upon delivery to the carrier.",
  },
  {
    title: "Returns and Refunds",
    body: "Please refer to our Returns & Refunds Policy for complete details on our return and refund process.",
  },
  {
    title: "Intellectual Property",
    body: "All content on this website — including text, images, logos, and design — is the property of LINE° and is protected by applicable copyright and trademark laws. You may not reproduce, distribute, or use any content without our express written permission.",
  },
  {
    title: "Limitation of Liability",
    body: "LINE° is not liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability is limited to the amount you paid for the product(s) in question.",
  },
  {
    title: "Governing Law",
    body: "These Terms are governed by the laws of the United States. Any disputes shall be resolved in the applicable courts.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these Terms at any time. Continued use of our website after changes constitutes acceptance of the updated Terms.",
  },
  {
    title: "Contact",
    body: "For questions about these Terms, contact us at legal@linedegree.com.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 1, 2026</p>
          <div className="space-y-7">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h2 className="font-display text-xl font-light tracking-wide mb-2">{sec.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{sec.body}</p>
                {sec.title === "Returns and Refunds" && (
                  <Link to="/returns" className="text-sm text-[hsl(var(--brand-terracotta))] hover:underline">View Returns Policy →</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
