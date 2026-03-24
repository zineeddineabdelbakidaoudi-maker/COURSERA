"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  X,
  Check,
  Image as ImageIcon,
  DollarSign,
  Clock,
  RefreshCw,
  FileText,
  Eye,
} from "lucide-react"

const steps = [
  { id: 1, name: "Overview", description: "Basic information" },
  { id: 2, name: "Pricing", description: "Set your packages" },
  { id: 3, name: "Description", description: "Detailed info" },
  { id: 4, name: "Requirements", description: "Buyer requirements" },
  { id: 5, name: "Gallery", description: "Add images" },
  { id: 6, name: "Review", description: "Publish service" },
]

const categories = [
  "Graphic Design",
  "Web Development",
  "Digital Marketing",
  "Writing & Translation",
  "Video & Animation",
  "Music & Audio",
  "Programming & Tech",
  "Business",
  "AI Services",
]

export default function NewServicePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    tags: [] as string[],
    packages: {
      basic: { name: "Basic", price: "", delivery: "", revisions: "", features: [] as string[] },
      standard: { name: "Standard", price: "", delivery: "", revisions: "", features: [] as string[] },
      premium: { name: "Premium", price: "", delivery: "", revisions: "", features: [] as string[] },
    },
    description: "",
    requirements: [] as string[],
    images: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [newRequirement, setNewRequirement] = useState("")

  const addTag = () => {
    if (newTag && formData.tags.length < 5) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] })
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const addRequirement = () => {
    if (newRequirement) {
      setFormData({ ...formData, requirements: [...formData.requirements, newRequirement] })
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/services">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Create New Service</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to list your service</p>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center shrink-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  <p className="text-xs mt-1 font-medium hidden md:block">{step.name}</p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 md:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Overview</CardTitle>
            <CardDescription>Provide basic information about your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input
                id="title"
                placeholder="I will design a professional logo for your business"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {formData.title.length}/80 characters. Start with &quot;I will&quot; for best results.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full h-10 rounded-md border bg-background px-3"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <select
                  id="subcategory"
                  className="w-full h-10 rounded-md border bg-background px-3"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                >
                  <option value="">Select a subcategory</option>
                  <option value="logo">Logo Design</option>
                  <option value="brand">Brand Identity</option>
                  <option value="illustration">Illustration</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Search Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{formData.tags.length}/5 tags. Help buyers find your service.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          {(["basic", "standard", "premium"] as const).map((tier) => (
            <Card key={tier}>
              <CardHeader>
                <CardTitle className="capitalize">{tier} Package</CardTitle>
                <CardDescription>
                  {tier === "basic" && "Your entry-level offering"}
                  {tier === "standard" && "Your most popular option"}
                  {tier === "premium" && "Your comprehensive package"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price
                    </Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.packages[tier].price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packages: {
                            ...formData.packages,
                            [tier]: { ...formData.packages[tier], price: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Delivery (days)
                    </Label>
                    <Input
                      type="number"
                      placeholder="3"
                      value={formData.packages[tier].delivery}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packages: {
                            ...formData.packages,
                            [tier]: { ...formData.packages[tier], delivery: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Revisions
                    </Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={formData.packages[tier].revisions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          packages: {
                            ...formData.packages,
                            [tier]: { ...formData.packages[tier], revisions: e.target.value },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>What&apos;s included</Label>
                  <Textarea
                    placeholder="List the features included in this package"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Description</CardTitle>
            <CardDescription>Provide a detailed description of your service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your service in detail. What do you offer? What makes you stand out? What's your process?"
                rows={12}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/2500 characters. Be specific about what you deliver.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tips for a great description
              </h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Start by introducing yourself and your expertise</li>
                <li>• Explain exactly what you&apos;ll deliver</li>
                <li>• Mention your process and timeline</li>
                <li>• Highlight what makes you unique</li>
                <li>• Include any requirements from buyers</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Buyer Requirements</CardTitle>
            <CardDescription>What information do you need from buyers to start working?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement (e.g., Brand colors, Company name, Target audience)"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" variant="outline" onClick={addRequirement}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span>{req}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => removeRequirement(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.requirements.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No requirements added yet. Add questions to ask buyers before starting.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Service Gallery</CardTitle>
            <CardDescription>Add images to showcase your work (up to 5 images)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  {i === 1 ? (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">Upload Image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground/50 mt-2">Optional</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              First image will be used as the service thumbnail
            </p>
          </CardContent>
        </Card>
      )}

      {currentStep === 6 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Service</CardTitle>
              <CardDescription>Check all the details before publishing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-muted/50">
                <h4 className="font-medium">Service Preview</h4>
                <div className="mt-4 flex gap-4">
                  <div className="w-48 h-32 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{formData.title || "Your service title"}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.category || "Category"} • {formData.subcategory || "Subcategory"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-lg font-bold text-primary mt-2">
                      From ${formData.packages.basic.price || "0"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {(["basic", "standard", "premium"] as const).map((tier) => (
                  <div key={tier} className="p-4 rounded-xl border">
                    <h4 className="font-medium capitalize">{tier}</h4>
                    <p className="text-2xl font-bold mt-2">${formData.packages[tier].price || "0"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.packages[tier].delivery || "0"} days delivery
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.packages[tier].revisions || "0"} revisions
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 text-green-600">
                <Check className="h-5 w-5" />
                <p>Your service is ready to be published!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        {currentStep < 6 ? (
          <Button onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button>
              <Check className="h-4 w-4 mr-2" />
              Publish Service
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
