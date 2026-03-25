import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Search, Sparkles, Star, Users, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Zap, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function EnhancedHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 sm:px-12 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/80 to-slate-950"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>
            
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC0xTDBgLjVsMSAuNXoiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMikiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4=')] opacity-20"></div>
          </div>

          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center animate-slide-up">
            <Badge variant="outline" className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 py-1.5 px-4 font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
              The Premium Marketplace for Algerian Creatives
            </Badge>
            
            <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight mb-8 leading-tight">
              Elevate your projects with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
                world-class talent.
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl font-light">
              Connect with top-tier Algerian freelancers to build your brand, develop your software, and create stunning content. Secure, fast, and professional.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl flex items-center shadow-2xl transition-all focus-within:border-indigo-500/50 focus-within:shadow-indigo-500/20">
              <div className="pl-4 text-slate-400"><Search className="w-5 h-5" /></div>
              <input 
                type="text" 
                placeholder="What service are you looking for?" 
                className="flex-1 bg-transparent border-none outline-none text-slate-200 px-4 py-3 placeholder:text-slate-500"
              />
              <Button className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-medium h-12">Search</Button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure COD Payments</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vetted Professionals</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 Dedicated Support</span>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="py-24 px-6 sm:px-12 bg-slate-950 relative border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">Trending <span className="text-indigo-400">Services</span></h2>
                <p className="text-slate-400 max-w-lg">Hire experts for one-off projects or long-term collaborations. Paid only upon successful delivery.</p>
              </div>
              <Button variant="outline" className="border-slate-800 hover:bg-slate-900 group">
                Browse All Services <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Brand Identity Design", author: "Yacine M.", rating: 4.9, price: "From 15,000 DZD", category: "Design", color: "from-blue-600 to-indigo-600" },
                { title: "React/Next.js Development", author: "Karim B.", rating: 5.0, price: "From 45,000 DZD", category: "Tech", color: "from-emerald-600 to-teal-600" },
                { title: "SEO Arabic Copywriting", author: "Nassima B.", rating: 4.8, price: "From 2,500 DZD", category: "Writing", color: "from-orange-600 to-red-600" },
                { title: "Social Media Management", author: "Amine K.", rating: 4.7, price: "From 20,000 DZD", category: "Marketing", color: "from-fuchsia-600 to-pink-600" },
              ].map((service, i) => (
                <div key={i} className="group rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                  <div className={`h-40 bg-gradient-to-br ${service.color} opacity-80 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    <Badge className="w-max bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md mb-2">{service.category}</Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">{service.author.charAt(0)}</div>
                      <span className="text-sm font-medium text-slate-300">{service.author}</span>
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-4 line-clamp-2 leading-tight group-hover:text-indigo-400 transition-colors">{service.title}</h3>
                    <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                      <div className="flex items-center text-amber-400 text-sm font-medium">
                        <Star className="w-4 h-4 fill-current mr-1" /> {service.rating}
                      </div>
                      <span className="text-sm font-semibold text-white">{service.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DIGITAL PRODUCTS SECTION (DISTINCT DESIGN) */}
        <section className="py-24 px-6 sm:px-12 bg-slate-900/50 relative border-t border-slate-900 overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -z-10"></div>
          
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <Badge variant="outline" className="mb-4 border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 py-1.5 px-3">
                  <Zap className="w-3.5 h-3.5 mr-1.5" /> Instant Access
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">Premium <span className="text-fuchsia-400">Digital Tools</span></h2>
                <p className="text-slate-400 max-w-lg">Ready-to-use templates, assets, and ebooks to speed up your workflow. Buy once, use forever.</p>
              </div>
              <Button variant="outline" className="border-slate-800 hover:bg-slate-900 text-slate-300 group">
                Explore Digital Assets <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Ultimate UI/UX Design System", author: "DigitHup Pro", type: "Figma Template", price: "5,000 DZD", sales: 124 },
                { title: "Freelancer Contract Templates", author: "LegalDZ", type: "Document", price: "1,500 DZD", sales: 342 },
                { title: "E-Commerce Masterclass 2026", author: "E-Com DZ", type: "Video Course", price: "12,000 DZD", sales: 89 },
              ].map((product, i) => (
                <div key={i} className="group relative rounded-3xl bg-slate-950 border border-slate-800 p-2 hover:border-fuchsia-500/30 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity"></div>
                  <div className="h-48 rounded-2xl bg-slate-900 border border-slate-800/50 flex items-center justify-center p-6 mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIi8+Cjwvc3ZnPg==')] opacity-50"></div>
                    <Package className="w-16 h-16 text-slate-700 group-hover:text-fuchsia-500/50 transition-colors" />
                    <Badge className="absolute top-4 left-4 bg-slate-950/80 border-slate-800 text-slate-300 backdrop-blur-md">{product.type}</Badge>
                  </div>
                  <div className="px-4 pb-4">
                    <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">{product.author} • {product.sales} sales</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-fuchsia-400">{product.price}</span>
                      <Button size="sm" className="bg-white text-slate-950 hover:bg-slate-200 rounded-full px-5">Get it now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST / WHY US */}
        <section className="py-24 px-6 sm:px-12 bg-slate-950 border-t border-slate-900">
          <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-slate-800 p-8 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">Why independent professionals choose Digit Hup</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-16">The most secure and professional way to conduct freelance business in Algeria.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">100% Secure Payments</h3>
                <p className="text-slate-400">Funds are held securely. Sellers get paid via Post / Bank transfer after successful project delivery, solving the local payment gap.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Vetted Professionals</h3>
                <p className="text-slate-400">Our elite seller tier requires portfolio verification to ensure you only work with the absolute best in the industry.</p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-6">
                  <Star className="w-6 h-6 text-fuchsia-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Quality Guaranteed</h3>
                <p className="text-slate-400">Built-in dispute resolution and milestone tracking ensures you get exactly what you paid for, stress-free.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
