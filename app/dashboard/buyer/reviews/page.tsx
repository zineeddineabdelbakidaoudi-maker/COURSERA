"use client"

import { Star, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const reviews = [
  { seller: "Yacine M.", service: "Brand Identity Design", rating: 5, comment: "Exceptional work. Delivered ahead of schedule with top-tier quality!", date: "Mar 21, 2026" },
  { seller: "Nassima B.", service: "SEO Copywriting x5", rating: 4, comment: "Very good articles, well-researched and on-point.", date: "Mar 11, 2026" },
]

export default function BuyerReviewsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Reviews</h1>
        <p className="text-muted-foreground">Reviews you have left for sellers.</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-border text-center p-16">
          <p className="text-muted-foreground">You haven't left any reviews yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <Card key={i} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback>{r.seller.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div>
                        <span className="font-semibold">{r.seller}</span>
                        <span className="text-xs text-muted-foreground ml-2">{r.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs mb-3">{r.service}</Badge>
                    <p className="text-sm text-foreground/80 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" /> {r.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
