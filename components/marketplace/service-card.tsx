"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Heart, Star, Clock, RefreshCw, CheckCircle2 } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"

export interface ServiceCardProps {
  id?: string
  slug: string
  title: string
  description: string
  price: number
  category: string
  thumbnail?: string
  seller: {
    name: string
    avatar?: string
    level: "new" | "rising" | "pro" | "elite"
    verified: boolean
  }
  rating: number
  reviewCount: number
  deliveryDays: number
  revisions: number
  isSaved?: boolean
  onSaveToggle?: () => void
}

const levelLabels: Record<string, { label: string; className: string }> = {
  new: { label: "New Seller", className: "bg-secondary text-secondary-foreground" },
  rising: { label: "Rising Talent", className: "bg-primary/10 text-primary" },
  pro: { label: "Pro Seller", className: "bg-accent/10 text-accent" },
  elite: { label: "Elite Partner", className: "bg-warning/10 text-warning" },
}

export function ServiceCard({
  id = "1",
  slug,
  title,
  description,
  price,
  category,
  seller,
  rating,
  reviewCount,
  deliveryDays,
  revisions,
  isSaved = false,
  onSaveToggle,
}: ServiceCardProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const levelInfo = levelLabels[seller.level]

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id,
      title,
      type: "Service",
      author: seller.name,
      price,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=2071&auto=format&fit=crop"
    })
    router.push("/cart")
  }

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      transitionSpeed={2500}
      className="group relative flex flex-col glass-card rounded-2xl border border-border overflow-hidden transition-all duration-300 shadow-premium card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">
              {category.charAt(0)}
            </span>
          </div>
        </div>
        
        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onSaveToggle?.()
          }}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10",
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/80 backdrop-blur-sm text-foreground hover:bg-background"
          )}
          aria-label={isSaved ? "Remove from saved" : "Save service"}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-foreground">
              {seller.name.charAt(0)}
            </span>
            {seller.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{seller.name}</span>
            <Badge variant="secondary" className={cn("text-xs w-fit", levelInfo.className)}>
              {levelInfo.label}
            </Badge>
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/services/${slug}`} className="block group/link">
          <h3 className="font-semibold text-foreground leading-snug mb-1 line-clamp-2 group-hover/link:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        {/* Category */}
        <Badge variant="outline" className="w-fit mb-3 text-xs">
          {category}
        </Badge>

        {/* Rating & Badges */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-success">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{deliveryDays} day{deliveryDays > 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-xs">{revisions} rev{revisions > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting from</span>
            <p className="font-mono font-bold text-lg text-foreground">
              {price.toLocaleString('en-US')} <span className="text-sm">DZD</span>
            </p>
          </div>
          <Button 
            onClick={handleOrderNow}
            size="sm" 
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground z-10"
          >
            Order Now
          </Button>
        </div>
      </div>
    </Tilt>
  )
}
