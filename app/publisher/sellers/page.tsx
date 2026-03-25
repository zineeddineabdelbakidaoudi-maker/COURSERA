"use client"

import { Search, Users, Star, Package, ExternalLink, MessageSquare, Award, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"
import Link from "next/link"

const sellers = [
  { name: "Yacine Mansouri", username: "yacine_m", services: 4, rating: 5.0, orders: 142, joined: "Jan 2025", category: "Design", level: "Elite", verified: true },
  { name: "Karim Boudiaf", username: "karim_b", services: 3, rating: 4.9, orders: 89, joined: "Mar 2025", category: "Web Dev", level: "Pro", verified: true },
  { name: "Nassima Bensaid", username: "nassima_b", services: 2, rating: 4.8, orders: 214, joined: "Jun 2025", category: "Writing", level: "Elite", verified: false },
]

const levelColor: Record<string, string> = {
  Elite: "bg-amber-500/10 text-amber-600 border-amber-200",
  Pro: "bg-blue-500/10 text-blue-600 border-blue-200",
  Rising: "bg-green-500/10 text-green-600 border-green-200",
}

export default function PublisherSellersPage() {
  const [q, setQ] = useState("")
  const filtered = sellers.filter(s => s.name.toLowerCase().includes(q.toLowerCase()) || s.category.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Linked Sellers</h1>
          <p className="text-muted-foreground">Sellers operating within your curated categories.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9 w-64" placeholder="Search sellers..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((seller, i) => (
          <Card key={i} className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">{seller.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-base truncate">{seller.name}</p>
                    {seller.verified && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">@{seller.username}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="outline" className={`text-xs ${levelColor[seller.level]}`}>{seller.level}</Badge>
                    <Badge variant="outline" className="text-xs">{seller.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[{ label: "Services", val: seller.services, icon: Package }, { label: "Rating", val: `${seller.rating}★`, icon: Star }, { label: "Orders", val: seller.orders, icon: Award }].map(s => {
                  const Icon = s.icon
                  return (
                    <div key={s.label} className="bg-muted/30 rounded-xl p-3 text-center">
                      <p className="font-bold text-base">{s.val}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5" asChild>
                  <Link href={`/sellers/${seller.username}`}><ExternalLink className="w-3.5 h-3.5" />Profile</Link>
                </Button>
                <Button size="sm" className="flex-1 gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
