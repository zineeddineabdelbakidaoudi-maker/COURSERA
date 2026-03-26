"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  ShoppingBag,
  Eye,
  Star,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar,
  Plus,
  Loader2,
  Briefcase,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>
    case "in_progress":
      return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
    case "pending_requirements":
      return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>
    case "delivered":
      return <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20"><CheckCircle2 className="h-3 w-3 mr-1" />Delivered</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({ earnings: 0, activeOrders: 0, services: 0, avgRating: 0, reviewCount: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [recentMessages, setRecentMessages] = useState<any[]>([])
  const [topServices, setTopServices] = useState<any[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Profile
    const { data: prof } = await supabase.from("Profile").select("full_name, avatar_url, role, seller_level, username").eq("id", user.id).single()
    setProfile(prof)

    // Orders where I am the seller
    const { data: orders } = await supabase.from("Order").select("*, buyer:Profile!buyer_id(full_name, avatar_url), service:Service(title)").eq("seller_id", user.id).order("created_at", { ascending: false }).limit(5)
    setRecentOrders(orders || [])

    const activeCount = (orders || []).filter(o => o.status === "in_progress" || o.status === "pending_requirements").length
    const completedOrders = (orders || []).filter(o => o.status === "completed")
    const totalEarnings = completedOrders.reduce((sum: number, o: any) => sum + parseFloat(o.price_dzd || 0), 0)

    // My services
    const { data: services } = await supabase.from("Service").select("id, title, status").eq("seller_id", user.id)
    setTopServices((services || []).slice(0, 5))

    // Reviews about me
    const { data: reviews } = await supabase.from("Review").select("rating_overall").eq("reviewed_user_id", user.id)
    const reviewCount = (reviews || []).length
    const avgRating = reviewCount > 0 ? ((reviews || []).reduce((s: number, r: any) => s + r.rating_overall, 0) / reviewCount).toFixed(1) : "0"

    // Recent conversations
    const { data: conversations } = await supabase.from("Conversation").select("id, participant_ids, last_message_at, Message(content, sender_id, created_at)").contains("participant_ids", [user.id]).order("last_message_at", { ascending: false }).limit(3)
    
    const enhancedConvs = await Promise.all((conversations || []).map(async (c: any) => {
      const otherId = c.participant_ids.find((id: string) => id !== user.id) || user.id
      const { data: otherProfile } = await supabase.from("Profile").select("full_name, avatar_url").eq("id", otherId).single()
      const lastMsg = c.Message?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
      return {
        ...c,
        otherUser: otherProfile || { full_name: "Unknown" },
        lastMessageText: lastMsg?.content || "No messages yet",
        lastMessageTime: lastMsg?.created_at ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""
      }
    }))
    setRecentMessages(enhancedConvs)

    setStats({
      earnings: totalEarnings,
      activeOrders: activeCount,
      services: (services || []).length,
      avgRating: parseFloat(avgRating as string),
      reviewCount
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

  const displayName = profile?.full_name || "Seller"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName.split(" ")[0]}!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">
              <Calendar className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/services/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Service
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Earnings", value: `${stats.earnings.toLocaleString()} DZD`, icon: DollarSign, desc: "from completed orders" },
          { title: "Active Orders", value: stats.activeOrders.toString(), icon: ShoppingBag, desc: "orders in progress" },
          { title: "My Services", value: stats.services.toString(), icon: Briefcase, desc: "published services" },
          { title: "Average Rating", value: stats.avgRating > 0 ? stats.avgRating.toString() : "N/A", icon: Star, desc: `from ${stats.reviewCount} reviews` },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Orders */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 className="font-semibold text-lg">Recent Orders</h3>
              <p className="text-sm text-muted-foreground">Your latest seller orders</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <CardContent className="pt-0">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No orders yet</p>
                <p className="text-sm">Orders from buyers will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={order.buyer?.avatar_url || ""} />
                        <AvatarFallback>{order.buyer?.full_name?.charAt(0) || "B"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{order.service?.title || order.package_name || "Order"}</p>
                        <p className="text-xs text-muted-foreground">{order.buyer?.full_name} • {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(order.status)}
                      <span className="font-bold text-sm">{parseFloat(order.price_dzd).toLocaleString()} DZD</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Messages */}
          <Card>
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="font-semibold">Messages</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/messages" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <CardContent className="pt-0">
              {recentMessages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentMessages.map((msg: any) => (
                    <Link key={msg.id} href={`/dashboard/messages?id=${msg.id}`} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <Avatar className="h-8 w-8 mt-0.5">
                        <AvatarImage src={msg.otherUser?.avatar_url || ""} />
                        <AvatarFallback>{msg.otherUser?.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium truncate">{msg.otherUser?.full_name}</p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">{msg.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{msg.lastMessageText}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Services */}
          <Card>
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="font-semibold">My Services</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/services" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <CardContent className="pt-0">
              {topServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No services published yet</p>
                  <Button variant="link" size="sm" asChild className="mt-2">
                    <Link href="/dashboard/services/new">Create your first service</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {topServices.map((svc: any) => (
                    <div key={svc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <p className="text-sm font-medium truncate flex-1">{svc.title}</p>
                      <Badge variant="outline" className="text-xs capitalize ml-2">{svc.status}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
