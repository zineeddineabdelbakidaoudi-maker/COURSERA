"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search, Sparkles, Star, ArrowRight, ShieldCheck,
  CheckCircle2, Zap, Package, Menu, X, LogOut, LayoutDashboard,
  Eye, ShoppingCart, MessageSquare, Users, TrendingUp
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { MeshGradient } from "@paper-design/shaders-react"
import { Navbar } from "@/components/layout/navbar"

const NAV_LINKS = [
  { href: "/services", label: "Explore Services" },
  { href: "/store", label: "Browse Products" },
  { href: "/how-it-works", label: "How It Works" },
]

export default function HomePage() {
  const supabase = createClient()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [services, setServices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll)

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from("Profile").select("full_name, role, avatar_url, publisher_status").eq("id", user.id).single().then(({ data }) => setProfile(data))
      }
    })

    Promise.all([
      supabase.from("Service").select("id, slug, title, status, thumbnail_url, packages, seller:Profile!seller_id(full_name, avatar_url)").eq('status', 'live').order('created_at', { ascending: false }).limit(4),
      supabase.from("DigitalProduct").select("id, slug, title, type, price_dzd, cover_url, publisher:Profile!publisher_id(full_name, avatar_url)").eq('status', 'live').order('created_at', { ascending: false }).limit(3)
    ]).then(([svcs, prods]) => {
      setServices(svcs.data || [])
      setProducts(prods.data || [])
      setLoading(false)
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

  const getStartingPrice = (packages: any) => {
    if (!packages) return "Custom"
    const basic = packages.basic || packages.Basic
    return basic?.price ? `${parseFloat(basic.price).toLocaleString()} DZD` : "Custom"
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black/10 selection:text-black overflow-x-hidden">

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
        {/* Mesh Gradient Canvas - FIXED to follow scroll */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <MeshGradient
            className="w-full h-full opacity-40"
            colors={["#ffffff", "#f0f0f0", "#e0e0e0", "#d0d0d0"]}
            speed={0.5}
            backgroundColor="#ffffff"
          />
        </div>

        {/* Subtle overlays for better reading */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/50 to-white pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30 pointer-events-none" />

        {/* Bloom accents - Soft Silver */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-slate-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gray-200/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center pt-32 pb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-black/5 text-black/60 text-sm font-bold mb-8 shadow-sm backdrop-blur-md animate-slide-up">
            <Sparkles className="w-4 h-4 text-black/40 animate-pulse" />The Premium Algerian Marketplace
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up text-balance leading-[1.05] text-black" style={{ animationDelay: "50ms" }}>
            Work with{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-600 to-black drop-shadow-sm animate-gradient bg-[length:200%]">world-class</span>
            </span>
            <br className="hidden md:block" />{" "}
            talent in Algeria.
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up font-medium" style={{ animationDelay: "100ms" }}>
            Connect with vetted professionals, buy digital products instantly, and manage your projects seamlessly.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex relative items-center bg-white/80 backdrop-blur-xl border border-black/10 rounded-2xl p-2 max-w-3xl mx-auto shadow-[0_20px_60px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)] transition-all focus-within:ring-2 focus-within:ring-black/20 focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] focus-within:-translate-y-0.5 duration-300 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="pl-5 pr-3 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-black placeholder:text-gray-400 text-lg py-4 font-medium"
            />
            <Button type="submit" size="lg" className="rounded-xl px-8 font-bold bg-black hover:bg-black/90 text-white shadow-lg border-none transition-all hover:scale-[1.02]">
              Explore
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-12 text-sm font-bold text-gray-500 animate-slide-up" style={{ animationDelay: "300ms" }}>
            {["Secure COD Mode", "Vetted Talent", "Instant Downloads", "24/7 Support"].map((t, i) => (
              <div key={i} className="flex items-center gap-2 bg-black/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-black/5 hover:border-black/20 hover:bg-black/10 transition-all duration-300">
                <CheckCircle2 className="w-4 h-4 text-black shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center animate-slide-up" style={{ animationDelay: "400ms" }}>
              {[
                { label: "Active Sellers", value: "500+", icon: Users },
                { label: "Completed Orders", value: "2,400+", icon: ShieldCheck },
                { label: "Digital Products", value: "300+", icon: Package },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Icon className="w-4 h-4 text-black/40 mb-1" />
                  <span className="text-2xl font-black text-black">{value}</span>
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="py-24 relative bg-gray-50/50">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="text-sm font-black tracking-widest text-black/40 uppercase mb-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/20 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-black/40"></span></span>
                Top picks for you
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
                In-Demand <span className="text-gray-400 leading-none">Services</span>
              </h2>
            </div>
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-xl font-bold border-black/10 bg-white hover:bg-black/5 text-black">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse" />)
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500 font-medium">No services found.</div>
            ) : services.map((s) => (
              <div key={s.id} className="group bg-white border border-black/5 rounded-3xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-black/10 transition-all duration-300 flex flex-col relative">
                <Link href={`/services/${s.slug || s.id}`} className="absolute inset-0 z-0 rounded-3xl" />

                <div className="h-44 rounded-2xl bg-gray-100 mb-4 overflow-hidden relative">
                  {s.thumbnail_url ? (
                    <img
                      src={s.thumbnail_url}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Sparkles className="w-10 h-10 text-black/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 z-10">
                    <Button size="sm" className="w-full rounded-xl bg-black hover:bg-black/90 text-white pointer-events-auto shadow-lg relative z-20 text-xs font-bold" asChild>
                      <Link href={`/services/${s.slug || s.id}`}><Eye className="w-3.5 h-3.5 mr-1.5" /> View Service</Link>
                    </Button>
                  </div>
                </div>

                <div className="px-2 pb-2 flex-1 flex flex-col z-10">
                  <h3 className="text-sm font-bold mb-3 line-clamp-2 leading-tight group-hover:text-black/60 transition-colors duration-200 text-black">{s.title}</h3>
                  <div className="flex items-center gap-2 mt-auto mb-3">
                    <img
                      src={s.seller?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.seller?.full_name}`}
                      className="w-6 h-6 rounded-full bg-gray-200"
                      alt=""
                      onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=seller` }}
                    />
                    <span className="text-xs font-semibold text-gray-500 line-clamp-1">{s.seller?.full_name || "Seller"}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-xs font-bold text-gray-400 uppercase">Starting at</span>
                    <span className="font-extrabold text-black text-sm">{getStartingPrice(s.packages)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PRODUCTS SECTION ── */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 text-black/60 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-black/10">
                <Package className="w-3.5 h-3.5" /> Digital Store
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-black">
                Instantly Downloadable <span className="text-gray-400">Products</span>
              </h2>
            </div>
            <Link href="/store">
              <Button variant="outline" size="lg" className="rounded-xl font-bold bg-white border-black/10 hover:bg-black/5 text-black">
                Go to Store <ShoppingCart className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />)
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500 font-medium">No products found.</div>
            ) : products.map((p) => (
              <div key={p.id} className="group bg-slate-900/60 backdrop-blur-sm rounded-[2.5rem] p-4 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] hover:-translate-y-2 hover:border-indigo-500/20 transition-all duration-500 relative flex flex-col">
                <Link href={`/store/${p.slug || p.id}`} className="absolute inset-0 z-0 rounded-[2.5rem]" />
                <div className="h-56 rounded-[1.8rem] bg-slate-800 overflow-hidden mb-6 relative border border-white/5">
                  {p.cover_url ? (
                    <img
                      src={p.cover_url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={p.title}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-indigo-400/40">
                      <Package className="w-16 h-16 drop-shadow-sm mb-2" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/10 text-xs font-bold px-3 py-1.5 rounded-full z-10 text-white shadow-sm">
                    {p.type || "Product"}
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col z-10">
                  <h3 className="text-xl font-bold mb-2 leading-tight text-white group-hover:text-indigo-400 transition-colors">{p.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 mb-6">By {p.publisher?.full_name || "Publisher"}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-white">{parseFloat(p.price_dzd).toLocaleString()} <span className="text-base text-slate-500 font-semibold">DZD</span></span>
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] z-20 relative pointer-events-auto" asChild>
                      <Link href={`/store/${p.slug || p.id}`}><ShoppingCart className="w-5 h-5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-black/5 blur-[100px] rounded-full" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-black mb-6">
            Ready to get started?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of professionals and businesses on Algeria&apos;s premier digital marketplace.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="rounded-xl px-8 font-bold bg-black hover:bg-black/90 text-white shadow-xl border-none transition-all hover:scale-[1.02]">
                Join DigitHup Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="rounded-xl px-8 font-bold border-black/10 bg-white text-black hover:bg-black/5">
                Browse Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-black/5 pt-16 pb-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-gray-400">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-black">Digit<span className="text-gray-400">Hup</span></span>
            </Link>
            <p>© {new Date().getFullYear()} DigitHup. Made with ❤️ in Algeria.</p>
            <div className="flex gap-6">
              {NAV_LINKS.map(l => <Link key={l.href} href={l.href} className="text-gray-400 hover:text-black transition-colors">{l.label}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
