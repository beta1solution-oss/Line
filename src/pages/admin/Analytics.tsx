import AdminLayout from "@/components/layout/AdminLayout";
import { getOrders } from "@/lib/orders";
import { PRODUCTS } from "@/constants/products";
import { formatPrice } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(22 55% 52%)", "hsl(20 10% 8%)", "hsl(22 40% 70%)", "hsl(22 20% 85%)"];

export default function AdminAnalytics() {
  const orders = getOrders();
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const unitsSold = paidOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);
  const avgOrderValue = paidOrders.length ? revenue / paidOrders.length : 0;
  const refunds = orders.filter((o) => o.paymentStatus === "Refunded").length;
  const refundRate = orders.length ? ((refunds / orders.length) * 100).toFixed(1) : "0.0";
  const estMargin = paidOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + (i.unitPrice - i.supplierCost - i.shippingCost) * i.quantity, 0), 0);

  // Product breakdown
  const productRevenue = PRODUCTS.map((p) => {
    const sold = paidOrders.reduce(
      (s, o) => s + o.items.filter((i) => i.productId === p.id).reduce((si, i) => si + i.quantity, 0),
      0
    );
    return { name: p.name.split(" ").slice(0, 3).join(" "), revenue: sold * p.price, units: sold };
  });

  const fulfillmentData = [
    { name: "Awaiting", value: orders.filter((o) => o.fulfillmentStatus === "Awaiting Fulfillment").length },
    { name: "Shipped", value: orders.filter((o) => o.fulfillmentStatus === "Shipped").length },
    { name: "Delivered", value: orders.filter((o) => o.fulfillmentStatus === "Delivered").length },
    { name: "Error", value: orders.filter((o) => o.fulfillmentStatus === "Fulfillment Error").length },
  ].filter((d) => d.value > 0);

  const METRICS = [
    { label: "Revenue", value: formatPrice(revenue) },
    { label: "Orders", value: orders.length },
    { label: "Avg Order Value", value: formatPrice(avgOrderValue) },
    { label: "Units Sold", value: unitsSold },
    { label: "Refund Rate", value: `${refundRate}%` },
    { label: "Est. Margin", value: formatPrice(estMargin) },
  ];

  return (
    <AdminLayout title="Analytics">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {METRICS.map(({ label, value }) => (
          <div key={label} className="bg-white border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white border border-border p-5">
          <h2 className="text-sm font-semibold mb-4">Revenue by Product</h2>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={90} />
                <Tooltip formatter={(v: number) => [`$${v.toFixed(0)}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(22 55% 52%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {fulfillmentData.length > 0 ? (
          <div className="bg-white border border-border p-5">
            <h2 className="text-sm font-semibold mb-4">Fulfillment Status</h2>
            <div className="h-52 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={fulfillmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {fulfillmentData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-border p-5 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No order data yet</p>
          </div>
        )}
      </div>

      <div className="bg-white border border-border p-5">
        <h2 className="text-sm font-semibold mb-2">TikTok Attribution</h2>
        <p className="text-xs text-muted-foreground">
          TikTok analytics require UTM parameter tracking. Add <code className="bg-muted px-1">?utm_source=tiktok</code> to your TikTok bio link. Attribution data will appear here once backend is enabled.
        </p>
      </div>
    </AdminLayout>
  );
}
