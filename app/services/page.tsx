"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Star, Clock, ArrowRight, SlidersHorizontal, X, Loader2, Briefcase, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import NeuralBackground from "@/components/ui/flow-field-background"

const LEVEL_STYLE: Record<string, string> = {
  elite: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  pro: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  rising: "bg-green-500/20 text-green-300 border-green-500/30",
  new: "bg-slate-500/20 text-slate-300 border-slate-500/30",
}

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
        .select("*, seller:Profile!seller_id(full_name, avatar_url, seller_level), category:Category!category_id(name_en)")
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
        </div>
        <p className="text-slate-500 text-sm font-medium">Loading services...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Animated Header */}
      <div className="relative overflow-hidden border-b border-white/5 bg-slate-900/50 backdrop-blur-sm">
        <div className="fixed inset-0 pointer-events-none z-0">
          <NeuralBackground
            color="#3b82f6"
            trailOpacity={0.15}
            particleCount={800}
            speed={0.8}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900 z-[1]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
                <Zap className="w-3 h-3" /> Live Marketplace
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Services</span>
              </h1>
              <p className="text-slate-400 font-medium">
                <span className="text-blue-400 font-bold">{filtered.length}</span> verified Algerian professionals ready to deliver.
              </p>
            </div>
            <Button
              variant="outline"
              className={`gap-2 border-white/10 bg-white/5 text-white hover:bg-blue-500/10 hover:border-blue-500/30 ${showFilters ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-xl mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              className="pl-11 h-12 rounded-xl bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              placeholder="Search by service, skill, or seller..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            {q && <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-5 p-4 rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-sm">
              <p className="text-sm font-semibold mb-3 text-slate-400">Max Price: <span className="text-blue-400 font-black">{maxPrice.toLocaleString()} DZD</span></p>
              <input type="range" min={1000} max={200000} step={1000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full max-w-xs accent-blue-500" />
            </div>
          )}

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${cat === c
                  ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "border-white/10 text-slate-400 hover:border-blue-500/30 hover:text-white bg-white/5"}`}>
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
              <Search className="w-8 h-8 opacity-30" />
            </div>
            <p className="text-lg font-semibold text-slate-400 mb-2">No services match your filters</p>
            <Button variant="ghost" className="mt-2 text-slate-500 hover:text-white" onClick={() => { setQ(""); setCat("All"); setMaxPrice(200000) }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s, i) => {
              const basePrice = s.packages?.basic?.price || s.packages?.Basic?.price || 0
              const sellerName = s.seller?.full_name || "Anonymous"
              const sellerLevel = s.seller?.seller_level || "new"

              return (
                <Link key={s.id || i} href={`/services/${s.slug || s.id}`} className="group block no-underline">
                  <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden h-full hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 hover:border-blue-500/20 transition-all duration-300">
                    <div className="h-36 bg-slate-800 relative overflow-hidden">
                      {s.thumbnail_url ? (
                        <img
                          src={s.thumbnail_url}
                          alt={s.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/30 to-indigo-900/30">
                          <Briefcase className="w-10 h-10 text-blue-400/20" />
                        </div>
                      )}
                      <Badge variant="outline" className={`absolute top-2.5 right-2.5 text-[10px] shadow-sm uppercase border ${LEVEL_STYLE[sellerLevel] || LEVEL_STYLE.new}`}>
                        {sellerLevel}
                      </Badge>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                          {sellerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs text-slate-400 font-medium truncate">{sellerName}</span>
                      </div>

                      <h3 className="font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors text-white h-10">{s.title}</h3>

                      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-auto">
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1 text-amber-400 font-semibold"><Star className="w-3 h-3 fill-current" />5.0</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{(s.packages?.basic?.delivery || 3)}d</span>
                        </div>
                        <span className="text-xs font-bold text-blue-400">{Number(basePrice).toLocaleString()} DZD</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
