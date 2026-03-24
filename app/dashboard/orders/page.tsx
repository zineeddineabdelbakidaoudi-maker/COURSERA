"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreVertical,
  MessageSquare,
  Eye,
  Download,
  Calendar,
} from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    buyer: { name: "Sarah Wilson", avatar: "/placeholder.svg", email: "sarah@example.com" },
    service: "Professional Logo Design with Brand Guidelines",
    package: "Premium",
    amount: "$150",
    status: "in_progress",
    dueDate: "Mar 28, 2026",
    startDate: "Mar 21, 2026",
    progress: 60,
  },
  {
    id: "ORD-002",
    buyer: { name: "Mike Johnson", avatar: "/placeholder.svg", email: "mike@example.com" },
    service: "Full Stack Website Development",
    package: "Standard",
    amount: "$800",
    status: "pending",
    dueDate: "Apr 2, 2026",
    startDate: "Mar 24, 2026",
    progress: 0,
  },
  {
    id: "ORD-003",
    buyer: { name: "Emily Chen", avatar: "/placeholder.svg", email: "emily@example.com" },
    service: "Social Media Marketing Kit",
    package: "Basic",
    amount: "$200",
    status: "completed",
    dueDate: "Mar 20, 2026",
    startDate: "Mar 15, 2026",
    progress: 100,
  },
  {
    id: "ORD-004",
    buyer: { name: "David Brown", avatar: "/placeholder.svg", email: "david@example.com" },
    service: "UI/UX Design for Mobile App",
    package: "Premium",
    amount: "$450",
    status: "revision",
    dueDate: "Mar 30, 2026",
    startDate: "Mar 18, 2026",
    progress: 80,
  },
  {
    id: "ORD-005",
    buyer: { name: "Lisa Anderson", avatar: "/placeholder.svg", email: "lisa@example.com" },
    service: "Content Writing Package",
    package: "Standard",
    amount: "$120",
    status: "cancelled",
    dueDate: "Mar 25, 2026",
    startDate: "Mar 20, 2026",
    progress: 0,
  },
  {
    id: "ORD-006",
    buyer: { name: "James Taylor", avatar: "/placeholder.svg", email: "james@example.com" },
    service: "SEO Optimization Service",
    package: "Premium",
    amount: "$350",
    status: "in_progress",
    dueDate: "Apr 5, 2026",
    startDate: "Mar 22, 2026",
    progress: 35,
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-0">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-0">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "revision":
      return (
        <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-0">
          <AlertCircle className="h-3 w-3 mr-1" />
          Revision
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-0">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && order.status === activeTab
  })

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    revision: orders.filter((o) => o.status === "revision").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your client orders</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orderCounts.in_progress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orderCounts.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orderCounts.revision}</p>
                <p className="text-sm text-muted-foreground">Revisions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orderCounts.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
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
                placeholder="Search orders by ID, service, or buyer..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Pending ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger
            value="in_progress"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            In Progress ({orderCounts.in_progress})
          </TabsTrigger>
          <TabsTrigger
            value="revision"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Revision ({orderCounts.revision})
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Completed ({orderCounts.completed})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order List</CardTitle>
              <CardDescription>
                {filteredOrders.length} order{filteredOrders.length !== 1 && "s"} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                  >
                    {/* Buyer Info */}
                    <div className="flex items-center gap-3 lg:w-48">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={order.buyer.avatar} />
                        <AvatarFallback>
                          {order.buyer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{order.buyer.name}</p>
                        <p className="text-xs text-muted-foreground">{order.id}</p>
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.service}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {order.package}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Due: {order.dueDate}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    {order.status === "in_progress" && (
                      <div className="lg:w-32">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{order.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${order.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Amount & Status */}
                    <div className="flex items-center justify-between lg:justify-end gap-4 lg:w-48">
                      <div className="text-right">
                        <p className="font-semibold">{order.amount}</p>
                        {getStatusBadge(order.status)}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message Buyer
                          </DropdownMenuItem>
                          {order.status === "in_progress" && (
                            <DropdownMenuItem>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Deliver Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No orders found matching your criteria.</p>
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
