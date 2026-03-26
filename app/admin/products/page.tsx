"use client"

import React, { useState } from "react"
import {
  Package, Search, Plus, Save, UploadCloud, Tag, CheckCircle2,
  DollarSign, Globe, BookOpen, Users, Shield, X, Image
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { createDigitalProductAction, uploadFileAction } from "@/app/actions/item-actions"
export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("directory")
  const [isPublishing, setIsPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const supabase = createClient()
  const [formData, setFormData] = useState({
    title: "", description: "", shortDesc: "", category: "Templates & UI Kits", type: "Template",
    price: "", discount: "", license: "Personal Use Only", level: "All Levels", destined: "", language: "English (EN)",
    publishStatus: "live"
  })
  const [coverFiles, setCoverFiles] = useState<File[]>([])
  const [productFiles, setProductFiles] = useState<File[]>([])

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishing(true)

    try {
      let cover_url = null
      let preview_urls: string[] = []
      let file_url = ""

      // 1. Upload Covers via server action
      if (coverFiles.length > 0) {
        for (let i = 0; i < coverFiles.length; i++) {
          const fd = new FormData()
          fd.append("file", coverFiles[i])
          fd.append("bucket", "products")
          fd.append("folder", "covers")
          const res = await uploadFileAction(fd)
          if (res.url) {
            if (i === 0) cover_url = res.url
            else preview_urls.push(res.url)
          }
        }
      }

      // 2. Upload Product File via server action
      if (productFiles.length > 0) {
        const fd = new FormData()
        fd.append("file", productFiles[0])
        fd.append("bucket", "products")
        fd.append("folder", "files")
        const res = await uploadFileAction(fd)
        if (res.url) file_url = res.url
      }

      // 3. Save to DB
      const result = await createDigitalProductAction({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        tags: tags,
        status: formData.publishStatus,
        cover_url,
        preview_urls,
        file_url,
        file_size_mb: productFiles[0] ? (productFiles[0].size / (1024 * 1024)).toFixed(2) : 0,
        price_dzd: parseFloat(formData.price || "0"),
        license: formData.license,
        language: formData.language
      })

      if (result.error) throw new Error(result.error)

      setPublished(true)
      setTimeout(() => { setPublished(false); setActiveTab("directory") }, 2500)
    } catch (err: any) {
      alert("Error publishing: " + err.message)
    } finally {
      setIsPublishing(false)
    }
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (t: string) => setTags(tags.filter(x => x !== t))

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setProductFiles(files)
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Digital Products</h1>
          <p className="text-muted-foreground">Monitor the catalog or publish new official products.</p>
        </div>
        <Button onClick={() => setActiveTab("publish")} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Publish Product
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="directory" className="gap-2"><Package className="w-4 h-4" /> Directory</TabsTrigger>
          <TabsTrigger value="publish" className="gap-2"><UploadCloud className="w-4 h-4" /> Publish New</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by product name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card className="border-border shadow-sm">
            <CardContent className="p-16 text-center">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">Use the Publish tab to add official platform products.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <form onSubmit={handlePublish}>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="xl:col-span-2 space-y-6">
                {published && (
                  <div className="bg-green-500/10 text-green-700 border border-green-200 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <p className="font-medium">Product published successfully!</p>
                  </div>
                )}

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Title *</Label>
                      <Input placeholder="e.g. Ultimate Freelancer Toolkit 2026" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Short Description (shown in cards)</Label>
                      <Input placeholder="One-line pitch for the product listing" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Full Description *</Label>
                      <Textarea rows={5} placeholder="Describe what's included, who it's for, and what problem it solves..." required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          <option value="">Select category</option>
                          <option>Templates & UI Kits</option>
                          <option>E-books & Guides</option>
                          <option>Courses & Tutorials</option>
                          <option>Software & Tools</option>
                          <option>Document Packs</option>
                          <option>Photography & Assets</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Product Type *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                          <option value="">Select type</option>
                          <option>Template</option>
                          <option>E-book</option>
                          <option>Course</option>
                          <option>Toolkit</option>
                          <option>Bundle</option>
                        </select>
                      </div>
                    </div>
                    {/* Tags */}
                    <div className="space-y-2">
                      <Label>Tags (press Enter to add)</Label>
                      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[44px] bg-background">
                        {tags.map(t => (
                          <Badge key={t} variant="secondary" className="gap-1">
                            {t}
                            <button type="button" onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                        <input
                          value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                          placeholder={tags.length === 0 ? "e.g. design, figma, ui..." : ""}
                          className="bg-transparent border-none outline-none text-sm flex-1 min-w-[120px]"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Cover Photos & Preview Files</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <label className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer block">
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      <Image className="w-10 h-10 mx-auto text-primary mb-3" />
                      <p className="font-medium">Upload cover images</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — max 5MB each · Recommended 1200×800px</p>
                    </label>
                    {previewImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-3">
                        {previewImages.map((src, i) => (
                          <div key={i} className="relative rounded-lg overflow-hidden aspect-video border border-border">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => {
                              setPreviewImages(previewImages.filter((_, j) => j !== i))
                              setCoverFiles(coverFiles.filter((_, j) => j !== i))
                            }}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <label className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center hover:bg-muted/20 transition-colors cursor-pointer block">
                      <input type="file" accept=".zip,.pdf,.mp4,.figma,.sketch,.psd" className="hidden" onChange={handleProductUpload} />
                      <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">{productFiles.length > 0 ? productFiles[0].name : "Upload product files"}</p>
                      <p className="text-xs text-muted-foreground mt-1">ZIP, PDF, MP4, Figma, PSD · max 500MB total</p>
                    </label>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar options */}
              <div className="space-y-6">
                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" />Pricing</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Price (DZD) *</Label>
                      <Input type="number" min="0" placeholder="0 = Free" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount Price (optional)</Label>
                      <Input type="number" min="0" placeholder="Leave blank for no discount" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
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
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" />Target Audience</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Skill Level</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                        <option>All Levels</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced / Pro</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destined For</Label>
                      <Input placeholder="e.g. Freelancers, Designers, Agencies" value={formData.destined} onChange={e => setFormData({...formData, destined: e.target.value})} />
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
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="w-4 h-4 text-purple-500" />Publication</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Publish Immediately</Label>
                      <input type="radio" name="status" checked={formData.publishStatus === "live"} onChange={() => setFormData({...formData, publishStatus: "live"})} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Save as Draft</Label>
                      <input type="radio" name="status" checked={formData.publishStatus === "draft"} onChange={() => setFormData({...formData, publishStatus: "draft"})} />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("directory")} className="flex-1">Cancel</Button>
                  <Button type="submit" disabled={isPublishing || published} className="flex-1 gap-2">
                    {isPublishing ? "Publishing..." : published ? <><CheckCircle2 className="w-4 h-4" />Done!</> : <><Save className="w-4 h-4" />Publish</>}
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
