"use client"

import React, { useState } from "react"
import Link from "next/link"
import { ShoppingBag, ChevronRight, Search, Filter, Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const statusConfig: Record<string, { label: string; icon: any; class: string }> = {
  pending: { label: "Pending", icon: Clock, class: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  in_progress: { label: "In Progress", icon: Package, class: "bg-blue-500/10 text-blue-600 border-blue-200" },
  completed: { label: "Completed", icon: CheckCircle, class: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, class: "bg-red-500/10 text-red-500 border-red-200" },
  delivered: { label: "Delivered", icon: Truck, class: "bg-purple-500/10 text-purple-600 border-purple-200" },
}

const orders = [
  { id: "ORD-7819", service: "Professional Logo Design", seller: "Yacine M.", status: "in_progress", amount: "2,500 DZD", date: "Mar 22, 2026", deliveryDate: "Mar 29, 2026" },
  { id: "ORD-7792", service: "Business Website Development", seller: "Karim B.", status: "pending", amount: "15,000 DZD", date: "Mar 20, 2026", deliveryDate: "Apr 5, 2026" },
  { id: "ORD-7744", service: "Arabic Content Writing (10 articles)", seller: "Nassima B.", status: "completed", amount: "4,500 DZD", date: "Mar 10, 2026", deliveryDate: "Mar 17, 2026" },
  { id: "ORD-7701", service: "Video Editing (3 minutes)", seller: "Amine K.", status: "delivered", amount: "3,000 DZD", date: "Mar 2, 2026", deliveryDate: "Mar 9, 2026" },
]

export default function BuyerOrdersPage() {
  const [search, setSearch] = useState("")
  const filtered = orders.filter(o =>
    o.service.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Orders</h1>
        <p className="text-muted-foreground">Track and manage all your purchases.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter by Status
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="border-border"><CardContent className="p-16 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No orders found</p>
        </CardContent></Card>
      ) : (
        <Card className="border-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border bg-muted/30">
            <CardTitle>Order History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filtered.map((order) => {
                const status = statusConfig[order.status]
                const Icon = status.icon
                return (
                  <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 border border-primary/10">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{order.service}</p>
                        <p className="text-sm text-muted-foreground">{order.id} • {order.seller}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Ordered: {order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="text-right">
                        <p className="font-bold text-foreground">{order.amount}</p>
                        <p className="text-xs text-muted-foreground">Delivery: {order.deliveryDate}</p>
                      </div>
                      <Badge variant="outline" className={`gap-1.5 ${status.class}`}>
                        <Icon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" asChild>
                        <Link href={`/dashboard/orders/${order.id}`}><ChevronRight className="w-4 h-4" /></Link>
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
