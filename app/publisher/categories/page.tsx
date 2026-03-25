"use client"

import { Tags, Plus, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "UI/UX Templates", slug: "ui-ux", products: 8, sellers: 12, type: "products" },
  { name: "Business Documents", slug: "documents", products: 14, sellers: 6, type: "products" },
  { name: "Online Courses", slug: "courses", products: 3, sellers: 4, type: "products" },
  { name: "Web Development", slug: "web-dev", products: 0, sellers: 18, type: "services" },
  { name: "Graphic Design", slug: "design", products: 5, sellers: 22, type: "both" },
]

const typeStyle: Record<string, string> = {
  products: "bg-purple-500/10 text-purple-600 border-purple-200",
  services: "bg-blue-500/10 text-blue-600 border-blue-200",
  both: "bg-green-500/10 text-green-600 border-green-200",
}

export default function PublisherCategoriesPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Curated Categories</h1>
          <p className="text-muted-foreground">Manage and organize the categories you oversee.</p>
        </div>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700"><Plus className="w-4 h-4" />Add Category</Button>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-semibold text-muted-foreground">Category</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">Products</th>
                <th className="text-center p-4 font-semibold text-muted-foreground">Sellers</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map(c => (
                <tr key={c.slug} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${typeStyle[c.type]}`}>{c.type}</Badge>
                  </td>
                  <td className="p-4 text-center font-semibold">{c.products}</td>
                  <td className="p-4 text-center font-semibold">{c.sellers}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
