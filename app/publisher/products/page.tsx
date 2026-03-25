"use client"

import { useState } from "react"
import { Package, Plus, Eye, Pencil, Trash2, UploadCloud, X, CheckCircle2, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const myProducts = [
  { title: "2026 UI Design Kit", type: "Template", status: "live", sales: 42, price: "4,500 DZD" },
  { title: "Freelance Starter Pack", type: "Bundle", status: "live", sales: 89, price: "2,000 DZD" },
  { title: "Arabic SEO Guide", type: "E-book", status: "draft", sales: 0, price: "1,200 DZD" },
]

const statusStyle: Record<string, string> = {
  live: "bg-green-500/10 text-green-600 border-green-200",
  draft: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
}

export default function PublisherProductsPage() {
  const [tab, setTab] = useState("list")
  const [done, setDone] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDone(true)
    setTimeout(() => { setDone(false); setTab("list") }, 2000)
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">My Products</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myProducts.map((p, i) => (
              <Card key={i} className="border-border shadow-sm overflow-hidden group">
                <div className="h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 flex items-center justify-center">
                  <Package className="w-12 h-12 text-purple-400/40 group-hover:text-purple-400/70 transition-colors" />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">⋯</Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Eye className="w-4 h-4" />View</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2"><Pencil className="w-4 h-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="w-4 h-4" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">{p.type}</Badge>
                    <Badge variant="outline" className={`text-xs ${statusStyle[p.status]}`}>{p.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="text-sm text-muted-foreground">{p.sales} sales</span>
                    <span className="font-bold text-sm text-primary">{p.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="publish" className="mt-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                {done && (
                  <div className="bg-green-500/10 text-green-700 border border-green-200 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" /><p className="font-medium">Product submitted successfully!</p>
                  </div>
                )}
                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Product Details</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Product Title *</Label><Input required placeholder="e.g. Freelancer Toolkit 2026" /></div>
                    <div className="space-y-2"><Label>Description *</Label><Textarea rows={4} required placeholder="Describe what's included..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>Templates & UI Kits</option>
                          <option>E-books & Guides</option>
                          <option>Courses</option>
                          <option>Document Packs</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option>Template</option>
                          <option>E-book</option>
                          <option>Course</option>
                          <option>Bundle</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Tags (press Enter)</Label>
                      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[44px] bg-background">
                        {tags.map(t => (
                          <Badge key={t} variant="secondary" className="gap-1">
                            {t}
                            <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                          </Badge>
                        ))}
                        <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag}
                          placeholder={tags.length === 0 ? "e.g. figma, design..." : ""}
                          className="bg-transparent border-none outline-none text-sm flex-1 min-w-[100px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Files & Cover</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <label className="border-2 border-dashed border-border rounded-xl p-6 text-center block cursor-pointer hover:bg-muted/20 transition-colors">
                      <input type="file" className="hidden" multiple accept="image/*" />
                      <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload cover images</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP — recommended 1200×800</p>
                    </label>
                    <label className="border-2 border-dashed border-border/60 rounded-xl p-6 text-center block cursor-pointer hover:bg-muted/10 transition-colors">
                      <input type="file" className="hidden" multiple accept=".zip,.pdf,.mp4,.figma" />
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Upload product files</p>
                      <p className="text-xs text-muted-foreground mt-1">ZIP, PDF, MP4, Figma — max 500MB</p>
                    </label>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-5">
                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Pricing</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2"><Label>Price (DZD) *</Label><Input type="number" min="0" required /></div>
                    <div className="space-y-2"><Label>Discount Price</Label><Input type="number" min="0" /></div>
                    <div className="space-y-2">
                      <Label>License</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>Personal Use</option>
                        <option>Commercial Use</option>
                        <option>Extended License</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader><CardTitle className="text-base">Audience</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Skill Level</Label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>All Levels</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-2"><Label>Target Audience</Label><Input placeholder="Freelancers, Designers..." /></div>
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setTab("list")} className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700">
                    {done ? <><CheckCircle2 className="w-4 h-4" />Done!</> : <><Save className="w-4 h-4" />Publish</>}
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
