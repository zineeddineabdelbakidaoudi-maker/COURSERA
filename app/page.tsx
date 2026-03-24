"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Search, 
  ArrowRight, 
  Users, 
  ShoppingBag, 
  Star, 
  BadgeCheck, 
  CreditCard, 
  MessageCircle, 
  Shield,
  Zap,
  GraduationCap,
  Palette,
  Code,
  PenTool,
  Share2,
  Video,
  FileText,
  Settings,
  ChevronRight,
  Lock,
  Clock,
  Ban,
  XCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ServiceCard } from "@/components/marketplace/service-card"
import { ProductCard } from "@/components/marketplace/product-card"
import { SellerCard } from "@/components/marketplace/seller-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { featuredServices, featuredProducts, topSellers, categories, testimonials, faqItems } from "@/lib/data"
import { HeroCanvas } from "@/components/ui/3d/hero-canvas"

// ━━━ CATEGORY ICONS MAP ━━━
const categoryIcons: Record<string, React.ElementType> = {
  palette: Palette,
  code: Code,
  pen: PenTool,
  share: Share2,
  video: Video,
  graduation: GraduationCap,
  file: FileText,
  settings: Settings,
}

// ━━━ POPULAR SEARCH TAGS ━━━
const popularSearches = [
  "Logo Design",
  "Web Development",
  "Arabic Translation",
  "Social Media",
  "Video Editing",
]

// ━━━ SERVICE CATEGORY FILTERS ━━━
const serviceFilters = [
  "All",
  "Graphic Design",
  "Web Dev",
  "Writing",
  "Video",
  "Social Media",
]

export default function HomePage() {
  const [activeServiceFilter, setActiveServiceFilter] = React.useState("All")
  const [savedServices, setSavedServices] = React.useState<Set<string>>(new Set())

  const toggleSaveService = (id: string) => {
    setSavedServices((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredServices = activeServiceFilter === "All" 
    ? featuredServices 
    : featuredServices.filter(s => s.category.toLowerCase().includes(activeServiceFilter.toLowerCase().split(" ")[0]))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ━━━ HERO SECTION ━━━ */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 -z-10 bg-background/50">
          <HeroCanvas />
          <div className="absolute inset-0 gradient-mesh" />
          <div className="absolute inset-0 bg-dot-pattern opacity-40 mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-float" />
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="mb-8 px-5 py-2.5 text-sm font-medium border-primary/30 bg-primary/5 text-primary animate-badge-glow rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {"Algeria's #1 Freelancer & Learning Platform"}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-balance animate-slide-up">
              Your Skills Have Value.{" "}
              <span className="gradient-text">Start Earning Today.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Hire top freelancers, sell your services, and access courses, templates, and tools — all from one trusted platform built for Algeria.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/become-a-seller">
                <Button size="lg" className="w-full sm:w-auto rounded-full gradient-primary hover:opacity-90 text-white gap-2 px-10 h-13 text-base shadow-glow transition-all duration-300">
                  Start Selling
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full gap-2 px-10 h-13 text-base border-2 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-base">1,200+</span>
                  <p className="text-muted-foreground text-xs">Verified Freelancers</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-base">4,500+</span>
                  <p className="text-muted-foreground text-xs">Services</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-warning/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-base">98%</span>
                  <p className="text-muted-foreground text-xs">Satisfaction</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-success" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-base">DZD</span>
                  <p className="text-muted-foreground text-xs">Prices Always</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-14 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: CreditCard, label: "Edahabia Compatible" },
              { icon: CreditCard, label: "CIB Compatible" },
              { icon: MessageCircle, label: "WhatsApp Support" },
              { icon: BadgeCheck, label: "Verified Sellers" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-sm card-hover"
              >
                <badge.icon className="w-4 h-4 text-primary/70" />
                <span className="text-muted-foreground font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ SEARCH BAR SECTION ━━━ */}
      <section className="py-8 lg:py-12 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find a designer, developer, copywriter..."
                className="w-full h-14 pl-12 pr-4 text-base rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <Button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                Search
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {popularSearches.map((tag) => (
                <Link
                  key={tag}
                  href={`/services?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 text-sm rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS SECTION ━━━ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-balance">
              One Platform. Two Powerful Engines.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you want to hire talent, sell your services, or learn new skills — we{"'"}ve got you covered.
            </p>
          </div>

          <Tabs defaultValue="hire" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 mb-8">
              <TabsTrigger value="hire" className="py-3">I Want to Hire</TabsTrigger>
              <TabsTrigger value="sell" className="py-3">I Want to Sell</TabsTrigger>
              <TabsTrigger value="learn" className="py-3">I Want to Learn</TabsTrigger>
            </TabsList>

            <TabsContent value="hire">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: 1, title: "Search", desc: "Find the perfect service for your needs" },
                  { step: 2, title: "Review", desc: "Check profiles, portfolios & reviews" },
                  { step: 3, title: "Order", desc: "Choose a package and place your order" },
                  { step: 4, title: "Receive", desc: "Get your delivery on time" },
                  { step: 5, title: "Review", desc: "Leave feedback to help others" },
                ].map((item, i) => (
                  <div key={item.step} className="relative text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    {i < 4 && (
                      <ChevronRight className="hidden md:block absolute top-6 -right-2 w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sell">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {[
                  { step: 1, title: "Register", desc: "Create your free account" },
                  { step: 2, title: "Build Profile", desc: "Showcase your skills" },
                  { step: 3, title: "Submit", desc: "Create your service listing" },
                  { step: 4, title: "Get Approved", desc: "Pass our quality review" },
                  { step: 5, title: "Receive Orders", desc: "Start getting clients" },
                  { step: 6, title: "Get Paid", desc: "Withdraw your earnings" },
                ].map((item, i) => (
                  <div key={item.step} className="relative text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    {i < 5 && (
                      <ChevronRight className="hidden md:block absolute top-6 -right-2 w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="learn">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { step: 1, title: "Browse", desc: "Explore courses & resources" },
                  { step: 2, title: "Choose", desc: "Pick what fits your goals" },
                  { step: 3, title: "Pay", desc: "Secure checkout in DZD" },
                  { step: 4, title: "Download", desc: "Instant access to content" },
                  { step: 5, title: "Grow", desc: "Apply & level up your career" },
                ].map((item, i) => (
                  <div key={item.step} className="relative text-center">
                    <div className="w-12 h-12 rounded-full bg-success/10 text-success font-bold flex items-center justify-center mx-auto mb-3">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                    {i < 4 && (
                      <ChevronRight className="hidden md:block absolute top-6 -right-2 w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ━━━ FEATURED SERVICES SECTION ━━━ */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Top Services This Week</h2>
              <p className="text-muted-foreground">Discover talented freelancers ready to help</p>
            </div>
            <Link href="/services" className="text-primary font-medium flex items-center gap-1 hover:underline">
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {serviceFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveServiceFilter(filter)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                  activeServiceFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.slice(0, 8).map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                isSaved={savedServices.has(service.id || "")}
                onSaveToggle={() => toggleSaveService(service.id || "")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ DIGITAL PRODUCTS SECTION ━━━ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <Badge className="mb-3 bg-accent/10 text-accent border-accent/20 hover:bg-accent/10">
                <GraduationCap className="w-4 h-4 mr-1" />
                Skill Growth Store
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Level Up Your Freelance Career</h2>
              <p className="text-muted-foreground">Courses, templates, ebooks, and toolkits made for Algerian freelancers.</p>
            </div>
            <Link href="/store" className="text-accent font-medium flex items-center gap-1 hover:underline">
              Browse All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ CATEGORIES GRID SECTION ━━━ */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Explore by Category</h2>
            <p className="text-muted-foreground">Find exactly what you need</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const IconComponent = (categoryIcons[cat.icon] || FileText) as any
              return (
                <Link
                  key={cat.slug}
                  href={`/services?category=${cat.slug}`}
                  className="flex flex-col items-center justify-center p-6 lg:p-8 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-center mb-1">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} services</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ━━━ SELLER SPOTLIGHT SECTION ━━━ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Meet Our Top Sellers</h2>
              <p className="text-muted-foreground">Talented professionals ready to bring your projects to life</p>
            </div>
            <Link href="/sellers" className="text-primary font-medium flex items-center gap-1 hover:underline">
              View All Sellers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sellers Scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {topSellers.map((seller) => (
              <SellerCard key={seller.username} {...seller} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TRUST & ALGERIA SECTION ━━━ */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Built for Algeria. Designed for Growth.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We understand the local market and built features specifically for Algerian freelancers and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Sellers</h3>
              <p className="text-muted-foreground text-sm">
                Every seller is reviewed before going live. Quality guaranteed.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Payment Support</h3>
              <p className="text-muted-foreground text-sm">
                Edahabia & CIB compatible payments coming soon.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Support in 3 Languages</h3>
              <p className="text-muted-foreground text-sm">
                Arabic, French, English via WhatsApp & email.
              </p>
            </div>
          </div>

          {/* Algeria Banner */}
          <div className="rounded-2xl bg-success/10 border border-success/20 p-6 text-center">
            <p className="text-success font-semibold text-lg">
              Made in Algeria — Built for the World
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            {[
              { icon: Lock, label: "SSL Secure" },
              { icon: Shield, label: "Buyer Protection" },
              { icon: Clock, label: "48h Support" },
              { icon: Ban, label: "No Hidden Fees" },
              { icon: XCircle, label: "Cancel Anytime" },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm"
              >
                <badge.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ BECOME A SELLER CTA SECTION ━━━ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-accent p-8 lg:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
                Your skills are worth more than you think.
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Join hundreds of verified Algerian freelancers already earning on Digit Hup. Free to join.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                {[
                  "Free to register",
                  "You control your pricing",
                  "Payments in DZD",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <Link href="/become-a-seller">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-primary hover:bg-white/90 gap-2 px-8 h-12 text-base font-semibold animate-pulse"
                >
                  Apply to Sell Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS SECTION ━━━ */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-muted-foreground">Real stories from real users</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex flex-col p-6 rounded-2xl bg-background border border-border"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                  {`"${testimonial.quote}"`}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ SECTION ━━━ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Got Questions? We Have Answers.</h2>
              <p className="text-muted-foreground">Everything you need to know about Digit Hup</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
