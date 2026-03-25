"use client"

import React, { useState } from "react"
import { ShoppingBag, Clock, CheckCircle2, AlertTriangle, Eye, X, MessageSquare, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const orders = [
  {
    id: "#ORD-1042", service: "Brand Identity Design", seller: "Yacine M.",
    price: "15,000 DZD", status: "in_progress", date: "Mar 20, 2026",
    deliveryDate: "Apr 3, 2026", requirements: "Logo, business card, brand guidelines",
    notes: "Please use dark blue and gold palette.", milestones: ["Brief approved", "First concept sent", "Revision requested"]
  },
  {
    id: "#ORD-1031", service: "SEO Copywriting x5", seller: "Nassima B.",
    price: "5,500 DZD", status: "completed", date: "Mar 10, 2026",
    deliveryDate: "Mar 14, 2026", requirements: "5 Arabic SEO articles, 500 words each",
    notes: "Topics sent via message.", milestones: ["Brief approved", "Articles delivered", "Completed ✓"]
  },
  {
    id: "#ORD-1019", service: "React Landing Page", seller: "Karim B.",
    price: "25,000 DZD", status: "completed", date: "Feb 28, 2026",
    deliveryDate: "Mar 8, 2026", requirements: "Full landing page with animations",
    notes: "Used Next.js + Tailwind", milestones: ["Kickoff call", "Draft sent", "Completed ✓"]
  },
  {
    id: "#ORD-1008", service: "Social Media Kit", seller: "Amine K.",
    price: "8,000 DZD", status: "disputed", date: "Feb 14, 2026",
    deliveryDate: "Feb 21, 2026", requirements: "10 social media templates",
    notes: "Delivered work did not match brief.", milestones: ["Brief approved", "Delivered (disputed)"]
  },
]

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Clock },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle2 },
  disputed: { label: "Disputed", color: "bg-red-500/10 text-red-600 border-red-200", icon: AlertTriangle },
}

export default function BuyerOrdersPage() {
  const [selected, setSelected] = useState<(typeof orders)[0] | null>(null)

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
                        <p className="text-xs text-muted-foreground line-clamp-1">{o.service}</p>
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
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSelected(o)}>
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

      {/* ORDER DETAIL MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-bold text-lg">{selected.id}</h2>
                <p className="text-sm text-muted-foreground">{selected.service}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Seller</p>
                  <p className="font-semibold">{selected.seller}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                  <p className="font-bold text-primary">{selected.price}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Order Date</p>
                  <p className="font-semibold">{selected.date}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Delivery Date</p>
                  <p className="font-semibold">{selected.deliveryDate}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Milestones</p>
                <div className="space-y-2">
                  {selected.milestones.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${i === selected.milestones.length - 1 ? "bg-primary animate-pulse" : "bg-green-500"}`} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.notes && (
                <div className="bg-amber-500/5 border border-amber-200 rounded-xl p-4 text-sm">
                  <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Notes</p>
                  <p className="text-foreground/80">{selected.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {selected.status === "in_progress" && (
                  <Button variant="outline" className="flex-1 gap-2"><MessageSquare className="w-4 h-4" />Message Seller</Button>
                )}
                {selected.status === "completed" && (
                  <Button className="flex-1 gap-2"><Package className="w-4 h-4" />Download Files</Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
