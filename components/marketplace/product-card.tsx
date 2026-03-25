"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Star, Download, BookOpen, FileText, Wrench, Package, Sparkles } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/useCartStore"

export interface ProductCardProps {
  id: string
  slug: string
  title: string
  description: string
  price: number
  type: "course" | "template" | "ebook" | "toolkit" | "bundle"
  creator: {
    name: string
    avatar?: string
  }
  rating: number
  purchaseCount: number
  isInstantDownload?: boolean
  isBestSeller?: boolean
  isNew?: boolean
}

const typeConfig: Record<string, { icon: React.ElementType; className: string; label: string }> = {
  course: { icon: BookOpen, className: "bg-accent/10 text-accent border-accent/20", label: "Course" },
  template: { icon: FileText, className: "bg-primary/10 text-primary border-primary/20", label: "Template" },
  ebook: { icon: BookOpen, className: "bg-success/10 text-success border-success/20", label: "Ebook" },
  toolkit: { icon: Wrench, className: "bg-warning/10 text-warning border-warning/20", label: "Toolkit" },
  bundle: { icon: Package, className: "bg-destructive/10 text-destructive border-destructive/20", label: "Bundle" },
}

export function ProductCard({
  id = "1",
  slug,
  title,
  description,
  price,
  type,
  creator,
  rating,
  purchaseCount,
  isInstantDownload = true,
  isBestSeller = false,
  isNew = false,
}: ProductCardProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const typeInfo = typeConfig[type]
  const TypeIcon = typeInfo.icon as any

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id,
      title,
      type: typeInfo.label,
      author: creator.name,
      price,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
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
      {/* Ribbons */}
      {(isBestSeller || isNew) && (
        <div className="absolute top-3 left-3 z-10">
          {isBestSeller ? (
            <Badge className="bg-warning text-warning-foreground border-0 gap-1">
              <Sparkles className="w-3 h-3" />
              Best Seller
            </Badge>
          ) : (
            <Badge className="bg-success text-success-foreground border-0">
              New
            </Badge>
          )}
        </div>
      )}

      {/* Cover */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-accent/20 via-primary/10 to-accent/5">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
            <TypeIcon className="w-10 h-10 text-accent" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Type Badge */}
        <Badge variant="outline" className={cn("w-fit mb-3 text-xs border", typeInfo.className)}>
          {typeInfo.label}
        </Badge>

        {/* Title & Description */}
        <Link href={`/store/${slug}`} className="block group/link">
          <h3 className="font-semibold text-foreground leading-snug mb-1 line-clamp-2 group-hover/link:text-accent transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        {/* Creator Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-foreground">
              {creator.name.charAt(0)}
            </span>
          </div>
          <span className="text-sm text-muted-foreground truncate">
            by {creator.name}
          </span>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs">{purchaseCount.toLocaleString()} {type === "course" ? "learners" : "downloads"}</span>
          </div>
        </div>

        {/* Instant Download Badge */}
        {isInstantDownload && (
          <Badge variant="secondary" className="w-fit text-xs mb-3 bg-success/10 text-success border-0">
            Instant Download
          </Badge>
        )}

        {/* Price & CTA */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <p className="font-mono font-bold text-lg text-foreground">
            {price.toLocaleString('en-US')} <span className="text-sm">DZD</span>
          </p>
          <Button 
            onClick={handleAddToCart}
            size="sm" 
            className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground z-10"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Tilt>
  )
}
