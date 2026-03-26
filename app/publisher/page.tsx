"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package, Tags, Users, TrendingUp, Plus, ArrowRight,
  Loader2, BarChart2, Eye,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function PublisherOverviewPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [stats, setStats] = useState({ total: 0, live: 0, draft: 0, sales: 0 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: prof } = await supabase.from("Profile").select("full_name, avatar_url").eq("id", user.id).single()
    setProfile(prof)

    const { data: prods } = await supabase
      .from("DigitalProduct")
      .select("id, title, type, status, created_at")
      .eq("publisher_id", user.id)
      .order("created_at", { ascending: false })

    setProducts(prods || [])

    const live = (prods || []).filter(p => p.status === "live").length
    const draft = (prods || []).filter(p => p.status === "draft").length

    // Count purchases for my products
    const productIds = (prods || []).map(p => p.id)
    let salesCount = 0
    if (productIds.length > 0) {
      const { count } = await supabase
        .from("ProductPurchase")
        .select("id", { count: "exact" })
        .in("product_id", productIds)
      salesCount = count || 0
    }

    setStats({ total: (prods || []).length, live, draft, sales: salesCount })
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </div>
  )

  const displayName = profile?.full_name?.split(" ")[0] || "Publisher"

  const statCards = [
    { label: "Products Published", value: stats.live, icon: Package, color: "text-purple-500 bg-purple-500/10" },
    { label: "Drafts", value: stats.draft, icon: Tags, color: "text-blue-500 bg-blue-500/10" },
    { label: "Total Products", value: stats.total, icon: BarChart2, color: "text-green-500 bg-green-500/10" },
    { label: "Total Sales", value: stats.sales, icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Publisher Overview</h1>
          <p className="text-muted-foreground">Welcome back, {displayName}. Manage your published content.</p>
        </div>
        <Button asChild className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Link href="/publisher/products"><Plus className="w-4 h-4" /> Publish Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${s.color}`}><Icon className="w-5 h-5" /></div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Products</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/publisher/products" className="gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No products yet</p>
              <p className="text-sm mt-1">Start by publishing your first digital product.</p>
              <Button asChild className="mt-4 bg-purple-600 hover:bg-purple-700" size="sm">
                <Link href="/publisher/products">Publish Now</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors px-1 rounded">
                  <div>
                    <p className="font-medium text-sm">{p.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.type} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <Badge className={p.status === "live" ? "bg-green-500/10 text-green-600 capitalize" : "bg-yellow-500/10 text-yellow-600 capitalize"}>
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
