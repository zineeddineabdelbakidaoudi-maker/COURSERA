"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search, Sparkles, Star, Users, ArrowRight, ShieldCheck,
  CheckCircle2, Zap, Package, Menu, X, LogOut, LayoutDashboard,
  Eye, ShoppingCart, MessageSquare
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

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
    
    // Auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        supabase.from("Profile").select("full_name, role, avatar_url").eq("id", user.id).single().then(({ data }) => setProfile(data))
      }
    })

    // Fetch dynamic content
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
    <div className="min-h-screen bg-slate-50 dark:bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      
      {/* ── NAVBAR ── */}
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.05)] py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)] bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-105 transition-transform duration-300">
              <Zap className="w-5 h-5 text-white drop-shadow-md" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-foreground">
              Digit<span className="text-indigo-500">Hup</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="text-sm font-semibold text-slate-600 dark:text-muted-foreground hover:text-indigo-600 dark:hover:text-foreground transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link href={getDashLink()}>
                  <Button variant="outline" className="gap-2 border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="text-slate-500 hover:text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login"><Button variant="ghost" className="font-semibold text-slate-600 dark:text-muted-foreground hover:bg-slate-100 dark:hover:bg-muted">Log In</Button></Link>
                <Link href="/register">
                  <Button className="font-bold relative overflow-hidden group bg-foreground text-background shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-none rounded-xl">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-800 dark:text-foreground p-2 bg-white dark:bg-card rounded-xl shadow-sm border border-slate-200 dark:border-border">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 flex flex-col items-center justify-center min-h-[95vh] overflow-hidden">
        {/* Soft Cozy Gradient Blooms */}
        <div className="absolute top-[5%] -left-[10%] w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten" />
        <div className="absolute bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-rose-400/20 dark:bg-pink-600/20 rounded-full blur-[140px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten" />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-500/20 bg-white/60 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-sm font-bold mb-8 shadow-sm backdrop-blur-md animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-500" /> The Cozy & Modern Platform for Algeria
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black tracking-tight mb-6 animate-slide-up text-balance leading-[1.05] text-slate-900 dark:text-foreground">
            Work with <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 drop-shadow-sm">world-class</span>
              <span className="absolute bottom-1 left-0 w-full h-4 bg-indigo-200/50 dark:bg-indigo-500/30 -rotate-2 -z-0 rounded-full"></span>
            </span><br className="hidden md:block" /> talent in Algeria.
          </h1>

          <p className="text-xl text-slate-600 dark:text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up font-medium" style={{ animationDelay: "100ms" }}>
            Connect with vetted professionals, easily buy digital products, and seamlessly manage projects. Built with love and modern tools.
          </p>

          {/* 3D Search Box */}
          <form onSubmit={handleSearch} className="flex relative items-center bg-white dark:bg-card border-none rounded-2xl p-2 max-w-3xl mx-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transition-all focus-within:ring-4 focus-within:ring-indigo-500/20 focus-within:-translate-y-1 duration-300 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute inset-0 rounded-2xl border border-white/50 dark:border-white/10 pointer-events-none mix-blend-overlay"></div>
            <div className="pl-5 pr-3 text-slate-400 dark:text-muted-foreground relative z-10"><Search className="w-6 h-6" /></div>
            <input
              type="text"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-foreground placeholder:text-slate-400 dark:placeholder:text-muted-foreground text-lg py-4 relative z-10 font-medium"
            />
            <Button type="submit" size="lg" className="relative z-10 rounded-xl px-8 font-bold text-md bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_20px_rgba(79,70,229,0.4)] border-none transition-all hover:scale-[1.02]">
              Explore
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mt-14 text-sm font-bold text-slate-600 dark:text-muted-foreground animate-slide-up" style={{ animationDelay: "300ms" }}>
            {["Secure COD Mode", "Vetted Talent", "Instant Downloads", "24/7 Support"].map((t, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/60 dark:bg-muted/50 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-border backdrop-blur-md shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 drop-shadow-sm" /> {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="py-24 relative bg-white dark:bg-secondary/20">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-border to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="text-sm font-black tracking-widest text-indigo-500 uppercase mb-3 flex items-center gap-2">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span></span>
                Top picks for you
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-foreground">
                In-Demand <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Services</span>
              </h2>
            </div>
            <Link href="/services">
              <Button variant="outline" size="lg" className="rounded-xl font-bold border-slate-200 dark:border-border bg-white dark:bg-card hover:bg-slate-50 shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-sm">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-80 rounded-3xl bg-slate-100 dark:bg-card/50 animate-pulse" />)
            ) : services.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500 font-medium">No services found.</div>
            ) : services.map((s) => (
              <div key={s.id} className="group bg-white dark:bg-card rounded-[2rem] p-3 border border-slate-200 dark:border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-sm hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative">
                <Link href={`/services/${s.slug || s.id}`} className="absolute inset-0 z-0" />
                
                <div className="h-44 rounded-3xl bg-slate-100 dark:bg-slate-800 mb-4 overflow-hidden relative">
                  {s.thumbnail_url ? (
                    <img src={s.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 z-10">
                    <Button size="sm" className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100 pointer-events-auto shadow-lg relative z-20" asChild>
                      <Link href={`/services/${s.slug || s.id}`}><Eye className="w-4 h-4 mr-2" /> Inspect fully</Link>
                    </Button>
                  </div>
                </div>
                
                <div className="px-3 pb-3 flex-1 flex flex-col z-10">
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-slate-900 dark:text-foreground">{s.title}</h3>
                  <div className="flex items-center gap-2 mt-auto mb-4">
                    <img src={s.seller?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + s.seller?.full_name} className="w-6 h-6 rounded-full bg-slate-200" alt="" />
                    <span className="text-sm font-semibold text-slate-600 dark:text-muted-foreground line-clamp-1">{s.seller?.full_name || "Seller"}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-border pt-3">
                    <span className="text-xs font-bold text-slate-500 uppercase">Starting at</span>
                    <span className="font-extrabold text-slate-900 dark:text-foreground">{getStartingPrice(s.packages)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PRODUCTS SECTION ── */}
      <section className="py-24 bg-slate-50 dark:bg-background relative">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-pink-500/20">
                <Package className="w-3.5 h-3.5 fill-pink-500 text-pink-500" /> Digital Store
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-foreground">
                Instantly Downloadable <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Products</span>
              </h2>
            </div>
            <Link href="/store">
              <Button variant="outline" size="lg" className="rounded-xl font-bold bg-white dark:bg-card border-slate-200 dark:border-border shadow-[0_4px_10px_rgba(0,0,0,0.03)] dark:shadow-sm">
                Go to Store <ShoppingCart className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-slate-100 dark:bg-card/50 animate-pulse" />)
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500 font-medium">No products found.</div>
            ) : products.map((p) => (
              <div key={p.id} className="group bg-white dark:bg-card rounded-[2.5rem] p-4 border border-slate-200 dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-transform duration-500 relative flex flex-col">
                <Link href={`/store/${p.slug || p.id}`} className="absolute inset-0 z-0" />
                <div className="h-56 rounded-[1.8rem] bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 overflow-hidden mb-6 relative border border-slate-100 dark:border-white/5">
                  {p.cover_url ? (
                    <img src={p.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-pink-300">
                      <Package className="w-16 h-16 drop-shadow-sm mb-2" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/60 backdrop-blur border border-slate-200 dark:border-border text-xs font-bold px-3 py-1.5 rounded-full z-10 text-slate-800 dark:text-white shadow-sm">
                    {p.type || "Product"}
                  </div>
                </div>
                <div className="px-4 pb-4 flex-1 flex flex-col z-10">
                  <h3 className="text-xl font-bold mb-2 leading-tight text-slate-900 dark:text-foreground group-hover:text-pink-600 transition-colors">{p.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 dark:text-muted-foreground mb-6">By {p.publisher?.full_name}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-foreground">{parseFloat(p.price_dzd).toLocaleString()} <span className="text-base text-slate-500 font-semibold">DZD</span></span>
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105 transition-transform shadow-lg z-20 relative pointer-events-auto" asChild>
                      <Link href={`/store/${p.slug || p.id}`}><ShoppingCart className="w-5 h-5" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white dark:bg-secondary/30 border-t border-slate-200 dark:border-border pt-20 pb-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-500 dark:text-muted-foreground">
            <p>© {new Date().getFullYear()} Digit Hup.</p>
            <p className="flex items-center gap-1">Made with <HeartIcon className="w-4 h-4 text-rose-500 fill-rose-500" /> in Algeria.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeartIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  )
}
