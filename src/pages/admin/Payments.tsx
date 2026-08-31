import AdminLayout from "@/components/layout/AdminLayout";
import { getOrders } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminPayments() {
  const orders = getOrders();
  const paymentsWithRecords = orders.filter((o) => o.payment);
  const totalRevenue = orders.filter((o) => o.paymentStatus === "Paid").reduce((s, o) => s + o.total, 0);
  const failedCount = orders.filter((o) => o.paymentStatus === "Failed").length;
  const unverified = orders.filter((o) => o.payment && !o.payment.webhookVerified && o.paymentStatus === "Paid").length;

  return (
    <AdminLayout title="Payments">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Revenue", value: formatPrice(totalRevenue), color: "text-green-700" },
          { label: "Transactions", value: paymentsWithRecords.length, color: "" },
          { label: "Failed Payments", value: failedCount, color: "text-red-600" },
          { label: "Webhook Unverified", value: unverified, color: "text-amber-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-border p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Provider status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { provider: "Paystack", note: "Card payments + Apple Pay (requires domain verification)", status: "Configured — add VITE_PAYSTACK_PUBLIC_KEY" },
          { provider: "Flutterwave", note: "Card payments", status: "Configured — add VITE_FLUTTERWAVE_PUBLIC_KEY" },
        ].map(({ provider, note, status }) => (
          <div key={provider} className="bg-white border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-sm">{provider}</p>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 font-semibold">Needs Key</span>
            </div>
            <p className="text-xs text-muted-foreground">{note}</p>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{status}</p>
          </div>
        ))}
      </div>

      {/* Webhook info */}
      <div className="bg-amber-50 border border-amber-200 p-4 mb-6 text-xs text-amber-800">
        <p className="font-semibold mb-1">Important: Webhook Verification</p>
        <p>Orders should only be marked PAID after server-side webhook verification. The current frontend-only flow is for demo purposes. Enable OnSpace Cloud backend and configure webhook endpoints for production security.</p>
        <p className="mt-2 font-mono">Paystack webhook: /api/webhooks/paystack</p>
        <p className="font-mono">Flutterwave webhook: /api/webhooks/flutterwave</p>
      </div>

      {/* Transaction list */}
      {paymentsWithRecords.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No payment transactions yet. Complete a checkout to see data here.</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="border-b border-border bg-[hsl(var(--muted))]/30">
              <tr>
                {["Order","Date","Customer","Provider","Amount","Status","Webhook"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paymentsWithRecords.map((o) => (
                <tr key={o.id} className="hover:bg-[hsl(var(--muted))]/20">
                  <td className="py-3 px-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{o.payment ? formatDate(o.payment.createdAt) : "—"}</td>
                  <td className="py-3 px-4 text-xs">{o.customer.firstName} {o.customer.lastName}</td>
                  <td className="py-3 px-4 text-xs">{o.payment?.provider}</td>
                  <td className="py-3 px-4 text-xs font-semibold">{formatPrice(o.total)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 ${
                      o.paymentStatus === "Paid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>{o.paymentStatus}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 ${
                      o.payment?.webhookVerified ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {o.payment?.webhookVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
