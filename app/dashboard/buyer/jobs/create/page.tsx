"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Save, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function CreateJobPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    skills: "",
    budget_dzd: "",
    delivery_time: ""
  })

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('Category')
        .select('id, name_en')
        .eq('type', 'services')
        .order('display_order')
      
      if (data) {
        setCategories(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: data[0].id }))
        }
      }
    }
    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category_id) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error("Not authenticated")

      const skillsArray = formData.skills
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)

      const { error } = await supabase.from('Job').insert({
        buyer_id: user.id,
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        skills: skillsArray,
        budget_dzd: formData.budget_dzd ? parseFloat(formData.budget_dzd) : null,
        delivery_time: formData.delivery_time || null,
        status: 'open'
      })

      if (error) throw error

      toast.success("Job posted successfully!")
      router.push("/dashboard/buyer/jobs")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to post job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-card shadow-sm border border-border">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              Post a New Job
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Fill out the details below to find the perfect talent.</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white rounded-xl shadow-md gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Save className="h-4 w-4" /> Publish Job</>
          )}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Job Title *</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="e.g. Need a Senior Next.js Developer for E-commerce App" 
              value={formData.title} 
              onChange={handleInputChange} 
              disabled={loading}
              className="rounded-xl border-gray-200"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-sm font-semibold">Category *</Label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              disabled={loading}
              className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the project requirements, deliverables, and any other relevant details..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              className="resize-none h-40 rounded-xl border-gray-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budget_dzd" className="text-sm font-semibold">Budget (DZD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">DZD</span>
                <Input 
                  id="budget_dzd" 
                  name="budget_dzd" 
                  type="number"
                  placeholder="e.g. 15000" 
                  value={formData.budget_dzd} 
                  onChange={handleInputChange} 
                  disabled={loading}
                  className="pl-12 rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_time" className="text-sm font-semibold">Estimated Delivery Time</Label>
              <Input 
                id="delivery_time" 
                name="delivery_time" 
                placeholder="e.g. 2 Weeks" 
                value={formData.delivery_time} 
                onChange={handleInputChange} 
                disabled={loading}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className="text-sm font-semibold">Required Skills (Comma separated)</Label>
            <Input 
              id="skills" 
              name="skills" 
              placeholder="e.g. React, Node.js, Tailwind CSS" 
              value={formData.skills} 
              onChange={handleInputChange} 
              disabled={loading}
              className="rounded-xl border-gray-200"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
