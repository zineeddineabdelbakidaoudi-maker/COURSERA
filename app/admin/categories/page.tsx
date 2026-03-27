"use client"

import React, { useEffect, useState } from "react"
import { Tags, Plus, Trash2, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

const typeStyle: Record<string, string> = {
  products: "bg-purple-500/10 text-purple-600 border-purple-200",
  services: "bg-blue-500/10 text-blue-600 border-blue-200",
  both: "bg-green-500/10 text-green-600 border-green-200",
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newCat, setNewCat] = useState("")
  const [newType, setNewType] = useState("both")
  const supabase = createClient()

  useEffect(() => {
    fetchCats()
  }, [])

  async function fetchCats() {
    const { data } = await supabase.from('Category').select('*').order('name_en')
    if (data) setCategories(data)
    setLoading(false)
  }

  async function addCat() {
    if (!newCat.trim()) return
    const id = crypto.randomUUID()
    const slug = newCat.toLowerCase().replace(/\s+/g, '-')
    const { error } = await supabase.from('Category').insert({ id, name_en: newCat, name_ar: newCat, name_fr: newCat, slug, type: newType })
    if (!error) { 
      setNewCat("")
      fetchCats() 
    } else {
      alert("Error adding category: " + error.message)
    }
  }

  async function deleteCat(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return
    const { error } = await supabase.from('Category').delete().eq('id', id)
    if (!error) {
      fetchCats()
    } else {
      alert("Error deleting category: " + error.message)
    }
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Manage Categories</h1>
          <p className="text-muted-foreground">Add or remove global platform categories.</p>
        </div>
      </div>

      <Card className="border-border shadow-sm p-4 bg-muted/10">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Category Name (EN)</label>
            <Input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g. Web Development" />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="both">Both</option>
              <option value="products">Products Only</option>
              <option value="services">Services Only</option>
            </select>
          </div>
          <Button onClick={addCat} className="gap-2" disabled={!newCat.trim()}><Plus className="w-4 h-4" /> Add Category</Button>
        </div>
      </Card>

      <Card className="border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 font-semibold text-muted-foreground w-12"><Tags className="w-4 h-4 ml-1" /></th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Category Name</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Slug</th>
                <th className="text-left p-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-right p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No categories found.</td></tr>
              ) : categories.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4"><div className="w-8 h-8 rounded bg-secondary flex items-center justify-center"><LayoutDashboard className="w-4 h-4 text-muted-foreground" /></div></td>
                  <td className="p-4 font-semibold">{c.name_en}</td>
                  <td className="p-4 text-muted-foreground font-mono text-xs">{c.slug || c.name_en.toLowerCase().replace(/\s+/g, '-')}</td>
                  <td className="p-4">
                    <Badge variant="outline" className={`${typeStyle[c.type] || typeStyle.both} uppercase text-[10px]`}>{c.type}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteCat(c.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
