"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, X, Briefcase, SlidersHorizontal, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar" 
import { AnimatedPageWrapper } from "@/components/ui/animated-page-wrapper"
import { ProductCard } from "@/components/ui/product-card"

export default function ServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState("All Gigs")
  const [q, setQ] = useState("")
  const [categories, setCategories] = useState<string[]>(["All Gigs"])

  useEffect(() => {
    async function fetchData() {
      // Fetch Categories
      const { data: cats } = await supabase.from("Category").select("name_en").or("type.eq.services,type.eq.both")
      if (cats) {
        setCategories(["All Gigs", ...cats.map(c => c.name_en)])
      }

      // Fetch Live Services with their Seller Profiles
      const { data: svcs } = await supabase
        .from("Service")
        .select(`
          id, slug, title, status, thumbnail_url, packages, created_at,
          seller:Profile!seller_id(full_name, seller_level, avatar_url)
        `)
        .eq("status", "live")
        .order("created_at", { ascending: false })

      setServices(svcs || [])
      setLoading(false)
    }
    fetchData()
  }, [])



  const filtered = services.filter(s => {
    const sName = s.title?.toLowerCase() || ""
    // We don't have rigid DB categories for Services yet, so we filter by title keywords like a search engine
    if (cat === "Development" && !sName.includes("dev") && !sName.includes("code") && !sName.includes("web") && !sName.includes("app")) return false
    if (cat === "Design" && !sName.includes("design") && !sName.includes("ui") && !sName.includes("logo") && !sName.includes("art")) return false
    if (cat === "Marketing" && !sName.includes("marketing") && !sName.includes("seo") && !sName.includes("ads")) return false
    if (cat === "Writing" && !sName.includes("write") && !sName.includes("copy") && !sName.includes("translate")) return false
    if (cat === "Video & Animation" && !sName.includes("video") && !sName.includes("animate") && !sName.includes("edit")) return false

    if (q && !sName.includes(q.toLowerCase())) return false
    return true
  })

  // Helper to extract basic price from JSON
  const getStartingPrice = (packages: any) => {
    if (!packages) return "Custom"
    const basic = packages.basic || packages.Basic
    if (basic?.price) {
       return `${Number(basic.price).toLocaleString()} DZD`
    }
    return "Custom"
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafafa] font-sans text-slate-900 selection:bg-black selection:text-white">      
      <AnimatedPageWrapper>
        <main className="pt-20 relative">
          
          <div className="absolute inset-0 bg-white z-[0] pointer-events-none" />

          {/* --- HERO SECTION --- */}
          <section className="relative overflow-hidden px-6 py-24 z-10 border-b border-gray-100 bg-white">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-medium tracking-tight text-black md:text-7xl">
                Professional <br />
                <span className="text-gray-400">Services & Gigs</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-500 leading-relaxed">
                Connect with elite Algerian talent to accomplish your next big project. High-quality deliverables on time, every time.
              </p>

              {/* SEARCH & FILTERS */}
              <div className="mx-auto flex max-w-3xl flex-col gap-4">
                <div className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-gray-300">
                  <Search className="ml-4 h-5 w-5 text-gray-400" />
                  <Input
                    className="border-none bg-transparent py-5 text-base text-black placeholder:text-gray-400 focus-visible:ring-0 px-4"
                    placeholder="What project do you need help with?"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                  />
                  {q && (
                     <button onClick={() => setQ('')} className="mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-4 w-4 text-gray-500" />
                     </button>
                  )}
                  <Button className="mr-1 h-11 rounded-xl bg-black px-6 text-white hover:bg-gray-800 transition-colors shadow-none font-medium">
                    Search
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCat(c)}
                      className={[
                        'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                        cat === c
                          ? 'bg-black text-white shadow-md'
                          : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-black shadow-sm',
                      ].join(' ')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- Grid SECTION --- */}
          <section className="bg-[#FAFAFA] px-6 py-20 relative z-10">
             <div className="mx-auto max-w-7xl">
               <div className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                 <h2 className="text-2xl font-medium tracking-tight text-black">Featured Services</h2>
                 <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{filtered.length} Services</span>
               </div>

               {loading ? (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2.5rem] bg-gray-100 animate-pulse border border-gray-200" />)}
                 </div>
               ) : filtered.length === 0 ? (
                 <div className="text-center py-24">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Briefcase className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium text-gray-500">No services match your criteria.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((s, index) => {
                       const sellerName = s.seller?.full_name || "Anonymous"
                       
                       return (
                          <Link key={s.id} href={`/services/${s.slug || s.id}`} className="block">
                             <ProductCard
                               index={index}
                               title={s.title}
                               subtitle={`by ${sellerName}`}
                               price={getStartingPrice(s.packages)}
                               imageUrl={s.thumbnail_url || ""}
                               badgeText={"Service"}
                               actionButton={
                                  <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
                                   <ArrowRight className="h-4 w-4" />
                                 </div>
                               }
                             />
                          </Link>
                       )
                    })}
                 </div>
               )}
             </div>
          </section>
        </main>
      </AnimatedPageWrapper>
    </div>
  )
}
