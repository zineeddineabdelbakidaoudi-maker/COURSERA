"use client"

import React from "react"
import Link from "next/link"
import { 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  BadgeCheck,
  Clock,
  ChevronRight,
  Star,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BuyerDashboardPage() {
  const stats = [
    { label: "Active Orders", value: "2", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Saved Services", value: "12", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Unread Messages", value: "5", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
    { label: "Reviews Given", value: "8", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ]

  const recentOrders = [
    { id: "ORD-7819", service: "Professional Logo Design", seller: "Yacine M.", status: "In Progress", amount: "2,500 DZD", date: "Mar 22, 2026" },
    { id: "ORD-7792", service: "Business Website Dev", seller: "Karim B.", status: "Pending", amount: "15,000 DZD", date: "Mar 20, 2026" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up py-8 px-4 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2 text-foreground">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Manage your purchases, saved services, and communication with sellers.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/services">
              <Search className="w-4 h-4 mr-2" />
              Find Services
            </Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Store
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Your Recent Orders</CardTitle>
                  <CardDescription>View status and manage your active orders</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All Orders
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.service}</p>
                        <p className="text-sm text-muted-foreground">Order: {order.id} • Seller: {order.seller}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-8">
                      <div className="text-right">
                        <p className="font-mono font-bold text-foreground">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                      <Badge className={order.status === "In Progress" ? "bg-blue-500/10 text-blue-600" : "bg-yellow-500/10 text-yellow-600"}>
                        {order.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Saved Services Shortcut */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Continue Exploring</CardTitle>
              <CardDescription>Based on your saved services and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="group cursor-pointer border border-border rounded-xl p-3 hover:border-primary/30 transition-all flex items-center gap-3">
                    <div className="w-16 h-12 rounded-lg bg-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">Professional Graphic Design</p>
                      <p className="text-xs text-primary font-bold">1,500 DZD</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Become a Seller</CardTitle>
              <CardDescription>Want to offer your skills on Digit Hup?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Join our community of professionals and start earning from your digital services and products.
              </p>
              <Button className="w-full gradient-primary text-white shadow-glow" asChild>
                <Link href="/become-seller">Activate Seller Mode</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Need Assistance?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                <Clock className="w-4 h-4 mr-2" />
                Help Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
