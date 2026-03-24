"use client"

import React from "react"
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Download,
  ArrowUpRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PublisherOverviewPage() {
  const stats = [
    { label: "Total Earnings", value: "145,000 DZD", icon: DollarSign, trend: "+24%" },
    { label: "Active Products", value: "12", icon: Package, trend: "0" },
    { label: "Total Sales", value: "840", icon: TrendingUp, trend: "+12%" },
    { label: "Downloads", value: "3,200", icon: Download, trend: "+5%" },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-2">Publisher Overview</h1>
          <p className="text-muted-foreground">Manage your digital products, courses, and templates.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-white gap-2">
          <Plus className="w-4 h-4" />
          Create New Product
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-accent/10 text-accent">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend.startsWith('+') ? 'text-success' : 'text-muted-foreground'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') && <ArrowUpRight className="w-4 h-4" />}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-semibold tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Sales List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Sales</h3>
          <button className="text-sm text-accent font-medium hover:underline">View All Sales</button>
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="p-4 sm:p-6 flex items-center justify-between hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-accent/70" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Modern UI Kit Template</p>
                  <p className="text-sm text-muted-foreground">Purchased by user_4829</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium text-foreground">2,500 DZD</p>
                <p className="text-xs text-muted-foreground">Today at 14:30</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
