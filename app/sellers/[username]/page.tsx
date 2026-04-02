"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  Star, MapPin, Clock, Award, Briefcase, MessageSquare, Heart, Share2,
  CheckCircle2, Shield, Globe, Twitter, Linkedin, ArrowLeft, Package, AlertTriangle, Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/layout/navbar" 

const DEMO_SERVICES = [
  { title: "Brand Identity Design Bundle", rating: 5.0, reviews: 142, price: 15000, delivery: "5 days", level: "Elite" },
  { title: "Logo Design x3 Concepts", rating: 4.9, reviews: 89, price: 5000, delivery: "3 days", level: "Elite" },
  { title: "Business Card + Letterhead", rating: 4.8, reviews: 54, price: 3500, delivery: "4 days", level: "Pro" },
]

export default function SellerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params)
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const [services, setServices] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!username) return
      setLoading(true)
      setError(null)

      try {
        const isMe = username?.toLowerCase() === "me"
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username)
        const query = supabase.from("Profile").select("*")
        
        const { data, error: profileError } = await (isUuid ? query.eq("id", username) : query.eq("username", username)).single()
        
        if (profileError) throw profileError
        if (!data) throw new Error("Profile not found.")
        
        setProfile(data)

        // Services
        const { data: srvs } = await supabase.from("Service").select("id, title, slug, thumbnail_url, packages").eq("seller_id", data.id).eq("status", "live")
        setServices(srvs || [])

        // Products
        const { data: prods } = await supabase.from("DigitalProduct").select("id, title, slug, cover_url, price_dzd, type").eq("publisher_id", data.id).eq("status", "live")
        setProducts(prods || [])

        // Reviews
        const { data: revs } = await supabase
          .from("Review")
          .select("*, buyer:Profile!reviewer_id(full_name, avatar_url)")
          .eq("reviewed_user_id", data.id)
          .order("created_at", { ascending: false })
        setReviews(revs || [])

        // Is Saved?
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        if (currentUser) {
          const { data: ws } = await supabase.from("Wishlist").select("id").eq("user_id", currentUser.id).eq("item_type", "service").eq("service_id", data.id).single()
          if (ws) setSaved(true)
        }

      } catch (err: any) {
        console.error("Error loading profile:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [username])

  const handleMessage = () => {
    if (!user) router.push("/login")
    else router.push(`/dashboard/messages?id=${profile?.id}`)
  }

  const handleDirectHire = async () => {
    if (!user) {
      router.push("/login")
      return
    }
    
    try {
      const { error } = await supabase.from("Notification").insert({
        id: crypto.randomUUID(),
        user_id: profile.id,
        type: 'info',
        title: 'New Hire Request!',
        body: `A client is interested in hiring you directly. Check your messages!`,
        link: `/dashboard/messages`,
        is_read: false
      })

      if (error) throw error
      toast.success("Hire request sent! The freelancer will notice your interest.")
      router.push(`/dashboard/messages?id=${profile.id}`)
    } catch (err: any) {
      toast.error("Failed to send hire request")
    }
  }

  const handleToggleSave = async () => {
    const { data: { user: me } } = await supabase.auth.getUser()
    if (!me) { alert("Login to save"); return }
    
    if (saved) {
      await supabase.from("Wishlist").delete().eq("user_id", me.id).eq("service_id", profile.id)
      setSaved(false)
    } else {
      await supabase.from("Wishlist").insert({
        id: crypto.randomUUID(),
        user_id: me.id,
        item_type: "service",
        service_id: profile.id
      })
      setSaved(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex flex-col items-center justify-center p-4">        <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mb-4 mt-20" />
        <h2 className="text-xl font-semibold mb-2">{error ? "Error Loading Profile" : "Profile Not Found"}</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-6">{error || "The profile you are looking for does not exist."}</p>
        <Button asChild className="bg-primary text-primary-foreground"><Link href="/services">Browse Marketplace</Link></Button>
      </div>
    )
  }

  const displayName = profile?.full_name || (username?.toLowerCase() === "me" ? "My Profile" : username?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())) || "Seller"
  const bio = profile?.bio || "No bio provided yet."
  const city = profile?.city || "Algeria"
  const responseRate = profile?.response_rate || 100
  const totalReviewsCount = reviews.length || profile?.total_reviews || 0
  const rating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating_overall, 0) / reviews.length).toFixed(1) : profile?.rating_avg || "0.0"
  const level = profile?.seller_level || "new"
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en", { month: "long", year: "numeric" }) : "Recently"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const levelStyles: Record<string, string> = {
    elite: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    pro: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    rising: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
    new: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30",
    pro_verified: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Clean White Background for Profile */}
      <div className="fixed inset-0 bg-slate-50 dark:bg-background z-[1] pointer-events-none" />

      <main className="pt-28 pb-16 relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Profile Header Glass Panel */}
        <div className="bg-white/70 dark:bg-card/40 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] mb-10 overflow-hidden relative">
          
          {/* subtle decorative gradients inside glass */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10">
            {/* Avatar block */}
            <div className="relative shrink-0 flex flex-col items-center">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-slate-100 dark:border-secondary shadow-lg">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-3xl font-extrabold bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>
              <Badge variant="outline" className={`mt-4 absolute -bottom-4 translate-y-1/2 px-3 py-1 text-xs font-bold shadow-md ${levelStyles[level] || levelStyles.new}`}>
                {level.charAt(0).toUpperCase() + level.slice(1)} Seller
              </Badge>
            </div>

            {/* Profile Info block */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                
                <div className="min-w-0 pr-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-foreground tracking-tight">{displayName}</h1>
                    {profile?.is_verified && <CheckCircle2 className="w-6 h-6 text-blue-500 drop-shadow-sm" />}
                    {profile?.publisher_status === "enabled" && (
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-500/30">Publisher</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 mb-4">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                      <Star className="w-4 h-4 fill-current" />{Number(rating).toFixed(1)} 
                      <span className="text-slate-500 dark:text-muted-foreground ml-1">({totalReviewsCount} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-muted-foreground">
                      <MapPin className="w-4 h-4" />{city}, Algeria
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-muted-foreground">
                      <Briefcase className="w-4 h-4" />{services.length} orders completed
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap shrink-0 gap-3">
                  <Button variant="outline" size="sm" className="h-10 rounded-xl px-4 gap-2 border-border bg-white/50 dark:bg-secondary/50 font-semibold" onClick={handleToggleSave}>
                    <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button size="sm" className="h-10 rounded-xl px-6 gap-2 bg-slate-100 text-slate-900 border border-slate-200 font-bold hover:bg-slate-200 shadow-sm" onClick={handleMessage}>
                    <MessageSquare className="w-4 h-4" /> Message
                  </Button>
                  <Button size="sm" className="h-10 rounded-xl px-8 gap-2 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" onClick={handleDirectHire}>
                    <Zap className="w-4 h-4" /> Hire Me
                  </Button>
                </div>
              </div>

              {/* Stats Bar Integrated */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border">
                {[
                  { icon: Briefcase, label: "Services", val: services.length },
                  { icon: Star, label: "Avg Rating", val: Number(rating).toFixed(1) },
                  { icon: Clock, label: "Response Rate", val: `${responseRate}%` },
                  { icon: Shield, label: "Member Since", val: new Date(profile.created_at).getFullYear() },
                ].map(s => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-primary/10 shrink-0">
                        <Icon className="w-5 h-5 text-slate-700 dark:text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-extrabold text-slate-900 dark:text-foreground">{s.val}</p>
                        <p className="text-xs font-bold text-slate-500 dark:text-muted-foreground uppercase tracking-widest">{s.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Glassmorphic integration */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="mb-8 w-full justify-start h-14 bg-white/50 dark:bg-card/40 backdrop-blur-md rounded-2xl border border-border p-1.5 shadow-sm overflow-x-auto">
            <TabsTrigger value="services" className="gap-2 rounded-xl h-full px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground transition-all"><Briefcase className="w-4 h-4" />Services</TabsTrigger>
            <TabsTrigger value="products" className="gap-2 rounded-xl h-full px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground transition-all"><Package className="w-4 h-4" />Products</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2 rounded-xl h-full px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground transition-all"><Star className="w-4 h-4" />Reviews</TabsTrigger>
            <TabsTrigger value="about" className="gap-2 rounded-xl h-full px-6 font-bold data-[state=active]:bg-slate-900 data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground transition-all"><Shield className="w-4 h-4" />About</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.length > 0 ? services.map((s, i) => (
                <Link href={`/services/${s.slug || s.id}`} key={i}>
                  <Card className="border-border bg-white dark:bg-card/60 backdrop-blur-md rounded-[2rem] shadow-sm hover:shadow-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1 group overflow-hidden">
                    <div className="h-44 bg-slate-100 dark:bg-secondary/50 relative border-b border-border">
                      {s.thumbnail_url ? (
                        <img src={s.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Briefcase className="w-8 h-8 text-slate-300 dark:text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-base leading-snug line-clamp-2 h-11 text-slate-900 dark:text-foreground group-hover:text-amber-500 transition-colors">{s.title}</h3>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground">Starting at</span>
                        <span className="font-extrabold text-xl text-slate-900 dark:text-foreground">{(s.packages?.basic?.price || s.packages?.Basic?.price || 5000).toLocaleString()} <span className="text-sm">DZD</span></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-500 dark:text-muted-foreground bg-white/50 dark:bg-card/40 backdrop-blur-sm rounded-[2.5rem] border border-border">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-bold text-lg">No services published yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="products" className="focus-visible:outline-none">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? products.map((p, i) => (
                <Link href={`/store/${p.slug || p.id}`} key={i}>
                  <Card className="border-border bg-white dark:bg-card/60 backdrop-blur-md rounded-[2rem] shadow-sm hover:shadow-xl dark:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all hover:-translate-y-1 group overflow-hidden">
                    <div className="h-44 bg-slate-100 dark:bg-secondary/50 relative border-b border-border">
                      {p.cover_url ? (
                        <img src={p.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-purple-500/20" />
                        </div>
                      )}
                      <Badge className="absolute top-3 right-3 bg-purple-600 border-none font-bold shadow-md uppercase">{p.type}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-base leading-snug line-clamp-2 h-11 text-slate-900 dark:text-foreground group-hover:text-purple-500 transition-colors">{p.title}</h3>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground">Instant Download</span>
                        <span className="font-extrabold text-xl text-purple-600 dark:text-purple-400">{Number(p.price_dzd).toLocaleString()} <span className="text-sm">DZD</span></span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-full py-16 text-center text-slate-500 dark:text-muted-foreground bg-white/50 dark:bg-card/40 backdrop-blur-sm rounded-[2.5rem] border border-border">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="font-bold text-lg">No products published yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="focus-visible:outline-none">
            <div className="space-y-4">
              {reviews.length > 0 ? reviews.map((r, i) => (
                <Card key={i} className="border-border bg-white/70 dark:bg-card/40 backdrop-blur-xl shadow-sm rounded-3xl">
                  <CardContent className="p-6 flex items-start gap-5">
                    <Avatar className="h-12 w-12 shrink-0 border border-border">
                      <AvatarImage src={r.buyer?.avatar_url || ""} />
                      <AvatarFallback className="font-bold">{r.buyer?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span className="font-bold text-slate-900 dark:text-foreground">{r.buyer?.full_name || "Buyer"}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-3 text-amber-500">
                        {Array.from({ length: r.rating_overall || 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-base text-slate-700 dark:text-foreground/90 leading-relaxed font-medium">{r.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="py-16 text-center text-slate-500 dark:text-muted-foreground bg-white/50 dark:bg-card/40 backdrop-blur-sm rounded-[2.5rem] border border-border">
                  <Star className="w-10 h-10 mx-auto mb-4 text-amber-500/30" />
                  <p className="font-bold">No reviews yet for this seller.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="about" className="focus-visible:outline-none">
            <Card className="border-border bg-white/70 dark:bg-card/40 backdrop-blur-xl shadow-sm rounded-[2.5rem]">
              <CardContent className="p-8 space-y-8">
                <div>
                  <h3 className="text-xl font-extrabold mb-4 text-slate-900 dark:text-foreground">About {displayName}</h3>
                  <p className="text-slate-600 dark:text-muted-foreground text-base leading-relaxed font-medium">{bio}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground mb-4">Details</h4>
                    <div className="space-y-4 text-sm font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-slate-400" />{city}, Algeria</div>
                      <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-400" />Member since {memberSince}</div>
                      <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-slate-400" />Arabic · French · English</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-muted-foreground mb-4">Certifications</h4>
                    <div className="space-y-4 font-bold text-slate-700 dark:text-slate-300">
                      {["Identity Verified", "Portfolio Approved", "Response Rate 98%"].map(c => (
                        <div key={c} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
