"use client"

import { Heart, Briefcase, Package, Search, Star, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const savedServices = [
  { title: "Brand Identity Design", seller: "Yacine M.", rating: 4.9, price: "From 15,000 DZD", category: "Design" },
  { title: "Fullstack Web Development", seller: "Karim B.", rating: 5.0, price: "From 45,000 DZD", category: "Tech" },
]
const savedProducts = [
  { title: "Ultimate Figma UI Kit", seller: "DigitHup Pro", type: "Template", price: "4,500 DZD" },
]

export default function BuyerSavedPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Saved Items</h1>
          <p className="text-muted-foreground">Your bookmarked services and digital products.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-64" placeholder="Search saved..." />
        </div>
      </div>

      <Tabs defaultValue="services">
        <TabsList>
          <TabsTrigger value="services" className="gap-2"><Briefcase className="w-4 h-4" />Services ({savedServices.length})</TabsTrigger>
          <TabsTrigger value="products" className="gap-2"><Package className="w-4 h-4" />Products ({savedProducts.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="services" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {savedServices.map((s, i) => (
              <Card key={i} className="border-border shadow-sm group hover:shadow-md transition-shadow">
                <div className="h-28 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-xl flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-primary/40" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">{s.category}</Badge>
                      <p className="font-semibold text-sm leading-tight">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.seller}</p>
                    </div>
                    <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0 mt-1" />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs flex items-center gap-1 text-amber-500 font-medium"><Star className="w-3 h-3 fill-current" />{s.rating}</span>
                    <Button size="sm" variant="outline" className="gap-1 text-xs"><ArrowRight className="w-3 h-3" />View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {savedProducts.map((p, i) => (
              <Card key={i} className="border-border shadow-sm">
                <div className="h-28 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 rounded-t-xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-purple-400/40" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <Badge variant="outline" className="text-xs mb-1">{p.type}</Badge>
                      <p className="font-semibold text-sm">{p.title}</p>
                      <p className="text-xs text-muted-foreground">{p.seller}</p>
                    </div>
                    <Heart className="w-4 h-4 text-red-400 fill-red-400 shrink-0" />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-bold text-sm text-primary">{p.price}</span>
                    <Button size="sm" className="text-xs gap-1">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
