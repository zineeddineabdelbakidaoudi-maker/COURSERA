"use client"

import React, { useState } from "react"
import { Package, Search, Plus, Save, UploadCloud, Tag, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("directory")
  const [isPublishing, setIsPublishing] = useState(false)
  const [published, setPublished] = useState(false)

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault()
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      setPublished(true)
      setTimeout(() => {
        setPublished(false)
        setActiveTab("directory")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold mb-1">Digital Products</h1>
          <p className="text-muted-foreground">Monitor the catalog or publish new administrative products.</p>
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
              <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold">No digital products found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">The digital product directory is empty. Use the Publish tab to add administrative products.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish">
          <form onSubmit={handlePublish}>
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>Publish Digital Product</CardTitle>
                <CardDescription>Upload files and set pricing for a new official platform product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {published && (
                  <div className="bg-green-500/10 text-green-700 border border-green-200 p-4 rounded-lg flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium">Product published successfully!</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Product Title</Label>
                    <Input placeholder="e.g. Complete Freelancer Toolkit" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option>Templates</option>
                      <option>E-books</option>
                      <option>Courses</option>
                      <option>Software</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea rows={4} placeholder="Describe the digital product in detail..." required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6 mt-6">
                  <div className="space-y-2">
                    <Label>Price (DZD)</Label>
                    <Input type="number" placeholder="0 for Free" required />
                  </div>
                  <div className="space-y-2">
                    <Label>License Type</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">
                      <option>Personal Use</option>
                      <option>Commercial Use</option>
                      <option>Extended License</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 mx-auto text-primary mb-3" />
                  <p className="font-medium">Click to upload product files</p>
                  <p className="text-xs text-muted-foreground mt-1">ZIP, PDF, MP4 up to 500MB</p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("directory")}>Cancel</Button>
                  <Button type="submit" disabled={isPublishing || published} className="gap-2">
                    {isPublishing ? "Publishing..." : published ? "Published" : <><Save className="w-4 h-4" /> Publish Now</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
