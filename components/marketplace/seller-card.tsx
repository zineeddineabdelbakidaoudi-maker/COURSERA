import Link from "next/link"
import { Star, Package, CheckCircle2 } from "lucide-react"
import Tilt from "react-parallax-tilt"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export interface SellerCardProps {
  username: string
  name: string
  avatar?: string
  specialty: string
  level: "new" | "rising" | "pro" | "elite"
  verified: boolean
  rating: number
  completedOrders: number
  topService?: {
    title: string
    price: number
  }
}

const levelLabels: Record<string, { label: string; className: string }> = {
  new: { label: "New Seller", className: "bg-secondary text-secondary-foreground" },
  rising: { label: "Rising Talent", className: "bg-primary/10 text-primary" },
  pro: { label: "Pro Seller", className: "bg-accent/10 text-accent" },
  elite: { label: "Elite Partner", className: "bg-warning/10 text-warning" },
}

export function SellerCard({
  username,
  name,
  specialty,
  level,
  verified,
  rating,
  completedOrders,
  topService,
}: SellerCardProps) {
  const levelInfo = levelLabels[level]

  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      scale={1.02}
      transitionSpeed={2500}
      className="flex flex-col glass-card rounded-2xl border border-border p-5 min-w-[280px] transition-all duration-300 shadow-premium card-hover"
    >
      {/* Avatar & Badge */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-foreground">
            {name.charAt(0)}
          </span>
          {verified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-foreground truncate">{name}</span>
          <span className="text-sm text-muted-foreground truncate">{specialty}</span>
          <Badge variant="secondary" className={cn("text-xs w-fit mt-1", levelInfo.className)}>
            {levelInfo.label}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-warning text-warning" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Package className="w-4 h-4" />
          <span className="text-sm">{completedOrders} orders</span>
        </div>
      </div>

      {/* Top Service */}
      {topService && (
        <div className="py-3 px-3 rounded-xl bg-secondary/50 mb-4">
          <p className="text-xs text-muted-foreground mb-1">Top Service</p>
          <p className="text-sm font-medium truncate">{topService.title}</p>
          <p className="text-sm text-primary font-mono font-semibold">
            From {topService.price.toLocaleString('en-US')} DZD
          </p>
        </div>
      )}

      {/* CTA */}
      <Link href={`/sellers/${username}`} className="mt-auto">
        <Button variant="outline" size="sm" className="w-full rounded-full">
          View Profile
        </Button>
      </Link>
    </Tilt>
  )
}
