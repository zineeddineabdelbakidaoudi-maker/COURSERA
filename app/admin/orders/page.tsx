"use client"

import React, { useState } from "react"
import { Search, ShoppingCart, AlertCircle, FileText, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Orders & Disputes</h1>
          <p className="text-muted-foreground">Monitor platform transactions and handle active disputes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Orders</h3>
            <p className="text-2xl font-bold">1,204</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">In Progress</h3>
            <p className="text-2xl font-bold">45</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm border-l-4 border-l-destructive">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Active Disputes</h3>
            <p className="text-2xl font-bold">2</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by Order ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-16 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No recent orders</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">When platform activity resumes, orders will be listed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
