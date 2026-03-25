"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Package, Clock, ArrowLeft, MessageSquare, Download, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockOrder = {
  id: "ORD-7819",
  service: "Professional Logo Design",
  seller: "Yacine M.",
  sellerUsername: "yacine_design",
  amount: "2,500 DZD",
  date: "Mar 22, 2026",
  deliveryDate: "Mar 29, 2026",
  status: "in_progress",
  description: "A high-quality logo package including 3 concepts, unlimited revisions, and all source files (AI, SVG, PNG).",
  timeline: [
    { label: "Order Placed", date: "Mar 22, 2026", done: true },
    { label: "Seller Confirmed", date: "Mar 22, 2026", done: true },
    { label: "In Progress", date: "Mar 23, 2026", done: true },
    { label: "Ready for Review", date: "Est. Mar 27, 2026", done: false },
    { label: "Delivered", date: "Est. Mar 29, 2026", done: false },
  ]
}

export default function OrderDetailPage() {
  return (
    <div className="space-y-8 max-w-3xl animate-slide-up">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/orders"><ArrowLeft className="w-4 h-4 mr-2" />Back to Orders</Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold mb-1">{mockOrder.service}</h1>
          <p className="text-muted-foreground">Order #{mockOrder.id} • Seller: {mockOrder.seller}</p>
        </div>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">In Progress</Badge>
      </div>

      {/* Timeline */}
      <Card className="border-border shadow-sm">
        <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-0">
            {mockOrder.timeline.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-primary text-primary-foreground" : "bg-muted border-2 border-border"}`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  {i < mockOrder.timeline.length - 1 && <div className={`w-0.5 flex-1 my-1 ${step.done ? "bg-primary" : "bg-border"}`} style={{minHeight: "2rem"}} />}
                </div>
                <div className="pb-4 pt-1">
                  <p className={`font-medium ${step.done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Details + Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{mockOrder.service}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span className="font-bold text-primary">{mockOrder.amount}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ordered</span><span>{mockOrder.date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expected Delivery</span><span>{mockOrder.deliveryDate}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><Badge variant="outline" className="text-xs">Cash on Delivery</Badge></div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full gap-2" asChild>
              <Link href="/dashboard/buyer/messages"><MessageSquare className="w-4 h-4" />Message Seller</Link>
            </Button>
            <Button variant="outline" className="w-full gap-2" disabled>
              <Download className="w-4 h-4" />Download Files (Awaiting Delivery)
            </Button>
            <Button variant="outline" className="w-full gap-2" disabled>
              <Star className="w-4 h-4" />Leave a Review (After Delivery)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
