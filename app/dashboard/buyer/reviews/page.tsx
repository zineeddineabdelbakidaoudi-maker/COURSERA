"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Star, MessageSquare, Loader2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { submitReviewAction } from "@/app/actions/item-actions"

function ReviewsContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams?.get("order")
  const supabase = createClient()
  
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [orderToReview, setOrderToReview] = useState<any>(null)
  
  // Review form state
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchData()
  }, [orderId])

  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // If an order ID is provided, fetch the order details to review it
    if (orderId) {
      const { data: orderData } = await supabase
        .from("Order")
        .select("*, service:Service(title), seller:Profile!seller_id(full_name)")
        .eq("id", orderId)
        .eq("buyer_id", user.id)
        .single()
        
      if (orderData) {
        // Check if review already exists
        const { data: existingReview } = await supabase
          .from("Review")
          .select("id")
          .eq("order_id", orderId)
          .single()
          
        if (!existingReview) setOrderToReview(orderData)
      }
    }

    // Fetch past reviews made by this user
    const { data: myReviews } = await supabase
      .from("Review")
      .select("*, service:Service(title), reviewed_user:Profile!reviewed_user_id(full_name, avatar_url)")
      .eq("reviewer_id", user.id)
      .order("created_at", { ascending: false })
      
    setReviews(myReviews || [])
    setLoading(false)
  }

  const handleSubmitReview = async () => {
    if (!comment.trim() || !orderToReview) return
    setSubmitting(true)

    const res = await submitReviewAction({
      reviewed_user_id: orderToReview.seller_id,
      service_id: orderToReview.service_id,
      order_id: orderToReview.id,
      type: 'service',
      rating: rating,
      comment: comment,
    })

    setSubmitting(false)
    if (res.success) {
      setSuccess(true)
      fetchData() // Refresh list
    } else {
      alert("Error submitting review: " + res.error)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Reviews</h1>
        <p className="text-muted-foreground">Reviews you have left for sellers.</p>
      </div>

      {/* Review Submission Form (only visible when arriving from ?order=uuid) */}
      {orderId && orderToReview && !success && (
        <Card className="border-primary shadow-md bg-primary/5">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>Rate your experience with {orderToReview.seller?.full_name} for the service "{orderToReview.service?.title}"</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Overall Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className={`p-1 hover:scale-110 transition-transform ${star <= rating ? "text-amber-400" : "text-slate-300"}`}>
                    <Star className={`w-8 h-8 ${star <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Feedback</Label>
              <Textarea 
                placeholder="What did you like about the delivery? Were the requirements met?" 
                rows={4} 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmitReview} disabled={submitting || !comment.trim()} className="w-full sm:w-auto">
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {success && (
        <div className="bg-green-500/10 text-green-700 border border-green-200 p-4 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="font-medium">Thank you! Your review has been published.</p>
        </div>
      )}

      {/* Display Past Reviews */}
      {reviews.length === 0 ? (
        <Card className="border-border text-center p-16">
          <p className="text-muted-foreground">You haven't left any reviews yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mt-8 mb-4">Past Reviews</h2>
          {reviews.map((r) => (
            <Card key={r.id} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarImage src={r.reviewed_user?.avatar_url || ""} />
                    <AvatarFallback>{r.reviewed_user?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                      <div>
                        <span className="font-semibold">{r.reviewed_user?.full_name || "Unknown Seller"}</span>
                        <span className="text-xs text-muted-foreground ml-2">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: r.rating_overall || 5 }).map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs mb-3 truncate max-w-sm">{r.service?.title || "Service"}</Badge>
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

export default function BuyerReviewsPage() {
  return (
    <React.Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ReviewsContent />
    </React.Suspense>
  )
}
