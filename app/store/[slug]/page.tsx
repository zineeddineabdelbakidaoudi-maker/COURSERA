"use client"

import * as React from "react"
import Link from "next/link"
import {
  ChevronRight, Star, Download, CheckCircle2, Shield, CreditCard, ThumbsUp, BookOpen, FileText, Users, Clock, Play, File, Sparkles, AlertTriangle, Package, Heart, Share2, MessageCircle
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductCard } from "@/components/marketplace/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [product, setProduct] = React.useState<any>(null)
  const [relatedProducts, setRelatedProducts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [addingToCart, setAddingToCart] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSaved, setIsSaved] = React.useState(false)

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
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
        const query = supabase.from('DigitalProduct').select('*, publisher:Profile!publisher_id(*), category:Category!category_id(*), reviews:Review(*, reviewer:Profile!reviewer_id(full_name, avatar_url))')
        
        const { data, error: fetchError } = await (isUuid ? query.eq('id', slug) : query.eq('slug', slug)).single()
        
        if (fetchError) throw fetchError

        if (data) {
          setProduct(data)
          // Check if saved
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: saved } = await supabase.from('Wishlist').select('id').eq('user_id', user.id).eq('product_id', data.id).single()
            setIsSaved(!!saved)
          }
          const { data: related } = await supabase.from('DigitalProduct').select('*, publisher:Profile!publisher_id(full_name, avatar_url)').eq('status', 'live').neq('id', data.id).limit(4)
          setRelatedProducts(related || [])
        }
      } catch (err: any) {
        console.error("Error loading product:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    
    const { error } = await supabase.from('CartItem').insert({
      id: crypto.randomUUID(),
      user_id: user.id,
      item_type: 'product',
      product_id: product.id,
      package_name: 'Digital File',
      quantity: 1,
      addons: { price: product.price_dzd }
    })
    setAddingToCart(false)
    if (!error) router.push("/cart")
    else alert("Failed to add to cart: " + error.message)
  }

  const handleToggleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    if (isSaved) {
      await supabase.from('Wishlist').delete().eq('user_id', user.id).eq('product_id', product.id)
      setIsSaved(false)
    } else {
      await supabase.from('Wishlist').insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        item_type: 'product',
        product_id: product.id
      })
      setIsSaved(true)
    }
  }

  const [messaging, setMessaging] = React.useState(false)

  const handleMessageSeller = async () => {
    if (!product) return
    setMessaging(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }
    if (user.id === product.publisher_id) {
      alert("You cannot message yourself.")
      setMessaging(false)
      return
    }
    
    // Check for existing conversation with these participants
    const { data: existing } = await supabase
      .from('Conversation')
      .select('id')
      .contains('participant_ids', [user.id, product.publisher_id])
      .limit(1)

    if (existing && existing.length > 0) {
      router.push(`/dashboard/messages?id=${existing[0].id}`)
    } else {
      const { data, error } = await supabase.from('Conversation').insert({
        id: crypto.randomUUID(),
        participant_ids: [user.id, product.publisher_id]
      }).select().single()
      
      if (!error && data) {
        router.push(`/dashboard/messages?id=${data.id}`)
      } else if (error) {
        alert("Failed to start conversation: " + error.message)
      }
    }
    setMessaging(false)
  }

  if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center animate-pulse"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center animate-slide-up">
        <AlertTriangle className="w-16 h-16 text-muted-foreground/30 mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-center">{error ? "Error Loading Product" : "Product Not Found"}</h1>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          {error || "This digital product might have been removed, unpublished, or never existed."}
        </p>
        <Button asChild size="lg" className="rounded-xl"><Link href="/store">Browse Store</Link></Button>
      </div>
    )
  }

  // Mappings
  const title = product.title
  const subtitle = product.description?.substring(0, 100) + '...'
  const type = product.type || "Product"
  const coverUrl = product.cover_url
  const price = parseFloat(product.price_dzd)
  
  const creatorName = product.publisher?.full_name
  const creatorBio = product.publisher?.bio
  const creatorAvatar = product.publisher?.avatar_url
  
  const purchaseCount = product.total_sales || 0
  const ratingAvg = product.rating_avg || 0
  const reviews = product.reviews || []
  const reviewCount = reviews.length
  
  const whatYouGet = Array.isArray(product.tags) ? product.tags : ["Instant Download", "Lifetime Access"]
  const fileDetails = { format: product.type || "ZIP", size: `${product.file_size_mb || 0} MB`, license: product.license || "Personal" }

  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach((r: any) => {
    if (r.rating_overall >= 1 && r.rating_overall <= 5) breakdown[r.rating_overall as 1|2|3|4|5]++
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      <Navbar />

      <main className="pt-24 pb-16 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 z-[1] pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 py-4 mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
            {product.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="hover:text-foreground transition-colors cursor-pointer">{product.category.name_en || product.category.name}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate font-medium max-w-[200px] sm:max-w-xs">{title}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column */}
            <div className="flex-1 min-w-0">
              {/* Cover Image */}
              <div className="relative aspect-video rounded-[2rem] bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 mb-8 overflow-hidden flex items-center justify-center border border-border shadow-sm group">
                {product.is_best_seller && (
                  <Badge className="absolute top-6 left-6 bg-amber-400 text-amber-950 hover:bg-amber-500 border-0 gap-1 z-10 font-bold px-3 py-1 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Best Seller
                  </Badge>
                )}
                {coverUrl ? (
                   <img src={coverUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-white/50 dark:bg-card/50 flex items-center justify-center backdrop-blur-sm shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Package className="w-16 h-16 text-pink-400" />
                  </div>
                )}
              </div>

              {/* Badges */}
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20 uppercase tracking-wider font-bold text-[10px] px-2.5 py-1">
                  {type}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 text-slate-900 dark:text-foreground leading-tight tracking-tight text-balance">
                {title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-muted-foreground mb-8 leading-relaxed font-medium">
                {subtitle}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 mb-10 text-sm bg-white dark:bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 dark:text-foreground">{ratingAvg.toFixed(1)}</span>
                  <span className="text-slate-500 font-medium">({reviewCount} reviews)</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-slate-600 dark:text-muted-foreground font-medium">
                  <Download className="w-5 h-5 text-indigo-500" />
                  <span>{purchaseCount.toLocaleString()} purchases</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-border hidden sm:block" />
                <div className="flex items-center gap-2 text-slate-600 dark:text-muted-foreground font-medium">
                  <Users className="w-5 h-5 text-emerald-500" />
                  <span>By <span className="text-slate-900 dark:text-foreground font-bold">{creatorName}</span></span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-slate dark:prose-invert max-w-none mb-12 prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-foreground prose-p:text-slate-600 dark:prose-p:text-muted-foreground prose-a:text-pink-600 hover:prose-a:text-pink-500">
                <h2 className="text-2xl">About This Product</h2>
                <div className="whitespace-pre-line leading-relaxed">
                  {product.description || "No description provided."}
                </div>
              </div>

              {/* Highlights */}
              {whatYouGet.length > 0 && (
                <div className="mb-12 bg-white dark:bg-card border border-border rounded-[2rem] p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-foreground">Highlights</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {whatYouGet.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-secondary/20 p-3 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-8 text-slate-900 dark:text-foreground">Customer Reviews</h2>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-card border border-border rounded-3xl shadow-sm">
                    <Star className="w-12 h-12 text-slate-200 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No reviews yet for this product.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-8 p-8 rounded-3xl bg-white dark:bg-card border border-border shadow-sm mb-8">
                      <div className="text-center sm:pr-8 sm:border-r border-slate-100 dark:border-border flex flex-col justify-center">
                        <div className="text-5xl font-black mb-2 text-slate-900 dark:text-foreground">{ratingAvg.toFixed(1)}</div>
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={cn("w-5 h-5", star <= Math.round(ratingAvg) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700")} />
                          ))}
                        </div>
                        <div className="text-sm font-medium text-slate-500">{reviews.length} reviews</div>
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
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right Column - Purchase Sticky Card */}
            <div className="lg:w-[400px]">
              <div className="sticky top-28">
                <div className="border border-border rounded-[2rem] bg-white dark:bg-card shadow-xl shadow-slate-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
                  <div className="p-8">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-8">
                      <span className="font-mono text-5xl font-black text-slate-900 dark:text-foreground tracking-tight">
                        {price.toLocaleString()}
                        <span className="text-xl ml-2 text-slate-500 font-bold tracking-normal">DZD</span>
                      </span>
                    </div>

                    {/* Buy Button */}
                    <Button 
                      className="w-full h-14 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 text-lg font-bold shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.2)] transition-all mb-4"
                      disabled={addingToCart}
                      onClick={handleAddToCart}
                    >
                      {addingToCart ? "Processing..." : "Buy Now"}
                    </Button>

                    <Button 
                        variant="outline" 
                        className="w-full rounded-2xl h-12 gap-2 font-bold border-slate-200 dark:border-border hover:bg-slate-50 dark:hover:bg-muted text-slate-700 dark:text-slate-300 mb-4"
                        disabled={messaging}
                        onClick={handleMessageSeller}
                      >
                        <MessageCircle className="w-5 h-5 text-indigo-500" />
                        {messaging ? "Please wait..." : "Message Publisher"}
                      </Button>

                    <Button variant="outline" className={cn("w-full h-12 rounded-2xl gap-2 font-bold bg-white dark:bg-card shadow-sm border-slate-200 dark:border-border mb-6", isSaved && "text-rose-600 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-900/10")} onClick={handleToggleSave}>
                      <Heart className={cn("w-5 h-5", isSaved ? "fill-rose-500 text-rose-500" : "text-slate-400")} />
                      {isSaved ? "Saved" : "Save List"}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 mb-6 font-bold bg-emerald-50 dark:bg-emerald-500/10 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                      <Download className="w-4 h-4" />
                      <span>Instant digital download</span>
                    </div>

                    {/* File Details */}
                    <div className="space-y-4 py-6 border-t border-b border-slate-100 dark:border-border">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-muted-foreground flex items-center gap-2 font-medium">
                          <File className="w-4 h-4" /> Format
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{fileDetails.format}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-muted-foreground flex items-center gap-2 font-medium">
                          <Download className="w-4 h-4" /> Size
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{fileDetails.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-muted-foreground flex items-center gap-2 font-medium">
                          <Shield className="w-4 h-4" /> License
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 max-w-[150px] truncate" title={fileDetails.license}>{fileDetails.license}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-6 pt-2 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure Payment</div>
                      <div className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Edahabia/CIB</div>
                    </div>
                  </div>

                  {/* Creator Card */}
                  <div className="border-t border-slate-100 dark:border-border p-8 bg-slate-50 dark:bg-secondary/10">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Published by</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-white dark:bg-card flex items-center justify-center overflow-hidden shrink-0 border border-border shadow-sm">
                        {creatorAvatar ? (
                          <img src={creatorAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-slate-500">{creatorName?.charAt(0) || "U"}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-lg text-slate-900 dark:text-foreground truncate">{creatorName || "Anonymous"}</p>
                      </div>
                    </div>
                    {creatorBio && (
                      <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">
                        {creatorBio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-24 pt-16 border-t border-border">
              <h2 className="text-3xl font-extrabold mb-10 text-slate-900 dark:text-foreground">More from the Store</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="group bg-white dark:bg-card rounded-[2rem] p-3 border border-slate-200 dark:border-border shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative flex flex-col">
                    <Link href={`/store/${p.slug || p.id}`} className="absolute inset-0 z-0" />
                    <div className="h-48 rounded-[1.5rem] bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 overflow-hidden mb-5 relative border border-slate-100 dark:border-border">
                      {p.cover_url ? (
                        <img src={p.cover_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-pink-300">
                          <Package className="w-12 h-12 mb-2 drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                    <div className="px-3 pb-3 flex-1 flex flex-col z-10">
                      <h3 className="text-lg font-bold mb-2 leading-tight text-slate-900 group-hover:text-pink-600 transition-colors line-clamp-2">{p.title}</h3>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-border">
                        <span className="font-extrabold text-slate-900">{parseFloat(p.price_dzd).toLocaleString()} DZD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
