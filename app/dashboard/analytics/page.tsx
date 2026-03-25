"use client"

import React from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, Eye, MousePointer, DollarSign, ArrowUpRight, ArrowDownRight, Users, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  { label: "Total Revenue", value: "48,200 DZD", change: "+12%", up: true, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Profile Views", value: "2,840", change: "+8%", up: true, icon: Eye, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Service Clicks", value: "1,230", change: "-3%", up: false, icon: MousePointer, color: "text-orange-500", bg: "bg-orange-500/10" },
  { label: "New Clients", value: "24", change: "+18%", up: true, icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
]

const topServices = [
  { name: "Logo Design Package", views: 820, orders: 12, revenue: "18,000 DZD", rating: 4.9 },
  { name: "Social Media Kit", views: 540, orders: 8, revenue: "12,800 DZD", rating: 4.7 },
  { name: "UI/UX Design", views: 310, orders: 4, revenue: "17,400 DZD", rating: 5.0 },
]

const revenueData = [
  { month: "Oct", value: 35 },
  { month: "Nov", value: 52 },
  { month: "Dec", value: 40 },
  { month: "Jan", value: 61 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 78 },
]

export default function AnalyticsPage() {
  const maxValue = Math.max(...revenueData.map(d => d.value))

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Analytics</h1>
        <p className="text-muted-foreground">Track your performance and growth over time.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <Badge variant="outline" className={`text-xs ${stat.up ? "text-green-600 border-green-200" : "text-red-500 border-red-200"}`}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue in DZD (last 6 months)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-48">
              {revenueData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-all duration-300 cursor-pointer"
                    style={{ height: `${(d.value / maxValue) * 100}%` }}
                    title={`${d.month}: ${d.value}k DZD`}
                  />
                  <span className="text-xs text-muted-foreground">{d.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Top Performing</CardTitle>
            <CardDescription>Services ranked by revenue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topServices.map((service, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium leading-tight">{service.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs ml-2 shrink-0">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span>{service.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{service.views} views • {service.orders} orders</span>
                  <span className="text-green-600 font-medium">{service.revenue}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(service.orders / 15) * 100}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-6 flex items-start gap-4">
          <TrendingUp className="w-8 h-8 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Boost Your Visibility</h3>
            <p className="text-sm text-muted-foreground">Add portfolio samples to your services to increase profile views by up to 40%. Complete your profile with a professional description and add your response rate.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
