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
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-primary/10 to-transparent border border-primary/20 p-8 lg:p-12 mb-8">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl font-display font-bold tracking-tight mb-3">
              Welcome back, <span className="text-primary">{displayName.split(" ")[0]}</span>!
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Ready to find your next professional service or digital asset? Explore our curated marketplace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                <Link href="/services"><Search className="w-5 h-5 mr-2" /> Discover Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-xl h-12 px-8 border-border hover:bg-white/5 transition-colors">
                <Link href="/store"><Store className="w-5 h-5 mr-2" /> Shop Products</Link>
              </Button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm transform hover:-translate-y-1 transition-transform">
                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                <p className="font-bold text-xl">{stats.orders}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Orders</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border shadow-sm transform hover:-translate-y-1 transition-transform translate-y-4">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <p className="font-bold text-xl">{stats.reviews}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Reviews Given</p>
              </div>
            </div>
          </div>
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
