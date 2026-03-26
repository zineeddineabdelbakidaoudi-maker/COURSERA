"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Star, Clock, ArrowRight, SlidersHorizontal, X, Loader2, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

const LEVEL_STYLE: Record<string, string> = {
  elite: "bg-amber-500/10 text-amber-600 border-amber-200",
  pro: "bg-blue-500/10 text-blue-600 border-blue-200",
  rising: "bg-green-500/10 text-green-600 border-green-200",
  new: "bg-gray-500/10 text-gray-600 border-gray-200",
}

const GRADIENT_PAIRS = [
  "from-violet-500/15 to-indigo-500/10",
  "from-sky-500/15 to-cyan-500/10",
  "from-rose-500/15 to-pink-500/10",
  "from-amber-500/15 to-orange-500/10",
  "from-indigo-500/15 to-purple-500/10",
  "from-teal-500/15 to-emerald-500/10",
  "from-blue-500/15 to-sky-500/10",
  "from-fuchsia-500/15 to-violet-500/10",
]

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")
  const [maxPrice, setMaxPrice] = useState(200000)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const { data: srvs } = await supabase
        .from("Service")
        .select("*, seller:Profile!seller_id(full_name, seller_level), category:Category!category_id(name_en)")
        .eq("status", "live")
      
      setServices(srvs || [])

      const { data: cats } = await supabase.from("Category").select("name_en").eq("type", "services")
      if (cats) {
        setCategories(["All", ...cats.map(c => c.name_en)])
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const filtered = services.filter(s => {
    const sCat = s.category?.name_en || "Other"
    const sTitle = s.title?.toLowerCase() || ""
    const sSeller = s.seller?.full_name?.toLowerCase() || ""
    const basePrice = s.packages?.basic?.price || s.packages?.Basic?.price || 0

    if (cat !== "All" && sCat !== cat) return false
    if (q && !sTitle.includes(q.toLowerCase()) && !sSeller.includes(q.toLowerCase())) return false
    if (basePrice > maxPrice) return false
    return true
  })

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-muted/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                Browse Services
              </h1>
              <p className="text-muted-foreground">
                {filtered.length} verified Algerian professionals ready to deliver.
              </p>
            </div>
            <Button variant="outline" className={`gap-2 ${showFilters ? "border-primary text-primary" : ""}`} onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-10 h-12 rounded-xl" placeholder="Search by service, skill, or seller..." value={q} onChange={e => setQ(e.target.value)} />
            {q && <button onClick={() => setQ("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-4 p-4 rounded-xl border border-border bg-background/60 backdrop-blur-sm">
              <p className="text-sm font-semibold mb-2 text-muted-foreground">Max Price: <span className="text-foreground">{maxPrice.toLocaleString()} DZD</span></p>
              <input type="range" min={1000} max={200000} step={1000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full max-w-xs accent-primary" />
            </div>
          )}

          {/* Category pills */}
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
            <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No services match your filters</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setQ(""); setCat("All"); setMaxPrice(100000) }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s, i) => {
              const basePrice = s.packages?.basic?.price || s.packages?.Basic?.price || 0
              const sellerName = s.seller?.full_name || "Anonymous"
              const sellerLevel = s.seller?.seller_level || "new"
              
              return (
              <Link key={s.id || i} href={`/services/${s.slug || s.id}`} className="group block no-underline">
                <Card className="border-border shadow-sm h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden">
                  <div className={`h-28 bg-muted relative border-b border-border overflow-hidden`}>
                    {s.thumbnail_url ? (
                      <img src={s.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                        <Briefcase className="w-10 h-10 text-primary/20" />
                      </div>
                    )}
                    <Badge variant="outline" className={`absolute top-2.5 right-2.5 text-[10px] shadow-sm uppercase ${LEVEL_STYLE[sellerLevel] || LEVEL_STYLE.new}`}>
                      {sellerLevel}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {sellerName.charAt(0)}
                      </div>
                      <span className="text-xs text-muted-foreground">{sellerName}</span>
                    </div>

                    <h3 className="font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors h-10">{s.title}</h3>

                    <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star className="w-3 h-3 fill-current" />5.0</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{(s.packages?.basic?.delivery || 3)}d</span>
                      </div>
                      <span className="text-xs font-bold text-primary">{Number(basePrice).toLocaleString()} DZD</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
