import AdminLayout from "@/components/layout/AdminLayout";
import { getOrders } from "@/lib/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { useMemo } from "react";

export default function AdminCustomers() {
  const orders = getOrders();

  const customers = useMemo(() => {
    const map: Record<string, { email: string; name: string; orders: number; totalSpent: number; lastOrder: string }> = {};
    orders.forEach((o) => {
      const email = o.customer.email.toLowerCase();
      if (!map[email]) {
        map[email] = {
          email,
          name: `${o.customer.firstName} ${o.customer.lastName}`,
          orders: 0,
          totalSpent: 0,
          lastOrder: o.createdAt,
        };
      }
      map[email].orders += 1;
      if (o.paymentStatus === "Paid") map[email].totalSpent += o.total;
      if (o.createdAt > map[email].lastOrder) map[email].lastOrder = o.createdAt;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <AdminLayout title="Customers">
      <p className="text-sm text-muted-foreground mb-5">{customers.length} unique customer(s)</p>

      {customers.length === 0 ? (
        <div className="bg-white border border-border p-12 text-center">
          <p className="text-muted-foreground text-sm">No customers yet. Complete a test checkout to see data here.</p>
        </div>
      ) : (
        <div className="bg-white border border-border overflow-auto">
          <table className="w-full text-sm min-w-[500px]">
            <thead className="border-b border-border bg-[hsl(var(--muted))]/30">
              <tr>
                {["Customer","Email","Orders","Total Spent","Last Order"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.map((c) => (
                <tr key={c.email} className="hover:bg-[hsl(var(--muted))]/20">
                  <td className="py-3 px-4 font-medium text-xs">{c.name}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{c.email}</td>
                  <td className="py-3 px-4 text-xs">{c.orders}</td>
                  <td className="py-3 px-4 text-xs font-semibold">{formatPrice(c.totalSpent)}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{formatDate(c.lastOrder)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
