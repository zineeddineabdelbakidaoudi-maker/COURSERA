"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { Search, Filter, Star, Clock, ArrowRight, Zap, SlidersHorizontal, X, CheckCircle2 } from "lucide-react"

const CATEGORIES = ["All", "Design", "Web Dev", "Marketing", "Writing", "Video", "Music", "Business"]
const LEVELS = ["All Levels", "⭐ Rising", "🔥 Pro", "💎 Elite"]

const services = [
  { title: "Premium Brand Identity Design", seller: "Yacine M.", rating: 5.0, reviews: 142, price: 15000, delivery: "5 days", level: "Elite 💎", category: "Design", tags: ["logo", "branding"], img: "🎨" },
  { title: "Full-Stack Web App (Next.js)", seller: "Karim B.", rating: 4.9, reviews: 89, price: 45000, delivery: "14 days", level: "Elite 💎", category: "Web Dev", tags: ["react", "api"], img: "💻" },
  { title: "SEO Articles x5 (Arabic/French)", seller: "Nassima B.", rating: 4.8, reviews: 214, price: 2500, delivery: "3 days", level: "Pro 🔥", category: "Writing", tags: ["seo", "content"], img: "✍️" },
  { title: "Social Media 30-Post Pack", seller: "Amine K.", rating: 4.7, reviews: 67, price: 8000, delivery: "7 days", level: "Pro 🔥", category: "Marketing", tags: ["instagram", "canva"], img: "📱" },
  { title: "Motion Graphics & Intro Video", seller: "Sofiane R.", rating: 4.9, reviews: 53, price: 12000, delivery: "10 days", level: "Elite 💎", category: "Video", tags: ["after effects", "animation"], img: "🎬" },
  { title: "Professional Logo Design x3", seller: "Rania M.", rating: 4.6, reviews: 178, price: 3500, delivery: "4 days", level: "Rising ⭐", category: "Design", tags: ["logo", "illustrator"], img: "✨" },
  { title: "Landing Page (HTML/CSS)", seller: "Bilal Z.", rating: 4.5, reviews: 34, price: 6000, delivery: "6 days", level: "Rising ⭐", category: "Web Dev", tags: ["html", "css"], img: "🌐" },
  { title: "Arabic Podcast Editing & Mix", seller: "Djamel S.", rating: 4.8, reviews: 41, price: 4000, delivery: "3 days", level: "Pro 🔥", category: "Music", tags: ["audio", "podcast"], img: "🎙️" },
]

function Card3D({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)")
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    setT(`perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateZ(8px)`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setT("perspective(900px) rotateX(0deg) rotateY(0deg)")}
      style={{ transform: t, transition: "transform 0.12s ease", ...style }}>
      {children}
    </div>
  )
}

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
    <div style={{ background: "#020817", color: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(2,8,23,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={16} color="white" /></div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>Digit<span style={{ color: "#818cf8" }}>Hup</span></span>
        </Link>
        <nav style={{ display: "flex", gap: 24 }}>
          {[{ href: "/", l: "Home" }, { href: "/store", l: "Products" }, { href: "/how-it-works", l: "How It Works" }].map(n => (
            <Link key={n.l} href={n.href} style={{ color: "rgba(248,250,252,0.6)", textDecoration: "none", fontSize: 14 }}>{n.l}</Link>
          ))}
        </nav>
        <Link href="/register" style={{ padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Get Started</Link>
      </header>

      {/* HEADER */}
      <div style={{ paddingTop: 100, paddingBottom: 40, padding: "100px 24px 40px", background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12), transparent 60%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 12 }}>
            Find a <span style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Service</span>
          </h1>
          <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 16, marginBottom: 32 }}>
            {filtered.length} results — verified Algerian professionals ready to help.
          </p>

          {/* Search+Filter Bar */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "0 16px" }}>
              <Search size={18} color="rgba(248,250,252,0.3)" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search services or sellers..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f8fafc", fontSize: 15, padding: "14px 0" }} />
              {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,250,252,0.4)" }}><X size={16} /></button>}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "0 20px", borderRadius: 14, background: showFilters ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${showFilters ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)"}`, color: showFilters ? "#818cf8" : "rgba(248,250,252,0.7)", display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(248,250,252,0.5)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Max Price: {maxPrice.toLocaleString()} DZD</p>
                <input type="range" min={1000} max={100000} step={1000} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                  style={{ width: 220, accentColor: "#6366f1" }} />
              </div>
            </div>
          )}

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 18px", borderRadius: 100, border: `1px solid ${cat === c ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.1)"}`, background: cat === c ? "rgba(99,102,241,0.2)" : "transparent", color: cat === c ? "#818cf8" : "rgba(248,250,252,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "rgba(248,250,252,0.3)" }}>
            <Search size={48} style={{ margin: "0 auto 16px", display: "block" }} />
            <p style={{ fontSize: 18, fontWeight: 600 }}>No services found</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {filtered.map((s, i) => (
              <Card3D key={i}>
                <Link href={`/services/${i + 1}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <div style={{ borderRadius: 22, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", transition: "none" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 24px 60px rgba(99,102,241,0.15)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.boxShadow = "none" }}>
                    <div style={{ height: 150, background: `linear-gradient(135deg, hsl(${200 + i * 25},60%,18%), hsl(${220 + i * 25},70%,12%))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative" }}>
                      {s.img}
                      <div style={{ position: "absolute", top: 12, right: 12, padding: "4px 10px", borderRadius: 8, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, backdropFilter: "blur(8px)" }}>
                        {s.level}
                      </div>
                    </div>
                    <div style={{ padding: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{s.seller.charAt(0)}</div>
                        <span style={{ fontSize: 13, color: "rgba(248,250,252,0.55)" }}>{s.seller}</span>
                      </div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 12 }}>{s.title}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fbbf24", fontSize: 13, fontWeight: 700 }}>
                          <Star size={13} fill="#fbbf24" /> {s.rating} ({s.reviews})
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(248,250,252,0.4)", fontSize: 12 }}>
                          <Clock size={12} /> {s.delivery}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                        {s.tags.map(tag => (
                          <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8", textTransform: "uppercase", letterSpacing: 0.5 }}>{tag}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                        <div>
                          <p style={{ fontSize: 10, color: "rgba(248,250,252,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Starting at</p>
                          <p style={{ fontSize: 18, fontWeight: 800, color: "#a5f3fc" }}>{s.price.toLocaleString()} DZD</p>
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <ArrowRight size={16} color="#818cf8" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card3D>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
