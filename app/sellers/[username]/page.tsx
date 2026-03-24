"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronRight,
  Star,
  Clock,
  Package,
  CheckCircle2,
  MessageCircle,
  MapPin,
  Calendar,
  Globe,
  Zap,
  ThumbsUp,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ServiceCard } from "@/components/marketplace/service-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { featuredServices } from "@/lib/data"

// ━━━ MOCK SELLER PROFILE DATA ━━━
const sellerProfile = {
  username: "yacine-m",
  name: "Yacine M.",
  tagline: "Professional Graphic Designer & Brand Strategist",
  level: "pro" as const,
  verified: true,
  avatar: "Y",
  coverGradient: "from-primary/30 via-accent/20 to-primary/10",
  memberSince: "March 2024",
  location: "Algiers, Algeria",
  responseTime: "< 1 hour",
  lastDelivery: "3 hours ago",
  completedOrders: 234,
  rating: 4.9,
  reviewCount: 189,
  bio: `Hello! I'm Yacine, a passionate graphic designer with over 5 years of experience helping businesses and startups create memorable brand identities.

Based in Algiers, I've had the pleasure of working with clients across Algeria and internationally. My design philosophy centers on creating clean, timeless visuals that effectively communicate your brand's values.

**What I specialize in:**
- Logo Design & Brand Identity
- Social Media Graphics
- Marketing Materials
- UI/UX Design

I believe in clear communication, meeting deadlines, and delivering quality work that exceeds expectations. Let's bring your vision to life!`,
  languages: ["Arabic (Native)", "French (Fluent)", "English (Professional)"],
  skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Adobe Photoshop", "Figma", "Social Media Design", "Print Design"],
  tools: ["Adobe Creative Suite", "Figma", "Canva Pro", "Procreate"],
  education: "Bachelor's in Visual Communication - University of Algiers",
  stats: {
    totalEarnings: "2.5M+ DZD",
    repeatClients: "45%",
    onTimeDelivery: "99%",
  },
  services: featuredServices.filter((s) => s.seller.name === "Yacine M." || s.category === "Graphic Design").slice(0, 4),
  portfolio: [
    { id: "1", title: "Tech Startup Logo", category: "Logo Design" },
    { id: "2", title: "Restaurant Branding", category: "Brand Identity" },
    { id: "3", title: "Social Media Campaign", category: "Social Media" },
    { id: "4", title: "E-commerce Logo", category: "Logo Design" },
    { id: "5", title: "Healthcare Brand", category: "Brand Identity" },
    { id: "6", title: "Fashion Brand Identity", category: "Brand Identity" },
  ],
  reviews: [
    {
      id: "1",
      buyer: { name: "Amira S.", avatar: "A" },
      rating: 5,
      date: "2 weeks ago",
      service: "Professional Logo Design",
      comment: "Yacine is incredibly talented! He understood my vision perfectly and delivered a stunning logo that exceeded my expectations. Highly recommend!",
      helpful: 24,
    },
    {
      id: "2",
      buyer: { name: "Mohamed K.", avatar: "M" },
      rating: 5,
      date: "1 month ago",
      service: "Brand Identity Package",
      comment: "Professional, creative, and fast. This was my third order with Yacine and he never disappoints.",
      helpful: 18,
    },
    {
      id: "3",
      buyer: { name: "Sara B.", avatar: "S" },
      rating: 5,
      date: "1 month ago",
      service: "Social Media Design Pack",
      comment: "Great communication and quality work. Only took one revision to get exactly what I wanted.",
      helpful: 12,
    },
  ],
  ratingBreakdown: { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 },
}

const levelLabels: Record<string, { label: string; className: string }> = {
  new: { label: "New Seller", className: "bg-secondary text-secondary-foreground" },
  rising: { label: "Rising Talent", className: "bg-primary/10 text-primary" },
  pro: { label: "Pro Seller", className: "bg-accent/10 text-accent" },
  elite: { label: "Elite Partner", className: "bg-warning/10 text-warning" },
}

export default function SellerProfilePage() {
  const levelInfo = levelLabels[sellerProfile.level]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        {/* Cover & Profile Header */}
        <div className="relative">
          {/* Cover */}
          <div className={cn("h-48 lg:h-64 bg-gradient-to-br", sellerProfile.coverGradient)} />
          
          {/* Profile Info */}
          <div className="container mx-auto px-4 lg:px-8">
            <div className="relative -mt-16 lg:-mt-20 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-6">
                {/* Avatar */}
                <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30">
                  <span className="text-4xl lg:text-5xl font-bold text-foreground">
                    {sellerProfile.avatar}
                  </span>
                  {sellerProfile.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold">{sellerProfile.name}</h1>
                    <Badge className={cn("w-fit", levelInfo.className)}>
                      {levelInfo.label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{sellerProfile.tagline}</p>
                  
                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-semibold">{sellerProfile.rating}</span>
                      <span className="text-muted-foreground">({sellerProfile.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>{sellerProfile.completedOrders} orders</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>Responds {sellerProfile.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {sellerProfile.memberSince}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4 lg:mt-0">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Me
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <Tabs defaultValue="services" className="w-full">
                <TabsList className="w-full justify-start h-auto p-1 mb-6 overflow-x-auto">
                  <TabsTrigger value="services" className="px-6">Services</TabsTrigger>
                  <TabsTrigger value="portfolio" className="px-6">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews" className="px-6">Reviews</TabsTrigger>
                  <TabsTrigger value="about" className="px-6">About</TabsTrigger>
                </TabsList>

                {/* Services Tab */}
                <TabsContent value="services">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sellerProfile.services.map((service) => (
                      <ServiceCard key={service.id} {...service} />
                    ))}
                  </div>
                </TabsContent>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sellerProfile.portfolio.map((item) => (
                      <div
                        key={item.id}
                        className="group relative aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 overflow-hidden cursor-pointer"
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                              {item.title.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <h3 className="font-semibold text-sm">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  {/* Rating Breakdown */}
                  <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-secondary/30 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-1">{sellerProfile.rating}</div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-4 h-4",
                              star <= Math.round(sellerProfile.rating)
                                ? "fill-warning text-warning"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sellerProfile.reviewCount} reviews
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm w-12">{stars} stars</span>
                          <Progress
                            value={sellerProfile.ratingBreakdown[stars as keyof typeof sellerProfile.ratingBreakdown]}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-10">
                            {sellerProfile.ratingBreakdown[stars as keyof typeof sellerProfile.ratingBreakdown]}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="space-y-6">
                    {sellerProfile.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-0">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
                            <span className="font-medium">{review.buyer.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{review.buyer.name}</span>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={cn(
                                      "w-3.5 h-3.5",
                                      star <= review.rating
                                        ? "fill-warning text-warning"
                                        : "text-muted-foreground"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">for {review.service}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{review.comment}</p>
                        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* About Tab */}
                <TabsContent value="about">
                  <div className="space-y-8">
                    {/* Bio */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">About Me</h3>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {sellerProfile.bio}
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {sellerProfile.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tools */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Tools I Use</h3>
                      <div className="flex flex-wrap gap-2">
                        {sellerProfile.tools.map((tool) => (
                          <Badge key={tool} variant="outline">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Languages */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Languages</h3>
                      <div className="space-y-2">
                        {sellerProfile.languages.map((lang) => (
                          <div key={lang} className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-muted-foreground" />
                            <span>{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Education</h3>
                      <p className="text-muted-foreground">{sellerProfile.education}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80">
              <div className="sticky top-24 space-y-6">
                {/* Hire Card */}
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h3 className="font-semibold mb-4">Hire {sellerProfile.name.split(" ")[0]}</h3>
                  
                  {/* Top Service */}
                  {sellerProfile.services[0] && (
                    <div className="p-4 rounded-xl bg-secondary/50 mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Featured Service</p>
                      <p className="font-medium text-sm mb-1">{sellerProfile.services[0].title}</p>
                      <p className="text-primary font-mono font-semibold">
                        From {sellerProfile.services[0].price.toLocaleString()} DZD
                      </p>
                    </div>
                  )}

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    View All Services
                  </Button>
                </div>

                {/* Stats Card */}
                <div className="p-6 rounded-2xl border border-border bg-card">
                  <h3 className="font-semibold mb-4">Seller Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {sellerProfile.location}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response time</span>
                      <span className="flex items-center gap-1 text-success">
                        <Zap className="w-4 h-4" />
                        {sellerProfile.responseTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last delivery</span>
                      <span>{sellerProfile.lastDelivery}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">On-time delivery</span>
                      <span className="text-success">{sellerProfile.stats.onTimeDelivery}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Repeat clients</span>
                      <span>{sellerProfile.stats.repeatClients}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Contact Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
