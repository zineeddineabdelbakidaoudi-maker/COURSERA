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

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>(["All Talent"])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("All Talent")
  const [q, setQ] = useState("")

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    async function fetchData() {
      const { data: srvs } = await supabase
        .from("Service")
        .select("*, seller:Profile!seller_id(full_name, avatar_url, seller_level, bio, role), category:Category!category_id(name_en)")
        .eq("status", "live")

      setServices(srvs || [])

      const { data: cats } = await supabase.from("Category").select("name_en").eq("type", "services")
      if (cats) {
        setCategories(["All Talent", ...cats.map(c => c.name_en)])
      }
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

  const filtered = services.filter(s => {
    const sCat = s.category?.name_en || "Other"
    const sTitle = s.title?.toLowerCase() || ""
    const sSeller = s.seller?.full_name?.toLowerCase() || ""
    if (activeCategory !== "All Talent" && sCat !== activeCategory) return false
    if (q && !sTitle.includes(q.toLowerCase()) && !sSeller.includes(q.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      <Navbar />
      
      <AnimatedPageWrapper>
        <main className="pt-20">
          {/* --- HERO SECTION --- */}
          <section 
            className="relative overflow-hidden bg-white px-6 py-24 border-b border-gray-100"
            onMouseMove={handleHeroMouseMove}
          >
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30">
              {/* 3D-like background shapes with parallax */}
              <div 
                className="absolute h-64 w-64 translate-x-48 -translate-y-24 rotate-45 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-2xl transition-transform duration-500 ease-out" 
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(45deg)` }}
              />
              <div 
                className="absolute h-48 w-48 -translate-x-64 translate-y-12 rotate-12 rounded-full border border-gray-200 bg-gradient-to-tr from-gray-50 to-white shadow-xl transition-transform duration-700 ease-out" 
                style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(12deg)` }}
              />
              <div 
                className="absolute h-[600px] w-[600px] rounded-full border border-gray-200 opacity-20 transition-transform duration-1000 ease-out" 
                style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-medium tracking-tight text-black md:text-7xl">
                Hire Top-Tier <br />
                <span className="text-black">Digital Talent</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500">
                The premier marketplace for elite Algerian freelancers. From expert developers to visionary 3D artists.
              </p>

              {/* UPWORK-STYLE SEARCH & FILTERS */}
              <div className="mx-auto flex max-w-3xl flex-col gap-4">
                <div className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-lg transition-shadow focus-within:shadow-xl">
                  <Search className="ml-4 h-5 w-5 text-gray-400" />
                  <Input
                    className="border-none bg-transparent py-6 text-lg placeholder:text-gray-400 focus-visible:ring-0 px-4"
                    placeholder="Search for skills (e.g. React, 3D Modeling, Python)"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                  {q && (
                     <button onClick={() => setQ('')} className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-4 w-4 text-gray-500" />
                     </button>
                  )}
                  <Button className="mr-1 h-12 rounded-xl bg-black px-8 text-white hover:bg-gray-800 transition-colors shadow-none font-medium">
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={[
                        'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                        activeCategory === cat
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-black shadow-sm',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  ))}
                  <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-500 hover:border-black hover:text-black transition-colors shadow-sm ml-2">
                    <Filter className="h-4 w-4" />
                    Advanced Filters
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* --- FREELANCER GRID --- */}
          <section className="bg-[#fafafa] px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-medium tracking-tight text-black">Recommended Services</h2>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{filtered.length} Services found</span>
              </div>

              {loading ? (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 animate-pulse border border-gray-200" />)}
                 </div>
              ) : filtered.length === 0 ? (
                 <div className="text-center py-24">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">No services match your criteria.</p>
                 </div>
              ) : (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((s) => {
                       const basePrice = s.packages?.basic?.price || s.packages?.Basic?.price || 0
                       const delivery = s.packages?.basic?.delivery || s.packages?.Basic?.delivery || 3
                       const sellerName = s.seller?.full_name || "Anonymous"
                       const sellerLevel = s.seller?.seller_level || "new"
                       const isTopRated = sellerLevel === "elite" || sellerLevel === "pro"
                       
                       return (
                          <Link key={s.id} href={`/services/${s.slug || s.id}`} className="block">
                             <TiltCard
                               className="group flex flex-col h-full rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
                             >
                                <div className="mb-6 flex items-start gap-5">
                                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                                    {s.thumbnail_url ? (
                                       <img
                                          alt={s.title}
                                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                          src={s.thumbnail_url}
                                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                                       />
                                    ) : (
                                       <div className="h-full w-full flex items-center justify-center">
                                          <Briefcase className="h-8 w-8 text-gray-300" />
                                       </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-medium text-black line-clamp-2 leading-snug group-hover:text-gray-600 transition-colors">
                                      {s.title}
                                    </h3>
                                    <p className="text-sm font-medium text-gray-500 mt-1">{sellerName}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                      {isTopRated && (
                                         <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-none font-semibold px-2">
                                           <CheckCircle2 className="mr-1 h-3 w-3" />
                                           Top Rated
                                         </Badge>
                                      )}
                                      <span className="flex items-center gap-1 text-xs font-bold text-gray-600">
                                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        5.0
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-6 grid grid-cols-2 gap-4 border-y border-gray-50 py-4 mt-auto">
                                  <div className="text-center">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Starting At</p>
                                    <p className="text-sm font-bold text-black">{Number(basePrice).toLocaleString()} DZD</p>
                                  </div>
                                  <div className="text-center border-l border-gray-50">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Delivery Time</p>
                                    <p className="text-sm font-bold text-black flex items-center justify-center gap-1">
                                       <Clock className="w-3.5 h-3.5 text-gray-400" /> {delivery} Days
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center gap-2">
                                  <Button className="flex-1 rounded-2xl bg-black py-6 text-xs font-semibold tracking-wide text-white transition-all hover:bg-gray-800 shadow-none">
                                    Hire Now
                                  </Button>
                                  <button onClick={(e) => e.preventDefault()} className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white transition-colors hover:bg-gray-50">
                                    <ArrowRight className="h-5 w-5 text-gray-400 transform -rotate-45" />
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
          <section className="bg-white px-6 py-24 border-t border-gray-100">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Why Businesses Choose DIGITHUB</h2>
                <p className="text-gray-500 max-w-2xl mx-auto">Access the top 3% of digital talent in Algeria through our secure and professional platform.</p>
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
                  <div key={prop.title} className="group p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 transition-transform group-hover:scale-110">
                      <prop.icon className="h-7 w-7 text-black" />
                    </div>
                    <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-black">{prop.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{prop.desc}</p>
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
