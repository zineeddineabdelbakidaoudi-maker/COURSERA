"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, User, MapPin, Phone, CheckCircle2, Loader2, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

export default function CheckoutPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" })
  const [requirementsAnswers, setRequirementsAnswers] = useState<Record<string, string[]>>({})

  useEffect(() => {
    async function fetchCart() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data } = await supabase.from('CartItem')
        .select('*, service:Service(*), product:DigitalProduct(*)')
        .eq('user_id', user.id)
      
      if (data && data.length > 0) {
        const mapped = data.map((item: any) => ({
          cart_id: item.id,
          id: item.service_id || item.product_id,
          title: item.item_type === 'service' ? item.service?.title : item.product?.title,
          price: item.addons?.price || (item.item_type === 'service' ? 15000 : 4500),
          qty: item.quantity || 1,
          type: item.item_type,
          seller_id: item.item_type === 'service' ? item.service?.seller_id : item.product?.publisher_id,
          package_name: item.package_name || 'Basic',
          order_requirements: item.service?.order_requirements || []
        }))
        setItems(mapped)

        // Initialize empty requirements answers for services
        const initialAnswers: Record<string, string[]> = {}
        mapped.forEach(item => {
          if (item.type === 'service' && Array.isArray(item.order_requirements)) {
            initialAnswers[item.id] = new Array(item.order_requirements.length).fill("")
          }
        })
        setRequirementsAnswers(initialAnswers)
      } else {
        router.push("/cart")
      }
      setPageLoading(false)
    }
    fetchCart()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || items.length === 0) return

    let allSuccess = true

    for (const item of items) {
      if (item.type === 'service') {
        const orderNumber = `DH-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`
        const fee = Math.round(item.price * 0.05)
        const payout = item.price - fee
        const { error } = await supabase.from('Order').insert({
          id: crypto.randomUUID(),
          order_number: orderNumber,
          buyer_id: user.id,
          seller_id: item.seller_id,
          service_id: item.id,
          package_name: item.package_name,
          price_dzd: item.price,
          platform_fee_dzd: fee,
          seller_payout_dzd: payout,
          requirements_data: { 
            notes: form.notes, 
            address: form.address, 
            phone: form.phone,
            answers: requirementsAnswers[item.id] || []
          },
          status: 'pending_requirements',
          delivery_files: []
        })
        if (error) {
          console.error("Order Insert Error:", error)
          window.localStorage.setItem('lastCheckoutError', error.message || JSON.stringify(error))
          allSuccess = false
        }
      } else if (item.type === 'product') {
        const fee = Math.round(item.price * 0.05)
        const payout = item.price - fee
        const token = `dl_${Math.random().toString(36).substring(2, 15)}`
        const { error } = await supabase.from('ProductPurchase').insert({
          id: crypto.randomUUID(),
          buyer_id: user.id,
          product_id: item.id,
          price_paid_dzd: item.price,
          platform_fee_dzd: fee,
          publisher_payout_dzd: payout,
          download_token: token
        })
        if (error) {
          console.error("Product Purchase Error:", error)
          window.localStorage.setItem('lastCheckoutError', error.message || JSON.stringify(error))
          allSuccess = false
        }
      }
    }

    if (allSuccess) {
      // Clear Cart
      await supabase.from('CartItem').delete().eq('user_id', user.id)
      router.push("/checkout/success")
    } else {
      alert("Checkout Error: " + window.localStorage.getItem('lastCheckoutError') || "There was an issue processing your order. Please check the console.")
      setLoading(false)
    }
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.round(subtotal * 0.05)
  const total = subtotal + fee

  if (pageLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center animate-pulse"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>
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

              {/* Dynamic Service Requirements */}
              {items.filter(i => i.type === 'service' && i.order_requirements?.length > 0).map((item) => (
                <Card key={item.id} className="border-blue-200 bg-blue-50/30">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                       Questions for: {item.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">The seller needs these details to start working.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {item.order_requirements.map((q: string, idx: number) => (
                      <div key={idx} className="space-y-1.5">
                        <Label className="text-xs font-semibold">{q}</Label>
                        <textarea
                          required
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={requirementsAnswers[item.id]?.[idx] || ""}
                          onChange={(e) => {
                            const newAnswers = [...(requirementsAnswers[item.id] || [])]
                            newAnswers[idx] = e.target.value
                            setRequirementsAnswers({ ...requirementsAnswers, [item.id]: newAnswers })
                          }}
                          placeholder="Your answer here..."
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="border-border shadow-sm sticky top-4">
                <CardHeader><CardTitle>Order Total</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    {items.map((item, i) => (
                       <div key={i} className="flex justify-between items-start gap-4">
                         <span className="text-muted-foreground flex items-center gap-1.5 line-clamp-2">
                           {item.type === 'product' ? <Package className="w-3.5 h-3.5 shrink-0" /> : <User className="w-3.5 h-3.5 shrink-0" />}
                           {item.title} x{item.qty}
                         </span>
                         <span className="shrink-0">{parseFloat(item.price).toLocaleString()} DZD</span>
                       </div>
                    ))}
                    <div className="flex justify-between"><span className="text-muted-foreground">Platform fee (5%)</span><span>{fee.toLocaleString()} DZD</span></div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                      <span>Grand Total</span><span className="text-primary">{total.toLocaleString()} DZD</span>
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
