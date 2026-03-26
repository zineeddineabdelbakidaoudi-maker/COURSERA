"use client"

import React, { useEffect, useState } from "react"
import { Package, Plus, Eye, Pencil, Trash2, UploadCloud, X, CheckCircle2, Save, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { createDigitalProductAction, uploadFileAction } from "@/app/actions/item-actions"

export default function PublisherProductsPage() {
  const supabase = createClient()
  const [tab, setTab] = useState("list")
  const [done, setDone] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [formData, setFormData] = useState({
    title: "", description: "", category: "Templates & UI Kits", type: "Template",
    price: "", discount: "", license: "Personal Use Only", level: "All Levels",
    destined: "", language: "English (EN)", publishStatus: "live"
  })
  const [coverFiles, setCoverFiles] = useState<File[]>([])
  const [productFiles, setProductFiles] = useState<File[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoadingProducts(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoadingProducts(false); return }
    const { data } = await supabase
      .from("DigitalProduct")
      .select("id, title, type, status, price_dzd, created_at")
      .eq("publisher_id", user.id)
      .order("created_at", { ascending: false })
    setProducts(data || [])
    setLoadingProducts(false)
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setCoverFiles(prev => [...prev, ...files])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        if (ev.target?.result) setPreviewImages(prev => [...prev, ev.target!.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in the title and description.")
      return
    }
    setIsPublishing(true)

    try {
      let cover_url: string | null = null
      const preview_urls: string[] = []
      let file_url = ""

      // Upload covers via server action (bypasses storage RLS)
      for (let i = 0; i < coverFiles.length; i++) {
        const fd = new FormData()
        fd.append("file", coverFiles[i])
        fd.append("bucket", "products")
        fd.append("folder", "covers")
        const res = await uploadFileAction(fd)
        if (res.url) {
          if (i === 0) cover_url = res.url
          else preview_urls.push(res.url)
        } else if (res.error) {
          console.warn("Cover upload error:", res.error)
        }
      }

      // Upload product file via server action
      if (productFiles.length > 0) {
        const fd = new FormData()
        fd.append("file", productFiles[0])
        fd.append("bucket", "products")
        fd.append("folder", "files")
        const res = await uploadFileAction(fd)
        if (res.url) file_url = res.url
        else if (res.error) console.warn("File upload error:", res.error)
      }

      const result = await createDigitalProductAction({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        tags,
        status: formData.publishStatus,
        cover_url,
        preview_urls,
        file_url,
        file_size_mb: productFiles[0] ? parseFloat((productFiles[0].size / (1024 * 1024)).toFixed(2)) : 0,
        price_dzd: parseFloat(formData.price || "0"),
        license: formData.license,
        language: formData.language
      })

      if (result.error) throw new Error(result.error)

      setDone(true)
      // Reset form
      setFormData({ title: "", description: "", category: "Templates & UI Kits", type: "Template", price: "", discount: "", license: "Personal Use Only", level: "All Levels", destined: "", language: "English (EN)", publishStatus: "live" })
      setTags([])
      setCoverFiles([])
      setProductFiles([])
      setPreviewImages([])
      await fetchProducts()
      setTimeout(() => { setDone(false); setTab("list") }, 2000)
    } catch (err: any) {
      alert("Error publishing: " + err.message)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return
    await supabase.from("DigitalProduct").delete().eq("id", id)
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Products</h1>
          <p className="text-muted-foreground">Manage your published digital content.</p>
        </div>
        <Button onClick={() => setTab("publish")} className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4" /> Publish Product
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2"><Package className="w-4 h-4" />My Products</TabsTrigger>
          <TabsTrigger value="publish" className="gap-2"><UploadCloud className="w-4 h-4" />Publish New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {loadingProducts ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : products.length === 0 ? (
            <Card className="border-border shadow-sm">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground text-sm mb-4">You haven&apos;t published any digital products yet.</p>
                <Button onClick={() => setTab("publish")} className="gap-2 bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4" /> Publish Your First Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((p) => (
                <Card key={p.id} className="border-border shadow-sm overflow-hidden group">
                  <div className="h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center">
                    <Package className="w-12 h-12 text-purple-400/40 group-hover:text-purple-400/70 transition-colors" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">{p.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs capitalize">{p.type}</Badge>
                      <Badge className={`text-xs capitalize ${p.status === "live" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                        {p.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="font-bold text-sm text-primary">{parseFloat(p.price_dzd || 0).toLocaleString()} DZD</span>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs text-destructive hover:text-destructive/80 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="publish" className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                {done && (
                  <div className="bg-green-500/10 text-green-700 border border-green-200 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium">Product published successfully! Redirecting...</p>
                  </div>
                )}

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Product Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Title *</Label>
                      <Input required placeholder="e.g. Freelancer Toolkit 2026" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description *</Label>
                      <Textarea rows={4} required placeholder="Describe what's included, who it's for, and what problem it solves..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          <option>Templates & UI Kits</option>
                          <option>E-books & Guides</option>
                          <option>Courses & Tutorials</option>
                          <option>Software & Tools</option>
                          <option>Document Packs</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option>Template</option>
                          <option>E-book</option>
                          <option>Course</option>
                          <option>Toolkit</option>
                          <option>Bundle</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (press Enter to add)</Label>
                      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[44px] bg-background">
                        {tags.map(t => (
                          <Badge key={t} variant="secondary" className="gap-1">
                            {t}
                            <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                        <input
                          value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                          placeholder={tags.length === 0 ? "e.g. figma, design, ui..." : ""}
                          className="bg-transparent border-none outline-none text-sm flex-1 min-w-[100px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Cover Images & Product File</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cover images */}
                    <label className="border-2 border-dashed border-border rounded-xl p-6 text-center block cursor-pointer hover:bg-muted/20 transition-colors">
                      <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageSelect} />
                      <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        {coverFiles.length > 0 ? `${coverFiles.length} cover image(s) selected` : "Click to upload cover images"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — recommended 1200×800</p>
                    </label>

                    {/* Preview thumbnails */}
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {previewImages.map((src, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden aspect-video border border-border">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewImages(previewImages.filter((_, j) => j !== i))
                                setCoverFiles(coverFiles.filter((_, j) => j !== i))
                              }}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Product file */}
                    <label className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center block cursor-pointer hover:bg-muted/10 transition-colors">
                      <input type="file" className="hidden" accept=".zip,.pdf,.mp4,.figma,.sketch,.psd" onChange={e => setProductFiles(Array.from(e.target.files || []))} />
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">{productFiles.length > 0 ? productFiles[0].name : "Click to upload product file"}</p>
                      <p className="text-xs text-muted-foreground mt-1">ZIP, PDF, MP4, Figma, PSD — max 500MB</p>
                    </label>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-5">
                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Price (DZD) *</Label>
                      <Input type="number" min="0" placeholder="0 = Free" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>License Type</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})}>
                        <option>Personal Use Only</option>
                        <option>Commercial Use</option>
                        <option>Extended License</option>
                        <option>Open Source (Free)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                        <option>Arabic (AR)</option>
                        <option>French (FR)</option>
                        <option>English (EN)</option>
                        <option>Multi-language</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Publication</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Publish Immediately</span>
                      <input type="radio" name="pubStatus" checked={formData.publishStatus === "live"} onChange={() => setFormData({...formData, publishStatus: "live"})} />
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm font-medium">Save as Draft</span>
                      <input type="radio" name="pubStatus" checked={formData.publishStatus === "draft"} onChange={() => setFormData({...formData, publishStatus: "draft"})} />
                    </label>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setTab("list")} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={isPublishing || done} className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
                    {isPublishing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</>
                    ) : done ? (
                      <><CheckCircle2 className="w-4 h-4" />Done!</>
                    ) : (
                      <><Save className="w-4 h-4" />Publish</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
