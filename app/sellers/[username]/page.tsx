"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import {
  Star, MapPin, Clock, Award, Briefcase, MessageSquare, Heart, Share2,
  CheckCircle2, Shield, Globe, Twitter, Linkedin, ArrowLeft, Package, AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

const DEMO_SERVICES = [
  { title: "Brand Identity Design Bundle", rating: 5.0, reviews: 142, price: 15000, delivery: "5 days", level: "Elite" },
  { title: "Logo Design x3 Concepts", rating: 4.9, reviews: 89, price: 5000, delivery: "3 days", level: "Elite" },
  { title: "Business Card + Letterhead", rating: 4.8, reviews: 54, price: 3500, delivery: "4 days", level: "Pro" },
]

const DEMO_REVIEWS = [
  { buyer: "Ahmed K.", comment: "Exceptional work! Delivered ahead of time and exceeded every expectation.", rating: 5, date: "Mar 20, 2026" },
  { buyer: "Sara B.", comment: "Very professional and responsive. Understood the brief perfectly.", rating: 5, date: "Mar 12, 2026" },
  { buyer: "Nassim D.", comment: "Great quality, would definitely hire again.", rating: 4, date: "Feb 28, 2026" },
]

export default function SellerProfilePage() {
  const params = useParams()
  const username = params?.username as string
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const [services, setServices] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!username) return
      setLoading(true)
      setError(null)

      try {
        const isMe = username?.toLowerCase() === "me"
        let targetId = username

        if (isMe) {
          const { data: { user } } = await supabase.auth.getUser()
          if (user) targetId = user.id
          else throw new Error("Please log in to view your profile.")
        }

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId)
        const query = supabase.from("Profile").select("*")
        
        const { data, error: profileError } = await (isUuid ? query.eq("id", targetId) : query.eq("username", targetId)).single()
        
        if (profileError) throw profileError
        if (!data) throw new Error("Profile not found.")
        
        setProfile(data)
        const { data: srvs } = await supabase.from("Service").select("id, title, slug, thumbnail_url, packages").eq("seller_id", data.id).eq("status", "live")
        setServices(srvs || [])
      } catch (err: any) {
        console.error("Error loading profile:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-semibold mb-2">{error ? "Error Loading Profile" : "Profile Not Found"}</h2>
        <p className="text-muted-foreground text-center max-w-sm mb-6">{error || "The profile you are looking for does not exist."}</p>
        <Button asChild><Link href="/services">Browse Marketplace</Link></Button>
      </div>
    )
  }

  // Use DB data if available, fall back to demo display
  const displayName = profile?.full_name || (username?.toLowerCase() === "me" ? "My Profile" : username?.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())) || "Seller"
  const bio = profile?.bio || "No bio provided yet."
  const city = profile?.city || "Algeria"
  const responseRate = profile?.response_rate || 100
  const totalReviews = profile?.total_reviews || 0
  const rating = profile?.rating_avg || 0
  const level = profile?.seller_level || "new"
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en", { month: "long", year: "numeric" }) : "Recently"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  const levelStyles: Record<string, string> = {
    elite: "bg-amber-500/10 text-amber-600 border-amber-200",
    pro: "bg-blue-500/10 text-blue-600 border-blue-200",
    rising: "bg-green-500/10 text-green-600 border-green-200",
    new: "bg-gray-500/10 text-gray-600 border-gray-200",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" asChild className="gap-2 bg-background/60 backdrop-blur-sm">
            <Link href="/services"><ArrowLeft className="w-4 h-4" /> Back</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <Avatar className="h-28 w-28 border-4 border-background shadow-lg -mt-14 sm:-mt-20 shrink-0">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-display font-bold">{displayName}</h1>
                  {profile?.is_verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                  <Badge variant="outline" className={levelStyles[level]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)} Seller
                  </Badge>
                  {profile?.publisher_status === "enabled" && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">Publisher</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-3 max-w-xl">{bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{city}, Algeria</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />Member since {memberSince}</span>
                  <span className="flex items-center gap-1.5 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-current" />{Number(rating).toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setSaved(!saved)}>
                  <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button size="sm" className="gap-2"><MessageSquare className="w-4 h-4" />Message</Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              {[
                { icon: Briefcase, label: "Services", val: services.length },
                { icon: Star, label: "Avg Rating", val: Number(rating).toFixed(1) },
                { icon: Clock, label: "Response Rate", val: `${responseRate}%` },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
                    <p className="text-xl font-bold">{s.val}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services">
          <TabsList className="mb-6">
            <TabsTrigger value="services" className="gap-2"><Briefcase className="w-4 h-4" />Services</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2"><Star className="w-4 h-4" />Reviews</TabsTrigger>
            <TabsTrigger value="about" className="gap-2"><Shield className="w-4 h-4" />About</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.length > 0 ? services.map((s, i) => (
                <Link href={`/services/${s.slug || s.id}`} key={i}>
                  <Card className="border-border shadow-sm hover:shadow-md transition-all group overflow-hidden">
                    <div className="h-36 bg-muted relative border-b border-border">
                      {s.thumbnail_url ? (
                        <img src={s.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 transition-colors">
                          <Package className="w-12 h-12 text-primary/30 group-hover:text-primary/50" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{s.title}</h3>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs text-amber-500 font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />5.0
                        </span>
                        <span className="font-bold text-sm text-primary">From {s.packages?.basic?.price || s.packages?.Basic?.price || "0"} DZD</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                  No active services found for this seller.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-4">
              {DEMO_REVIEWS.map((r, i) => (
                <Card key={i} className="border-border shadow-sm">
                  <CardContent className="p-5 flex items-start gap-4">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback>{r.buyer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <span className="font-semibold">{r.buyer}</span>
                        <span className="text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-sm text-foreground/80">{r.comment}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">About {displayName}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{city}, Algeria</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" />Member since {memberSince}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Globe className="w-4 h-4" />Arabic · French · English</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-3">Certifications</h4>
                    <div className="space-y-2">
                      {["Identity Verified", "Portfolio Approved", "Response Rate 98%"].map(c => (
                        <div key={c} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
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
      </div>
    </div>
  )
}
