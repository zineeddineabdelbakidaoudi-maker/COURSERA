"use client"

import React, { useState } from "react"
import { Package, Search, ExternalLink, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Digital Products</h1>
        <p className="text-muted-foreground">Monitor and manage all digital products across the platform.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by product name..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="border-border shadow-sm">
        <CardContent className="p-16 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No digital products found</h3>
          <p className="text-muted-foreground max-w-sm mx-auto mt-2">The digital product directory is empty. When sellers create products, they will appear here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
