"use client"

import React from "react"
import Link from "next/link"
import { Heart, Star, ExternalLink, Trash2, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const savedServices = [
  {
    id: "1",
    title: "Professional Video Editing",
    seller: "Amine K.",
    rating: 4.9,
    reviews: 124,
    price: "3,000 DZD",
    category: "Video & Animation",
    saved: "3 days ago",
  },
  {
    id: "2",
    title: "Full-Stack Web Application Dev",
    seller: "Mohamed R.",
    rating: 5.0,
    reviews: 67,
    price: "25,000 DZD",
    category: "Development",
    saved: "1 week ago",
  },
  {
    id: "3",
    title: "Arabic & French Content Writing",
    seller: "Nassima B.",
    rating: 4.7,
    reviews: 89,
    price: "1,500 DZD",
    category: "Writing",
    saved: "2 weeks ago",
  },
]

export default function FavoritesPage() {
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

      {savedServices.length === 0 ? (
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
          {savedServices.map((service) => (
            <Card key={service.id} className="border-border shadow-sm overflow-hidden group hover:border-primary/30 transition-all">
              <div className="h-36 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <div className="text-4xl">🎨</div>
              </div>
              <CardContent className="p-5">
                <Badge variant="outline" className="text-xs mb-2">{service.category}</Badge>
                <h3 className="font-semibold text-foreground leading-tight mb-1 line-clamp-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">by {service.seller}</p>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">({service.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">{service.price}</span>
                  <span className="text-xs text-muted-foreground">{service.saved}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 gap-1.5 text-xs" asChild>
                    <Link href={`/services/${service.id}`}>
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Order Now
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" asChild>
                    <Link href={`/services/${service.id}`}><ExternalLink className="w-3.5 h-3.5" /></Link>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
