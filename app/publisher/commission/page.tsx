"use client"

import React, { useState } from "react"
import { Calculator, DollarSign, Percent, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function PublisherCommissionPage() {
  const [price, setPrice] = useState(5000)
  const [publisherRate, setPublisherRate] = useState(5) // Default 5%

  const platformFee = price * 0.10 // Platform takes base 10%
  const publisherCut = (price * (publisherRate / 100))
  const totalDeduction = platformFee + publisherCut
  const sellerEarnings = price - totalDeduction

  return (
    <div className="space-y-8 animate-slide-up max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold mb-1">Commission Calculator</h1>
        <p className="text-muted-foreground">Estimate your earnings as a publisher per product sale.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" />
              Pricing & Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-base">Product Price (DZD)</Label>
                <span className="font-semibold text-primary">{price.toLocaleString()} DZD</span>
              </div>
              <Input 
                type="number" 
                value={price} 
                onChange={(e) => setPrice(Number(e.target.value) || 0)} 
                className="text-lg font-medium"
              />
            </div>
            
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between">
                <Label className="text-base">Your Publisher Rate</Label>
                <span className="font-semibold text-purple-500">{publisherRate}%</span>
              </div>
              <Slider
                value={[publisherRate]}
                onValueChange={(vals) => setPublisherRate(vals[0])}
                max={20}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">Standard publisher commission varies between 2% - 15%.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-muted/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader>
            <CardTitle>Breakdown</CardTitle>
            <CardDescription>How an order of {price} DZD is split</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg"><DollarSign className="w-4 h-4 text-blue-500" /></div>
                <span className="font-medium text-muted-foreground">Platform Fee (10%)</span>
              </div>
              <span className="font-semibold text-foreground">-{platformFee.toLocaleString()} DZD</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg"><Percent className="w-4 h-4 text-purple-600" /></div>
                <span className="font-bold text-purple-700 dark:text-purple-400">Your Cut ({publisherRate}%)</span>
              </div>
              <span className="font-bold text-purple-600 text-lg">+{publisherCut.toLocaleString()} DZD</span>
            </div>

            <div className="flex justify-center py-2"><ArrowRight className="w-5 h-5 text-muted-foreground/40 rotate-90" /></div>

            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-green-500/30">
              <span className="font-semibold text-muted-foreground">Freelancer Takes</span>
              <span className="font-bold text-green-600 text-xl">{sellerEarnings.toLocaleString()} DZD</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
