"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Globe,
  Search,
  ShoppingCart,
  Star,
  Zap,
  Package,
  Eye
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AnimatedPageWrapper } from "@/components/ui/animated-page-wrapper"
import { TiltCard } from "@/components/ui/tilt-card"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"

const valueProps = [
  {
    icon: CheckCircle,
    title: 'Curated Quality',
    description: 'Every expert, tool, and template is manually vetted by our team before reaching the platform.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Gain immediate access to your digital assets and course materials the moment checkout completes.',
  },
  {
    icon: Globe,
    title: 'Local Excellence',
    description: 'Built for the Algerian market, bridging global digital standards with local payment realities.',
  },
];

const footerColumns = [
  {
    title: 'Platform',
    links: [{ text: 'Browse Services', href: '/services' }, { text: 'Digital Store', href: '/store' }, { text: 'How it Works', href: '/how-it-works' }],
  },
  {
    title: 'Browse',
    links: [{ text: 'Premium Assets', href: '/store?cat=assets' }, { text: 'Notion Templates', href: '/store?cat=templates' }, { text: 'Hire Freelancers', href: '/services' }],
  },
  {
    title: 'Support',
    links: [{ text: 'Help Center', href: '#' }, { text: 'Contact Us', href: '#' }, { text: 'Terms of Service', href: '#' }, { text: 'Privacy Policy', href: '#' }],
  },
];

export default function HomePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from("Profile").select("full_name, role, avatar_url").eq("id", user.id).single().then(({ data }) => setProfile(data))
      }
    })

    Promise.all([
      supabase.from("Service").select("id, slug, title, status, thumbnail_url, packages, seller:Profile!seller_id(full_name, avatar_url)").eq('status', 'live').order('created_at', { ascending: false }).limit(3)
    ]).then(([svcs]) => {
      setServices(svcs.data || [])
      setLoading(false)
    })
  }, [])

  const getStartingPrice = (packages: any) => {
    if (!packages) return "Custom"
    const basic = packages.basic || packages.Basic
    return basic?.price ? `${parseFloat(basic.price).toLocaleString()} DZD` : "Custom"
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] font-sans text-gray-900 selection:bg-black selection:text-white">
      <Navbar />
      
      <AnimatedPageWrapper>
        <main>
          {/* HERO SECTION */}
          <section className="relative min-h-screen overflow-hidden px-6 pt-24 md:pt-32">
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <div className="absolute h-[1000px] w-[1000px] rounded-full border border-slate-100/50" />
              <div className="absolute h-[700px] w-[700px] rounded-full border border-slate-100" />
              <div className="absolute h-[400px] w-[400px] rounded-full border border-slate-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-12rem)] max-w-5xl flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="mb-8 text-7xl font-black leading-[0.95] tracking-[-0.04em] text-slate-900 md:text-[11rem] uppercase">
                  TALENT &
                  <br />
                  <span className="text-slate-200">OPPORTUNITY</span>
                </h1>

                <p className="mx-auto mb-16 max-w-2xl text-xl font-medium tracking-tight text-slate-500 md:text-2xl">
                  Unified gateway for digital products, courses, and expert services in Algeria.
                </p>

                {/* Hero Search */}
                <div className="relative w-full max-w-2xl mx-auto mb-16 px-4">
                  <div className="group relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input 
                      type="text"
                      placeholder="What are you looking for today?"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-6 pl-16 pr-8 text-lg font-medium shadow-[0_10px_40px_rgba(0,0,0,0.04)] focus:shadow-[0_20px_60px_rgba(0,0,0,0.08)] outline-none transition-all focus:border-slate-400"
                    />
                    <button className="absolute right-3 top-3 bottom-3 rounded-xl bg-slate-900 px-8 text-sm font-black tracking-widest text-white transition-all hover:bg-slate-800 uppercase">
                      SEARCH
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
                  <Link href="/register" className="group text-[12px] font-black tracking-[0.2em] text-slate-900 uppercase flex items-center gap-2">
                    Start Your Path
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="hidden h-px w-12 bg-slate-200 sm:block" />
                  <Link href="/how-it-works" className="text-[12px] font-black tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all uppercase">
                    Our Workflow
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          {/* MASTER YOUR CRAFT (SERVICES) */}
          <section className="relative z-20 bg-white px-6 py-32 border-y border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="mb-4 text-5xl font-black tracking-tighter text-slate-900 uppercase">Master Your Craft</h2>
                  <p className="text-xl font-medium tracking-tight text-slate-500">Premium services for the digital economy.</p>
                </div>

                <Link className="hidden items-center text-[12px] font-black tracking-widest uppercase transition-colors hover:text-slate-500 sm:flex" href="/services">
                  Explore Hub
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-slate-50 animate-pulse border border-slate-100" />)
                ) : services.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug || s.id}`} className="block group">
                    <div className="h-full flex flex-col transition-all duration-500 group-hover:-translate-y-2">
                      <div className="relative mb-8 aspect-square overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 shadow-sm">
                         {s.thumbnail_url ? (
                          <img
                            alt={s.title}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            src={s.thumbnail_url}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                             <Zap className="w-12 h-12 mb-2 opacity-20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                             <span className="text-white text-xs font-black tracking-[0.2em] uppercase">Connect Now</span>
                        </div>
                      </div>

                      <div className="flex flex-col flex-1 px-2">
                        <div className="mb-4 flex items-start justify-between gap-4">
                          <h3 className="text-2xl font-bold tracking-tight text-slate-900 leading-tight">{s.title}</h3>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex flex-col">
                              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Starting From</span>
                              <span className="text-xl font-bold text-slate-900">{getStartingPrice(s.packages)}</span>
                           </div>
                           <div className="h-12 w-12 rounded-full border border-slate-200 flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                              <ArrowRight className="w-5 h-5" />
                           </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* EXPLORE THE ECOSYSTEM */}
          <section className="bg-slate-50 px-6 py-32">
            <div className="mx-auto max-w-7xl">
              <div className="mb-24 text-center">
                <h2 className="mb-6 text-6xl font-black tracking-tighter text-slate-900 uppercase">The Ecosystem</h2>
                <p className="mx-auto max-w-2xl text-xl font-medium tracking-tight text-slate-500">
                  Scale your digital presence with local expertise and global standards.
                </p>
              </div>

              <div className="grid auto-rows-[300px] grid-cols-1 gap-8 md:grid-cols-4">
                <Link
                  href="/store"
                  className="group relative flex flex-col justify-end overflow-hidden rounded-[3rem] border border-slate-200 bg-white p-10 shadow-sm transition-all hover:shadow-xl md:col-span-2 md:row-span-2"
                >
                  <img
                    alt="Digital Assets"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="mb-4 text-4xl font-black tracking-tighter text-slate-900 uppercase">Market Store</h3>
                    <p className="mb-10 max-w-sm text-lg font-medium tracking-tight text-slate-500 leading-relaxed">
                      Instant delivery on scripts, templates, and courses.
                    </p>
                    <span className="inline-block rounded-full bg-slate-900 px-10 py-4 text-sm font-black tracking-widest text-white shadow-xl transition-all hover:bg-slate-800 uppercase">
                      Browse Digital Store
                    </span>
                  </div>
                </Link>

                <Link
                  href="/services"
                  className="group flex items-center justify-between rounded-[3rem] border border-slate-200 bg-white p-10 transition-all hover:shadow-xl md:col-span-2"
                >
                  <div>
                    <h3 className="mb-3 text-3xl font-black tracking-tighter text-slate-900 uppercase">Talent Pool</h3>
                    <p className="max-w-xs text-lg font-medium tracking-tight text-slate-500">
                      Connect with Algeria's top-tier local talent for projects.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-900 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Link>

                {[
                  { title: 'Templates', description: 'Notion, Figma, Webflow.', path: '/store?type=template' },
                  { title: 'Training', description: 'Video courses & guides.', path: '/store?type=course' },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.path}
                    className="group flex flex-col justify-between rounded-[3rem] border border-slate-200 bg-white p-10 transition-all hover:shadow-xl"
                  >
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">{item.title}</h3>
                      <p className="mb-4 mt-2 text-md font-medium tracking-tight text-slate-400 font-display">{item.description}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 transition-all group-hover:bg-slate-900 group-hover:text-white">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* VALUE PROPS */}
          <section className="bg-white px-6 py-40 border-t border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-20 text-center md:grid-cols-3 md:text-left">
                {valueProps.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex flex-col items-center md:items-start group">
                      <div className="mb-10 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-slate-100 bg-slate-50 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:-translate-y-2">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h3 className="mb-4 text-sm font-black uppercase tracking-[0.2em] text-slate-900">{item.title}</h3>
                      <p className="text-lg font-medium tracking-tight leading-relaxed text-slate-500">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </AnimatedPageWrapper>
    </div>
  )
}
