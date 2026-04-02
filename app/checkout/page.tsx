"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, User, MapPin, Phone, CheckCircle2, Loader2, Package, Sparkles, ShieldCheck, Zap, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { toast } from "sonner"

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

        // Initialize empty requirements answers
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
          delivery_files: [],
          updated_at: new Date().toISOString()
        })
        if (error) {
          console.error("Order Insert Error:", error)
          allSuccess = false
          toast.error(`Checkout Error (Order): ${error.message}. Please ensure the RLS fix is applied.`)
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
          allSuccess = false
          toast.error("Checkout Error (Product): " + error.message)
        }
      }
    }

    if (allSuccess) {
      await supabase.from('CartItem').delete().eq('user_id', user.id)
      router.push("/checkout/success")
    } else {
      setLoading(false)
    }
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.round(subtotal * 0.05)
  const total = subtotal + fee

  if (pageLoading) {
    return <div className="min-h-screen pt-20 flex items-center justify-center animate-pulse"><div className="w-8 h-8 rounded-full border-4 border-slate-900 border-t-transparent animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Finalize Order</h1>
            <p className="text-slate-500 font-medium italic mt-1">Complete your delivery and contact details to proceed.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <ShieldCheck className="w-3.5 h-3.5" /> Secured by Digithub
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Delivery / Contact Card */}
              <Card className="rounded-[2.5rem] border-slate-200 bg-white shadow-sm p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 mb-6">
                    <User className="w-5 h-5" /> Contact & Delivery Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</Label>
                        <Input 
                          name="name" 
                          value={form.name} 
                          onChange={handleChange} 
                          required 
                          placeholder="Zineeddine Daoudi" 
                          className="h-12 rounded-2xl border-slate-200 focus:ring-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">WhatsApp / Phone</Label>
                        <Input 
                          name="phone" 
                          value={form.phone} 
                          onChange={handleChange} 
                          required 
                          placeholder="+213 6XX XXX XXX" 
                          className="h-12 rounded-2xl border-slate-200 focus:ring-slate-900"
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Street Address</Label>
                      <Input 
                        name="address" 
                        value={form.address} 
                        onChange={handleChange} 
                        required 
                        placeholder="123 Boulevard des Martyrs" 
                        className="h-12 rounded-2xl border-slate-200 focus:ring-slate-900"
                      />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">City / Wilaya</Label>
                        <Input 
                          name="city" 
                          value={form.city} 
                          onChange={handleChange} 
                          required 
                          placeholder="Algiers" 
                          className="h-12 rounded-2xl border-slate-200 focus:ring-slate-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Country</Label>
                        <Input 
                          value="Algeria" 
                          readOnly 
                          className="h-12 rounded-2xl bg-slate-50 border-slate-100 text-slate-500 font-bold" 
                        />
                      </div>
                   </div>

                   <div className="space-y-2 pt-4">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Notes (Optional)</Label>
                      <textarea 
                        name="notes" 
                        value={form.notes} 
                        onChange={handleChange} 
                        rows={3} 
                        placeholder="Any special instructions for the seller..." 
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all" 
                      />
                   </div>
                </CardContent>
              </Card>

              {/* Service Requirements Questions */}
              {items.filter(i => i.type === 'service' && i.order_requirements?.length > 0).map((item) => (
                <Card key={item.id} className="rounded-[2.5rem] border-slate-200 bg-white shadow-sm p-8 overflow-hidden relative">
                   <div className="absolute top-0 left-0 w-1 h-full bg-slate-900" />
                   <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg font-bold flex items-center gap-3 text-slate-900 mb-2">
                        <Sparkles className="w-5 h-5" /> Requirements for: {item.title}
                      </CardTitle>
                      <p className="text-sm font-semibold text-slate-400 uppercase tracking-tight italic">Please provide these details so the freelancer can start work immediately.</p>
                   </CardHeader>
                   <CardContent className="px-0 space-y-6 pt-4">
                      {item.order_requirements.map((q: string, idx: number) => (
                        <div key={idx} className="space-y-3">
                          <Label className="text-sm font-bold text-slate-700">{q}</Label>
                          <textarea
                            required
                            className="w-full min-h-[100px] rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all"
                            value={requirementsAnswers[item.id]?.[idx] || ""}
                            onChange={(e) => {
                              const newAnswers = [...(requirementsAnswers[item.id] || [])]
                              newAnswers[idx] = e.target.value
                              setRequirementsAnswers({ ...requirementsAnswers, [item.id]: newAnswers })
                            }}
                            placeholder="Your detailed answer here..."
                          />
                        </div>
                      ))}
                   </CardContent>
                </Card>
              ))}

              {/* Payment Method - Fixed to COD since it's an Algerian Marketplace focus */}
              <Card className="rounded-[2.5rem] border-slate-200 bg-slate-900 text-white p-8">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-xl font-bold flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5" /> Payment Confirmation
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                   <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5"><CreditCard className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="font-bold text-lg mb-1">Cash on Delivery (COD)</p>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">Place your order now. You will pay once the seller delivers the final job files or the product is confirmed via WhatsApp.</p>
                      </div>
                      <div className="ml-auto"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div>
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:sticky lg:top-32">
              <Card className="rounded-[2.5rem] border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Order Summary
                </h2>
                
                <div className="space-y-4 mb-8">
                   {items.map((item, i) => (
                      <div key={i} className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                           <p className="text-sm font-bold text-slate-900 truncate">{item.title}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.package_name || item.type}</p>
                        </div>
                        <span className="text-sm font-black text-slate-900 shrink-0">{(item.price * item.qty).toLocaleString()} DZD</span>
                      </div>
                   ))}
                </div>

                <div className="h-px bg-slate-100 my-6" />

                <div className="space-y-3 mb-8">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Subtotal</span>
                      <span className="text-slate-900 font-bold">{subtotal.toLocaleString()} DZD</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-medium">Fee (5%)</span>
                      <span className="text-slate-900 font-bold">+{fee.toLocaleString()} DZD</span>
                   </div>
                   <div className="pt-4 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total</p>
                        <p className="text-3xl font-black text-slate-900 leading-none">{total.toLocaleString()} <span className="text-sm">DZD</span></p>
                      </div>
                   </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Confirm & Pay"}
                </Button>

                <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                   <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                   <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight italic">
                     By clicking confirm, you agree to our terms of service and recognize that refunds are handled via platform mediation.
                   </p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
