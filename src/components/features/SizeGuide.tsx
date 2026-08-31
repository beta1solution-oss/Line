import { X } from "lucide-react";

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
}

const sizeData = [
  { size: "XS", us: "0–2", chest: "32–33", waist: "24–25", hips: "35–36" },
  { size: "S",  us: "4–6", chest: "34–35", waist: "26–27", hips: "37–38" },
  { size: "M",  us: "8–10", chest: "36–37", waist: "28–29", hips: "39–40" },
  { size: "L",  us: "12–14", chest: "38–40", waist: "30–32", hips: "41–43" },
  { size: "XL", us: "16–18", chest: "41–43", waist: "33–35", hips: "44–46" },
  { size: "XXL", us: "20–22", chest: "44–46", waist: "36–38", hips: "47–49" },
];

export default function SizeGuide({ open, onClose }: SizeGuideProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto bg-white z-50 p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-light tracking-wide">Size Guide</h2>
          <button onClick={onClose} className="p-2 hover:opacity-60 transition-opacity min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label="Close size guide">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">All measurements in inches.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Size", "US Size", "Chest", "Waist", "Hips"].map((h) => (
                  <th key={h} className="text-left py-2 pr-4 font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeData.map((row, i) => (
                <tr key={row.size} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-[hsl(var(--muted))]/30" : ""}`}>
                  <td className="py-2.5 pr-4 font-semibold">{row.size}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.us}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.chest}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.waist}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 p-4 bg-[hsl(var(--muted))] text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold mb-1">How to measure</p>
          <p><strong>Chest:</strong> Measure around the fullest part of your bust.</p>
          <p><strong>Waist:</strong> Measure around your natural waistline.</p>
          <p><strong>Hips:</strong> Measure around the fullest part of your hips.</p>
          <p className="mt-2">When between sizes, we recommend sizing up for a more relaxed fit.</p>
        </div>
      </div>
    </>
  );
}
