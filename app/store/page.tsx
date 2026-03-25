"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import { Search, Zap, Package, ArrowRight, Star, X, ShoppingCart, Download } from "lucide-react"

const CATEGORIES = ["All", "Templates", "E-books", "Courses", "Documents", "Tools", "Bundles"]

const products = [
  { title: "Ultimate Figma UI Design System 2026", author: "DigitHup Pro", type: "Template", price: 5000, rating: 4.9, sales: 342, emoji: "🎨", tags: ["figma", "ui kit", "components"] },
  { title: "Freelancer Starter Bundle (Contract + Invoice)", author: "LegalDZ", type: "Documents", price: 1500, rating: 4.8, sales: 812, emoji: "📄", tags: ["legal", "freelance", "templates"] },
  { title: "E-Commerce Masterclass 2026 (Arabic)", author: "E-Com DZ", type: "Course", price: 12000, rating: 4.9, sales: 198, emoji: "🎓", tags: ["ecommerce", "business", "arabic"] },
  { title: "Brand Identity Presentation Template", author: "Design Studio DZ", type: "Template", price: 2500, rating: 4.7, sales: 456, emoji: "🖼️", tags: ["powerpoint", "pitch", "brand"] },
  { title: "Social Media Scheduler Script (Python)", author: "DevAlgeria", type: "Tools", price: 3000, rating: 4.6, sales: 87, emoji: "🤖", tags: ["python", "automation", "social"] },
  { title: "Arabic SEO Complete Guide 2026", author: "SEO DZ", type: "E-books", price: 800, rating: 4.8, sales: 1203, emoji: "📖", tags: ["seo", "arabic", "marketing"] },
]

function Card3D({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [t, setT] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)")
  return (
    <div ref={ref}
      onMouseMove={e => { const r = ref.current!.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5; const y = (e.clientY - r.top) / r.height - 0.5; setT(`perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(10px)`) }}
      onMouseLeave={() => setT("perspective(900px) rotateX(0deg) rotateY(0deg)")}
      style={{ transform: t, transition: "transform 0.12s ease", ...style }}>
      {children}
    </div>
  )
}

export default function StorePage() {
  const [cat, setCat] = useState("All")
  const [q, setQ] = useState("")

  const filtered = products.filter(p => {
    if (cat !== "All" && p.type !== cat) return false
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false
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
          {[{ href: "/", l: "Home" }, { href: "/services", l: "Services" }, { href: "/how-it-works", l: "How It Works" }].map(n => (
            <Link key={n.l} href={n.href} style={{ color: "rgba(248,250,252,0.6)", textDecoration: "none", fontSize: 14 }}>{n.l}</Link>
          ))}
        </nav>
        <Link href="/register" style={{ padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Get Started</Link>
      </header>

      {/* HERO */}
      <div style={{ paddingTop: 100, paddingBottom: 48, padding: "100px 24px 48px", background: "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.12), transparent 60%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, border: "1px solid rgba(168,85,247,0.35)", background: "rgba(168,85,247,0.08)", color: "#c084fc", fontSize: 12, fontWeight: 700, marginBottom: 20 }}>
            <Zap size={12} /> Instant Download · Buy Once, Keep Forever
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 12 }}>
            Browse <span style={{ background: "linear-gradient(135deg,#c084fc,#f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Digital Tools</span>
          </h1>
          <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 16, marginBottom: 32 }}>
            {filtered.length} premium assets — ready to download and use immediately.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: 1, minWidth: 280, display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "0 16px" }}>
              <Search size={18} color="rgba(248,250,252,0.3)" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..."
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f8fafc", fontSize: 15, padding: "14px 0" }} />
              {q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(248,250,252,0.4)" }}><X size={16} /></button>}
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: "8px 18px", borderRadius: 100, border: `1px solid ${cat === c ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)"}`, background: cat === c ? "rgba(168,85,247,0.2)" : "transparent", color: cat === c ? "#c084fc" : "rgba(248,250,252,0.55)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {filtered.map((p, i) => (
            <Card3D key={i}>
              <div style={{ borderRadius: 26, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", padding: 8, transition: "none" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(168,85,247,0.45)"; el.style.boxShadow = "0 30px 80px rgba(168,85,247,0.15)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.07)"; el.style.boxShadow = "none" }}>
                {/* Product Image */}
                <div style={{ height: 180, borderRadius: 20, background: `linear-gradient(135deg, rgba(168,85,247,${0.12 + i * 0.02}), rgba(99,102,241,0.1))`, border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                  {/* Glassmorphism shimmer */}
                  <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(168,85,247,0.15)", filter: "blur(40px)" }} />
                  <div style={{ fontSize: 56, position: "relative", zIndex: 1 }}>{p.emoji}</div>
                  <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 8, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 700, color: "rgba(248,250,252,0.7)", backdropFilter: "blur(8px)" }}>
                    {p.type}
                  </div>
                  <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 8, background: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 700, color: "#fbbf24" }}>
                    <Star size={11} fill="#fbbf24" /> {p.rating}
                  </div>
                </div>

                <div style={{ padding: "4px 12px 14px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, lineHeight: 1.35 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginBottom: 12 }}>by {p.author} · {p.sales.toLocaleString()} sales</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {p.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc", textTransform: "uppercase", letterSpacing: 0.5 }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#e879f9" }}>{p.price.toLocaleString()} <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(248,250,252,0.4)" }}>DZD</span></span>
                    <button style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "rgba(248,250,252,0.95)", color: "#020817", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>
                      <ShoppingCart size={14} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </div>
  )
}
