"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare,
  Eye,
  Calendar,
  Loader2,
  ShoppingBag,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-600 border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>
    case "in_progress":
      return <Badge className="bg-blue-500/10 text-blue-600 border-0"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>
    case "pending_requirements":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-0"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>
    case "delivered":
      return <Badge className="bg-purple-500/10 text-purple-600 border-0"><CheckCircle2 className="h-3 w-3 mr-1" />Delivered</Badge>
    case "cancelled":
      return <Badge className="bg-red-500/10 text-red-600 border-0"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
    default:
      return <Badge variant="secondary" className="capitalize">{status?.replace("_", " ")}</Badge>
  }
}

export default function OrdersPage() {
  const supabase = createClient()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from("Order")
      .select("*, buyer:Profile!buyer_id(full_name, avatar_url), service:Service(title)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.service?.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      o.id?.toLowerCase().includes(search.toLowerCase())
    if (activeTab === "all") return matchesSearch
    return matchesSearch && o.status === activeTab
  })

  const counts = {
    all: orders.length,
    pending_requirements: orders.filter(o => o.status === "pending_requirements").length,
    in_progress: orders.filter(o => o.status === "in_progress").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your client orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "In Progress", value: counts.in_progress, color: "bg-blue-500/10", icon: Clock, iconColor: "text-blue-500" },
          { label: "Pending", value: counts.pending_requirements, color: "bg-yellow-500/10", icon: AlertCircle, iconColor: "text-yellow-500" },
          { label: "Delivered", value: counts.delivered, color: "bg-purple-500/10", icon: CheckCircle2, iconColor: "text-purple-500" },
          { label: "Completed", value: counts.completed, color: "bg-green-500/10", icon: CheckCircle2, iconColor: "text-green-500" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${s.color} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders by service or buyer..."
              className="pl-10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending_requirements" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pending ({counts.pending_requirements})</TabsTrigger>
          <TabsTrigger value="in_progress" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">In Progress ({counts.in_progress})</TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Delivered ({counts.delivered})</TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Completed ({counts.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order List</CardTitle>
              <CardDescription>{filteredOrders.length} order{filteredOrders.length !== 1 && "s"} found</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="font-medium text-muted-foreground">
                    {orders.length === 0 ? "No orders yet" : "No orders match your search"}
                  </p>
                  {orders.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-1">Orders from clients will appear here.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                      {/* Buyer */}
                      <div className="flex items-center gap-3 lg:w-48">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={order.buyer?.avatar_url || ""} />
                          <AvatarFallback>{order.buyer?.full_name?.charAt(0) || "B"}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{order.buyer?.full_name || "Buyer"}</p>
                          <p className="text-xs text-muted-foreground">{order.id?.slice(0, 8)}</p>
                        </div>
                      </div>

                      {/* Service */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{order.service?.title || order.package_name || "Order"}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {order.package_name && (
                            <Badge variant="secondary" className="text-xs">{order.package_name}</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Amount & Status & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-48">
                        <div className="text-right">
                          <p className="font-semibold">{parseFloat(order.price_dzd || 0).toLocaleString()} DZD</p>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
