"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Star,
  Eye,
  ShoppingBag,
  MoreVertical,
  Edit,
  Copy,
  Pause,
  Trash2,
  TrendingUp,
  Clock,
} from "lucide-react"

const services = [
  {
    id: 1,
    title: "Professional Logo Design with Brand Guidelines",
    image: "/placeholder.svg?height=200&width=300",
    category: "Graphic Design",
    price: 50,
    rating: 4.9,
    reviews: 156,
    orders: 45,
    views: 2847,
    status: "active",
    featured: true,
  },
  {
    id: 2,
    title: "Full Stack Website Development with React & Node.js",
    image: "/placeholder.svg?height=200&width=300",
    category: "Web Development",
    price: 200,
    rating: 4.8,
    reviews: 89,
    orders: 23,
    views: 1523,
    status: "active",
    featured: false,
  },
  {
    id: 3,
    title: "Social Media Marketing Kit - Complete Package",
    image: "/placeholder.svg?height=200&width=300",
    category: "Digital Marketing",
    price: 75,
    rating: 4.9,
    reviews: 67,
    orders: 38,
    views: 1890,
    status: "paused",
    featured: false,
  },
  {
    id: 4,
    title: "UI/UX Design for Mobile Applications",
    image: "/placeholder.svg?height=200&width=300",
    category: "UI/UX Design",
    price: 150,
    rating: 5.0,
    reviews: 42,
    orders: 18,
    views: 956,
    status: "active",
    featured: true,
  },
  {
    id: 5,
    title: "SEO Optimization & Keyword Research",
    image: "/placeholder.svg?height=200&width=300",
    category: "SEO",
    price: 100,
    rating: 4.7,
    reviews: 34,
    orders: 29,
    views: 1245,
    status: "draft",
    featured: false,
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">Active</Badge>
    case "paused":
      return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-0">Paused</Badge>
    case "draft":
      return <Badge className="bg-muted text-muted-foreground border-0">Draft</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase())
    if (activeTab === "all") return matchesSearch
    return matchesSearch && service.status === activeTab
  })

  const serviceCounts = {
    all: services.length,
    active: services.filter((s) => s.status === "active").length,
    paused: services.filter((s) => s.status === "paused").length,
    draft: services.filter((s) => s.status === "draft").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage and optimize your service listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/services/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Service
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.reduce((acc, s) => acc + s.orders, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.reduce((acc, s) => acc + s.views, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(services.reduce((acc, s) => acc + s.rating, 0) / services.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{services.filter((s) => s.featured).length}</p>
                <p className="text-sm text-muted-foreground">Featured</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All ({serviceCounts.all})
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Active ({serviceCounts.active})
          </TabsTrigger>
          <TabsTrigger
            value="paused"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Paused ({serviceCounts.paused})
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Drafts ({serviceCounts.draft})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                {filteredServices.length} service{filteredServices.length !== 1 && "s"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col md:flex-row gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                      {service.featured && (
                        <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold line-clamp-1">{service.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{service.category}</Badge>
                            {getStatusBadge(service.status)}
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary shrink-0">
                          From ${service.price}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {service.rating} ({service.reviews})
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4" />
                          {service.orders} orders
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {service.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col items-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild className="flex-1 md:flex-none">
                        <Link href={`/dashboard/services/${service.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/services/${service.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Live
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Clock className="h-4 w-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {service.status === "active" ? (
                            <DropdownMenuItem>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Service
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem>
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Activate Service
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {filteredServices.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No services found.</p>
                    <Button asChild>
                      <Link href="/dashboard/services/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Service
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
