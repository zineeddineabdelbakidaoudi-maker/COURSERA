"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Star, ExternalLink, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function FavoritesPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<any[]>([])

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data, error } = await supabase
      .from("Wishlist")
      .select(`
        *,
        service:Service(*, seller:Profile!seller_id(full_name, avatar_url), category:Category!category_id(name_en))
      `)
      .eq("user_id", user.id)
      .eq("item_type", "service")
      .order("created_at", { ascending: false })

    if (!error) setFavorites(data || [])
    setLoading(false)
  }

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("Wishlist").delete().eq("id", id)
    if (!error) {
      setFavorites(prev => prev.filter(item => item.id !== id))
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Saved Services</h1>
          <p className="text-muted-foreground">Services you've bookmarked for later.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/services">Browse More Services</Link>
        </Button>
      </div>

      {favorites.length === 0 ? (
        <Card className="border-border shadow-sm">
          <CardContent className="p-16 flex flex-col items-center text-center">
            <Heart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved services yet</h3>
            <p className="text-muted-foreground mb-6">Browse the marketplace and save services you're interested in.</p>
            <Button asChild>
              <Link href="/services">Explore Services</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => {
            const service = item.service
            if (!service) return null
            return (
            <Card key={item.id} className="border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
              <div className="h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
                {service.thumbnail_url ? (
                  <img src={service.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl opacity-20">🎨</div>
                )}
              </div>
              <CardContent className="p-5">
                <Badge variant="outline" className="text-xs mb-2 uppercase">{service.category?.name_en || "Service"}</Badge>
                <h3 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 h-10">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {service.seller?.full_name || "Seller"}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{Number(service.rating_avg || 5).toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({service.total_reviews || 0})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{Number(service.packages?.basic?.price || 5000).toLocaleString()} DZD</span>
                  <span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                    <Link href={`/services/${service.slug || service.id}`}>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Order Now
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" asChild>
                    <Link href={`/services/${service.slug || service.id}`}><ExternalLink className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
