"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingBag,
  Heart,
  MessageSquare,
  Star,
  Search,
  Loader2,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-600 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>
    case "in_progress":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
    case "pending_requirements":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-200"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>
    case "delivered":
      return <Badge className="bg-purple-500/10 text-purple-600 border-purple-200"><CheckCircle2 className="h-3 w-3 mr-1" />Delivered</Badge>
    default:
      return <Badge variant="secondary" className="capitalize">{status?.replace("_", " ")}</Badge>
  }
}

export default function BuyerDashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState({ orders: 0, saved: 0, messages: 0, reviews: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: prof } = await supabase.from("Profile").select("full_name, avatar_url, role").eq("id", user.id).single()
    setProfile(prof)

    // My orders as buyer
    const { data: myOrders } = await supabase
      .from("Order")
      .select("*, service:Service(title, thumbnail_url), seller:Profile!seller_id(full_name, avatar_url)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
    setOrders(myOrders || [])

    // Stats
    const activeOrders = (myOrders || []).filter(o => ["in_progress","pending_requirements","delivered"].includes(o.status)).length

    const { count: msgCount } = await supabase
      .from("Conversation")
      .select("id", { count: "exact" })
      .contains("participant_ids", [user.id])

    const { count: reviewCount } = await supabase
      .from("Review")
      .select("id", { count: "exact" })
      .eq("reviewer_id", user.id)

    setStats({
      orders: activeOrders,
      saved: 0, // Future: Favorites table
      messages: msgCount || 0,
      reviews: reviewCount || 0,
    })

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = profile?.full_name || "there"

  const statItems = [
    { label: "Active Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10", href: "/dashboard/buyer/orders" },
    { label: "Saved Services", value: stats.saved, icon: Heart, color: "text-red-500", bg: "bg-red-500/10", href: "/dashboard/buyer/saved" },
    { label: "Conversations", value: stats.messages, icon: MessageSquare, color: "text-primary", bg: "bg-primary/10", href: "/dashboard/buyer/messages" },
    { label: "Reviews Given", value: stats.reviews, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10", href: "/dashboard/buyer/reviews" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 lg:px-0 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {displayName.split(" ")[0]}! 👋</h1>
          <p className="text-muted-foreground">Manage your orders, messages, and saved services.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/services"><Search className="w-4 h-4 mr-2" />Find Services</Link>
          </Button>
          <Button asChild>
            <Link href="/store"><Store className="w-4 h-4 mr-2" />Browse Store</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-border shadow-sm">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest service purchases</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/buyer/orders" className="gap-1">View All <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No orders yet</p>
              <p className="text-sm mt-1">Your purchases will appear here.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={order.seller?.avatar_url || ""} />
                      <AvatarFallback>{order.seller?.full_name?.charAt(0) || "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{order.service?.title || order.package_name || "Order"}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.seller?.full_name} · {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="font-bold text-sm">{parseFloat(order.price_dzd || 0).toLocaleString()} DZD</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
