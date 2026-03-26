"use client"

import { useState, useEffect } from "react"
import { Star, Filter, MessageSquare, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

export default function ReviewsPage() {
  const [filter, setFilter] = useState(0)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from("Review")
      .select("*, service:Service(title), buyer:Profile!reviewer_id(full_name, avatar_url)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })

    setReviews(data || [])
    setLoading(false)
  }

  const starColor = (r: number) => r >= 5 ? "text-amber-400" : r >= 4 ? "text-blue-400" : "text-muted-foreground"
  
  const avg = reviews.length > 0 
    ? (reviews.reduce((a, r) => a + (r.rating_overall || 0), 0) / reviews.length).toFixed(1) 
    : "0.0"
    
  const filtered = filter === 0 ? reviews : reviews.filter(r => Math.floor(r.rating_overall || 0) === filter)

  if (loading) {
    return <div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
  }

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
        {[0, 5, 4, 3, 2, 1].map(n => (
          <button key={n} onClick={() => setFilter(n)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === n ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}>
            {n === 0 ? "All" : `${n} ★`}
          </button>
        ))}
      </div>

      {reviews.length === 0 ? (
        <Card className="border-border text-center p-16">
          <p className="text-muted-foreground">No reviews yet. Keep delivering great services!</p>
        </Card>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground py-8">No reviews matching {filter} stars.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <Card key={r.id} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarImage src={r.buyer?.avatar_url || ""} />
                    <AvatarFallback>{r.buyer?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div>
                        <span className="font-semibold">{r.buyer?.full_name || "Unknown Buyer"}</span>
                        <span className="text-xs text-muted-foreground ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className={`flex items-center gap-1 font-bold ${starColor(r.rating_overall || 5)}`}>
                        {Array.from({ length: r.rating_overall || 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                    <Badge variant="outline" className="mb-3 text-xs">{r.service?.title || "Service"}</Badge>
                    <p className="text-sm text-foreground/80 flex items-start gap-2 max-w-2xl">
                      <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                      {r.comment || "No comment provided."}
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
