"use client"

import { BarChart3, TrendingUp, DollarSign, Eye, Star, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  { label: "Total Earnings", value: "48,500 DZD", change: "+12%", up: true, icon: DollarSign, color: "text-green-500" },
  { label: "Profile Views", value: "1,240", change: "+23%", up: true, icon: Eye, color: "text-blue-500" },
  { label: "Orders Completed", value: "34", change: "+5%", up: true, icon: BarChart3, color: "text-purple-500" },
  { label: "Avg. Rating", value: "4.8 ★", change: "-0.1", up: false, icon: Star, color: "text-amber-500" },
]

const monthly = [
  { month: "Oct", val: 12000 }, { month: "Nov", val: 18500 }, { month: "Dec", val: 9000 },
  { month: "Jan", val: 22000 }, { month: "Feb", val: 31000 }, { month: "Mar", val: 48500 },
]
const maxVal = Math.max(...monthly.map(m => m.val))

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Analytics</h1>
        <p className="text-muted-foreground">Track your performance and earnings over time.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`w-5 h-5 ${s.color}`} />
                  <span className={`text-xs font-semibold flex items-center gap-1 ${s.up ? "text-green-500" : "text-red-500"}`}>
                    {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {s.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Monthly Earnings (DZD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">{(m.val / 1000).toFixed(0)}k</span>
                <div
                  className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                  style={{ height: `${(m.val / maxVal) * 100}%`, minHeight: 8 }}
                />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Top Performing Services</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {["Brand Identity Design", "Logo Redesign", "UI Mockup Pack"].map((s, i) => (
              <div key={s} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <span className="text-sm font-medium">{s}</span>
                </div>
                <span className="text-sm font-semibold text-primary">{[24, 17, 9][i]} orders</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle className="text-base">Traffic Sources</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[{ src: "Search", pct: 62 }, { src: "Direct", pct: 28 }, { src: "Social", pct: 10 }].map((t) => (
              <div key={t.src}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{t.src}</span>
                  <span className="text-muted-foreground">{t.pct}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${t.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
