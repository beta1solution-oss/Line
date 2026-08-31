import AdminLayout from "@/components/layout/AdminLayout";
import { getOrders } from "@/lib/orders";
import { PRODUCTS } from "@/constants/products";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, ShoppingBag, Package, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function generateMockRevenueTrend() {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.floor(Math.random() * 800 + 200),
      orders: Math.floor(Math.random() * 8 + 1),
    });
  }
  return days;
}

export default function AdminDashboard() {
  const orders = getOrders();
  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid");
  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const unitsSold = paidOrders.reduce((s, o) => s + o.items.reduce((si, i) => si + i.quantity, 0), 0);
  const avgOrderValue = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const pendingFulfillment = orders.filter((o) => o.paymentStatus === "Paid" && o.fulfillmentStatus === "Awaiting Fulfillment").length;
  const fulfillmentErrors = orders.filter((o) => o.fulfillmentStatus === "Fulfillment Error").length;
  const chartData = generateMockRevenueTrend();

  const METRICS = [
    { label: "Total Revenue", value: formatPrice(revenue), icon: TrendingUp, color: "text-[hsl(var(--brand-terracotta))]" },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "text-blue-600" },
    { label: "Units Sold", value: unitsSold.toString(), icon: Package, color: "text-green-600" },
    { label: "Avg Order Value", value: formatPrice(avgOrderValue), icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Alert */}
      {fulfillmentErrors > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-3 mb-5 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {fulfillmentErrors} order(s) have fulfillment errors. <a href="/admin/orders" className="underline ml-1">Review now</a>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRICS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-border p-4 lg:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground tracking-wide">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-xl lg:text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-amber-50 border border-amber-200 p-4">
          <p className="text-xs text-amber-700 font-medium mb-1">Pending Fulfillment</p>
          <p className="text-2xl font-semibold text-amber-800">{pendingFulfillment}</p>
          <p className="text-xs text-amber-600 mt-1">Paid orders awaiting CJ submission</p>
        </div>
        <div className="bg-green-50 border border-green-200 p-4">
          <p className="text-xs text-green-700 font-medium mb-1">Est. Contribution Margin</p>
          <p className="text-2xl font-semibold text-green-800">{formatPrice(revenue * 0.52)}</p>
          <p className="text-xs text-green-600 mt-1">Based on avg 52% margin</p>
        </div>
      </div>

      {/* Revenue chart */}
      <div className="bg-white border border-border p-5 mb-6">
        <h2 className="text-sm font-semibold mb-4">Revenue — Last 30 Days (Demo Data)</h2>
        <div className="h-48 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(22 55% 52%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product performance */}
      <div className="bg-white border border-border p-5">
        <h2 className="text-sm font-semibold mb-4">Product Performance</h2>
        <div className="space-y-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="w-10 h-12 bg-muted overflow-hidden flex-shrink-0">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-tight truncate">{p.name}</p>
                <p className="text-[10px] text-muted-foreground">{p.status} · {p.reviewCount} reviews · ★{p.rating}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                <p className="text-[10px] text-muted-foreground">Margin: ${(p.price - p.supplierCost - p.shippingCost).toFixed(0)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
