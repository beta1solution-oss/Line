import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";
import editorial1 from "@/assets/editorial-1.jpg";
import editorial2 from "@/assets/editorial-2.jpg";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="relative bg-[hsl(var(--brand-charcoal))] py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img src={editorial1} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative max-w-3xl mx-auto px-4 lg:px-8 text-center text-white">
            <span className="text-[hsl(var(--brand-terracotta))] text-xs font-semibold tracking-[0.3em] uppercase mb-4 block">Our Story</span>
            <h1 className="font-display text-4xl lg:text-6xl font-light tracking-wide mb-5">
              Fashion built<br />on intention.
            </h1>
            <p className="text-white/60 text-sm lg:text-base leading-relaxed max-w-xl mx-auto">
              LINE° was born from one question — why does getting dressed feel like a chore?
              We set out to build a wardrobe that works as hard as you do, without asking you to think too hard.
            </p>
          </div>
        </div>

        {/* Story */}
        <section className="py-16 lg:py-24">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-light tracking-wide mb-5">
                  The idea behind LINE°
                </h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <p>Every piece in the LINE° collection starts with a purpose. Not a trend. Not a price point. A purpose. We ask: does this piece earn its place in your wardrobe? Does it work alone and with everything else you own? Does it make you feel something when you put it on?</p>
                  <p>We started with four silhouettes — the wide-leg trouser, the corset mini, the linen shirt, the tailored pant — because we believe that when you get the foundation right, everything else follows naturally.</p>
                  <p>LINE° is for women who are intentional about what they wear, who they are, and how they move through the world. The degree symbol in our name is a nod to precision — to doing something at exactly the right angle.</p>
                </div>
              </div>
              <div className="aspect-[3/4] overflow-hidden bg-[hsl(var(--muted))]">
                <img src={editorial2} alt="LINE° editorial" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-[hsl(var(--secondary))]">
          <div className="max-w-[1200px] mx-auto px-4 lg:px-8">
            <h2 className="font-display text-3xl font-light tracking-wide text-center mb-12">What we stand for</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Considered Design",
                  body: "Every seam, every silhouette, every fabric choice is made with intention. We don't design for trend cycles — we design for your real life.",
                },
                {
                  title: "Honest Pricing",
                  body: "Quality pieces at prices that don't require a second mortgage. We believe you shouldn't have to choose between good design and financial sanity.",
                },
                {
                  title: "Simplified Choice",
                  body: "We curate, not flood. A small, tightly edited catalog means you spend less time scrolling and more time actually wearing things.",
                },
              ].map((val) => (
                <div key={val.title} className="border border-border p-7 bg-white">
                  <h3 className="font-display text-xl font-light tracking-wide mb-3">{val.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{val.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 text-center">
          <div className="max-w-xl mx-auto px-4">
            <h2 className="font-display text-3xl font-light tracking-wide mb-4">Shop the Collection</h2>
            <p className="text-muted-foreground text-sm mb-7">Four pieces. Endless combinations. Designed to last.</p>
            <Link to="/shop" className="btn-primary text-xs px-10 py-3.5">Explore LINE°</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
