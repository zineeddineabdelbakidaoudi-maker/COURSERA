"use client"

import { ShoppingBag, Clock, CheckCircle2, AlertTriangle, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const orders = [
  { id: "#ORD-1042", service: "Brand Identity Design", seller: "Yacine M.", price: "15,000 DZD", status: "in_progress", date: "Mar 20, 2026" },
  { id: "#ORD-1031", service: "SEO Copywriting x5", seller: "Nassima B.", price: "5,500 DZD", status: "completed", date: "Mar 10, 2026" },
  { id: "#ORD-1019", service: "React Landing Page", seller: "Karim B.", price: "25,000 DZD", status: "completed", date: "Feb 28, 2026" },
  { id: "#ORD-1008", service: "Social Media Kit", seller: "Amine K.", price: "8,000 DZD", status: "disputed", date: "Feb 14, 2026" },
]

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle2 },
  disputed: { label: "Disputed", color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertTriangle },
}

export default function BuyerOrdersPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">My Orders</h1>
        <p className="text-muted-foreground">Track all your service and product orders.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Active", count: 1, color: "text-blue-500" }, { label: "Completed", count: 2, color: "text-green-500" }, { label: "Disputed", count: 1, color: "text-red-500" }].map(s => (
          <Card key={s.label} className="border-border shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-muted-foreground font-semibold">Order</th>
                  <th className="text-left p-4 text-muted-foreground font-semibold hidden sm:table-cell">Seller</th>
                  <th className="text-left p-4 text-muted-foreground font-semibold">Status</th>
                  <th className="text-right p-4 text-muted-foreground font-semibold">Price</th>
                  <th className="text-right p-4 text-muted-foreground font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(o => {
                  const s = STATUS_MAP[o.status]
                  const SIcon = s.icon
                  return (
                    <tr key={o.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <p className="font-semibold">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.service}</p>
                        <p className="text-xs text-muted-foreground">{o.date}</p>
                      </td>
                      <td className="p-4 hidden sm:table-cell text-muted-foreground">{o.seller}</td>
                      <td className="p-4">
                        <Badge variant="outline" className={`gap-1.5 ${s.color}`}>
                          <SIcon className="w-3 h-3" />{s.label}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-semibold">{o.price}</td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Eye className="w-3.5 h-3.5" />View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
