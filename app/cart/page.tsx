"use client"

import { ShoppingCart, Trash2, ArrowRight, Package, Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import NeuralBackground from "@/components/ui/flow-field-background"

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
          seller: item.item_type === 'service' ? 'Service Provider' : 'Product Publisher'
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
      alert("Failed to remove item")
      setItems(prev)
    }
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
  const fee = Math.round(subtotal * 0.05)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header with Neural */}
      <div className="relative overflow-hidden border-b border-white/5 h-48">
        <div className="absolute inset-0">
          <NeuralBackground
            color="#3b82f6"
            trailOpacity={0.1}
            particleCount={300}
            speed={0.4}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/50 to-slate-950" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 h-full flex items-center">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
              </div>
              My Cart
              <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 font-bold">{items.length} items</Badge>
            </h1>
            <p className="text-slate-500 text-sm pl-14">Review your items before checkout</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl mb-4 animate-pulse" />
            <div className="h-4 w-48 bg-white/5 mx-auto rounded animate-pulse" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/5 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-slate-600" />
            </div>
            <p className="text-xl font-semibold text-slate-400 mb-2">Your cart is empty</p>
            <p className="text-slate-600 text-sm mb-8">Discover amazing services and digital products</p>
            <div className="flex gap-3 justify-center">
              <Button asChild className="bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <Link href="/services">Browse Services</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                <Link href="/store">Explore Store</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.cart_id} className="bg-slate-900/60 border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-blue-500/20 transition-colors group">
                  <div className="w-16 h-16 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.cover ? (
                      <img src={item.cover} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    ) : (
                      item.type === 'service'
                        ? <Sparkles className="w-7 h-7 text-blue-400/50" />
                        : <Package className="w-7 h-7 text-indigo-400/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate mb-1">{item.title || "Unknown Item"}</p>
                    <p className="text-sm text-slate-500">{item.seller}</p>
                    <Badge variant="outline" className={`mt-1.5 text-xs capitalize border ${item.type === 'service' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10'}`}>
                      {item.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-bold text-lg text-white">{item.price.toLocaleString()} <span className="text-xs text-slate-500">DZD</span></span>
                    <button
                      onClick={() => remove(item.cart_id)}
                      className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 sticky top-4">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-400" /> Order Summary
                </h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="text-white font-semibold">{subtotal.toLocaleString()} DZD</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee (5%)</span>
                    <span className="text-white font-semibold">{fee.toLocaleString()} DZD</span>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between font-bold text-base">
                    <span className="text-white">Total</span>
                    <span className="text-blue-400 text-lg">{(subtotal + fee).toLocaleString()} DZD</span>
                  </div>
                </div>
                <Button asChild className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] border-none hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all">
                  <Link href="/checkout">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <p className="text-xs text-slate-600 text-center mt-4 flex items-center justify-center gap-1">
                  🔒 Cash on Delivery available · Secure payments
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
