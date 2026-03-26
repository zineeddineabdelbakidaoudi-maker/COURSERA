"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, Clock, ArrowLeft, MessageSquare, Download, Star, Loader2, AlertTriangle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"buyer" | "seller" | null>(null)
  
  const id = params.id as string

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const { data, error } = await supabase
      .from("Order")
      .select("*, service:Service(title), seller:Profile!seller_id(full_name, avatar_url), buyer:Profile!buyer_id(full_name, avatar_url)")
      .eq("id", id)
      .single()

    if (error || !data) {
      setLoading(false)
      return
    }

    if (user.id === data.buyer_id) setUserRole("buyer")
    else if (user.id === data.seller_id) setUserRole("seller")
    else {
      // Not authorized
      setLoading(false)
      return
    }

    setOrder(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20 animate-slide-up">
        <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you are looking for does not exist or you don't have access to view it.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "completed": return { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200" }
      case "in_progress": return { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-200" }
      case "pending_requirements": return { label: "Awaiting Requirements", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200" }
      case "delivered": return { label: "Delivered", color: "bg-purple-500/10 text-purple-600 border-purple-200" }
      case "cancelled": return { label: "Cancelled", color: "bg-red-500/10 text-red-600 border-red-200" }
      default: return { label: status, color: "bg-secondary text-secondary-foreground" }
    }
  }

  const statusInfo = getStatusDisplay(order.status)
  const isBuyer = userRole === "buyer"
  const counterpartName = isBuyer ? order.seller?.full_name : order.buyer?.full_name
  const backLink = isBuyer ? "/dashboard/buyer/orders" : "/dashboard/orders"

  const timelineSteps = [
    { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), done: true },
    { label: "Requirements Submitted", date: order.status !== "pending_requirements" ? new Date(order.created_at).toLocaleDateString() : "Pending", done: order.status !== "pending_requirements" },
    { label: "In Progress", date: ["in_progress", "delivered", "completed"].includes(order.status) ? "Active" : "Waiting", done: ["in_progress", "delivered", "completed"].includes(order.status) },
    { label: "Delivered", date: ["delivered", "completed"].includes(order.status) ? "Ready" : "Pending", done: ["delivered", "completed"].includes(order.status) },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8 px-4 lg:px-0 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={backLink}><ArrowLeft className="w-4 h-4 mr-2" />Back to Orders</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-semibold mb-2">{order.service?.title || order.package_name || "Order"}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <span>Order #{order.order_number || order.id.slice(0, 8)}</span>
            <span>•</span>
            <span>{isBuyer ? "Seller" : "Buyer"}: <span className="font-medium text-foreground">{counterpartName}</span></span>
          </p>
        </div>
        <Badge variant="outline" className={`text-sm px-3 py-1 ${statusInfo.color}`}>{statusInfo.label}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Timeline */}
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-0">
                {timelineSteps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-primary-foreground" : "bg-muted border-2 border-border"}`}>
                        {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                      </div>
                      {i < timelineSteps.length - 1 && <div className={`w-0.5 flex-1 my-1 ${step.done ? "bg-primary" : "bg-border"}`} style={{minHeight: "2rem"}} />}
                    </div>
                    <div className="pb-4 pt-1">
                      <p className={`font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-right max-w-[60%]">{order.service?.title || "Custom Order"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Selected Package</span>
                <span className="font-medium">{order.package_name || "Standard"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-3">
                <span className="text-muted-foreground">Order Date</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-bold text-lg text-primary">{parseFloat(order.price_dzd).toLocaleString()} DZD</span>
              </div>
            </CardContent>
          </Card>

          {order.requirements_data?.notes && (
            <Card className="bg-amber-500/5 border-amber-200 shadow-sm">
              <CardHeader className="pb-3"><CardTitle className="text-base text-amber-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />Order Notes & Requirements</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-amber-900/80 leading-relaxed whitespace-pre-wrap">{order.requirements_data.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2" variant="default" asChild>
                <Link href={isBuyer ? "/dashboard/buyer/messages" : "/dashboard/messages"}>
                  <MessageSquare className="w-4 h-4" /> Message {isBuyer ? "Seller" : "Buyer"}
                </Link>
              </Button>
              
              {isBuyer && order.status === "delivered" && (
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle2 className="w-4 h-4" /> Accept Delivery
                </Button>
              )}
              
              {!isBuyer && order.status === "in_progress" && (
                <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  <Package className="w-4 h-4" /> Deliver Order
                </Button>
              )}

              {isBuyer && order.status === "completed" && (
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href={`/dashboard/buyer/reviews?order=${order.id}`}><Star className="w-4 h-4" /> Leave a Review</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
