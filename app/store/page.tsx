"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Package, Star, ShoppingCart, X, Zap, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

const GRADIENT_PAIRS = [
  "from-violet-500/15 to-purple-500/10",
  "from-blue-500/15 to-cyan-500/10",
  "from-rose-500/15 to-pink-500/10",
  "from-amber-500/15 to-orange-500/10",
  "from-indigo-500/15 to-blue-500/10",
  "from-emerald-500/15 to-teal-500/10",
]

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
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")

  useEffect(() => {
    async function fetchData() {
      const { data: prods } = await supabase
        .from("DigitalProduct")
        .select("*, publisher:Profile!publisher_id(full_name), category:Category!category_id(name_en)")
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
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary mb-4">
              <Zap className="w-3 h-3" /> Instant Download · Buy Once, Keep Forever
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
              Digital Products Store
            </h1>
            <p className="text-muted-foreground">{filtered.length} premium assets — download and use immediately.</p>
          </div>

          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 h-12 rounded-xl" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} />
            {q && <button onClick={() => setQ("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="w-4 h-4" /></button>}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${cat === c ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground bg-background"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No products found</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setQ(""); setCat("All") }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Card key={p.id || i} className="border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden group">
                <Link href={`/store/${p.slug || p.id}`} className="absolute inset-0 z-10" />
                <div className={`h-40 bg-muted relative flex flex-col items-center justify-center gap-2 overflow-hidden`}>
                  {p.cover_url ? (
                    <img src={p.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-5xl">{TYPE_EMOJI[p.type] || "📦"}</span>
                  )}
                  <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm shadow-sm absolute bottom-3 left-3 z-20 uppercase tracking-widest">{p.type}</Badge>
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-500 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-200/30 z-20">
                    <Star className="w-3 h-3 fill-current" /> 5.0
                  </div>
                </div>

                <CardContent className="p-5 relative z-20 pointer-events-none">
                  <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2 h-10">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 font-medium">by {p.publisher?.full_name || "Anonymous"}</p>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xl font-black text-primary">{Number(p.price_dzd).toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">DZD</span></p>
                    </div>
                    <Button size="sm" className="gap-2 shadow-sm pointer-events-auto relative z-30">
                      <ShoppingCart className="w-3.5 h-3.5" /> Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
