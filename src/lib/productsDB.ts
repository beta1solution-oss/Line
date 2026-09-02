// Products DB — read/write products to/from Supabase
// Falls back to static PRODUCTS constant if Supabase has no data
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types";
import { PRODUCTS as STATIC_PRODUCTS } from "@/constants/products";
import { generateId, slugify } from "@/lib/utils";

function dbRowToProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: (row.description as string) || "",
    shortDescription: (row.short_description as string) || "",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    supplierCost: Number(row.supplier_cost) || 0,
    shippingCost: Number(row.shipping_cost) || 0,
    estimatedMargin: Number(row.estimated_margin) || 0,
    images: (row.images as string[]) || [],
    videos: (row.videos as string[]) || [],
    colors: (row.colors as { name: string; hex: string }[]) || [],
    sizes: (row.sizes as string[]) || [],
    material: (row.material as string) || "",
    fit: (row.fit as string) || "",
    careInstructions: (row.care_instructions as string[]) || [],
    shippingInfo: (row.shipping_info as string) || "",
    returnInfo: (row.return_info as string) || "",
    cjProductId: (row.cj_product_id as string) || undefined,
    cjVariantIds: (row.cj_variant_ids as Record<string, string>) || {},
    variants: (row.variants as Product["variants"]) || [],
    status: (row.status as Product["status"]) || "Draft",
    category: (row.category as string) || "",
    tags: (row.tags as string[]) || [],
    rating: Number(row.rating) || 0,
    reviewCount: Number(row.review_count) || 0,
    featured: Boolean(row.featured),
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

function productToDbRow(p: Product): Record<string, unknown> {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    short_description: p.shortDescription,
    price: p.price,
    compare_at_price: p.compareAtPrice || null,
    supplier_cost: p.supplierCost,
    shipping_cost: p.shippingCost,
    estimated_margin: p.estimatedMargin,
    images: p.images,
    videos: p.videos || [],
    colors: p.colors,
    sizes: p.sizes,
    material: p.material,
    fit: p.fit,
    care_instructions: p.careInstructions,
    shipping_info: p.shippingInfo,
    return_info: p.returnInfo,
    cj_product_id: p.cjProductId || null,
    cj_variant_ids: p.cjVariantIds || {},
    variants: p.variants,
    status: p.status,
    category: p.category,
    tags: p.tags,
    rating: p.rating,
    review_count: p.reviewCount,
    featured: p.featured,
    updated_at: new Date().toISOString(),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    // Fall back to static products
    return STATIC_PRODUCTS;
  }
  return data.map(dbRowToProduct);
}

export async function getActiveProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("status", ["Active", "Winner"])
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return STATIC_PRODUCTS.filter((p) => p.status === "Active" || p.status === "Winner");
  }
  return data.map(dbRowToProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("status", ["Active", "Winner"])
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return STATIC_PRODUCTS.filter(
      (p) => p.featured && (p.status === "Active" || p.status === "Winner")
    );
  }
  return data.map(dbRowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return STATIC_PRODUCTS.find((p) => p.slug === slug);
  }
  return dbRowToProduct(data as Record<string, unknown>);
}

export async function saveProduct(product: Product): Promise<{ error?: string }> {
  const row = productToDbRow(product);
  const { error } = await supabase
    .from("products")
    .upsert(row);
  if (error) return { error: error.message };
  return {};
}

export async function deleteProduct(id: string): Promise<{ error?: string }> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  return {};
}

export function createEmptyProduct(): Product {
  const id = `prod_${generateId()}`;
  return {
    id,
    name: "",
    slug: "",
    description: "",
    shortDescription: "",
    price: 0,
    compareAtPrice: undefined,
    supplierCost: 0,
    shippingCost: 0,
    estimatedMargin: 0,
    images: [],
    videos: [],
    colors: [],
    sizes: [],
    material: "",
    fit: "",
    careInstructions: [],
    shippingInfo: "Free shipping on orders over $75. Standard delivery 7–14 business days.",
    returnInfo: "Free returns within 30 days of delivery.",
    cjProductId: undefined,
    cjVariantIds: {},
    variants: [],
    status: "Draft",
    category: "",
    tags: [],
    rating: 0,
    reviewCount: 0,
    featured: false,
    createdAt: new Date().toISOString(),
  };
}

export async function uploadProductImage(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type });
  
  if (error) {
    console.error("Image upload error:", error);
    return null;
  }
  
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(path);
  
  return data.publicUrl;
}

export function generateSlug(name: string): string {
  return slugify(name);
}
