"use client"

import { useState, useEffect, type CSSProperties, useRef } from "react"
import Link from "next/link"
import { 
  Search, 
  Star, 
  Clock, 
  ArrowRight, 
  Filter, 
  X, 
  Loader2, 
  Briefcase, 
  CheckCircle2,
  ShieldCheck,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar" 
import { AnimatedPageWrapper } from "@/components/ui/animated-page-wrapper"
import { TiltCard } from "@/components/ui/tilt-card"
import NeuralBackground from "@/components/ui/flow-field-background"

export default function HirePage() {
  const supabase = createClient()
  const [freelancers, setFreelancers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All Talent")
  const [q, setQ] = useState("")

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchData() {
      const { data: sellers } = await supabase
        .from("Profile")
        .select("*")
        .in("role", ["seller", "publisher"])

      setFreelancers(sellers || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 40,
      y: (clientY / window.innerHeight - 0.5) * 40,
    });
  };

  const filtered = freelancers.filter(f => {
    const sName = f.full_name?.toLowerCase() || f.username?.toLowerCase() || ""
    const sBio = f.bio?.toLowerCase() || ""
    if (activeCategory === "Top Rated" && !(f.seller_level === "elite" || f.seller_level === "pro")) return false
    
    // Specialty filters
    if (activeCategory === "Design" && !sBio.includes("design") && !sBio.includes("ui") && !sBio.includes("art")) return false
    if (activeCategory === "Development" && !sBio.includes("code") && !sBio.includes("dev") && !sBio.includes("program")) return false
    if (activeCategory === "Marketing" && !sBio.includes("market") && !sBio.includes("seo") && !sBio.includes("ads")) return false
    
    if (q && !sName.includes(q.toLowerCase()) && !sBio.includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f4f5] font-sans text-slate-900 selection:bg-primary selection:text-white">
      <Navbar />
      
      <AnimatedPageWrapper>
        <main className="pt-20 relative">
          {/* BACKGROUND LAYER */}
          <div className="absolute inset-0 bg-[#f4f4f5] z-[0] pointer-events-none" />

          {/* --- HERO SECTION --- */}
          <section 
            className="relative overflow-hidden px-6 py-24 z-10"
            onMouseMove={handleHeroMouseMove}
          >
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-100">
              {/* 3D-like background shapes with parallax */}
              <div 
                className="absolute h-64 w-64 translate-x-48 -translate-y-24 rotate-45 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-2xl transition-transform duration-500 ease-out" 
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(45deg)` }}
              />
              <div 
                className="absolute h-48 w-48 -translate-x-64 translate-y-12 rotate-12 rounded-full border border-slate-200 bg-white/70 backdrop-blur-xl shadow-xl transition-transform duration-700 ease-out" 
                style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(12deg)` }}
              />
              <div 
                className="absolute h-[600px] w-[600px] rounded-full border border-slate-200 bg-white/30 backdrop-blur-3xl transition-transform duration-1000 ease-out" 
                style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 dark:text-foreground md:text-7xl">
                Hire Top-Tier <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Digital Talent</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-slate-600 dark:text-muted-foreground leading-relaxed">
                The premier marketplace for elite Algerian freelancers. From expert developers to visionary 3D artists.
              </p>

              {/* UPWORK-STYLE SEARCH & FILTERS */}
              <div className="mx-auto flex max-w-3xl flex-col gap-4">
                <div className="relative flex items-center overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-lg transition-shadow focus-within:shadow-xl">
                  <Search className="ml-4 h-5 w-5 text-slate-400" />
                  <Input
                    className="border-none bg-transparent py-6 text-lg text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 px-4"
                    placeholder="Search for skills (e.g. React, 3D Modeling, Python)"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                  {q && (
                     <button onClick={() => setQ('')} className="mr-2 p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="h-4 w-4 text-slate-500" />
                     </button>
                  )}
                  <Button className="mr-1 h-12 rounded-xl bg-slate-900 px-8 text-white font-bold hover:bg-slate-800 transition-all shadow-md">
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {['All Talent', 'Top Rated', 'Design', 'Development', 'Marketing'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={[
                        'rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 shadow-sm border',
                        activeCategory === cat
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- FREELANCER GRID --- */}
          <section className="relative z-10 px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Recommended Talent</h2>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{filtered.length} Profiles found</span>
              </div>

              {loading ? (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-slate-100 animate-pulse border border-border" />)}
                 </div>
              ) : filtered.length === 0 ? (
                 <div className="text-center py-24 bg-white/50 backdrop-blur-xl border border-border rounded-[3rem]">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 border border-border flex items-center justify-center shadow-sm">
                    <Search className="w-10 h-10 text-slate-400" />
                  </div>
                  <p className="text-xl font-bold text-slate-600">No freelancers match your criteria.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((f) => {
                       const sellerName = f.full_name || f.username || "Anonymous"
                       const sellerLevel = f.seller_level || "new"
                       const isTopRated = sellerLevel === "elite" || sellerLevel === "pro"
                       
                       return (
                          <Link key={f.id} href={`/sellers/${f.username || f.id}`} className="block h-full cursor-pointer">
                             <TiltCard
                               className="group flex flex-col h-full rounded-[2.5rem] border border-border bg-white p-6 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-slate-300"
                             >
                                <div className="mb-6 flex items-start gap-5">
                                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-border">
                                    {f.avatar_url ? (
                                       <img
                                          alt={sellerName}
                                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                          src={f.avatar_url}
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                       />
                                    ) : (
                                       <div className="h-full w-full flex items-center justify-center">
                                          <Briefcase className="h-8 w-8 text-slate-300" />
                                       </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                      {sellerName}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500 mt-1 capitalize">{f.role}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                      {isTopRated && (
                                         <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 uppercase tracking-wider text-[10px]">
                                           <CheckCircle2 className="mr-1 h-3 w-3" />
                                           Top Rated
                                         </Badge>
                                      )}
                                      
                                      <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        {f.rating_avg || "5.0"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-6 grid grid-cols-3 gap-4 border-y border-slate-100 py-4">
                                  <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Success</p>
                                    <p className="text-sm font-extrabold text-slate-900">100%</p>
                                  </div>
                                  <div className="text-center border-x border-slate-100">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Orders</p>
                                    <p className="text-sm font-extrabold text-slate-900">{f.total_orders_completed || 0}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Rate</p>
                                    <p className="text-sm font-extrabold text-slate-900">$$$</p>
                                  </div>
                                </div>

                                <p className="mb-8 line-clamp-2 text-base leading-relaxed text-slate-600">
                                  {f.bio || "No professional biography provided."}
                                </p>

                                <div className="mt-auto flex items-center gap-3">
                                  <Button className="flex-1 rounded-2xl bg-slate-900 h-12 text-sm font-bold tracking-wide text-white transition-all hover:bg-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.2)]">
                                    Contact Freelancer
                                  </Button>
                                  <button onClick={(e) => e.preventDefault()} className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-white shadow-sm transition-colors hover:bg-slate-50 text-slate-400 group-hover:text-indigo-500">
                                    <Briefcase className="h-5 w-5" />
                                  </button>
                                </div>
                             </TiltCard>
                          </Link>
                       )
                    })}
                 </div>
              )}
            </div>
          </section>

          {/* --- WHY CHOOSE DIGITHUB (PROFESSIONAL VALUE PROPS) --- */}
          <section className="relative z-10 px-6 py-24 border-t border-border bg-white/50 dark:bg-black/20 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl">
              <div className="mb-20 text-center">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-foreground">Why Businesses Choose DIGITHUB</h2>
                <p className="text-slate-600 dark:text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed">Access the top 3% of digital talent in Algeria through our secure and professional platform.</p>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {[
                  { 
                    icon: CheckCircle2, 
                    title: 'Rigorous Vetting', 
                    desc: 'Every freelancer undergoes a strict review of their portfolio, technical skills, and professional reliability.' 
                  },
                  { 
                    icon: ShieldCheck, 
                    title: 'Secure Payments', 
                    desc: 'Payments are held in escrow and only released when you are 100% satisfied with the delivered work.' 
                  },
                  { 
                    icon: Zap, 
                    title: 'Quality Assurance', 
                    desc: 'Our dedicated support team ensures every project meets international standards of digital excellence.' 
                  },
                ].map((prop) => (
                  <div key={prop.title} className="group bg-white dark:bg-card p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all hover:-translate-y-2">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 dark:bg-secondary/30 shadow-sm border border-border transition-transform group-hover:scale-110">
                      <prop.icon className="h-8 w-8 text-black dark:text-white" />
                    </div>
                    <h3 className="mb-4 text-center text-xl font-extrabold uppercase tracking-wider text-slate-900 dark:text-foreground">{prop.title}</h3>
                    <p className="text-center text-base leading-relaxed font-medium text-slate-600 dark:text-muted-foreground">{prop.desc}</p>
                  </div>
                ))}
              </div>

            </div>
          </section>
        </main>
      </AnimatedPageWrapper>
    </div>
  )
}
