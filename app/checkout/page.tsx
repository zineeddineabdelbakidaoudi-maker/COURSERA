"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, User, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function CheckoutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Here we would insert an Order record via Supabase
    await new Promise(r => setTimeout(r, 1800))
    router.push("/checkout/success")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">Complete your order details below.</p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="w-4 h-4" />Contact Info</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input name="name" value={form.name} onChange={handleChange} required placeholder="Ahmed Boualem" />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp / Phone</Label>
                    <Input name="phone" value={form.phone} onChange={handleChange} required placeholder="+213 6XX XXX XXX" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><MapPin className="w-4 h-4" />Delivery Address</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Street Address</Label>
                    <Input name="address" value={form.address} onChange={handleChange} required placeholder="12 Rue de l'indépendance" />
                  </div>
                  <div className="space-y-2">
                    <Label>City / Wilaya</Label>
                    <Input name="city" value={form.city} onChange={handleChange} required placeholder="Algiers" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value="Algeria" readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Order notes (optional)</Label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="Any specific instructions..." className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><CreditCard className="w-4 h-4" />Payment Method</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                    <div>
                      <p className="font-semibold">Cash on Delivery (COD)</p>
                      <p className="text-xs text-muted-foreground">Pay when your order is confirmed via WhatsApp</p>
                    </div>
                    <div className="ml-auto"><CheckCircle2 className="w-5 h-5 text-primary" /></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-border shadow-sm sticky top-4">
                <CardHeader><CardTitle>Order Total</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Brand Identity Design</span><span>15,000 DZD</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Figma UI Kit 2026</span><span>4,500 DZD</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (5%)</span><span>975 DZD</span></div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                      <span>Grand Total</span><span className="text-primary">20,475 DZD</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="w-full text-center justify-center py-2 border-green-200 bg-green-500/10 text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Secured · COD · No Upfront Risk
                  </Badge>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
