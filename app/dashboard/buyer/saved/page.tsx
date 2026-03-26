"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Briefcase, Package, Search, Star, ArrowRight, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function BuyerSavedPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
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
        service:Service(*, seller:Profile!seller_id(full_name, avatar_url), category:Category!category_id(name_en)),
        product:DigitalProduct(*, publisher:Profile!publisher_id(full_name, avatar_url), category:Category!category_id(name_en))
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!error) setWishlist(data || [])
    setLoading(false)
  }

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("Wishlist").delete().eq("id", id)
    if (!error) {
      setWishlist(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleAddToCart = async (item: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const insertData: any = {
      user_id: user.id,
      item_type: item.item_type,
      quantity: 1
    }

    if (item.item_type === 'service') {
      insertData.service_id = item.service_id
      insertData.package_name = item.service?.packages?.basic?.name || "Basic"
      insertData.addons = { price: item.service?.packages?.basic?.price || 5000 }
    } else {
      insertData.product_id = item.product_id
      insertData.package_name = "Digital File"
      insertData.addons = { price: item.product?.price_dzd || 0 }
    }

    const { error } = await supabase.from("CartItem").insert(insertData)
    if (!error) router.push("/cart")
    else alert("Error adding to cart: " + error.message)
  }

  const services = wishlist.filter(item => item.item_type === "service" && item.service)
  const products = wishlist.filter(item => item.item_type === "product" && item.product)

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Saved Items</h1>
          <p className="text-muted-foreground">Your bookmarked services and digital products.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-64" 
            placeholder="Search saved..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services" className="gap-2">
            <Briefcase className="w-4 h-4" />Services ({services.length})
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-2">
            <Package className="w-4 h-4" />Products ({products.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="services" className="mt-6">
          {services.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No saved services yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/services">Browse Marketplace</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {services.map((item) => {
                const s = item.service
                return (
                  <Card key={item.id} className="border-border shadow-sm group hover:shadow-md transition-shadow">
                    <div className="h-32 bg-muted relative rounded-t-xl overflow-hidden">
                      {s.thumbnail_url ? (
                        <img src={s.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Briefcase className="w-10 h-10 text-primary/20" />
                        </div>
                      )}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Badge variant="outline" className="text-[10px] mb-1 uppercase">{s.category?.name_en || "Service"}</Badge>
                        <p className="font-semibold text-sm leading-tight line-clamp-2 h-10">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {s.seller?.full_name || "Seller"}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current" /> {Number(s.rating_avg || 5).toFixed(1)}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-[10px] gap-1 px-2" asChild>
                            <Link href={`/services/${s.slug || s.id}`}>View</Link>
                          </Button>
                          <Button size="sm" className="h-8 text-[10px] gap-1 px-2" onClick={() => handleAddToCart(item)}>
                            <ShoppingCart className="w-3 h-3" /> Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
              <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No saved products yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/store">Browse Store</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((item) => {
                const p = item.product
                return (
                  <Card key={item.id} className="border-border shadow-sm group hover:shadow-md transition-shadow">
                    <div className="h-32 bg-muted relative rounded-t-xl overflow-hidden">
                      {p.cover_url ? (
                        <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                          <Package className="w-10 h-10 text-primary/20" />
                        </div>
                      )}
                      <button 
                        onClick={() => handleRemove(item.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Badge variant="outline" className="text-[10px] mb-1 uppercase">{p.type || "Product"}</Badge>
                        <p className="font-semibold text-sm leading-tight line-clamp-2 h-10">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">by {p.publisher?.full_name || "Publisher"}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="font-bold text-sm text-primary">{Number(p.price_dzd || 0).toLocaleString()} DZD</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8 text-[10px] gap-1 px-2" asChild>
                            <Link href={`/store/${p.slug || p.id}`}>View</Link>
                          </Button>
                          <Button size="sm" className="h-8 text-[10px] gap-1 px-2" onClick={() => handleAddToCart(item)}>
                            <ShoppingCart className="w-3 h-3" /> Buy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
