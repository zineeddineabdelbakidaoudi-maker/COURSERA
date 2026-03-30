"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Package, Star, ShoppingCart, X, Loader2, SlidersHorizontal, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar"
import { AnimatedPageWrapper } from "@/components/ui/animated-page-wrapper"
import { ProductCard } from "@/components/ui/product-card"

const TYPE_EMOJI: Record<string, string> = {
  template: "🎨",
  ebook: "📖",
  course: "🎓",
  toolkit: "🤖",
  bundle: "📦",
}

export default function StorePage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["All Assets"])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All Assets")
  const [q, setQ] = useState("")

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchData() {
      const { data: prods } = await supabase
        .from("DigitalProduct")
        .select("*, publisher:Profile!publisher_id(full_name, avatar_url, seller_level), category:Category!category_id(name_en)")
        .eq("status", "live")

      setProducts(prods || [])

      const { data: cats } = await supabase.from("Category").select("name_en").or("type.eq.products,type.eq.both")
      if (cats) {
        setCategories(["All Assets", ...cats.map(c => c.name_en)])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 40,
      y: (clientY / window.innerHeight - 0.5) * 40,
    });
  };

  const filtered = products.filter(p => {
    const pCat = p.category?.name_en || "Other"
    const pTitle = p.title?.toLowerCase() || ""
    if (cat !== "All Assets" && pCat !== cat) return false
    if (q && !pTitle.includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      <Navbar />

      <AnimatedPageWrapper>
        <main className="pt-20">
          {/* --- HERO SECTION --- */}
          <section 
            className="relative overflow-hidden bg-white px-6 py-24 border-b border-gray-100"
            onMouseMove={handleHeroMouseMove}
          >
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30">
              {/* 3D-like background shapes with parallax */}
              <div 
                className="absolute h-64 w-64 translate-x-48 -translate-y-24 rotate-45 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-2xl transition-transform duration-500 ease-out" 
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(45deg)` }}
              />
              <div 
                className="absolute h-48 w-48 -translate-x-64 translate-y-12 rotate-12 rounded-full border border-gray-200 bg-gradient-to-tr from-gray-50 to-white shadow-xl transition-transform duration-700 ease-out" 
                style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(12deg)` }}
              />
              <div 
                className="absolute h-[600px] w-[600px] rounded-full border border-gray-200 opacity-20 transition-transform duration-1000 ease-out" 
                style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-medium tracking-tight text-black md:text-7xl">
                Premium Digital <br />
                <span className="text-black">Store</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500">
                Instantly level up your workflow with premium templates, 3D assets, UI kits, and expert scripts in Algeria.
              </p>

              {/* SEARCH & FILTERS */}
              <div className="mx-auto flex max-w-3xl flex-col gap-4">
                <div className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-lg transition-shadow focus-within:shadow-xl">
                  <Search className="ml-4 h-5 w-5 text-gray-400" />
                  <Input
                    className="border-none bg-transparent py-6 text-lg placeholder:text-gray-400 focus-visible:ring-0 px-4"
                    placeholder="Search for templates, UI kits, ebooks..."
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                  {q && (
                     <button onClick={() => setQ('')} className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-4 w-4 text-gray-500" />
                     </button>
                  )}
                  <Button className="mr-1 h-12 rounded-xl bg-black px-8 text-white hover:bg-gray-800 transition-colors shadow-none font-medium">
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={[
                        'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                        cat === c
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-black shadow-sm',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-500 hover:border-black hover:text-black transition-colors shadow-sm ml-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- Grid SECTION --- */}
          <section className="bg-[#FAFAFA] px-6 py-20">
             <div className="mx-auto max-w-7xl">
               <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <h2 className="text-2xl font-medium tracking-tight text-black">Top Selling Products</h2>
                 <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{filtered.length} Items found</span>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 animate-pulse border border-gray-200" />)}
                 </div>
               ) : filtered.length === 0 ? (
                 <div className="text-center py-24">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">No products match your criteria.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((p) => {
                       const publisherName = p.publisher?.full_name || "Anonymous"
                       const isTopRated = p.publisher?.seller_level === "elite" || p.publisher?.seller_level === "pro"
                       
                       return (
                          <Link key={p.id} href={`/store/${p.slug || p.id}`} className="block">
                             <ProductCard
                               index={filtered.indexOf(p)}
                               title={p.title}
                               subtitle={`by ${publisherName}`}
                               price={`${Number(p.price_dzd).toLocaleString()} DZD`}
                               imageUrl={p.cover_url || ""}
                               badgeText={p.type || "Asset"}
                               actionButton={
                                 <Button className="rounded-2xl bg-black px-6 py-2.5 text-xs font-semibold tracking-wide text-white transition-all hover:bg-gray-800 shadow-none">
                                   Buy Now
                                 </Button>
                               }
                             />
                          </Link>
                       )
                    })}
                 </div>
               )}
             </div>
          </section>

          {/* --- WHY CHOOSE DIGITHUB STORE --- */}
          <section className="bg-white px-6 py-24 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Why Buy From Us</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Instant access to premium content vetted by experts.</p>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {[
                  { 
                    icon: ShieldCheck, 
                    title: 'Tested & Verified', 
                    desc: 'Every file is manually scanned and tested to ensure the highest code and design quality.' 
                  },
                  { 
                    icon: Zap, 
                    title: 'Instant Delivery', 
                    desc: 'Get a secure download link instantly after your payment is confirmed.' 
                  },
                  { 
                    icon: CheckCircle2, 
                    title: 'Lifetime Updates', 
                    desc: 'Receive free updates whenever the creator publishes a new version of the asset.' 
                  },
                ].map((prop) => (
                  <div key={prop.title} className="group p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 transition-transform group-hover:scale-110">
                      <prop.icon className="h-7 w-7 text-black" />
                    </div>
                    <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-black">{prop.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{prop.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </main>
      </AnimatedPageWrapper>
    </div>
  )
}
