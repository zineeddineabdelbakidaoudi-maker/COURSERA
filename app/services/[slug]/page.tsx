"use client"

import * as React from "react"
import Link from "next/link"
import { 
  ChevronRight, Star, Clock, RefreshCw, CheckCircle2, MessageCircle, Heart, Share2, Shield, CreditCard, ThumbsUp, Package, Zap, AlertTriangle
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ServiceCard } from "@/components/marketplace/service-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import NeuralBackground from "@/components/ui/flow-field-background"

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [selectedPackage, setSelectedPackage] = React.useState(0)
  const [isSaved, setIsSaved] = React.useState(false)
  const [service, setService] = React.useState<any>(null)
  const [relatedServices, setRelatedServices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [addingToCart, setAddingToCart] = React.useState(false)
  const [messaging, setMessaging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  // In Next.js 15/16, params is a Promise in page components
  const { slug } = React.use(params)
  
  const supabase = createClient()
  const router = useRouter()

  React.useEffect(() => {
    async function loadData() {
      if (!slug) return
      setLoading(true)
      setError(null)

      try {
        // Attempt to load by slug or id
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
        const query = supabase.from('Service').select('*, seller:Profile!seller_id(*), category:Category!category_id(*), reviews:Review(*, reviewer:Profile!reviewer_id(full_name, avatar_url))')
        
        const { data, error: fetchError } = await (isUuid ? query.eq('id', slug) : query.eq('slug', slug)).single()
        
        if (fetchError) throw fetchError

        if (data) {
          setService(data)
          // Check if it's saved by current user
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: saved } = await supabase.from('Wishlist').select('id').eq('user_id', user.id).eq('service_id', data.id).single()
            setIsSaved(!!saved)
          }
          // Load some related ones
          const { data: related } = await supabase.from('Service').select('*, seller:Profile!seller_id(full_name, avatar_url)').eq('status', 'live').neq('id', data.id).limit(4)
          setRelatedServices(related || [])
        }
      } catch (err: any) {
        console.error("Error loading service:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const handleMessageSeller = async () => {
    if (!service) return
    setMessaging(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    if (user.id === service.seller_id) {
      alert("You cannot message yourself.")
      setMessaging(false)
      return
    }
    
    // Check for existing conversation with these participants
    const { data: existing } = await supabase
      .from('Conversation')
      .select('id')
      .contains('participant_ids', [user.id, service.seller_id])
      .limit(1)

    if (existing && existing.length > 0) {
      router.push(`/dashboard/messages?id=${existing[0].id}`)
    } else {
      const { data, error } = await supabase.from('Conversation').insert({
        id: crypto.randomUUID(),
        participant_ids: [user.id, service.seller_id]
      }).select().single()
      
      if (!error && data) {
        router.push(`/dashboard/messages?id=${data.id}`)
      } else if (error) {
        alert("Failed to start conversation: " + error.message)
      }
    }
    setMessaging(false)
  }

  const handleToggleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    if (isSaved) {
      await supabase.from('Wishlist').delete().eq('user_id', user.id).eq('service_id', service.id)
      setIsSaved(false)
    } else {
      await supabase.from('Wishlist').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        item_type: 'service',
        service_id: service.id
      })
      setIsSaved(true)
    }
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { error } = await supabase.from('CartItem').insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      item_type: 'service',
      service_id: service.id,
      package_name: packagesArray[selectedPackage]?.name || "Standard",
      quantity: 1,
      addons: {}
    })
    
    setAddingToCart(false)
    if (!error) router.push("/cart")
    else alert("Failed to add to cart: " + error.message)
  }

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center animate-pulse"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
  
  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center animate-slide-up">
        <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-center">{error ? "Error Loading Service" : "Service Not Found"}</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          {error || "This service might have been deleted, paused by the seller, or never existed."}
        </p>
        <Button asChild size="lg" className="rounded-xl"><Link href="/services">Browse Services</Link></Button>
      </div>
    )
  }

  const getPackagesArray = () => {
    if (Array.isArray(service.packages) && service.packages.length > 0) return service.packages
    let pkgs = []
    if (service.packages?.basic) pkgs.push({ ...service.packages.basic, name: "Basic", price: parseFloat(service.packages.basic.price || 0) })
    if (service.packages?.standard) pkgs.push({ ...service.packages.standard, name: "Standard", price: parseFloat(service.packages.standard.price || 0) })
    if (service.packages?.premium) pkgs.push({ ...service.packages.premium, name: "Premium", price: parseFloat(service.packages.premium.price || 0) })
    
    return pkgs.filter(p => !isNaN(p.price) && p.price > 0).length > 0 ? pkgs : [{ name: "Standard", price: 5000, description: "Standard Package", delivery: 3, revisions: 1, features: ["High Quality"] }]
  }

  const packagesArray = getPackagesArray()
  const currentPackage = packagesArray[selectedPackage] || packagesArray[0]
  const renderedPackageIdx = selectedPackage < packagesArray.length ? selectedPackage : 0

  const reviews = service.reviews || []
  const ratingAvg = service.rating_avg || 0
  const seller = service.seller || {}

  // Calculate rating breakdown
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r: any) => {
    if (r.rating_overall >= 1 && r.rating_overall <= 5) breakdown[r.rating_overall as 1|2|3|4|5]++
  })

  const faqData = service.faq || []
  const features = Array.isArray(service.order_requirements) ? service.order_requirements : ["High-resolution delivery", "Commercial rights", "Top notch quality"]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <Navbar />

      <main className="pt-24 pb-16 relative">
        <div className="absolute top-0 left-0 right-0 h-[60vh] z-0 overflow-hidden pointer-events-none">
          <NeuralBackground color="#38bdf8" trailOpacity={0.15} particleCount={500} speed={0.8} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/0 via-slate-50/80 to-slate-50 dark:from-background/0 dark:via-background/80 dark:to-background" />
        </div>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 py-4 mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
            {service.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="hover:text-foreground transition-colors cursor-pointer">{service.category.name_en || service.category.name}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate font-medium max-w-[200px] sm:max-w-xs">{service.title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-5 text-slate-900 dark:text-foreground text-balance leading-tight">
                {service.title}
              </h1>

              {/* Seller Info */}
              <div className="flex items-center gap-5 mb-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-border shadow-sm">
                    {seller.avatar_url ? (
                      <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-lg font-bold text-slate-500">{seller.full_name?.charAt(0) || "U"}</span>
                    )}
                    {seller.is_verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-white dark:border-background">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Link href={`/sellers/${seller.username || seller.id}`} className="font-bold text-slate-900 dark:text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {seller.full_name || "Anonymous"}
                    </Link>
                    <div className="flex items-center mt-0.5">
                      <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 capitalize hover:bg-indigo-100">
                        {seller.seller_level || "New"} Seller
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-foreground">{ratingAvg.toFixed(1)}</span>
                    <span className="text-slate-500">({reviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>{seller.total_orders_completed || 0} orders</span>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="mb-10 relative rounded-[2rem] overflow-hidden aspect-video bg-slate-100 dark:bg-card border border-border shadow-sm">
                  <img src={service.thumbnail_url || "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80"} alt={service.title} className="w-full h-full object-cover" />
              </div>

              {/* Description */}
              <div className="prose prose-slate dark:prose-invert max-w-none mb-10 prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-foreground prose-p:text-slate-600 dark:prose-p:text-muted-foreground prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                <h2 className="text-2xl">About This Service</h2>
                <div className="whitespace-pre-line leading-relaxed">
                  {service.description || "No description provided."}
                </div>
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="mb-10 bg-white dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
                  <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-foreground">What You'll Get</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((item: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 p-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        </div>
                        <span className="text-slate-600 dark:text-muted-foreground leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {faqData.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-foreground">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="bg-white dark:bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                    {faqData.map((item: any, i: number) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="px-6 border-b-slate-100 dark:border-border last:border-0">
                        <AccordionTrigger className="text-left font-semibold text-slate-800 dark:text-foreground py-5 hover:text-indigo-600 transition-colors">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-slate-600 dark:text-muted-foreground pb-5 leading-relaxed">{item.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Reviews */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-foreground">Client Reviews</h2>

                {reviews.length === 0 ? (
                  <div className="text-center py-10 bg-white dark:bg-card border border-border rounded-3xl shadow-sm">
                    <Star className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No reviews yet for this service.</p>
                  </div>
                ) : (
                  <>
                    {/* Rating Breakdown */}
                    <div className="flex flex-col sm:flex-row gap-8 p-8 rounded-3xl bg-white dark:bg-card border border-border shadow-sm mb-8">
                      <div className="text-center sm:pr-8 sm:border-r border-slate-100 dark:border-border flex flex-col justify-center">
                        <div className="text-5xl font-black mb-2 text-slate-900 dark:text-foreground">{ratingAvg.toFixed(1)}</div>
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn("w-5 h-5", star <= Math.round(ratingAvg) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")}
                            />
                          ))}
                        </div>
                        <div className="text-sm font-medium text-slate-500">
                          {reviews.length} reviews
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 justify-center flex flex-col">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = breakdown[stars as 1|2|3|4|5] || 0
                          const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                          return (
                            <div key={stars} className="flex items-center gap-4">
                              <span className="text-sm font-bold w-12 text-slate-700 dark:text-slate-300">{stars} stars</span>
                              <div className="flex-1 h-2.5 bg-slate-100 dark:bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-sm font-medium text-slate-500 w-8">{count}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                      {reviews.map((review: any) => (
                        <div key={review.id} className="bg-white dark:bg-card border border-border p-6 rounded-3xl shadow-sm">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {review.reviewer?.avatar_url ? <img src={review.reviewer.avatar_url} alt="" className="w-full h-full object-cover" /> : <span className="font-bold text-slate-500">{review.reviewer?.full_name?.charAt(0) || "U"}</span>}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-foreground">{review.reviewer?.full_name || "Unknown"}</span>
                                <span className="text-xs font-semibold text-slate-400">{new Date(review.created_at).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className={cn("w-3.5 h-3.5", star <= review.rating_overall ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-slate-600 dark:text-muted-foreground leading-relaxed mb-4">{review.comment}</p>
                          <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                            <ThumbsUp className="w-4 h-4" /> Helpful
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Order Sticky Card */}
            <div className="lg:w-[400px]">
              <div className="sticky top-28">
                <div className="border border-border rounded-[2rem] bg-white dark:bg-card shadow-xl shadow-slate-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                  
                  {/* Package Tabs */}
                  <div className="flex bg-slate-50 dark:bg-secondary/20">
                    {packagesArray.map((pkg: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPackage(i)}
                        className={cn(
                          "py-5 px-2 flex-1 text-sm font-bold transition-all text-center border-b-2",
                          renderedPackageIdx === i
                            ? "border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-white dark:bg-card"
                            : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-muted"
                        )}
                      >
                        {pkg.name || "Standard"}
                      </button>
                    ))}
                  </div>

                  {/* Package Details */}
                  <div className="p-8">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-4xl font-black text-slate-900 dark:text-foreground tracking-tight">
                        {currentPackage.price.toLocaleString()}
                        <span className="text-xl ml-1 text-slate-500 font-bold">DZD</span>
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-muted-foreground mb-6 leading-relaxed font-medium">{currentPackage.description || "Get high quality results with this excellent package tailored for your needs."}</p>

                    <div className="flex items-center gap-6 mb-6 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        <span>{currentPackage.delivery || currentPackage.deliveryDays || 3} Days Delivery</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-indigo-500" />
                        <span>{currentPackage.revisions === -1 ? "Unlimited" : currentPackage.revisions || 1} Revisions</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {(currentPackage.features || ["High quality source files", "Commercial use ready", "Fast & priority support"]).map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm font-medium text-slate-600 dark:text-muted-foreground">
                          <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white h-14 text-lg font-bold shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] transition-all mb-4"
                      disabled={addingToCart} 
                      onClick={handleAddToCart}
                    >
                      {addingToCart ? "Adding to Cart..." : "Continue to Order"}
                    </Button>

                    <Button variant="outline" className="w-full rounded-2xl h-12 gap-2 font-bold border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-muted text-slate-700 dark:text-slate-300" disabled={messaging} onClick={handleMessageSeller}>
                      <MessageCircle className="w-5 h-5" />
                      {messaging ? "Please wait..." : "Message Seller"}
                    </Button>

                    <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-border text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure</div>
                      <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Escrow</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <Button variant="outline" className={cn("flex-1 h-12 rounded-2xl gap-2 font-bold bg-white dark:bg-card shadow-sm border-slate-200 dark:border-border", isSaved && "text-rose-600 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/10")} onClick={handleToggleSave}>
                    <Heart className={cn("w-5 h-5", isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
                    {isSaved ? "Saved" : "Save List"}
                  </Button>
                  <Button variant="outline" className="h-12 w-12 rounded-2xl bg-white dark:bg-card shadow-sm border-slate-200 dark:border-border text-slate-500 hover:text-indigo-600">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-24 pt-16 border-t border-border">
              <h2 className="text-3xl font-extrabold mb-10 text-slate-900 dark:text-foreground">Similar Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedServices.map((svc) => (
                  <div key={svc.id} className="group bg-white dark:bg-card rounded-[2rem] p-3 border border-slate-200 dark:border-border shadow-sm hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative">
                    <Link href={`/services/${svc.slug || svc.id}`} className="absolute inset-0 z-0" />
                    <div className="h-44 rounded-3xl bg-slate-100 mb-4 overflow-hidden relative">
                      {svc.thumbnail_url ? <img src={svc.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-indigo-50" />}
                    </div>
                    <div className="px-3 pb-3 flex-1 flex flex-col z-10">
                      <h3 className="text-lg font-bold mb-3 line-clamp-2 text-slate-900">{svc.title}</h3>
                      <div className="flex items-center gap-2 mt-auto">
                        <div className="font-semibold text-slate-600 text-sm">By {svc.seller?.full_name}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
