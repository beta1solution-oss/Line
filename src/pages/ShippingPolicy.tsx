import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 lg:px-8 prose prose-sm max-w-none">
          <h1 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-2">Shipping Policy</h1>
          <p className="text-muted-foreground text-sm mb-8">Last updated: January 1, 2026</p>

          {[
            {
              title: "Processing Time",
              body: "All orders are processed within 1–2 business days (Monday–Friday, excluding public holidays). Orders placed after 12 PM ET may be processed the following business day.",
            },
            {
              title: "Standard Shipping — United States",
              body: "Standard shipping takes 7–14 business days from the date your order is placed. Tracking information will be emailed to you once your order ships. Please allow up to 24 hours for tracking to update after you receive your shipping confirmation.\n\nFree standard shipping is available on all US orders of $75 or more. Orders under $75 incur a flat shipping fee of $7.99.",
            },
            {
              title: "Canada",
              body: "We currently ship to Canada. Estimated delivery is 10–18 business days. International shipping rates are calculated at checkout. Customers are responsible for any applicable customs duties, import taxes, or brokerage fees charged by their country.",
            },
            {
              title: "Order Tracking",
              body: "Once your order ships, you'll receive an email with your tracking number and a link to track your shipment. You can also track your order by visiting our Order Tracking page and entering your order number.",
            },
            {
              title: "Delayed or Lost Orders",
              body: "Shipping times are estimates and may be affected by carrier delays, weather, or other factors outside our control. If your order has not arrived within 21 business days of placing it, please contact us at support@linedegree.com so we can investigate.",
            },
            {
              title: "Incorrect Address",
              body: "Please ensure your shipping address is correct before placing your order. LINE° is not responsible for orders shipped to an incorrect address provided by the customer. If you need to correct your address, contact us immediately — we may not be able to update it once the order is in fulfillment.",
            },
          ].map((sec) => (
            <div key={sec.title} className="mb-7">
              <h2 className="font-display text-xl font-light tracking-wide mb-2">{sec.title}</h2>
              {sec.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3">{para}</p>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
