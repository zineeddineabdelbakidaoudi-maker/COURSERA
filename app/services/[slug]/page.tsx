"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronRight,
  Star,
  Clock,
  RefreshCw,
  CheckCircle2,
  MessageCircle,
  Heart,
  Share2,
  Shield,
  CreditCard,
  ThumbsUp,
  Calendar,
  Package,
  Zap,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ServiceCard } from "@/components/marketplace/service-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { featuredServices } from "@/lib/data"

// ━━━ MOCK SERVICE DETAILS ━━━
const serviceDetail = {
  id: "1",
  slug: "professional-logo-design",
  title: "I Will Design a Professional Logo for Your Brand",
  description: `Are you looking for a unique, professional logo that perfectly represents your brand? Look no further!

I specialize in creating modern, memorable logos that help businesses stand out. With over 5 years of experience in brand identity design, I've helped hundreds of clients across Algeria and beyond establish a strong visual presence.

**What makes my logos special:**
- Clean, modern designs that stand the test of time
- Multiple concept options to choose from
- Unlimited revisions until you're 100% satisfied
- Full ownership and commercial rights
- Quick turnaround without compromising quality

**My process:**
1. I start by understanding your brand, target audience, and preferences
2. I create initial concepts based on your brief
3. We collaborate on refinements until it's perfect
4. You receive all final files in multiple formats

Let's create something amazing together!`,
  seller: {
    username: "yacine-m",
    name: "Yacine M.",
    level: "pro" as const,
    verified: true,
    avatar: "Y",
    memberSince: "March 2024",
    responseTime: "< 1 hour",
    completedOrders: 234,
    rating: 4.9,
    bio: "Professional graphic designer specializing in brand identity and logo design. Passionate about helping businesses establish a strong visual presence.",
    languages: ["Arabic", "French", "English"],
    skills: ["Logo Design", "Brand Identity", "Graphic Design", "Illustration"],
  },
  category: "Graphic Design",
  subcategory: "Logo Design",
  packages: [
    {
      name: "Basic",
      price: 2500,
      description: "Simple logo design",
      deliveryDays: 3,
      revisions: 2,
      features: [
        "1 concept included",
        "Logo transparency",
        "Vector file (SVG)",
        "Printable file (PDF)",
      ],
    },
    {
      name: "Standard",
      price: 5000,
      description: "Professional logo with more options",
      deliveryDays: 4,
      revisions: 5,
      features: [
        "3 concepts included",
        "Logo transparency",
        "Vector file (SVG)",
        "Printable file (PDF)",
        "3D mockup",
        "Social media kit",
      ],
    },
    {
      name: "Premium",
      price: 10000,
      description: "Complete brand identity package",
      deliveryDays: 7,
      revisions: -1, // unlimited
      features: [
        "5 concepts included",
        "Logo transparency",
        "Vector file (SVG)",
        "Printable file (PDF)",
        "3D mockup",
        "Social media kit",
        "Business card design",
        "Letterhead design",
        "Brand guidelines",
        "Source file",
      ],
    },
  ],
  whatYouGet: [
    "High-resolution logo files",
    "Vector formats (AI, EPS, SVG)",
    "Web-ready formats (PNG, JPG)",
    "Print-ready files (PDF, CMYK)",
    "Full commercial rights",
    "24/7 support during the project",
  ],
  faq: [
    {
      question: "What information do you need from me?",
      answer: "I'll need your company name, industry, target audience, any color preferences, and examples of logos you like. The more details you provide, the better I can capture your vision.",
    },
    {
      question: "Can you match a specific style?",
      answer: "Yes! If you have reference images or a specific style in mind, please share them and I'll incorporate those elements into the design.",
    },
    {
      question: "What if I don't like any of the concepts?",
      answer: "No worries! I offer unlimited revisions on the Premium package and multiple revision rounds on other packages. We'll keep working until you're 100% satisfied.",
    },
    {
      question: "Do you provide the source files?",
      answer: "Source files (Adobe Illustrator) are included in the Premium package. For other packages, they can be added for an additional fee.",
    },
  ],
  reviews: [
    {
      id: "1",
      buyer: { name: "Amira S.", avatar: "A" },
      rating: 5,
      date: "2 weeks ago",
      comment: "Yacine is incredibly talented! He understood my vision perfectly and delivered a stunning logo that exceeded my expectations. Highly recommend!",
      helpful: 24,
    },
    {
      id: "2",
      buyer: { name: "Mohamed K.", avatar: "M" },
      rating: 5,
      date: "1 month ago",
      comment: "Professional, creative, and fast. This was my third order with Yacine and he never disappoints. The logo is perfect for my new startup.",
      helpful: 18,
    },
    {
      id: "3",
      buyer: { name: "Sara B.", avatar: "S" },
      rating: 4,
      date: "1 month ago",
      comment: "Great communication and quality work. Only took one revision to get exactly what I wanted. Will definitely order again.",
      helpful: 12,
    },
  ],
  ratingBreakdown: {
    5: 85,
    4: 10,
    3: 3,
    2: 1,
    1: 1,
  },
  tags: ["logo design", "brand identity", "modern logo", "business logo", "minimalist"],
}

export default function ServiceDetailPage() {
  const [selectedPackage, setSelectedPackage] = React.useState(1) // Standard by default
  const [isSaved, setIsSaved] = React.useState(false)

  const currentPackage = serviceDetail.packages[selectedPackage]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/services?category=${serviceDetail.category.toLowerCase().replace(" ", "-")}`} className="hover:text-foreground transition-colors">
              {serviceDetail.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{serviceDetail.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-balance">
                {serviceDetail.title}
              </h1>

              {/* Seller Info */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-lg font-bold">{serviceDetail.seller.avatar}</span>
                    {serviceDetail.seller.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link href={`/sellers/${serviceDetail.seller.username}`} className="font-semibold hover:text-primary transition-colors">
                      {serviceDetail.seller.name}
                    </Link>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
                        Pro Seller
                      </Badge>
                      <span className="text-muted-foreground">Member since {serviceDetail.seller.memberSince}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium">{serviceDetail.seller.rating}</span>
                    <span className="text-muted-foreground">({serviceDetail.reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>{serviceDetail.seller.completedOrders} orders</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="mb-8">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center mb-4">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">Y</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <button
                      key={i}
                      className="w-20 h-14 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-transparent hover:border-primary transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-slate max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">About This Service</h2>
                <div className="text-muted-foreground whitespace-pre-line">
                  {serviceDetail.description}
                </div>
              </div>

              {/* What You'll Get */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What You{"'"}ll Get</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceDetail.whatYouGet.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible>
                  {serviceDetail.faq.map((item, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>

                {/* Rating Breakdown */}
                <div className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl bg-secondary/30 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-1">{serviceDetail.seller.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= Math.round(serviceDetail.seller.rating)
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {serviceDetail.reviews.length} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-12">{stars} stars</span>
                        <Progress
                          value={serviceDetail.ratingBreakdown[stars as keyof typeof serviceDetail.ratingBreakdown]}
                          className="flex-1 h-2"
                        />
                        <span className="text-sm text-muted-foreground w-10">
                          {serviceDetail.ratingBreakdown[stars as keyof typeof serviceDetail.ratingBreakdown]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {serviceDetail.reviews.map((review) => (
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
                          <div className="flex items-center gap-1 mt-1">
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
              </div>
            </div>

            {/* Right Column - Order Card */}
            <div className="lg:w-96">
              <div className="sticky top-24">
                <div className="border border-border rounded-2xl bg-card overflow-hidden">
                  {/* Package Tabs */}
                  <div className="grid grid-cols-3 border-b border-border">
                    {serviceDetail.packages.map((pkg, i) => (
                      <button
                        key={pkg.name}
                        onClick={() => setSelectedPackage(i)}
                        className={cn(
                          "py-4 text-sm font-medium transition-colors",
                          selectedPackage === i
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        )}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>

                  {/* Package Details */}
                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-mono text-3xl font-bold">
                        {currentPackage.price.toLocaleString()}
                        <span className="text-lg ml-1">DZD</span>
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4">{currentPackage.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{currentPackage.deliveryDays} day{currentPackage.deliveryDays > 1 ? 's' : ''} delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {currentPackage.revisions === -1 ? "Unlimited" : currentPackage.revisions} revision{currentPackage.revisions !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {currentPackage.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base mb-3">
                      Continue ({currentPackage.price.toLocaleString()} DZD)
                    </Button>

                    <Button variant="outline" className="w-full rounded-xl h-12 gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact Seller
                    </Button>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Edahabia/CIB</span>
                      </div>
                    </div>
                  </div>

                  {/* Seller Mini Profile */}
                  <div className="border-t border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-lg font-bold">{serviceDetail.seller.avatar}</span>
                        {serviceDetail.seller.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <div>
                        <Link href={`/sellers/${serviceDetail.seller.username}`} className="font-semibold hover:text-primary transition-colors">
                          {serviceDetail.seller.name}
                        </Link>
                        <Badge variant="secondary" className="text-xs bg-accent/10 text-accent ml-2">
                          Pro Seller
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Response time</p>
                        <p className="font-medium flex items-center gap-1">
                          <Zap className="w-4 h-4 text-warning" />
                          {serviceDetail.seller.responseTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Completed orders</p>
                        <p className="font-medium">{serviceDetail.seller.completedOrders}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Member since</p>
                        <p className="font-medium">{serviceDetail.seller.memberSince}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-medium flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          {serviceDetail.seller.rating}
                        </p>
                      </div>
                    </div>

                    <Link href={`/sellers/${serviceDetail.seller.username}`}>
                      <Button variant="ghost" className="w-full" size="sm">
                        View Full Profile
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => setIsSaved(!isSaved)}
                  >
                    <Heart className={cn("w-4 h-4", isSaved && "fill-current text-destructive")} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Services */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredServices.slice(0, 4).map((service) => (
                <ServiceCard key={service.id} {...service} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
