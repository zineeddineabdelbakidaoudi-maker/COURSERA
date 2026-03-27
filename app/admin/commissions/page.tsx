"use client"

import React, { useState } from "react"
import { Calculator, DollarSign, Percent, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

export default function AdminCommissionPage() {
  const [price, setPrice] = useState(10000)
  const [platformRate, setPlatformRate] = useState(10) // Admin sets platform default
  const [publisherRate, setPublisherRate] = useState(5)

  const platformFee = (price * (platformRate / 100))
  const publisherCut = (price * (publisherRate / 100))
  const totalDeduction = platformFee + publisherCut
  const sellerEarnings = price - totalDeduction

  return (
    <div className="space-y-8 animate-slide-up max-w-5xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Commission Engine</h1>
          <p className="text-muted-foreground">Global view of platform fee splits and publisher rates.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">System Live</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Global Fee Configurator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-base">Simulated Product Price (DZD)</Label>
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
                <Label className="text-base">Platform Base Fee</Label>
                <span className="font-semibold text-blue-500">{platformRate}%</span>
              </div>
              <Slider
                value={[platformRate]}
                onValueChange={(vals) => setPlatformRate(vals[0])}
                max={30}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">The flat percentage the platform takes on every transaction.</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between">
                <Label className="text-base">Publisher Cut</Label>
                <span className="font-semibold text-purple-500">{publisherRate}%</span>
              </div>
              <Slider
                value={[publisherRate]}
                onValueChange={(vals) => setPublisherRate(vals[0])}
                max={20}
                step={1}
                className="py-2"
              />
              <p className="text-xs text-muted-foreground">The percentage given to publishers for featured/published products.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm bg-muted/20 relative overflow-hidden h-fit">
          <CardHeader>
            <CardTitle>Transaction Model Breakdown</CardTitle>
            <CardDescription>Simulated payout on {price} DZD purchase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg"><DollarSign className="w-4 h-4 text-blue-600" /></div>
                <span className="font-bold text-blue-700 dark:text-blue-400">Platform Revenue ({platformRate}%)</span>
              </div>
              <span className="font-bold text-blue-600 text-lg">+{platformFee.toLocaleString()} DZD</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg"><Percent className="w-4 h-4 text-purple-500" /></div>
                <span className="font-medium text-muted-foreground">Publisher Payment ({publisherRate}%)</span>
              </div>
              <span className="font-semibold text-foreground">-{publisherCut.toLocaleString()} DZD</span>
            </div>

            <div className="flex justify-center py-2"><ArrowRight className="w-5 h-5 text-muted-foreground/40 rotate-90" /></div>

            <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <span className="font-bold text-green-700 dark:text-green-400">Seller Payout</span>
              <span className="font-bold text-green-600 text-xl">{sellerEarnings.toLocaleString()} DZD</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
