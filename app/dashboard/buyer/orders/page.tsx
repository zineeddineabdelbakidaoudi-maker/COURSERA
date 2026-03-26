"use client"

import React, { useState, useEffect } from "react"
import { ShoppingBag, Clock, CheckCircle2, AlertTriangle, Eye, X, MessageSquare, Package, Star, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  pending_requirements: { label: "Awaiting Req", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock },
  in_revision: { label: "In Revision", color: "bg-amber-500/10 text-amber-600 border-amber-200", icon: Clock },
  delivered: { label: "Delivered", color: "bg-purple-500/10 text-purple-600 border-purple-200", icon: Package },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertTriangle },
  disputed: { label: "Disputed", color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertTriangle },
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  
  // Review state
  const [showReview, setShowReview] = useState(false)
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" })
  
  const supabase = createClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    // Fetch real orders mapping their respective service and seller
    const { data } = await supabase.from('Order').select('*, service:Service(title), seller:Profile!seller_id(full_name), reviews:Review(id)').eq('buyer_id', user.id).order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  const handleReviewSubmit = async () => {
    if (!selected || !reviewForm.comment.trim()) return
    setSubmittingReview(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('Review').insert({
      reviewer_id: user?.id,
      reviewed_user_id: selected.seller_id,
      service_id: selected.service_id,
      order_id: selected.id,
      rating_overall: reviewForm.rating,
      rating_quality: reviewForm.rating,
      rating_communication: reviewForm.rating,
      comment: reviewForm.comment,
      is_verified_purchase: true,
      is_visible: true
    })

    setSubmittingReview(false)
    if (!error) {
      alert("Review submitted successfully!")
      setShowReview(false)
      setSelected(null)
      fetchOrders() // Refresh to show it has a review
    } else {
      alert("Error submitting review: " + error.message)
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Orders</h1>
        <p className="text-muted-foreground">Track all your service and product orders.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", count: orders.filter(o => o.status === 'in_progress' || o.status === 'pending_requirements').length, color: "text-blue-500" },
          { label: "Completed", count: orders.filter(o => o.status === 'completed').length, color: "text-green-500" },
          { label: "Cancelled", count: orders.filter(o => o.status === 'cancelled' || o.status === 'disputed').length, color: "text-red-500" }
        ].map(s => (
          <Card key={s.label} className="border-border shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{loading ? '-' : s.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-muted-foreground font-semibold">Order</th>
                  <th className="text-left p-4 text-muted-foreground font-semibold hidden sm:table-cell">Seller</th>
                  <th className="text-left p-4 text-muted-foreground font-semibold">Status</th>
                  <th className="text-right p-4 text-muted-foreground font-semibold">Price</th>
                  <th className="text-right p-4 text-muted-foreground font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No orders found.</td></tr>
                ) : orders.map(o => {
                  const s = STATUS_MAP[o.status] || STATUS_MAP.in_progress
                  const SIcon = s.icon
                  return (
                    <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold">{o.order_number}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{o.service?.title || o.package_name}</p>
                        <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-muted-foreground">{o.seller?.full_name || "Unknown"}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`gap-1.5 ${s.color}`}>
                          <SIcon className="w-3 h-3" />{s.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-semibold">{parseFloat(o.price_dzd).toLocaleString()} DZD</td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setSelected(o); setShowReview(false); }}>
                          <Eye className="w-3.5 h-3.5" />View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ORDER DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-bold text-lg">{showReview ? "Leave a Review" : selected.order_number}</h2>
                <p className="text-sm text-muted-foreground">{selected.service?.title}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {showReview ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col items-center justify-center py-4 border-b border-border">
                  <p className="text-sm mb-2 font-medium">Rate your experience</p>
                  <div className="flex gap-2 text-warning">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                        <Star className={`w-8 h-8 ${star <= reviewForm.rating ? "fill-warning" : "text-muted border-muted-foreground stroke-1 stroke-muted-foreground fill-none"}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Your Comment</Label>
                  <Textarea 
                    rows={4} 
                    placeholder="Describe your experience with this seller..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowReview(false)}>Cancel</Button>
                  <Button className="flex-1 bg-primary text-primary-foreground" disabled={!reviewForm.comment.trim() || submittingReview} onClick={handleReviewSubmit}>
                    {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Seller</p>
                    <p className="font-semibold">{selected.seller?.full_name}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                    <p className="font-bold text-primary">{parseFloat(selected.price_dzd).toLocaleString()} DZD</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                    <p className="font-semibold">{new Date(selected.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Delivery Status</p>
                    <p className="font-semibold">{STATUS_MAP[selected.status]?.label || selected.status}</p>
                  </div>
                </div>

                {selected.requirements_data?.notes && (
                  <div className="bg-amber-500/5 border border-amber-200 rounded-xl p-4 text-sm">
                    <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Notes</p>
                    <p className="text-foreground/80">{selected.requirements_data.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {(selected.status === "in_progress" || selected.status === "pending_requirements") && (
                    <Button variant="outline" className="flex-1 gap-2"><MessageSquare className="w-4 h-4" />Message</Button>
                  )}
                  {selected.status === "completed" && selected.reviews?.length === 0 && (
                    <Button className="flex-1 gap-2 bg-warning text-warning-foreground hover:bg-warning/90" onClick={() => setShowReview(true)}><Star className="w-4 h-4 fill-warning-foreground" />Review Seller</Button>
                  )}
                  {selected.status === "completed" && selected.reviews?.length > 0 && (
                    <Button disabled variant="outline" className="flex-1"><Star className="w-4 h-4 mr-2" />Reviewed</Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Close</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
