"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Package, Star, ShoppingCart, X, Zap, Loader2, BookOpen, SlidersHorizontal, Briefcase, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { MeshGradient } from "@paper-design/shaders-react"
import { Navbar } from "@/components/layout/navbar"

const TYPE_EMOJI: Record<string, string> = {
  template: "🎨",
  ebook: "📖",
  course: "🎓",
  toolkit: "🤖",
  bundle: "📦",
}

const TYPE_COLOR: Record<string, string> = {
  template: "text-black bg-black/5 border-black/10",
  ebook: "text-black bg-black/5 border-black/10",
  course: "text-black bg-black/5 border-black/10",
  toolkit: "text-black bg-black/5 border-black/10",
  bundle: "text-black bg-black/5 border-black/10",
}

export default function StorePage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")
  const [showFilters, setShowFilters] = useState(false)

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-black/40" />
        </div>
        <p className="text-gray-400 text-sm font-medium">Opening store...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      {/* Animated Header */}
      <div className="relative overflow-hidden border-b border-black/5 bg-white">
        <div className="fixed inset-0 pointer-events-none z-0">
          <MeshGradient
            className="w-full h-full opacity-30"
            colors={["#ffffff", "#fafafa", "#f5f5f5", "#eeeeee"]}
            speed={0.4}
            backgroundColor="#ffffff"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/10 bg-black/5 text-black/60 text-xs font-bold tracking-widest uppercase mb-4">
                <Package className="w-3 h-3" /> Digital Assets
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                Digital <span className="text-gray-400">Store</span>
              </h1>
              <p className="text-gray-500 font-medium">
                Premium templates, scripts, and assets at your fingertips.
              </p>
            </div>
            <Button
              variant="outline"
              className={`gap-2 border-black/10 bg-white text-black hover:bg-black/5 ${showFilters ? "border-black/40 bg-black/5" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-11 h-12 rounded-xl bg-white border-black/10 text-black placeholder:text-gray-400 focus:border-black/40 focus:ring-black/5"
              placeholder="Search products..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${cat === c
                  ? "bg-black text-white border-black shadow-md"
                  : "border-black/10 text-gray-400 hover:border-black/30 hover:text-black bg-white"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Package className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-lg font-semibold text-gray-500 mb-2">No products found</p>
            <Button variant="ghost" className="mt-2 text-gray-400 hover:text-black" onClick={() => { setQ(""); setCat("All") }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Link key={p.id || i} href={`/store/${p.slug || p.id}`} className="group block">
                <div className="bg-white border border-black/5 rounded-2xl overflow-hidden h-full hover:shadow-xl hover:-translate-y-1 hover:border-black/10 transition-all duration-300">
                  <div className="h-48 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    {p.cover_url ? (
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 gap-2">
                        <span className="text-5xl">{TYPE_EMOJI[p.type] || "📦"}</span>
                      </div>
                    )}
                    <Badge variant="outline" className={`absolute bottom-3 left-3 text-[10px] uppercase tracking-widest font-bold border ${TYPE_COLOR[p.type] || "text-gray-500 bg-gray-100 border-gray-200"}`}>
                      {p.type || "product"}
                    </Badge>
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-black bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-black/10">
                      <Star className="w-3 h-3 fill-current" /> 5.0
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-black/60 transition-colors line-clamp-2 text-black h-12">{p.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 font-medium">by {p.publisher?.full_name || "Anonymous"}</p>

                    <div className="flex items-center justify-between border-t border-black/5 pt-4">
                      <p className="text-xl font-black text-black">{Number(p.price_dzd).toLocaleString()} <span className="text-xs font-semibold text-gray-400">DZD</span></p>
                      <Button size="sm" className="gap-2 bg-black hover:bg-black/90 text-white shadow-lg transition-all pointer-events-none">
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
