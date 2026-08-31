import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import { PRODUCTS } from "@/constants/products";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Top Rated" },
];

const CATEGORIES = ["All", "Dresses", "Tops", "Bottoms"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") ? 
      searchParams.get("category")!.charAt(0).toUpperCase() + searchParams.get("category")!.slice(1) 
      : "All"
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);

  const searchQuery = searchParams.get("search") || "";
  const filterTag = searchParams.get("filter") || "";

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    let results = PRODUCTS.filter(
      (p) => p.status === "Active" || p.status === "Winner"
    );

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    if (selectedCategory !== "All") {
      results = results.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (filterTag === "sale") {
      results = results.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    if (selectedSizes.length > 0) {
      results = results.filter((p) =>
        selectedSizes.some((size) => p.sizes.includes(size))
      );
    }

    results = results.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sort) {
      case "price-asc":
        return [...results].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...results].sort((a, b) => b.price - a.price);
      case "newest":
        return [...results].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "rating":
        return [...results].sort((a, b) => b.rating - a.rating);
      default:
        return [...results].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [searchQuery, selectedCategory, filterTag, selectedSizes, priceRange, sort]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedSizes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 200;

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedSizes([]);
    setPriceRange([0, 200]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Page header */}
        <div className="bg-[hsl(var(--brand-charcoal))] py-10 lg:py-14 text-center">
          <h1 className="font-display text-3xl lg:text-5xl font-light text-white tracking-wide">
            {searchQuery ? `Results for "${searchQuery}"` : filterTag === "sale" ? "Sale" : "The Collection"}
          </h1>
          <p className="text-white/50 text-sm mt-2">{filteredProducts.length} piece{filteredProducts.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              {/* Category quick filters */}
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 text-xs font-medium tracking-widest uppercase px-4 py-2 border transition-all min-h-[44px] ${
                    selectedCategory === cat
                      ? "bg-[hsl(var(--brand-charcoal))] text-white border-[hsl(var(--brand-charcoal))]"
                      : "border-border hover:border-[hsl(var(--brand-charcoal))]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[hsl(var(--brand-terracotta))] flex items-center gap-1 hover:underline"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase border border-border px-3 py-2 hover:border-[hsl(var(--brand-charcoal))] transition-colors min-h-[44px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filter
              </button>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none text-xs font-medium tracking-wider uppercase border border-border px-3 py-2 pr-7 bg-white hover:border-[hsl(var(--brand-charcoal))] transition-colors focus:outline-none min-h-[44px] cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter panel */}
          {filterOpen && (
            <div className="border border-border p-5 mb-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xs font-semibold tracking-widest uppercase mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 text-xs font-medium border transition-all ${
                          selectedSizes.includes(size)
                            ? "bg-[hsl(var(--brand-charcoal))] text-white border-[hsl(var(--brand-charcoal))]"
                            : "border-border hover:border-[hsl(var(--brand-charcoal))]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold tracking-widest uppercase mb-3">
                    Price Range: ${priceRange[0]} – ${priceRange[1]}
                  </h3>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-[hsl(var(--brand-charcoal))]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl font-light text-muted-foreground mb-2">No pieces found</p>
              <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <button onClick={clearFilters} className="btn-secondary text-xs px-6">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
