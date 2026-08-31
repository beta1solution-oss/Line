import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { PRODUCTS } from "@/constants/products";
import type { TikTokVideo } from "@/types";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

const MOCK_VIDEOS: TikTokVideo[] = [
  {
    id: "v1",
    videoUrl: "https://tiktok.com",
    thumbnail: PRODUCTS[0].images[0],
    productId: "prod_001",
    productName: "Oversized Wide-Leg Pants",
    hook: "POV: You found the perfect wide-leg trouser",
    date: "2026-08-20",
    views: 142000,
    likes: 8400,
    comments: 312,
    shares: 1840,
    saves: 6200,
    profileVisits: 4100,
    linkClicks: 920,
    orders: 38,
    revenue: 2584,
  },
  {
    id: "v2",
    videoUrl: "https://tiktok.com",
    thumbnail: PRODUCTS[1].images[0],
    productId: "prod_002",
    productName: "Structured Corset Mini Dress",
    hook: "The dress that broke my FYP",
    date: "2026-08-15",
    views: 380000,
    likes: 24000,
    comments: 890,
    shares: 5600,
    saves: 18000,
    profileVisits: 12400,
    linkClicks: 3100,
    orders: 127,
    revenue: 11303,
  },
];

export default function AdminContent() {
  const [videos, setVideos] = useState<TikTokVideo[]>(MOCK_VIDEOS);
  const [adding, setAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({
    hook: "",
    productId: "",
    date: "",
    views: 0,
    likes: 0,
    orders: 0,
  });

  const handleAdd = () => {
    if (!newVideo.hook || !newVideo.productId) return;
    const product = PRODUCTS.find((p) => p.id === newVideo.productId);
    if (!product) return;
    const v: TikTokVideo = {
      id: `v_${Date.now()}`,
      videoUrl: "",
      thumbnail: product.images[0],
      productId: product.id,
      productName: product.name,
      hook: newVideo.hook,
      date: newVideo.date || new Date().toISOString().split("T")[0],
      views: newVideo.views,
      likes: newVideo.likes,
      comments: 0,
      shares: 0,
      saves: 0,
      profileVisits: 0,
      linkClicks: 0,
      orders: newVideo.orders,
      revenue: newVideo.orders * (PRODUCTS.find((p) => p.id === newVideo.productId)?.price || 0),
    };
    setVideos([v, ...videos]);
    setAdding(false);
    setNewVideo({ hook: "", productId: "", date: "", views: 0, likes: 0, orders: 0 });
  };

  return (
    <AdminLayout title="TikTok Content Tracker">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">{videos.length} video(s) tracked</p>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 btn-primary text-xs px-4 py-2.5">
          <Plus className="w-3.5 h-3.5" /> Track New Video
        </button>
      </div>

      {adding && (
        <div className="bg-white border border-border p-5 mb-5 animate-fade-in">
          <h3 className="text-sm font-semibold mb-4">Add Video</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="col-span-2">
              <label className="text-xs font-medium tracking-wider uppercase block mb-1">Hook / Video Title</label>
              <input value={newVideo.hook} onChange={(e) => setNewVideo({ ...newVideo, hook: e.target.value })}
                placeholder="POV: You found the perfect pair of trousers…"
                className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-1">Product</label>
              <select value={newVideo.productId} onChange={(e) => setNewVideo({ ...newVideo, productId: e.target.value })}
                className="w-full border border-border px-3 py-2.5 text-sm bg-white focus:outline-none">
                <option value="">Select product</option>
                {PRODUCTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium tracking-wider uppercase block mb-1">Date Posted</label>
              <input type="date" value={newVideo.date} onChange={(e) => setNewVideo({ ...newVideo, date: e.target.value })}
                className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            {[
              { key: "views", label: "Views" },
              { key: "likes", label: "Likes" },
              { key: "orders", label: "Orders" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs font-medium tracking-wider uppercase block mb-1">{label}</label>
                <input type="number" value={(newVideo as Record<string, unknown>)[key] as number}
                  onChange={(e) => setNewVideo({ ...newVideo, [key]: Number(e.target.value) })}
                  className="w-full border border-border px-3 py-2.5 text-sm focus:outline-none" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary text-xs px-5 py-2.5">Save</button>
            <button onClick={() => setAdding(false)} className="btn-secondary text-xs px-5 py-2.5">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {videos.map((v) => (
          <div key={v.id} className="bg-white border border-border p-4 flex gap-4">
            <div className="w-16 h-20 bg-muted overflow-hidden flex-shrink-0">
              <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-tight">{v.hook}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{v.productName} · {formatDate(v.date)}</p>

              <div className="grid grid-cols-4 lg:grid-cols-7 gap-3 mt-3">
                {[
                  { label: "Views", value: v.views.toLocaleString() },
                  { label: "Likes", value: v.likes.toLocaleString() },
                  { label: "Saves", value: v.saves.toLocaleString() },
                  { label: "Shares", value: v.shares.toLocaleString() },
                  { label: "Link Clicks", value: v.linkClicks.toLocaleString() },
                  { label: "Orders", value: v.orders.toString(), highlight: true },
                  { label: "Revenue", value: `$${v.revenue.toLocaleString()}`, highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className={`text-xs font-semibold ${highlight ? "text-[hsl(var(--brand-terracotta))]" : ""}`}>{value}</p>
                  </div>
                ))}
              </div>

              {v.views > 0 && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  CTR: {((v.linkClicks / v.views) * 100).toFixed(2)}% · 
                  Conv: {((v.orders / (v.linkClicks || 1)) * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
