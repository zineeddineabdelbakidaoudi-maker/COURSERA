"use client"

import { useState } from "react"
import { Star, Filter, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const reviews = [
  { buyer: "Ahmed K.", service: "Brand Identity Design", rating: 5, comment: "Absolutely incredible work! Fast delivery and understood the brief perfectly.", date: "Mar 20, 2026" },
  { buyer: "Sara B.", service: "Logo Redesign", rating: 4, comment: "Very clean result, I would have liked a bit more variation in concepts.", date: "Mar 15, 2026" },
  { buyer: "Nassim D.", service: "UI Mockup Pack", rating: 5, comment: "Great quality Figma files. The components are very well structured.", date: "Mar 10, 2026" },
  { buyer: "Leila M.", service: "Brand Identity Design", rating: 5, comment: "Super fast, super professional. Will hire again!", date: "Feb 28, 2026" },
]

const starColor = (r: number) => r === 5 ? "text-amber-400" : r >= 4 ? "text-blue-400" : "text-muted-foreground"

export default function ReviewsPage() {
  const [filter, setFilter] = useState(0)
  const avg = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
  const filtered = filter === 0 ? reviews : reviews.filter(r => r.rating === filter)

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Reviews</h1>
          <p className="text-muted-foreground">Feedback received from your buyers.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-300/30 px-4 py-2 rounded-xl">
          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-2xl font-bold">{avg}</span>
          <span className="text-sm text-muted-foreground">/ 5.0</span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {[0, 5, 4, 3].map(n => (
          <button key={n} onClick={() => setFilter(n)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === n ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}>
            {n === 0 ? "All" : `${n} ★`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((r, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{r.buyer.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <div>
                      <span className="font-semibold">{r.buyer}</span>
                      <span className="text-xs text-muted-foreground ml-2">{r.date}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-bold ${starColor(r.rating)}`}>
                      {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                    </div>
                  </div>
                  <Badge variant="outline" className="mb-3 text-xs">{r.service}</Badge>
                  <p className="text-sm text-foreground/80 flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    {r.comment}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
