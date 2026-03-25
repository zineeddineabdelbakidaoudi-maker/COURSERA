"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Star, Clock, ArrowRight, SlidersHorizontal, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = ["All", "Design", "Web Dev", "Marketing", "Writing", "Video", "Music", "Business"]

const services = [
  { title: "Premium Brand Identity Design", seller: "Yacine M.", rating: 5.0, reviews: 142, price: 15000, delivery: "5 days", level: "Elite", category: "Design", tags: ["logo", "branding"] },
  { title: "Full-Stack Web App (Next.js)", seller: "Karim B.", rating: 4.9, reviews: 89, price: 45000, delivery: "14 days", level: "Elite", category: "Web Dev", tags: ["react", "api"] },
  { title: "SEO Articles x5 (Arabic/French)", seller: "Nassima B.", rating: 4.8, reviews: 214, price: 2500, delivery: "3 days", level: "Pro", category: "Writing", tags: ["seo", "content"] },
  { title: "Social Media 30-Post Pack", seller: "Amine K.", rating: 4.7, reviews: 67, price: 8000, delivery: "7 days", level: "Pro", category: "Marketing", tags: ["instagram", "canva"] },
  { title: "Motion Graphics & Intro Video", seller: "Sofiane R.", rating: 4.9, reviews: 53, price: 12000, delivery: "10 days", level: "Elite", category: "Video", tags: ["after effects", "animation"] },
  { title: "Professional Logo Design x3", seller: "Rania M.", rating: 4.6, reviews: 178, price: 3500, delivery: "4 days", level: "Rising", category: "Design", tags: ["logo", "illustrator"] },
  { title: "Landing Page (HTML/CSS)", seller: "Bilal Z.", rating: 4.5, reviews: 34, price: 6000, delivery: "6 days", level: "Rising", category: "Web Dev", tags: ["html", "css"] },
  { title: "Arabic Podcast Editing & Mix", seller: "Djamel S.", rating: 4.8, reviews: 41, price: 4000, delivery: "3 days", level: "Pro", category: "Music", tags: ["audio", "podcast"] },
]

const LEVEL_STYLE: Record<string, string> = {
  Elite: "bg-amber-500/10 text-amber-600 border-amber-200",
  Pro: "bg-blue-500/10 text-blue-600 border-blue-200",
  Rising: "bg-green-500/10 text-green-600 border-green-200",
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
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")
  const [maxPrice, setMaxPrice] = useState(100000)
  const [showFilters, setShowFilters] = useState(false)

  const filtered = services.filter(s => {
    if (cat !== "All" && s.category !== cat) return false
    if (q && !s.title.toLowerCase().includes(q.toLowerCase()) && !s.seller.toLowerCase().includes(q.toLowerCase())) return false
    if (s.price > maxPrice) return false
    return true
  })

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
              <input type="range" min={1000} max={100000} step={500} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} className="w-full max-w-xs accent-primary" />
            </div>
          )}

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
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
            {filtered.map((s, i) => (
              <Link key={i} href={`/services/${i + 1}`} className="group block no-underline">
                <Card className="border-border shadow-sm h-full hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden">
                  {/* Card header with gradient */}
                  <div className={`h-28 bg-gradient-to-br ${GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]} flex items-center justify-center relative`}>
                    <span className="text-4xl select-none">
                      {["🎨","💻","✍️","📱","🎬","✨","🌐","🎙️"][i % 8]}
                    </span>
                    <Badge variant="outline" className={`absolute top-2.5 right-2.5 text-[10px] shadow-sm ${LEVEL_STYLE[s.level]}`}>
                      {s.level}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    {/* Seller */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {s.seller.charAt(0)}
                      </div>
                      <span className="text-xs text-muted-foreground">{s.seller}</span>
                    </div>

                    <h3 className="font-semibold text-sm leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">{s.title}</h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {s.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">{tag}</span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star className="w-3 h-3 fill-current" />{s.rating}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.delivery}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">{s.price.toLocaleString()} DZD</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
