"use client"

import React, { useState } from "react"
import { CheckCircle2, XCircle, Eye, Search, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const services = [
  { id: "1", title: "Professional Logo Design", seller: "Yacine M.", category: "Graphic Design", price: "2,500 DZD", submitted: "Mar 23, 2026", status: "pending_review" },
  { id: "2", title: "Full-Stack E-commerce App", seller: "Karim B.", category: "Development", price: "40,000 DZD", submitted: "Mar 22, 2026", status: "pending_review" },
  { id: "3", title: "Arabic SEO Content Writing", seller: "Nassima B.", category: "Writing", price: "1,800 DZD", submitted: "Mar 21, 2026", status: "pending_review" },
]

export default function AdminServicesPage() {
  const [search, setSearch] = useState("")
  const filtered = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Service Approvals</h1>
        <p className="text-muted-foreground">Review and approve or reject services submitted by sellers.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            Pending Review ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.map(service => (
              <div key={service.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{service.seller.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{service.title}</p>
                    <p className="text-sm text-muted-foreground">{service.seller} • {service.category} • {service.price}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {service.submitted}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-1.5"><Eye className="w-3.5 h-3.5" />Preview</Button>
                  <Button size="sm" className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />Approve
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50">
                    <XCircle className="w-3.5 h-3.5" />Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
