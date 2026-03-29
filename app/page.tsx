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
          <section className="relative min-h-screen overflow-hidden px-6 pt-20">
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40">
              <div className="absolute h-[800px] w-[800px] rounded-full border border-gray-200" />
              <div className="absolute h-[600px] w-[600px] rounded-full border border-gray-200" />
              <div className="absolute h-[400px] w-[400px] rounded-full border border-gray-200" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-4xl flex-col items-center justify-center text-center">
              <h1 className="mb-6 text-6xl font-medium leading-[1.1] tracking-tight text-black md:text-8xl">
                Where Talent Meets
                <br />
                <span className="text-black">Opportunity</span>
              </h1>

              <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500 md:text-xl">
                Your unified gateway to digital products, premium courses, and specialized services in Algeria.
              </p>

              <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/register" className="w-full rounded-full border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-semibold tracking-wide text-black transition-all hover:bg-gray-200 sm:w-auto text-center">
                  GET STARTED
                </Link>
                <Link href="/how-it-works" className="group flex w-full items-center justify-center rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-gray-500 transition-all hover:text-black sm:w-auto">
                  HOW IT WORKS
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>

          {/* MASTER YOUR CRAFT (SERVICES) */}
          <section className="relative z-20 bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="mb-2 text-3xl font-medium tracking-tight text-black">Master Your Craft</h2>
                  <p className="text-gray-500">Premium services designed for the modern digital economy.</p>
                </div>

                <Link className="hidden items-center text-sm font-medium transition-colors hover:text-gray-600 sm:flex" href="/services">
                  View all services
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-96 rounded-[2rem] bg-gray-100 animate-pulse border border-gray-100" />)
                ) : services.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug || s.id}`} className="block">
                    <TiltCard className="group cursor-pointer rounded-[2rem] border border-gray-100 bg-[#f8f9fa] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full flex flex-col">
                      <div className="relative mb-6 h-64 overflow-hidden rounded-2xl bg-gray-200 flex-shrink-0">
                         {s.thumbnail_url ? (
                          <img
                            alt={s.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            src={s.thumbnail_url}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                             <Zap className="w-10 h-10 mb-2 opacity-20" />
                          </div>
                        )}
                      </div>

                      <div className="px-2 pb-4 flex flex-col flex-1">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <h3 className="text-xl font-medium text-black line-clamp-2">{s.title}</h3>
                        </div>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between">
                           <span className="text-lg font-semibold text-black">{getStartingPrice(s.packages)}</span>
                           <Button asChild className="rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-black hover:text-white group-hover:bg-black group-hover:text-white shadow-none h-10">
                              <span>Hire Now</span>
                           </Button>
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* EXPLORE THE ECOSYSTEM */}
          <section className="bg-[#fafafa] px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="mb-16 text-center">
                <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Explore the Ecosystem</h2>
                <p className="mx-auto max-w-2xl text-gray-500">
                  Everything you need to build, scale, and automate your digital presence.
                </p>
              </div>

              <div className="grid auto-rows-[240px] grid-cols-1 gap-6 md:grid-cols-4">
                <Link
                  href="/store"
                  className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:col-span-2 md:row-span-2"
                >
                  <img
                    alt="Automation dashboard visuals"
                    className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
                    src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                  <div className="relative z-10">
                    <h3 className="mb-2 text-3xl font-medium text-black">Digital Products</h3>
                    <p className="mb-6 max-w-sm text-gray-600">
                      Plug-and-play scripts, templates, and assets to save you hundreds of hours.
                    </p>
                    <span className="inline-block rounded-full border border-gray-200 bg-white/80 px-6 py-2 text-sm font-medium backdrop-blur transition-colors group-hover:bg-black group-hover:text-white shadow-sm">
                      Browse Digital Store
                    </span>
                  </div>
                </Link>

                <Link
                  href="/services"
                  className="group flex items-center justify-between rounded-[2rem] border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-50 p-8 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:col-span-2"
                >
                  <div>
                    <h3 className="mb-2 text-2xl font-medium text-black">Hire Freelancers</h3>
                    <p className="max-w-xs text-sm text-gray-500">
                      Connect with top-tier local talent for your next big project.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-sm transition-all group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </Link>

                {[
                  { title: 'Templates', description: 'Notion, Figma, and Webflow.', path: '/store?type=template' },
                  { title: 'eBooks', description: 'Actionable guides and strategies.', path: '/store?type=ebook' },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={item.path}
                    className="group flex flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-8 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                  >
                    <div>
                      <h3 className="text-xl font-medium text-black">{item.title}</h3>
                      <p className="mb-4 mt-2 text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-black group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* VALUE PROPS */}
          <section className="border-t border-gray-100 bg-white px-6 py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
                {valueProps.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex flex-col items-center md:items-start">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                        <Icon className="h-6 w-6 text-black" />
                      </div>
                      <h3 className="mb-3 text-lg font-medium uppercase tracking-wide text-black">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-gray-200 bg-[#fafafa] px-6 pb-10 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-4">
              <div className="md:col-span-1">
                <div className="mb-6 text-lg font-bold tracking-[0.2em] text-black">D I G I T H U P</div>
                <p className="text-sm leading-relaxed text-gray-500">
                  The premier marketplace for digital creators, learners, and businesses in Algeria to connect and scale.
                </p>
              </div>

              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h4 className="mb-6 text-sm font-semibold uppercase tracking-wider text-black">{column.title}</h4>
                  <ul className="space-y-4 text-sm text-gray-500">
                    {column.links.map((link) => (
                      <li key={link.text}>
                        <Link className="transition-colors hover:text-black" href={link.href}>
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 text-center text-xs font-medium tracking-wide text-gray-400 md:flex-row md:text-left">
              <p>Copyright {new Date().getFullYear()} DIGITHUP. All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
                <span>Proudly built in Algeria</span>
              </div>
            </div>
          </div>
        </footer>
      </AnimatedPageWrapper>
    </div>
  )
}
