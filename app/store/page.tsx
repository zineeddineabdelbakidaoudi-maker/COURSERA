"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Package, Star, ShoppingCart, X, Zap, Loader2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import NeuralBackground from "@/components/ui/flow-field-background"

const TYPE_EMOJI: Record<string, string> = {
  template: "🎨",
  ebook: "📖",
  course: "🎓",
  toolkit: "🤖",
  bundle: "📦",
}

const TYPE_COLOR: Record<string, string> = {
  template: "text-violet-400 bg-violet-500/20 border-violet-500/30",
  ebook: "text-amber-400 bg-amber-500/20 border-amber-500/30",
  course: "text-blue-400 bg-blue-500/20 border-blue-500/30",
  toolkit: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30",
  bundle: "text-pink-400 bg-pink-500/20 border-pink-500/30",
}

export default function StorePage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")

  useEffect(() => {
    async function fetchData() {
      const { data: prods } = await supabase
        .from("DigitalProduct")
        .select("*, publisher:Profile!publisher_id(full_name, avatar_url), category:Category!category_id(name_en)")
        .eq("status", "live")
      setProducts(prods || [])

      const { data: cats } = await supabase.from("Category").select("name_en").eq("type", "products")
      if (cats) {
        setCategories(["All", ...cats.map(c => c.name_en)])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = products.filter(p => {
    const pCat = p.category?.name_en || "Other"
    const pTitle = p.title?.toLowerCase() || ""
    if (cat !== "All" && pCat !== cat) return false
    if (q && !pTitle.includes(q.toLowerCase())) return false
    return true
  })

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading products...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Animated Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 h-full">
          <NeuralBackground
            color="#818cf8"
            trailOpacity={0.15}
            particleCount={800}
            speed={0.8}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Zap className="w-3 h-3" /> Instant Download · Buy Once, Keep Forever
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              Digital Products <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Store</span>
            </h1>
            <p className="text-slate-400 font-medium">
              <span className="text-indigo-400 font-bold">{filtered.length}</span> premium assets — download and use immediately.
            </p>
          </div>

          <div className="relative max-w-xl mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              className="pl-11 h-12 rounded-xl bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
              placeholder="Search products..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${cat === c
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  : "border-white/10 text-slate-400 hover:border-indigo-500/30 hover:text-white bg-white/5"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Package className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-lg font-semibold text-slate-400 mb-2">No products found</p>
            <Button variant="ghost" className="mt-2 text-slate-500 hover:text-white" onClick={() => { setQ(""); setCat("All") }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Link key={p.id || i} href={`/store/${p.slug || p.id}`} className="group block">
                <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden h-full hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] hover:-translate-y-1 hover:border-indigo-500/20 transition-all duration-300">
                  <div className="h-48 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    {p.cover_url ? (
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/30 to-blue-900/30 gap-2">
                        <span className="text-5xl">{TYPE_EMOJI[p.type] || "📦"}</span>
                      </div>
                    )}
                    <Badge variant="outline" className={`absolute bottom-3 left-3 text-[10px] uppercase tracking-widest font-bold border ${TYPE_COLOR[p.type] || "text-slate-300 bg-slate-500/20 border-slate-500/30"}`}>
                      {p.type || "product"}
                    </Badge>
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-400 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-500/20">
                      <Star className="w-3 h-3 fill-current" /> 5.0
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-indigo-400 transition-colors line-clamp-2 text-white h-12">{p.title}</h3>
                    <p className="text-xs text-slate-500 mb-4 font-medium">by {p.publisher?.full_name || "Anonymous"}</p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <p className="text-xl font-black text-indigo-400">{Number(p.price_dzd).toLocaleString()} <span className="text-xs font-semibold text-slate-500">DZD</span></p>
                      <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all pointer-events-none">
                        <ShoppingCart className="w-3.5 h-3.5" /> Buy
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
