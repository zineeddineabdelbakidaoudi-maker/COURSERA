"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Package, Star, ShoppingCart, X, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const CATEGORIES = ["All", "Templates", "E-books", "Courses", "Documents", "Tools", "Bundles"]

const products = [
  { title: "Ultimate Figma UI Design System 2026", author: "DigitHup Pro", type: "Template", price: 5000, rating: 4.9, sales: 342, emoji: "🎨", tags: ["figma", "ui kit"] },
  { title: "Freelancer Starter Bundle (Contract + Invoice)", author: "LegalDZ", type: "Documents", price: 1500, rating: 4.8, sales: 812, emoji: "📄", tags: ["legal", "freelance"] },
  { title: "E-Commerce Masterclass 2026 (Arabic)", author: "E-Com DZ", type: "Course", price: 12000, rating: 4.9, sales: 198, emoji: "🎓", tags: ["ecommerce", "arabic"] },
  { title: "Brand Identity Presentation Template", author: "Design Studio DZ", type: "Template", price: 2500, rating: 4.7, sales: 456, emoji: "🖼️", tags: ["powerpoint", "pitch"] },
  { title: "Social Media Scheduler Script (Python)", author: "DevAlgeria", type: "Tools", price: 3000, rating: 4.6, sales: 87, emoji: "🤖", tags: ["python", "script"] },
  { title: "Arabic SEO Complete Guide 2026", author: "SEO DZ", type: "E-books", price: 800, rating: 4.8, sales: 1203, emoji: "📖", tags: ["seo", "arabic"] },
]

const GRADIENT_PAIRS = [
  "from-violet-500/15 to-purple-500/10",
  "from-blue-500/15 to-cyan-500/10",
  "from-rose-500/15 to-pink-500/10",
  "from-amber-500/15 to-orange-500/10",
  "from-indigo-500/15 to-blue-500/10",
  "from-emerald-500/15 to-teal-500/10",
]

export default function StorePage() {
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")

  const filtered = products.filter(p => {
    if (cat !== "All" && p.type !== cat) return false
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

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
            <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold">No products found</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setQ(""); setCat("All") }}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <Card key={i} className="border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 overflow-hidden group">
                {/* Header */}
                <div className={`h-40 bg-gradient-to-br ${GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]} flex flex-col items-center justify-center relative gap-2`}>
                  <span className="text-5xl">{p.emoji}</span>
                  <Badge variant="outline" className="text-xs bg-background/60 backdrop-blur-sm shadow-sm">{p.type}</Badge>
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-500 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-200/30">
                    <Star className="w-3 h-3 fill-current" /> {p.rating}
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-bold text-base leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">by {p.author} · <span className="font-semibold">{p.sales.toLocaleString()} sales</span></p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
                      <p className="text-xl font-black text-primary">{p.price.toLocaleString()} <span className="text-xs font-semibold text-muted-foreground">DZD</span></p>
                    </div>
                    <Button size="sm" className="gap-2 shadow-sm">
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
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
