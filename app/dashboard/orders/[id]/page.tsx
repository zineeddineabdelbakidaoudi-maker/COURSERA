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

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true)
    const { error } = await supabase
      .from("Order")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
    
    if (error) {
      alert("Error updating status: " + error.message)
    } else {
      fetchOrder()
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
    <div className="space-y-8 max-w-4xl mx-auto py-12 px-4 lg:px-0 animate-fade-in pb-32">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href={backLink}><ArrowLeft className="w-4 h-4 mr-2" />Back to Orders</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <Badge variant="outline" className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 ${statusInfo.color}`}>{statusInfo.label}</Badge>
             <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase">Order #{order.order_number || order.id.slice(0, 8)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 leading-none">{order.service?.title || order.package_name || "Order"}</h1>
          <p className="text-slate-500 mt-4 text-sm font-medium">
            {isBuyer ? "Reviewing project with" : "Delivering excellence for"}: <span className="text-slate-900 font-bold">{counterpartName}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          
           {/* Order Content */}
          <div className="space-y-8">
             {/* Requirements Section */}
             {(() => {
               let reqData = order.requirements_data;
               if (typeof reqData === 'string') {
                 try { reqData = JSON.parse(reqData) } catch (e) {}
               }
               const hasNotes = !!reqData?.notes;
               const hasAnswers = reqData?.answers?.length > 0;
               
               if (!hasNotes && !hasAnswers) return null;

               return (
                 <div className="space-y-6">
                  <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Project Requirements</h3>
                  <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                    {hasNotes && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes from Buyer</p>
                        <p className="text-slate-700 leading-relaxed font-medium">{reqData.notes}</p>
                      </div>
                    )}
                    {hasAnswers && reqData.answers.map((ans: any, idx: number) => (
                      <div key={idx} className="space-y-2 border-t border-slate-200/50 pt-4 first:border-0 first:pt-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement #{idx + 1}</p>
                        <p className="text-slate-900 font-bold">{ans.question || "Requirement Answer"}</p>
                        <p className="text-slate-600 font-medium bg-white p-4 rounded-xl border border-slate-100">{ans.answer || ans}</p>
                      </div>
                    ))}
                  </div>
                 </div>
               );
             })()}

             {/* Timeline */}
             <div className="space-y-6">
                <h3 className="text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">Milestones</h3>
                <div className="relative pl-8 space-y-8 border-l border-slate-100 ml-4">
                  {timelineSteps.map((step, i) => (
                    <div key={i} className="relative">
                      <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm ${step.done ? "bg-slate-900" : "bg-slate-200"}`} />
                      <div className="flex flex-col">
                        <span className={`text-[11px] font-black tracking-widest uppercase ${step.done ? "text-slate-900" : "text-slate-400"}`}>{step.label}</span>
                        <span className="text-xs text-slate-400 mt-1">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/50 mb-2">Total Value</p>
              <h2 className="text-3xl font-black tracking-tighter mb-8">{parseFloat(order.price_dzd).toLocaleString()} DZD</h2>
              
              <div className="space-y-4">
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl py-6 font-black tracking-widest text-[11px] uppercase group shadow-lg" asChild>
                  <Link href={isBuyer ? "/dashboard/messages" : "/dashboard/messages"}>
                    <MessageSquare className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Chat with {isBuyer ? "Seller" : "Buyer"}
                  </Link>
                </Button>

                {isBuyer && order.status === "delivered" && (
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-6 font-black tracking-widest text-[11px] uppercase shadow-lg"
                    onClick={() => handleUpdateStatus("completed")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Accept & Complete
                  </Button>
                )}
                
                {!isBuyer && (order.status === "in_progress" || order.status === "pending_requirements") && (
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-6 font-black tracking-widest text-[11px] uppercase shadow-lg"
                    onClick={() => handleUpdateStatus(order.status === "pending_requirements" ? "in_progress" : "delivered")}
                  >
                    <Package className="w-4 h-4 mr-2" /> 
                    {order.status === "pending_requirements" ? "Start Working" : "Deliver Final Order"}
                  </Button>
                )}

                {isBuyer && order.status === "completed" && (
                  <Button className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-xl py-6 font-black tracking-widest text-[11px] uppercase shadow-lg" asChild>
                    <Link href="/dashboard/buyer/orders">
                      <Star className="w-4 h-4 mr-2 fill-slate-900" /> Leave Feedback
                    </Link>
                  </Button>
                )}
              </div>
           </div>

           <div className="p-8 border border-slate-200 rounded-[2rem] space-y-4">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Order Specs</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Package</span>
                <span className="font-bold text-slate-900 uppercase">{order.package_name || "Standard"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Placed On</span>
                <span className="font-bold text-slate-900">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
