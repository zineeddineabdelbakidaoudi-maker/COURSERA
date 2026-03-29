"use client"

import React, { useEffect, useState } from "react"
import { Tags, Plus, Trash2, LayoutDashboard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

const typeStyle: Record<string, string> = {
  products: "bg-purple-50 text-purple-700 border-purple-200",
  services: "bg-blue-50 text-blue-700 border-blue-200",
  both: "bg-green-50 text-green-700 border-green-200",
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
      toast.success("Category added successfully")
      fetchCats() 
    } else {
      toast.error("Error adding category: " + error.message)
    }
  }

  async function deleteCat(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return
    const { error } = await supabase.from('Category').delete().eq('id', id)
    if (!error) {
      toast.success("Category deleted")
      fetchCats()
    } else {
      toast.error("Error deleting category: " + error.message)
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

      <Card className="border-gray-100 shadow-sm p-6 bg-white rounded-[2rem]">
        <div className="flex flex-col sm:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category Name (EN)</label>
            <Input className="rounded-xl border-gray-200" value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="e.g. Web Development" />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Type</label>
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="both">Both</option>
              <option value="products">Products Only</option>
              <option value="services">Freelancers & Jobs</option>
            </select>
          </div>
          <Button onClick={addCat} className="bg-black hover:bg-gray-800 text-white rounded-xl h-10 px-6 gap-2" disabled={!newCat.trim()}><Plus className="w-4 h-4" /> Add Category</Button>
        </div>
      </Card>

      <Card className="border-gray-100 shadow-sm overflow-hidden rounded-[2rem] bg-white">
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left p-6 font-semibold text-gray-500 w-12"><Tags className="w-4 h-4" /></th>
                <th className="text-left p-6 font-semibold text-gray-500">Category Name</th>
                <th className="text-left p-6 font-semibold text-gray-500">Slug</th>
                <th className="text-left p-6 font-semibold text-gray-500">Type</th>
                <th className="text-right p-6 font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">Loading categories...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-400 font-medium">No categories found.</td></tr>
              ) : categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6"><div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200"><LayoutDashboard className="w-4 h-4 text-gray-500" /></div></td>
                  <td className="p-6 font-bold text-black">{c.name_en}</td>
                  <td className="p-6 text-gray-400 font-mono text-xs tracking-wider">{c.slug || c.name_en.toLowerCase().replace(/\s+/g, '-')}</td>
                  <td className="p-6">
                    <Badge variant="outline" className={`${typeStyle[c.type] || typeStyle.both} uppercase text-[10px] font-bold tracking-wider rounded-lg px-2.5 py-1`}>{c.type}</Badge>
                  </td>
                  <td className="p-6 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg" onClick={() => deleteCat(c.id)}>
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
