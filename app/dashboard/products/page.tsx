"use client"

import React from "react"
import Link from "next/link"
import { Package, Plus, Eye, Edit, Trash2, Download, Star, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: "1",
    name: "Algerian UI Component Kit",
    type: "Design Kit",
    price: "2,500 DZD",
    sales: 34,
    revenue: "85,000 DZD",
    rating: 4.8,
    status: "live",
    downloads: 34,
    image: null,
  },
  {
    id: "2",
    name: "Business Plan Template Pack",
    type: "Document",
    price: "1,200 DZD",
    sales: 22,
    revenue: "26,400 DZD",
    rating: 4.6,
    status: "live",
    downloads: 22,
    image: null,
  },
  {
    id: "3",
    name: "Instagram Growth Guide",
    type: "E-Book",
    price: "800 DZD",
    sales: 0,
    revenue: "0 DZD",
    rating: null,
    status: "draft",
    downloads: 0,
    image: null,
  },
]

const statusConfig: Record<string, { label: string; class: string }> = {
  live: { label: "Live", class: "bg-green-500/10 text-green-600 border-green-200" },
  draft: { label: "Draft", class: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
  paused: { label: "Paused", class: "bg-gray-500/10 text-gray-600 border-gray-200" },
}

export default function ProductsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">My Products</h1>
          <p className="text-muted-foreground">Manage your digital products and downloads.</p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Products", value: products.length.toString(), icon: Package },
          { label: "Total Sales", value: products.reduce((a, b) => a + b.sales, 0).toString(), icon: Download },
          { label: "Est. Revenue", value: "111,400 DZD", icon: TrendingUp },
        ].map((s, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Products List */}
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {products.map((product) => {
              const status = statusConfig[product.status]
              return (
                <div key={product.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.type} • {product.price}</p>
                      {product.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{product.rating} • {product.downloads} sales</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={status.class}>{status.label}</Badge>
                    <span className="text-sm font-bold text-foreground hidden sm:block">{product.revenue}</span>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
