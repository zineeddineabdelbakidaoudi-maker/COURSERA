"use client"

import React, { useEffect, useState } from "react"
import { Package, Plus, Eye, Pencil, Trash2, MoreHorizontal, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

const statusStyle: Record<string, string> = {
  live: "bg-green-500/10 text-green-600 border-green-200",
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  rejected: "bg-red-500/10 text-red-600 border-red-200",
}

export default function SellerProductsPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from("DigitalProduct")
      .select("id, title, type, status, price_dzd, cover_url")
      .eq("publisher_id", user.id)
      .order("created_at", { ascending: false })
    
    setProducts(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    const { error } = await supabase.from("DigitalProduct").delete().eq("id", id)
    if (!error) setProducts(products.filter(p => p.id !== id))
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">My Digital Products</h1>
          <p className="text-muted-foreground">Manage and track your digital goods.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/publisher/products"><Plus className="w-4 h-4" /> Add Product</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p) => (
          <Card key={p.id} className="border-border shadow-sm overflow-hidden group">
            <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
              {p.cover_url ? (
                <img src={p.cover_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <Package className="w-14 h-14 text-primary/30 group-hover:text-primary/60 transition-colors" />
              )}
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2 h-10">{p.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/store/${p.id}`} className="flex items-center gap-2"><Eye className="w-4 h-4" />View</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-[10px] uppercase">{p.type}</Badge>
                <Badge variant="outline" className={`text-[10px] uppercase ${statusStyle[p.status] || ""}`}>{p.status}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">Store Product</span>
                <span className="font-bold text-primary">{parseFloat(p.price_dzd || 0).toLocaleString()} DZD</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Link href="/publisher/products" className="block">
          <Card className="border-border border-dashed shadow-sm flex items-center justify-center h-[280px] hover:bg-muted/30 transition-colors cursor-pointer">
            <div className="text-center">
              <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Add New Product</p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
