import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const sections = [
  {
    title: "Information We Collect",
    body: "When you place an order, we collect your name, email address, shipping address, phone number, and payment information. Payment details are processed securely by Paystack or Flutterwave and are never stored on our servers. We also collect usage data such as pages visited, browser type, and device information when you browse our website.",
  },
  {
    title: "How We Use Your Information",
    body: "We use your information to: process and fulfill your orders; send order confirmations and shipping notifications; respond to your inquiries and provide customer support; send marketing emails (only if you have opted in); improve our website and services; prevent fraud and maintain security.",
  },
  {
    title: "Sharing of Information",
    body: "We do not sell your personal information to third parties. We share your information with: our fulfillment partner (CJ Dropshipping) to process and ship your order — they receive only the shipping information necessary to fulfill your order; our payment processors (Paystack, Flutterwave) who handle your payment securely; service providers who help us operate our website and email systems.",
  },
  {
    title: "Cookies",
    body: "We use cookies and similar technologies to maintain your shopping cart, remember your preferences, and analyze how our website is used. You can control cookie settings through your browser preferences.",
  },
  {
    title: "Data Retention",
    body: "We retain your order information for as long as necessary to fulfill our legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your personal data by contacting us at privacy@linedegree.com.",
  },
  {
    title: "Your Rights",
    body: "You have the right to: access the personal data we hold about you; correct inaccurate data; request deletion of your data; opt out of marketing communications at any time (using the unsubscribe link in any email); file a complaint with your local data protection authority.",
  },
  {
    title: "Security",
    body: "We use industry-standard security measures including SSL/TLS encryption to protect your data in transit. Payment information is handled exclusively by our PCI-compliant payment processors and is never stored on our systems.",
  },
  {
    title: "Contact",
    body: "For privacy-related inquiries, please contact us at privacy@linedegree.com.",
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 1, 2026</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            LINE° ("we," "us," "our") is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our website or purchase our products.
          </p>
          <div className="space-y-7">
            {sections.map((sec) => (
              <div key={sec.title}>
                <h2 className="font-display text-xl font-light tracking-wide mb-2">{sec.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
