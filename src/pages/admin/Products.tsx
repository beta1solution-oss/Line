import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PRODUCTS } from "@/constants/products";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";
import { Edit2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_COLORS: Record<ProductStatus, string> = {
  Draft: "bg-gray-50 text-gray-600",
  Testing: "bg-yellow-50 text-yellow-700",
  Active: "bg-green-50 text-green-700",
  Paused: "bg-orange-50 text-orange-700",
  Winner: "bg-[hsl(var(--brand-terracotta))]/10 text-[hsl(var(--brand-terracotta))]",
  Discontinued: "bg-red-50 text-red-700",
};

export default function AdminProducts() {
  const [products] = useState<Product[]>(PRODUCTS);
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <AdminLayout title="Products">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{products.length} products in catalog</p>
        <div className="text-xs text-muted-foreground border border-border px-3 py-2 bg-[hsl(var(--muted))]/30">
          Product editing requires backend — enable OnSpace Cloud to save changes
        </div>
      </div>

      <div className="grid gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-border p-4 flex gap-4 items-start">
            <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.category} · SKU base: {p.variants[0]?.sku.split("-").slice(0, 2).join("-")}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3 text-xs">
                <div>
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-semibold">{formatPrice(p.price)}</p>
                  {p.compareAtPrice && <p className="line-through text-muted-foreground/60">{formatPrice(p.compareAtPrice)}</p>}
                </div>
                <div>
                  <p className="text-muted-foreground">Supplier Cost</p>
                  <p className="font-medium">{formatPrice(p.supplierCost)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Margin</p>
                  <p className="font-medium text-green-700">{formatPrice(p.price - p.supplierCost - p.shippingCost)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">CJ Product ID</p>
                  <p className="font-mono text-[10px]">{p.cjProductId || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex gap-1">
                  {p.colors.map((c) => (
                    <span key={c.name} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{p.sizes.join(", ")}</span>
                <span className="text-xs text-muted-foreground">★{p.rating} ({p.reviewCount})</span>
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button onClick={() => setSelected(p)} className="flex items-center gap-1.5 text-xs text-[hsl(var(--brand-terracotta))] hover:underline">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <Link to={`/product/${p.slug}`} target="_blank" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <Eye className="w-3 h-3" /> View on Store
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit modal (read-only until backend) */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelected(null)} />
          <div className="fixed inset-x-4 top-8 bottom-8 max-w-2xl mx-auto bg-white z-50 overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground">Close ✕</button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                Product editing requires OnSpace Cloud backend. Enable it to persist changes.
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Product Name", value: selected.name },
                  { label: "Status", value: selected.status },
                  { label: "Price", value: `$${selected.price}` },
                  { label: "Compare-At Price", value: selected.compareAtPrice ? `$${selected.compareAtPrice}` : "—" },
                  { label: "Supplier Cost", value: `$${selected.supplierCost}` },
                  { label: "Shipping Cost", value: `$${selected.shippingCost}` },
                  { label: "CJ Product ID", value: selected.cjProductId || "—" },
                  { label: "Category", value: selected.category },
                ].map(({ label, value }) => (
                  <div key={label} className="border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="font-medium text-xs">{value}</p>
                  </div>
                ))}
              </div>

              <div className="border border-border p-3">
                <p className="text-xs text-muted-foreground mb-2">Variants ({selected.variants.length})</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-muted-foreground">
                      {["SKU","Color","Size","Stock","CJ Variant ID"].map((h) => <th key={h} className="text-left pb-1 pr-3">{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {selected.variants.map((v) => (
                        <tr key={v.id} className="border-t border-border/50">
                          <td className="py-1.5 pr-3 font-mono">{v.sku}</td>
                          <td className="py-1.5 pr-3">{v.color}</td>
                          <td className="py-1.5 pr-3">{v.size}</td>
                          <td className="py-1.5 pr-3">{v.stock}</td>
                          <td className="py-1.5 font-mono text-muted-foreground">{v.cjVariantId || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
