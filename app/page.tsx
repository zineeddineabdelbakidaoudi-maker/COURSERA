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
          <section className="relative min-h-[90vh] overflow-hidden px-6 pt-32 md:pt-48 pb-20">
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
              <div className="absolute h-[1000px] w-[1000px] rounded-full border border-slate-100/50" />
              <div className="absolute h-[700px] w-[700px] rounded-full border border-slate-100" />
              <div className="absolute h-[400px] w-[400px] rounded-full border border-slate-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.01)]" />
            </div>

            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <h1 className="text-7xl font-semibold leading-[1.05] tracking-tight text-slate-900 md:text-9xl">
                  Where Talent Meets
                  <br />
                  <span className="text-slate-900/60">Opportunity</span>
                </h1>

                <p className="mx-auto max-w-xl text-lg font-medium tracking-tight text-slate-500 md:text-xl">
                  Your unified gateway to digital products, premium courses, and specialized services in Algeria.
                </p>

                <div className="flex flex-col items-center justify-center space-y-4 pt-8 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button size="lg" className="rounded-full bg-slate-900 px-10 py-7 text-xs font-black tracking-widest text-white transition-all hover:bg-slate-800 uppercase shadow-xl hover:shadow-2xl hover:-translate-y-1" asChild>
                    <Link href="/register">GET STARTED</Link>
                  </Button>
                  <Button variant="ghost" size="lg" className="rounded-full px-10 py-7 text-xs font-black tracking-widest text-slate-400 hover:text-slate-900 transition-all uppercase group" asChild>
                    <Link href="/how-it-works" className="flex items-center gap-2">
                       HOW IT WORKS <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* EXPLORE THE ECOSYSTEM */}
          <section className="bg-white px-6 py-40 border-t border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center mb-24 text-center">
                <h2 className="mb-6 text-6xl font-semibold tracking-tighter text-slate-900">Explore the Ecosystem</h2>
                <p className="mx-auto max-w-2xl text-lg font-medium tracking-tight text-slate-500">
                   Everything you need to build, scale, and automate your digital presence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <Link
                  href="/services"
                  className="group relative h-[400px] overflow-hidden rounded-[3rem] border border-slate-100 bg-[#F8F9FA] transition-all hover:shadow-2xl hover:border-slate-200"
                >
                  <div className="h-2/3 w-full overflow-hidden bg-slate-200">
                    <img
                      alt="Services"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
                    />
                  </div>
                  <div className="flex h-1/3 items-center justify-between p-10 bg-white">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900">Hire Freelancers</h3>
                      <p className="max-w-xs text-sm font-medium tracking-tight text-slate-400 mt-1">
                        Connect with top-tier local talent for your next big project.
                      </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-900 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </Link>

                <Link
                  href="/store"
                  className="group relative h-[400px] overflow-hidden rounded-[3rem] border border-slate-100 bg-[#F8F9FA] transition-all hover:shadow-2xl hover:border-slate-200"
                >
                  <div className="h-2/3 w-full overflow-hidden bg-slate-200">
                    <img
                      alt="Digital Store"
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800"
                    />
                  </div>
                  <div className="flex h-1/3 items-center justify-between p-10 bg-white">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900">Digital Store</h3>
                      <p className="max-w-xs text-sm font-medium tracking-tight text-slate-400 mt-1">
                         Scale your skills with premium courses and templates.
                      </p>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-900 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          {/* MASTER YOUR CRAFT (SERVICES SHORTLIST) */}
          <section className="relative z-20 bg-slate-50/50 px-6 py-32 border-y border-slate-100">
            <div className="mx-auto max-w-7xl">
              <div className="mb-20 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="mb-4 text-4xl font-bold tracking-tighter text-slate-900">Recommended Services</h2>
                  <p className="text-lg font-medium tracking-tight text-slate-500">Curated talent ready to help you build.</p>
                </div>

                <Link className="hidden items-center text-[10px] font-black tracking-widest uppercase transition-all hover:tracking-[0.15em] sm:flex" href="/services">
                  VIEW ALL SERVICES
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-96 rounded-3xl bg-white animate-pulse border border-slate-100 shadow-sm" />)
                ) : services.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug || s.id}`} className="block group">
                    <div className="h-full flex flex-col transition-all duration-500 group-hover:-translate-y-2">
                      <div className="relative mb-6 aspect-square overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                         {s.thumbnail_url ? (
                          <img
                            alt={s.title}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            src={s.thumbnail_url}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                             <Zap className="w-12 h-12 mb-2 opacity-20" />
                          </div>
                        )}
                        <div className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                           <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="px-2">
                        <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-tight mb-2">{s.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Starting From</span>
                          <span className="text-lg font-bold text-slate-900">{getStartingPrice(s.packages)}</span>
                        </div>
                      </div>
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
