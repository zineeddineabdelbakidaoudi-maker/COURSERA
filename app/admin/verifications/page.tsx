"use client"

import React, { useState } from "react"
import { ShieldCheck, CheckCircle2, XCircle, Search, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const verificationQueue = [
  { id: "1", user: "Karim Belkacem", type: "ID Document", submitted: "2 hours ago", status: "pending" },
  { id: "2", user: "Amine Khaldi", type: "Pro Seller Portfolio", submitted: "5 hours ago", status: "pending" },
  { id: "3", user: "Nassima Bensalem", type: "Address Proof", submitted: "1 day ago", status: "pending" },
]

export default function AdminVerificationsPage() {
  const [search, setSearch] = useState("")

  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Verification Queue</h1>
        <p className="text-muted-foreground">Review and approve user compliance and identity documents.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by user or document type..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Pending Reviews
          </CardTitle>
          <CardDescription>Documents awaiting admin team approval.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {verificationQueue.filter(v => v.user.toLowerCase().includes(search.toLowerCase())).map(item => (
              <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.user}</p>
                    <p className="text-sm text-muted-foreground">{item.type} • Submitted {item.submitted}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Documents</Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />Approve</Button>
                  <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50 gap-1.5"><XCircle className="w-3.5 h-3.5" />Reject</Button>
                </div>
              </div>
            ))}
            {verificationQueue.length === 0 && <div className="p-8 text-center text-muted-foreground">Queue is empty! 🎉</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
