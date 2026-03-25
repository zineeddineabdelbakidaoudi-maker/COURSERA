"use client"

import { Package, Tags, Users, TrendingUp, Plus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
  { label: "Products Published", value: "12", icon: Package, color: "text-purple-500 bg-purple-500/10" },
  { label: "Categories Curated", value: "5", icon: Tags, color: "text-blue-500 bg-blue-500/10" },
  { label: "Linked Sellers", value: "28", icon: Users, color: "text-green-500 bg-green-500/10" },
  { label: "Total Sales", value: "247", icon: TrendingUp, color: "text-amber-500 bg-amber-500/10" },
]

const recentProducts = [
  { title: "2026 UI Design Kit", type: "Template", status: "live", sales: 42 },
  { title: "Freelance Starter Pack", type: "Bundle", status: "live", sales: 89 },
  { title: "Arabic SEO Guide", type: "E-book", status: "draft", sales: 0 },
]

export default function PublisherOverviewPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Publisher Overview</h1>
          <p className="text-muted-foreground">Manage your published content and curated categories.</p>
        </div>
        <Button asChild className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Link href="/publisher/products"><Plus className="w-4 h-4" /> Publish Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
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
          <Button variant="ghost" size="sm" asChild><Link href="/publisher/products" className="gap-1">View all <ArrowRight className="w-3 h-3" /></Link></Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {recentProducts.map((p, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.type} · {p.sales} sales</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.status === "live" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
