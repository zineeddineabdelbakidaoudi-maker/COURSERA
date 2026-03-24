"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight,
  Star,
  Download,
  CheckCircle2,
  Shield,
  CreditCard,
  ThumbsUp,
  BookOpen,
  FileText,
  Users,
  Clock,
  Play,
  File,
  Sparkles,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/marketplace/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { featuredProducts } from "@/lib/data"

// ━━━ MOCK PRODUCT DETAILS ━━━
const productDetail = {
  id: "1",
  slug: "freelance-starter-pack",
  title: "Freelance Starter Pack",
  subtitle: "Everything you need to launch your freelance career in Algeria",
  description: `Ready to start your freelance journey but don't know where to begin? The Freelance Starter Pack is your comprehensive guide to launching and growing a successful freelance business in Algeria.

**What's Inside:**

This toolkit includes 15+ templates, guides, and resources covering:

- **Client Acquisition**: Learn how to find your first clients and build a steady pipeline
- **Pricing Strategies**: Discover how to price your services competitively in DZD
- **Contract Templates**: Protect yourself with professional, Algeria-friendly contracts
- **Invoice Templates**: Get paid faster with professional invoicing
- **Proposal Templates**: Win more projects with compelling proposals
- **Portfolio Guide**: Showcase your work effectively even without experience
- **Time Management**: Balance multiple clients without burning out
- **Tax Guide**: Understand basic tax obligations for freelancers in Algeria

Created by experienced freelancers who have built successful careers in the Algerian market, this pack gives you a head start without the trial and error.`,
  price: 1500,
  type: "toolkit" as const,
  creator: {
    name: "Digit Hup Team",
    avatar: "D",
    totalProducts: 12,
    rating: 4.9,
    bio: "The Digit Hup content team creates resources specifically designed for Algerian freelancers.",
  },
  rating: 4.9,
  purchaseCount: 847,
  isInstantDownload: true,
  isBestSeller: true,
  whatYouGet: [
    "15+ Professional Templates",
    "Step-by-Step Getting Started Guide",
    "Client Contract Template (French & Arabic)",
    "Invoice Template (Excel & Google Sheets)",
    "Proposal Template Pack",
    "Portfolio Website Template",
    "Pricing Calculator",
    "Tax Checklist for Algeria",
    "Email Scripts for Client Communication",
    "Lifetime Updates",
  ],
  whoIsThisFor: [
    "Beginners wanting to start freelancing",
    "Students looking to earn while studying",
    "Professionals transitioning to freelance work",
    "Existing freelancers wanting to professionalize",
    "Anyone in Algeria wanting location-independent income",
  ],
  fileDetails: {
    format: "ZIP (PDF, DOCX, XLSX)",
    size: "45 MB",
    license: "Personal & Commercial Use",
  },
  tableOfContents: [
    {
      title: "Module 1: Getting Started",
      items: ["Mindset for Success", "Setting Up Your Workspace", "Choosing Your Niche"],
    },
    {
      title: "Module 2: Finding Clients",
      items: ["Building Your Online Presence", "Networking Strategies", "Cold Outreach Scripts"],
    },
    {
      title: "Module 3: Winning Projects",
      items: ["Writing Winning Proposals", "Pricing Your Services", "Negotiation Tips"],
    },
    {
      title: "Module 4: Delivering Excellence",
      items: ["Project Management", "Client Communication", "Handling Revisions"],
    },
    {
      title: "Module 5: Getting Paid",
      items: ["Invoicing Best Practices", "Payment Methods in Algeria", "Handling Late Payments"],
    },
  ],
  reviews: [
    {
      id: "1",
      buyer: { name: "Khaled R.", avatar: "K" },
      rating: 5,
      date: "1 week ago",
      comment: "This pack saved me months of trial and error! The contract templates alone are worth the price. Highly recommended for any new freelancer.",
      helpful: 32,
    },
    {
      id: "2",
      buyer: { name: "Fatima Z.", avatar: "F" },
      rating: 5,
      date: "2 weeks ago",
      comment: "Finally, resources made specifically for the Algerian market. The pricing guide helped me confidently quote my first client.",
      helpful: 28,
    },
    {
      id: "3",
      buyer: { name: "Omar M.", avatar: "O" },
      rating: 4,
      date: "1 month ago",
      comment: "Great value for the price. The templates are professional and easy to customize. Would love to see more advanced content in the future.",
      helpful: 15,
    },
  ],
  ratingBreakdown: { 5: 82, 4: 12, 3: 4, 2: 1, 1: 1 },
  faq: [
    {
      question: "Is this suitable for complete beginners?",
      answer: "Absolutely! This pack is designed specifically for people starting their freelance journey. No prior experience is required.",
    },
    {
      question: "Are the templates in Arabic?",
      answer: "The main guides are in French and English. Key templates like contracts are available in both French and Arabic.",
    },
    {
      question: "Do I get lifetime access?",
      answer: "Yes! Once you purchase, you get lifetime access to all current materials and any future updates.",
    },
    {
      question: "Can I use these templates commercially?",
      answer: "Yes, the license includes personal and commercial use. You can use all templates for your client work.",
    },
  ],
}

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{productDetail.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Cover Image */}
              <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-accent/30 via-primary/20 to-accent/10 mb-6 overflow-hidden">
                {productDetail.isBestSeller && (
                  <Badge className="absolute top-4 left-4 bg-warning text-warning-foreground border-0 gap-1">
                    <Sparkles className="w-3 h-3" />
                    Best Seller
                  </Badge>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-accent/20 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-accent" />
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <Badge variant="outline" className="mb-4 bg-warning/10 text-warning border-warning/20">
                Toolkit
              </Badge>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {productDetail.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {productDetail.subtitle}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-semibold">{productDetail.rating}</span>
                  <span className="text-muted-foreground">({productDetail.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Download className="w-4 h-4" />
                  <span>{productDetail.purchaseCount.toLocaleString()} purchases</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>By {productDetail.creator.name}</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-slate max-w-none mb-8">
                <h2 className="text-xl font-semibold mb-4">About This Product</h2>
                <div className="text-muted-foreground whitespace-pre-line">
                  {productDetail.description}
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{"What's Included"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {productDetail.whatYouGet.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table of Contents */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
                <Accordion type="single" collapsible className="w-full">
                  {productDetail.tableOfContents.map((module, i) => (
                    <AccordionItem key={i} value={`module-${i}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-semibold text-accent">
                            {i + 1}
                          </div>
                          {module.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="ml-11 space-y-2">
                          {module.items.map((item, j) => (
                            <li key={j} className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="w-4 h-4" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Who Is This For */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Who Is This For?</h2>
                <div className="space-y-3">
                  {productDetail.whoIsThisFor.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible>
                  {productDetail.faq.map((item, i) => (
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
                    <div className="text-4xl font-bold mb-1">{productDetail.rating}</div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-4 h-4",
                            star <= Math.round(productDetail.rating)
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {productDetail.reviews.length} reviews
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-sm w-12">{stars} stars</span>
                        <Progress
                          value={productDetail.ratingBreakdown[stars as keyof typeof productDetail.ratingBreakdown]}
                          className="flex-1 h-2"
                        />
                        <span className="text-sm text-muted-foreground w-10">
                          {productDetail.ratingBreakdown[stars as keyof typeof productDetail.ratingBreakdown]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {productDetail.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center flex-shrink-0">
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

            {/* Right Column - Purchase Card */}
            <div className="lg:w-96">
              <div className="sticky top-24">
                <div className="border border-border rounded-2xl bg-card overflow-hidden">
                  <div className="p-6">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-mono text-3xl font-bold">
                        {productDetail.price.toLocaleString()}
                        <span className="text-lg ml-1">DZD</span>
                      </span>
                    </div>

                    {/* Buy Button */}
                    <Button className="w-full h-12 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground text-base mb-3">
                      Buy Now
                    </Button>

                    {/* Instant Download Notice */}
                    {productDetail.isInstantDownload && (
                      <div className="flex items-center justify-center gap-2 text-sm text-success mb-4">
                        <Download className="w-4 h-4" />
                        <span>Instant download after payment</span>
                      </div>
                    )}

                    {/* File Details */}
                    <div className="space-y-3 py-4 border-t border-b border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <File className="w-4 h-4" />
                          Format
                        </span>
                        <span>{productDetail.fileDetails.format}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Size
                        </span>
                        <span>{productDetail.fileDetails.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          License
                        </span>
                        <span>{productDetail.fileDetails.license}</span>
                      </div>
                    </div>

                    {/* Money Back */}
                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Contact us within 48 hours if there{"'"}s an issue
                    </p>

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

                  {/* Creator Card */}
                  <div className="border-t border-border p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center">
                        <span className="text-lg font-bold">{productDetail.creator.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{productDetail.creator.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {productDetail.creator.totalProducts} products
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {productDetail.creator.bio}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{productDetail.creator.rating} rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id || ""} {...product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
