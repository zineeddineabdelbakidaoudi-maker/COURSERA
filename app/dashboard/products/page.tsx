"use client"

import { Package, Plus, Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const products = [
  { title: "Figma Design System Pro", type: "Template", price: "3,500 DZD", sales: 42, status: "live" },
  { title: "Freelancer Invoice Pack", type: "Document", price: "800 DZD", sales: 89, status: "live" },
  { title: "Brand Strategy Workbook", type: "E-book", price: "1,200 DZD", sales: 15, status: "draft" },
]

const statusStyle: Record<string, string> = {
  live: "bg-green-500/10 text-green-600 border-green-200",
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  rejected: "bg-red-500/10 text-red-600 border-red-200",
}

export default function SellerProductsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">My Digital Products</h1>
          <p className="text-muted-foreground">Manage and track your digital goods.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Add Product</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <Card key={i} className="border-border shadow-sm overflow-hidden group">
            <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Package className="w-14 h-14 text-primary/30 group-hover:text-primary/60 transition-colors" />
            </div>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><MoreHorizontal className="w-4 h-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" />View</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2"><Pencil className="w-4 h-4" />Edit</DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">{p.type}</Badge>
                <Badge variant="outline" className={`text-xs ${statusStyle[p.status]}`}>{p.status}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">{p.sales} sales</span>
                <span className="font-bold text-primary">{p.price}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="border-border border-dashed shadow-sm flex items-center justify-center h-64 hover:bg-muted/30 transition-colors cursor-pointer">
          <div className="text-center">
            <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground">Add New Product</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
