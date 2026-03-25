"use client"

import React from "react"
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const reviews = [
  {
    id: "1",
    buyer: "Karim B.",
    avatar: null,
    service: "Logo Design Package",
    rating: 5,
    comment: "Absolutely fantastic work! The logos were creative, professional, and delivered on time. Highly recommend this seller.",
    date: "Mar 22, 2026",
    helpful: 4,
  },
  {
    id: "2",
    buyer: "Sara M.",
    avatar: null,
    service: "Social Media Kit",
    rating: 4,
    comment: "Great quality and very responsive. Minor revision required but everything was handled smoothly.",
    date: "Mar 18, 2026",
    helpful: 2,
  },
  {
    id: "3",
    buyer: "Yacine D.",
    avatar: null,
    service: "UI/UX Design",
    rating: 5,
    comment: "Exceeded all expectations. The design really captured our brand identity perfectly. Will order again!",
    date: "Mar 10, 2026",
    helpful: 7,
  },
]

const ratingBreakdown = [
  { stars: 5, count: 18, pct: 75 },
  { stars: 4, count: 4, pct: 17 },
  { stars: 3, count: 1, pct: 4 },
  { stars: 2, count: 1, pct: 4 },
  { stars: 1, count: 0, pct: 0 },
]

export default function ReviewsPage() {
  const avgRating = 4.8

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Reviews</h1>
        <p className="text-muted-foreground">See what clients say about your services.</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="text-6xl font-bold text-foreground mb-2">{avgRating}</div>
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
              ))}
            </div>
            <p className="text-muted-foreground text-sm">{reviews.length} total reviews</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ratingBreakdown.map((r) => (
              <div key={r.stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{r.stars}</span>
                </div>
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-8 text-right">{r.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.avatar || ""} />
                    <AvatarFallback>{review.buyer.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.buyer}</p>
                    <p className="text-xs text-muted-foreground">{review.service}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{review.comment}</p>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Helpful ({review.helpful})
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-muted-foreground">
                  <Flag className="w-3.5 h-3.5" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
