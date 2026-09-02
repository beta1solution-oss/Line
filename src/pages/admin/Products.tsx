import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductStatus } from "@/types";
import { Edit2, Eye, Plus, Trash2, X, Upload, Loader2, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  getAllProducts,
  saveProduct,
  deleteProduct,
  uploadProductImage,
  createEmptyProduct,
  generateSlug,
} from "@/lib/productsDB";
import { PRODUCTS as STATIC_PRODUCTS } from "@/constants/products";

const STATUS_COLORS: Record<ProductStatus, string> = {
  Draft: "bg-gray-50 text-gray-600",
  Testing: "bg-yellow-50 text-yellow-700",
  Active: "bg-green-50 text-green-700",
  Paused: "bg-orange-50 text-orange-700",
  Winner: "bg-[hsl(var(--brand-terracotta))]/10 text-[hsl(var(--brand-terracotta))]",
  Discontinued: "bg-red-50 text-red-700",
};

const STATUS_OPTIONS: ProductStatus[] = ["Draft","Testing","Active","Paused","Winner","Discontinued"];
const CATEGORIES = ["Tops","Bottoms","Dresses","Accessories"];
const SIZES_LIST = ["XS","S","M","L","XL","XXL"];

type EditingProduct = Product & {
  variants: (Product["variants"][0] & { price?: number })[];
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingProduct | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p, variants: p.variants.map(v => ({ ...v })) } as EditingProduct);
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(createEmptyProduct() as EditingProduct);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) { toast.error("Product name is required"); return; }
    if (editing.price <= 0) { toast.error("Price must be greater than 0"); return; }
    
    setSaving(true);
    const toSave: Product = {
      ...editing,
      slug: editing.slug || generateSlug(editing.name),
      estimatedMargin: editing.price - editing.supplierCost - editing.shippingCost,
    };
    
    const { error } = await saveProduct(toSave);
    if (error) {
      toast.error(`Failed to save: ${error}`);
    } else {
      toast.success("Product saved successfully");
      closeForm();
      loadProducts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteProduct(id);
    if (error) {
      toast.error(`Delete failed: ${error}`);
    } else {
      toast.success("Product deleted");
      setDeleteConfirm(null);
      loadProducts();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !editing) return;
    
    setUploadingImage(true);
    const urls: string[] = [];
    
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const url = await uploadProductImage(file);
      if (url) urls.push(url);
    }
    
    if (urls.length > 0) {
      setEditing({ ...editing, images: [...editing.images, ...urls] });
      toast.success(`${urls.length} image(s) uploaded`);
    } else {
      toast.error("Image upload failed. Check your connection.");
    }
    setUploadingImage(false);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, images: editing.images.filter((_, i) => i !== idx) });
  };

  const moveImage = (from: number, to: number) => {
    if (!editing) return;
    const imgs = [...editing.images];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(to, 0, moved);
    setEditing({ ...editing, images: imgs });
  };

  const toggleSize = (size: string) => {
    if (!editing) return;
    const sizes = editing.sizes.includes(size)
      ? editing.sizes.filter((s) => s !== size)
      : [...editing.sizes, size];
    setEditing({ ...editing, sizes });
  };

  const addColor = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      colors: [...editing.colors, { name: "New Color", hex: "#000000" }],
    });
  };

  const updateColor = (i: number, field: "name" | "hex", value: string) => {
    if (!editing) return;
    const colors = editing.colors.map((c, idx) => idx === i ? { ...c, [field]: value } : c);
    setEditing({ ...editing, colors });
  };

  const removeColor = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, colors: editing.colors.filter((_, idx) => idx !== i) });
  };

  const addVariant = () => {
    if (!editing) return;
    const newVariant = {
      id: `v_${Date.now()}`,
      color: editing.colors[0]?.name || "",
      colorHex: editing.colors[0]?.hex || "#000000",
      size: editing.sizes[0] || "S",
      sku: "",
      stock: 0,
      price: undefined,
      cjVariantId: "",
    };
    setEditing({ ...editing, variants: [...editing.variants, newVariant] });
  };

  const updateVariant = (i: number, field: string, value: string | number | undefined) => {
    if (!editing) return;
    const variants = editing.variants.map((v, idx) => {
      if (idx !== i) return v;
      if (field === "color") {
        const colorObj = editing.colors.find((c) => c.name === value);
        return { ...v, color: value as string, colorHex: colorObj?.hex || v.colorHex };
      }
      return { ...v, [field]: value };
    });
    setEditing({ ...editing, variants });
  };

  const removeVariant = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, variants: editing.variants.filter((_, idx) => idx !== i) });
  };

  const field = (label: string, node: React.ReactNode, required = false) => (
    <div>
      <label className="text-xs font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">
        {label}{required && <span className="text-[hsl(var(--brand-terracotta))]"> *</span>}
      </label>
      {node}
    </div>
  );

  const inputCls = "w-full border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-[hsl(var(--brand-charcoal))] transition-colors bg-white";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;

  return (
    <AdminLayout title="Products">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{products.length} products</p>
        <button onClick={openNew} className="btn-primary text-xs flex items-center gap-2 px-4 py-2.5">
          <Plus className="w-3.5 h-3.5" /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-border p-4 flex gap-4 items-start">
              <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
                {p.images[0] ? (
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.category} · {p.variants.length} variant(s)</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 flex-shrink-0 ${STATUS_COLORS[p.status]}`}>{p.status}</span>
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
                <div className="flex items-center gap-2 mt-3">
                  {p.colors.map((c) => (
                    <span key={c.name} className="w-3.5 h-3.5 rounded-full border border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{p.sizes.join(", ")}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 text-xs text-[hsl(var(--brand-terracotta))] hover:underline">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <Link to={`/product/${p.slug}`} target="_blank" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Eye className="w-3 h-3" /> Preview
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(p.id)}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:underline ml-auto"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No products yet. Click "Add Product" to get started.
            </div>
          )}
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white z-50 p-6 shadow-2xl max-w-sm w-full mx-4">
            <h3 className="font-medium mb-2">Delete product?</h3>
            <p className="text-sm text-muted-foreground mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 text-xs font-semibold tracking-wide uppercase">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-border py-2.5 text-xs font-semibold tracking-wide uppercase">Cancel</button>
            </div>
          </div>
        </>
      )}

      {/* Product form modal */}
      {showForm && editing && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={closeForm} />
          <div className="fixed inset-x-0 top-0 bottom-0 lg:inset-x-auto lg:right-0 lg:w-[700px] bg-white z-50 flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <h2 className="font-medium">{editing.name || "New Product"}</h2>
              <button onClick={closeForm} className="p-2 hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Basic info */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Basic Info</h3>
                <div className="space-y-4">
                  {field("Product Name *", (
                    <input
                      value={editing.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setEditing({ ...editing, name, slug: editing.slug || generateSlug(name) });
                      }}
                      placeholder="e.g. Oversized Wide-Leg Pants"
                      className={inputCls}
                    />
                  ), true)}

                  {field("URL Slug", (
                    <input
                      value={editing.slug}
                      onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                      placeholder="auto-generated from name"
                      className={inputCls}
                    />
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    {field("Category", (
                      <div className="relative">
                        <select
                          value={editing.category}
                          onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                          className={selectCls}
                        >
                          <option value="">Select…</option>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground" />
                      </div>
                    ))}

                    {field("Status", (
                      <div className="relative">
                        <select
                          value={editing.status}
                          onChange={(e) => setEditing({ ...editing, status: e.target.value as ProductStatus })}
                          className={selectCls}
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground" />
                      </div>
                    ))}
                  </div>

                  {field("Short Description", (
                    <textarea
                      value={editing.shortDescription}
                      onChange={(e) => setEditing({ ...editing, shortDescription: e.target.value })}
                      rows={2}
                      placeholder="One-line hook for the product card"
                      className={`${inputCls} resize-none`}
                    />
                  ))}

                  {field("Full Description", (
                    <textarea
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                      rows={4}
                      placeholder="Full product description…"
                      className={`${inputCls} resize-none`}
                    />
                  ))}
                </div>
              </section>

              {/* Pricing */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "price", label: "Price *" },
                    { key: "compareAtPrice", label: "Compare-At Price" },
                    { key: "supplierCost", label: "Supplier Cost" },
                    { key: "shippingCost", label: "Shipping Cost" },
                  ].map(({ key, label }) => (
                    field(label, (
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={(editing as Record<string, unknown>)[key] as number || ""}
                          onChange={(e) => setEditing({ ...editing, [key]: e.target.value ? Number(e.target.value) : undefined })}
                          placeholder="0.00"
                          className={`${inputCls} pl-7`}
                        />
                      </div>
                    ), key === "price")
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.featured}
                      onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-medium">Featured product (shown on homepage)</span>
                  </label>
                </div>
              </section>

              {/* Images */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Product Images</h3>
                <p className="text-xs text-muted-foreground mb-3">First image is the main image. Drag to reorder. Customers can swipe and zoom.</p>

                <label className={`flex items-center justify-center gap-2 border-2 border-dashed border-border px-4 py-6 cursor-pointer hover:border-[hsl(var(--brand-charcoal))] transition-colors ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}>
                  {uploadingImage ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span className="text-xs">Uploading…</span></>
                  ) : (
                    <><Upload className="w-4 h-4 text-muted-foreground" /><span className="text-xs font-medium">Click to upload images</span></>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>

                {editing.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {editing.images.map((url, i) => (
                      <div key={url + i} className="relative group aspect-square bg-muted overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <span className="absolute top-1 left-1 bg-[hsl(var(--brand-terracotta))] text-white text-[9px] px-1 py-0.5 font-bold">MAIN</span>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                          {i > 0 && (
                            <button
                              onClick={() => moveImage(i, i - 1)}
                              className="w-6 h-6 bg-white text-xs flex items-center justify-center"
                              title="Move left"
                            >←</button>
                          )}
                          <button
                            onClick={() => removeImage(i)}
                            className="w-6 h-6 bg-red-500 text-white flex items-center justify-center"
                            title="Remove"
                          ><X className="w-3 h-3" /></button>
                          {i < editing.images.length - 1 && (
                            <button
                              onClick={() => moveImage(i, i + 1)}
                              className="w-6 h-6 bg-white text-xs flex items-center justify-center"
                              title="Move right"
                            >→</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {field("Or paste image URL", (
                  <div className="flex gap-2 mt-2">
                    <input
                      id="img-url-input"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className={`${inputCls} flex-1`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) { setEditing({ ...editing, images: [...editing.images, val] }); (e.target as HTMLInputElement).value = ""; }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("img-url-input") as HTMLInputElement;
                        const val = input?.value.trim();
                        if (val) { setEditing({ ...editing, images: [...editing.images, val] }); input.value = ""; }
                      }}
                      className="btn-secondary text-xs px-3 py-2.5"
                    >Add</button>
                  </div>
                ))}
              </section>

              {/* Colors */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Colors</h3>
                <div className="space-y-2">
                  {editing.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => updateColor(i, "hex", e.target.value)}
                        className="w-9 h-9 border border-border cursor-pointer p-0.5"
                      />
                      <input
                        value={color.name}
                        onChange={(e) => updateColor(i, "name", e.target.value)}
                        placeholder="Color name"
                        className={`${inputCls} flex-1`}
                      />
                      <button onClick={() => removeColor(i)} className="text-muted-foreground hover:text-red-500 p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addColor} className="text-xs text-[hsl(var(--brand-terracotta))] hover:underline flex items-center gap-1 mt-1">
                    <Plus className="w-3 h-3" /> Add color
                  </button>
                </div>
              </section>

              {/* Sizes */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES_LIST.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 text-xs font-medium border transition-all ${
                        editing.sizes.includes(size)
                          ? "bg-[hsl(var(--brand-charcoal))] text-white border-[hsl(var(--brand-charcoal))]"
                          : "border-border hover:border-[hsl(var(--brand-charcoal))]"
                      }`}
                    >{size}</button>
                  ))}
                </div>
              </section>

              {/* Variants */}
              <section>
                <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
                  <h3 className="text-xs font-bold tracking-widest uppercase">Variants</h3>
                  <button onClick={addVariant} className="text-xs text-[hsl(var(--brand-terracotta))] hover:underline flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add variant
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Each variant can optionally override the base price (leave blank to use base price).</p>
                {editing.variants.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No variants. Add at least one to make the product available.</p>
                )}
                <div className="space-y-2">
                  {editing.variants.map((v, i) => (
                    <div key={v.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-1.5 items-start text-xs">
                      <div>
                        {i === 0 && <label className="text-[10px] text-muted-foreground block mb-1">Color</label>}
                        <div className="relative">
                          <select
                            value={v.color}
                            onChange={(e) => updateVariant(i, "color", e.target.value)}
                            className="w-full border border-border px-2 py-2 text-xs focus:outline-none appearance-none bg-white"
                          >
                            {editing.colors.map((c) => <option key={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        {i === 0 && <label className="text-[10px] text-muted-foreground block mb-1">Size</label>}
                        <div className="relative">
                          <select
                            value={v.size}
                            onChange={(e) => updateVariant(i, "size", e.target.value)}
                            className="w-full border border-border px-2 py-2 text-xs focus:outline-none appearance-none bg-white"
                          >
                            {editing.sizes.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        {i === 0 && <label className="text-[10px] text-muted-foreground block mb-1">SKU</label>}
                        <input
                          value={v.sku}
                          onChange={(e) => updateVariant(i, "sku", e.target.value)}
                          placeholder="SKU-001"
                          className="w-full border border-border px-2 py-2 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        {i === 0 && <label className="text-[10px] text-muted-foreground block mb-1">Stock</label>}
                        <input
                          type="number"
                          min="0"
                          value={v.stock}
                          onChange={(e) => updateVariant(i, "stock", Number(e.target.value))}
                          className="w-full border border-border px-2 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div>
                        {i === 0 && <label className="text-[10px] text-muted-foreground block mb-1">Price (opt.)</label>}
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={(v as { price?: number }).price ?? ""}
                            onChange={(e) => updateVariant(i, "price", e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="Base"
                            className="w-full border border-border pl-5 pr-2 py-2 text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => removeVariant(i)}
                        className={`text-muted-foreground hover:text-red-500 p-1 ${i === 0 ? "mt-5" : ""}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Product details */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">Product Details</h3>
                <div className="space-y-4">
                  {field("Material", (
                    <input
                      value={editing.material}
                      onChange={(e) => setEditing({ ...editing, material: e.target.value })}
                      placeholder="e.g. 72% Viscose, 25% Polyester, 3% Elastane"
                      className={inputCls}
                    />
                  ))}
                  {field("Fit", (
                    <textarea
                      value={editing.fit}
                      onChange={(e) => setEditing({ ...editing, fit: e.target.value })}
                      rows={2}
                      placeholder="Fit notes, model sizing, recommendations…"
                      className={`${inputCls} resize-none`}
                    />
                  ))}
                  {field("Care Instructions (one per line)", (
                    <textarea
                      value={editing.careInstructions.join("\n")}
                      onChange={(e) => setEditing({ ...editing, careInstructions: e.target.value.split("\n").filter(Boolean) })}
                      rows={3}
                      placeholder="Machine wash cold&#10;Do not bleach&#10;Lay flat to dry"
                      className={`${inputCls} resize-none`}
                    />
                  ))}
                </div>
              </section>

              {/* CJ Dropshipping */}
              <section>
                <h3 className="text-xs font-bold tracking-widest uppercase border-b border-border pb-2 mb-4">CJ Dropshipping</h3>
                <div className="grid grid-cols-2 gap-3">
                  {field("CJ Product ID", (
                    <input
                      value={editing.cjProductId || ""}
                      onChange={(e) => setEditing({ ...editing, cjProductId: e.target.value })}
                      placeholder="CJ_PRODUCT_001"
                      className={`${inputCls} font-mono`}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-border flex-shrink-0 bg-white">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex-1 py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : "Save Product"}
              </button>
              <button onClick={closeForm} className="btn-secondary py-3 text-xs px-6">Cancel</button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
