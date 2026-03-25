"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search, Sparkles, Star, Users, ArrowRight, ShieldCheck,
  CheckCircle2, Zap, Package, Menu, X, LogOut, LayoutDashboard
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const NAV_LINKS = [
  { href: "/services", label: "Explore Services" },
  { href: "/store", label: "Browse Products" },
  { href: "/how-it-works", label: "How It Works" },
]

const SERVICES = [
  { title: "Brand Identity Design", author: "Yassine M.", rating: 4.9, price: "From 15,000 DZD", category: "Design", emoji: "🎨" },
  { title: "React & Next.js Development", author: "Karim B.", rating: 5.0, price: "From 45,000 DZD", category: "Tech", emoji: "💻" },
  { title: "SEO Arabic Copywriting", author: "Nassima B.", rating: 4.8, price: "From 2,500 DZD", category: "Writing", emoji: "✍️" },
  { title: "Social Media Management", author: "Amine K.", rating: 4.7, price: "From 20,000 DZD", category: "Marketing", emoji: "📱" },
]

const PRODUCTS = [
  { title: "Ultimate UI/UX Design System", author: "DigitHup Pro", type: "Figma Template", price: "5,000 DZD", sales: 124 },
  { title: "Freelancer Contract Pack", author: "LegalDZ", type: "Document Bundle", price: "1,500 DZD", sales: 342 },
  { title: "E-Commerce Masterclass 2026", author: "E-Com DZ", type: "Video Course", price: "12,000 DZD", sales: 89 },
]

export default function HomePage() {
  const supabase = createClient()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from("Profile").select("full_name, role, avatar_url").eq("id", user.id).single().then(({ data }) => setProfile(data))
      }
    })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/services?q=${encodeURIComponent(searchQuery)}`)
  }

  const getDashLink = () => {
    if (!profile) return "/dashboard"
    if (profile.role === "admin") return "/admin"
    if (profile.role === "buyer") return "/dashboard/buyer"
    return "/dashboard"
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const initials = profile?.full_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U"

  return (
    <div style={{ background: "#020817", color: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(2,8,23,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        transition: "all 0.25s ease"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.5px" }}>Digit<span style={{ color: "#818cf8" }}>Hup</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <nav style={{ display: "flex", gap: 32, listStyle: "none" }} className="hidden-mobile">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ color: "rgba(248,250,252,0.7)", textDecoration: "none", fontSize: 15, fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#f8fafc")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,250,252,0.7)")}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Auth Area */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {user ? (
              <>
                <Link href={getDashLink()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button onClick={handleLogout} style={{ padding: "8px 14px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <LogOut size={15} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: "rgba(248,250,252,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 600, padding: "8px 16px" }}>Log In</Link>
                <Link href="/register" style={{ padding: "9px 20px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>
                  Get Started
                </Link>
              </>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "none" }} className="show-mobile">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: "rgba(2,8,23,0.98)", backdropFilter: "blur(16px)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", color: "rgba(248,250,252,0.8)", textDecoration: "none", fontSize: 16, fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <Link href="/login" style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Log In</Link>
              <Link href="/register" style={{ flex: 1, textAlign: "center", padding: "10px", borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Register</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "20%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(99,102,241,0.4)", background: "rgba(99,102,241,0.1)", color: "#818cf8", fontSize: 13, fontWeight: 600, marginBottom: 28, backdropFilter: "blur(8px)" }}>
            <Sparkles size={14} /> The Premier Digital Marketplace for Algeria
          </div>

          <h1 style={{ fontSize: "clamp(40px, 7vw, 76px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 24 }}>
            Elevate your work with
            <br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              world-class talent.
            </span>
          </h1>

          <p style={{ fontSize: 18, color: "rgba(248,250,252,0.6)", marginBottom: 40, lineHeight: 1.7, maxWidth: 580, margin: "0 auto 40px" }}>
            Connect with top Algerian freelancers, purchase ready-made digital tools, and grow your business. Secure. Professional. Built for Algeria.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 6, maxWidth: 640, margin: "0 auto 48px", backdropFilter: "blur(16px)", transition: "border-color 0.2s" }}>
            <div style={{ padding: "0 16px", color: "rgba(248,250,252,0.4)" }}><Search size={20} /></div>
            <input
              type="text"
              placeholder="Search for a service or product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#f8fafc", fontSize: 15, padding: "12px 0" }}
            />
            <button type="submit" style={{ padding: "12px 24px", borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
              Search
            </button>
          </form>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", color: "rgba(248,250,252,0.55)", fontSize: 14 }}>
            {["Secure COD Payments", "Vetted Professionals", "24/7 Support"].map(t => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={16} color="#34d399" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#818cf8", textTransform: "uppercase", marginBottom: 10 }}>🔥 Trending Now</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>
                Top-Rated <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Services</span>
              </h2>
              <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 15 }}>Hire experts. Pay only on delivery.</p>
            </div>
            <Link href="/services" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(248,250,252,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Browse All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ borderRadius: 20, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden", transition: "all 0.25s ease", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(99,102,241,0.4)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(99,102,241,0.15)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}>
                <div style={{ height: 140, background: `linear-gradient(135deg, hsl(${200 + i * 30}, 70%, 25%), hsl(${220 + i * 30}, 80%, 18%))`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                  {s.emoji}
                </div>
                <div style={{ padding: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", textTransform: "uppercase", letterSpacing: 1 }}>{s.category}</span>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: "8px 0 12px", lineHeight: 1.4 }}>{s.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, color: "rgba(248,250,252,0.5)", fontSize: 13 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{s.author.charAt(0)}</div>
                    {s.author}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#fbbf24", fontSize: 13, fontWeight: 700 }}>
                      <Star size={14} fill="#fbbf24" /> {s.rating}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#a5f3fc" }}>{s.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PRODUCTS SECTION ── */}
      <section style={{ padding: "80px 24px", background: "linear-gradient(180deg, transparent, rgba(168,85,247,0.05), transparent)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, border: "1px solid rgba(168,85,247,0.4)", background: "rgba(168,85,247,0.1)", color: "#c084fc", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                <Zap size={12} /> Instant Access
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>
                Premium <span style={{ background: "linear-gradient(135deg, #c084fc, #f0abfc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Digital Tools</span>
              </h2>
              <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 15 }}>Instantly unlock templates, courses & resources.</p>
            </div>
            <Link href="/store" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", color: "rgba(248,250,252,0.8)", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              Explore All <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {PRODUCTS.map((p, i) => (
              <div key={i} style={{ borderRadius: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", padding: 8, transition: "all 0.25s ease", cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.4)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 60px rgba(168,85,247,0.12)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}>
                <div style={{ height: 160, borderRadius: 18, background: `linear-gradient(135deg, rgba(168,85,247,0.${12 + i * 3}), rgba(99,102,241,0.15))`, border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                  <Package size={52} color="rgba(168,85,247,0.4)" />
                  <div style={{ position: "absolute", top: 12, left: 12, padding: "4px 10px", borderRadius: 8, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(248,250,252,0.7)", fontSize: 11, fontWeight: 600, backdropFilter: "blur(8px)" }}>
                    {p.type}
                  </div>
                </div>
                <div style={{ padding: "4px 12px 12px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginBottom: 16 }}>{p.author} • {p.sales} sales</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "#e879f9" }}>{p.price}</span>
                    <button style={{ padding: "9px 20px", borderRadius: 10, background: "rgba(248,250,252,0.95)", color: "#020817", fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer" }}>Get it now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DIGIT HUP ── */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>
              Why professionals choose <span style={{ background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DigitHup</span>
            </h2>
            <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 16, maxWidth: 480, margin: "0 auto" }}>The most trusted and secure platform for Algerian freelancers and businesses.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 28 }}>
            {[
              { icon: <ShieldCheck size={28} color="#34d399" />, bg: "rgba(52,211,153,0.1)", title: "100% Secure Payments", desc: "Funds held safely. Released only after successful delivery. COD-ready for Algeria." },
              { icon: <Users size={28} color="#818cf8" />, bg: "rgba(99,102,241,0.1)", title: "Verified Professionals", desc: "Elite sellers pass portfolio verification. Only the best get the badge." },
              { icon: <Star size={28} color="#fbbf24" />, bg: "rgba(251,191,36,0.1)", title: "Quality Guaranteed", desc: "Built-in dispute resolution and milestone tracking. You always get what you paid for." },
            ].map((f, i) => (
              <div key={i} style={{ padding: 28, borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: "rgba(248,250,252,0.5)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "80px 24px 120px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "60px 32px", borderRadius: 28, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))", border: "1px solid rgba(99,102,241,0.25)" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: 16 }}>Ready to get started?</h2>
          <p style={{ color: "rgba(248,250,252,0.6)", fontSize: 16, marginBottom: 36 }}>Join thousands of Algerian freelancers and businesses already on DigitHup.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ padding: "14px 36px", borderRadius: 14, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", textDecoration: "none", fontSize: 15, fontWeight: 700 }}>
              Create Free Account
            </Link>
            <Link href="/how-it-works" style={{ padding: "14px 36px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", color: "rgba(248,250,252,0.85)", textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px", background: "rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 40, justifyContent: "space-between" }}>
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={16} color="white" />
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: "#f8fafc" }}>DigitHup</span>
            </Link>
            <p style={{ color: "rgba(248,250,252,0.4)", fontSize: 13, maxWidth: 220, lineHeight: 1.7 }}>Algeria's first premium freelance & digital products marketplace.</p>
          </div>
          {[
            { title: "Platform", links: [{ href: "/services", l: "Services" }, { href: "/store", l: "Products" }, { href: "/become-a-seller", l: "Become a Seller" }] },
            { title: "Company", links: [{ href: "/about", l: "About Us" }, { href: "/blog", l: "Blog" }, { href: "/careers", l: "Careers" }] },
            { title: "Support", links: [{ href: "/help", l: "Help Center" }, { href: "/terms", l: "Terms" }, { href: "/privacy", l: "Privacy" }] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "rgba(248,250,252,0.6)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>{col.title}</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(lk => (
                  <Link key={lk.href} href={lk.href} style={{ color: "rgba(248,250,252,0.4)", textDecoration: "none", fontSize: 14 }}>{lk.l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1280, margin: "32px auto 0", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(248,250,252,0.3)", fontSize: 13, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span>© 2026 Digit Hup. Made with ❤️ in Algeria.</span>
          <span>All rights reserved.</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
