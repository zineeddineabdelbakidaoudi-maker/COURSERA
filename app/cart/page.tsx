"use client"

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-primary" /> My Cart
          <Badge variant="secondary">{items.length} items</Badge>
        </h1>

        {loading ? (
          <div className="text-center py-24 animate-pulse">
             <div className="w-16 h-16 mx-auto bg-muted rounded-full mb-4" />
             <div className="h-6 w-48 bg-muted mx-auto rounded" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
            <p className="text-xl font-semibold text-muted-foreground mb-2">Your cart is empty</p>
            <Button asChild className="mt-4"><Link href="/services">Browse Services</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <Card key={item.cart_id} className="border-border shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.title || "Unknown Item"}</p>
                      <p className="text-sm text-muted-foreground">{item.seller}</p>
                      <Badge variant="outline" className="mt-1 text-xs capitalize">{item.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-lg">{item.price.toLocaleString()} DZD</span>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(item.cart_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="border-border shadow-sm sticky top-4">
                <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{subtotal.toLocaleString()} DZD</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee (5%)</span><span>{fee.toLocaleString()} DZD</span></div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                      <span>Total</span><span className="text-primary">{(subtotal + fee).toLocaleString()} DZD</span>
                    </div>
                  </div>
                  <Button asChild className="w-full gap-2">
                    <Link href="/checkout">Proceed to Checkout <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">Cash on Delivery available · Secure payments</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
