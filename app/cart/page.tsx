"use client"

import { ShoppingCart, Trash2, ArrowRight, Package, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { toast } from "sonner"
import { AnimatedPageWrapper } from "@/components/ui/animated-page-wrapper"

export default function CartPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function loadCart() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase.from('CartItem')
        .select('*, service:Service(*), product:DigitalProduct(*)')
        .eq('user_id', user.id)

      if (data) {
        const mapped = data.map((item: any) => ({
          cart_id: item.id,
          id: item.service_id || item.product_id,
          title: item.item_type === 'service' ? item.service?.title : item.product?.title,
          cover: item.item_type === 'service' ? item.service?.thumbnail_url : item.product?.cover_url,
          price: item.addons?.price || (item.item_type === 'service' ? 15000 : 4500),
          qty: item.quantity || 1,
          type: item.item_type,
          seller: item.item_type === 'service' ? 'Freelancer' : 'Publisher'
        }))
        setItems(mapped)
      }
      setLoading(false)
    }
    loadCart()
  }, [])

  const remove = async (cart_id: string) => {
    const prev = [...items]
    setItems(items.filter(i => i.cart_id !== cart_id))
    const { error } = await supabase.from('CartItem').delete().eq('id', cart_id)
    if (error) {
      toast.error("Failed to remove item")
      setItems(prev)
    } else {
      toast.success("Item removed from cart")
    }
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.round(subtotal * 0.05)

  return (
    <div className="min-h-screen bg-[#f4f4f5] font-sans selection:bg-slate-900 selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-20 max-w-6xl mx-auto px-4">
        <AnimatedPageWrapper>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 flex items-center justify-center gap-3">
               <ShoppingCart className="w-8 h-8" /> My Shopping Cart
            </h1>
            <p className="text-slate-500 font-medium">Review your selected services and products before checkout.</p>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <Card className="rounded-[2.5rem] border-slate-200 bg-white p-16 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
                 <ShoppingCart className="w-12 h-12 text-slate-300" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium">Looks like you haven't added anything yet. Explore our marketplace to find premium services and digital assets.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild className="rounded-2xl h-12 px-8 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  <Link href="/services">Browse Services</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl h-12 px-8 border-slate-200 font-bold hover:bg-slate-50 transition-all">
                  <Link href="/store">Explore Store</Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              {/* Items List */}
              <div className="lg:col-span-2 space-y-6">
                {items.map(item => (
                  <div key={item.cart_id} className="group bg-white rounded-[2rem] border border-slate-200 p-6 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md hover:border-slate-300 relative overflow-hidden">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 overflow-hidden relative">
                      {item.cover ? (
                        <img src={item.cover} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                      ) : (
                        item.type === 'service'
                          ? <Sparkles className="w-10 h-10 text-slate-300" />
                          : <Package className="w-10 h-10 text-slate-300" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <Badge variant="outline" className={`uppercase text-[10px] font-black tracking-widest px-2 py-0.5 rounded-lg border-0 bg-slate-100 text-slate-500`}>
                          {item.type}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Ready to delivery
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 truncate mb-1 pr-10">{item.title}</h3>
                      <p className="text-sm font-medium text-slate-500">By {item.seller}</p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      <div className="text-right">
                        <p className="text-2xl font-black text-slate-900 leading-none">{item.price.toLocaleString()} <span className="text-xs font-bold text-slate-400">DZD</span></p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Best Price</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(item.cart_id)}
                        className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:sticky lg:top-32">
                <Card className="rounded-[2.5rem] border-slate-200 bg-white shadow-xl shadow-slate-200/50 p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2 relative z-10">
                    <Zap className="w-5 h-5 text-slate-900 fill-slate-900" /> Summary
                  </h2>
                  
                  <div className="space-y-4 mb-8 relative z-10">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400">Subtotal ({items.length})</span>
                      <span className="text-slate-900">{subtotal.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-slate-400">Secure Fee (5%)</span>
                      <span className="text-slate-900">+{fee.toLocaleString()} DZD</span>
                    </div>
                    <div className="h-px bg-slate-100 my-4" />
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-slate-900">{(subtotal + fee).toLocaleString()} <span className="text-sm">DZD</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <Button asChild className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 group">
                      <Link href="/checkout" className="flex items-center justify-center gap-2">
                        Checkout Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-emerald-800">Secure Checkout</p>
                        <p className="text-[10px] text-emerald-600/80 leading-relaxed font-bold uppercase tracking-tight">Your payment is only released to the seller after your confirmation.</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 text-center mt-6 grayscale opacity-50 flex items-center justify-center gap-2 uppercase tracking-wide">
                     Cash on delivery available in Algiers
                  </p>
                </Card>
              </div>
            </div>
          )}
        </AnimatedPageWrapper>
      </main>
      <Footer />
    </div>
  )
}
