"use client"

import React, { useEffect, useState } from "react"
import { Tags, Package, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

const typeStyle: Record<string, string> = {
  products: "bg-purple-500/10 text-purple-600 border-purple-200",
  services: "bg-blue-500/10 text-blue-600 border-blue-200",
  both: "bg-green-500/10 text-green-600 border-green-200",
}

export default function PublisherCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchCats() {
      const { data } = await supabase.from('Category').select('*').order('name_en')
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCats()
  }, [])

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Live Categories</h1>
          <p className="text-muted-foreground">View all available market categories to publish to.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-semibold text-muted-foreground w-12"><Tags className="w-4 h-4 ml-1" /></th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Category Name</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Slug</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Content Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No categories found in system.</td></tr>
              ) : categories.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4"><div className="w-8 h-8 rounded bg-secondary flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-muted-foreground" /></div></td>
                  <td className="p-4 font-semibold">{c.name_en}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{c.slug || c.name_en.toLowerCase().replace(/\s+/g, '-')}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${typeStyle[c.type] || typeStyle.both} uppercase text-[10px]`}>{c.type}</Badge>
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
