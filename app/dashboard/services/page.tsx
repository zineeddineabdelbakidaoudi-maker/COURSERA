"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Search, Plus, Star, Eye, ShoppingBag, Edit, Trash2,
  Loader2, Briefcase, CheckCircle2, Clock, AlertCircle, Pause
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function MyServicesPage() {
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data } = await supabase
      .from("Service")
      .select("id, title, status, category_id, thumbnail_url, tags, packages, created_at, Category(name_en)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false })
    setServices(data || [])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return
    await supabase.from("Service").delete().eq("id", id)
    setServices(services.filter(s => s.id !== id))
  }

  const handlePause = async (id: string, current: string) => {
    const newStatus = current === "paused" ? "live" : "paused"
    await supabase.from("Service").update({ 
      status: newStatus, 
      updated_at: new Date().toISOString() 
    }).eq("id", id)
    setServices(services.map(s => s.id === id ? { ...s, status: newStatus } : s))
  }

  const filtered = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live": return <Badge className="bg-green-500/10 text-green-600"><CheckCircle2 className="h-3 w-3 mr-1" />Live</Badge>
      case "paused": return <Badge className="bg-yellow-500/10 text-yellow-600"><Pause className="h-3 w-3 mr-1" />Paused</Badge>
      case "pending_review": return <Badge className="bg-blue-500/10 text-blue-600"><Clock className="h-3 w-3 mr-1" />Under Review</Badge>
      case "draft": return <Badge className="bg-gray-500/10 text-gray-600"><AlertCircle className="h-3 w-3 mr-1" />Draft</Badge>
      default: return <Badge variant="secondary" className="capitalize">{status}</Badge>
    }
  }

  const getBasePrice = (packages: any) => {
    if (!packages) return null
    const basic = packages.basic || packages.Basic
    return basic?.price ? `${parseFloat(basic.price).toLocaleString()} DZD` : null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground mt-1">{services.length} service{services.length !== 1 ? "s" : ""} published</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="h-4 w-4 mr-2" /> Create Service
          </Link>
        </Button>
      </div>

      {/* Search */}
      {services.length > 0 && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Services list */}
      {services.length === 0 ? (
        <Card className="border-border">
          <CardContent className="py-20 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
            <h3 className="text-xl font-bold mb-2">No services yet</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mb-6">
              Start listing your skills and services to attract clients and begin earning.
            </p>
            <Button asChild>
              <Link href="/dashboard/services/new">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No services match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((service) => (
            <Card key={service.id} className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-28 h-20 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-border flex items-center justify-center shrink-0 overflow-hidden">
                    {service.thumbnail_url ? (
                      <img src={service.thumbnail_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-primary/30" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-base leading-tight line-clamp-2 flex-1">{service.title}</h3>
                      {getStatusBadge(service.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {service.Category?.name_en || "Uncategorized"} · Created {new Date(service.created_at).toLocaleDateString()}
                    </p>
                    {service.tags && service.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {service.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 sm:min-w-[120px]">
                    {getBasePrice(service.packages) && (
                      <p className="text-lg font-bold text-primary">From {getBasePrice(service.packages)}</p>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePause(service.id, service.status)}
                        className="text-xs"
                      >
                        {service.status === "paused" ? "Resume" : "Pause"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
