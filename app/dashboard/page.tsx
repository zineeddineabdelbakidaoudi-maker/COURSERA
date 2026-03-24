import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  ShoppingBag,
  Eye,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Calendar,
} from "lucide-react"

const stats = [
  {
    title: "Total Earnings",
    value: "$12,450",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    description: "vs last month",
  },
  {
    title: "Active Orders",
    value: "8",
    change: "+3",
    trend: "up",
    icon: ShoppingBag,
    description: "2 pending delivery",
  },
  {
    title: "Profile Views",
    value: "2,847",
    change: "-5.2%",
    trend: "down",
    icon: Eye,
    description: "vs last month",
  },
  {
    title: "Average Rating",
    value: "4.9",
    change: "+0.1",
    trend: "up",
    icon: Star,
    description: "from 156 reviews",
  },
]

const recentOrders = [
  {
    id: "ORD-001",
    buyer: { name: "Sarah Wilson", avatar: "/placeholder.svg" },
    service: "Logo Design",
    amount: "$150",
    status: "in_progress",
    dueDate: "Mar 28, 2026",
  },
  {
    id: "ORD-002",
    buyer: { name: "Mike Johnson", avatar: "/placeholder.svg" },
    service: "Website Development",
    amount: "$800",
    status: "pending",
    dueDate: "Apr 2, 2026",
  },
  {
    id: "ORD-003",
    buyer: { name: "Emily Chen", avatar: "/placeholder.svg" },
    service: "Social Media Kit",
    amount: "$200",
    status: "completed",
    dueDate: "Mar 20, 2026",
  },
  {
    id: "ORD-004",
    buyer: { name: "David Brown", avatar: "/placeholder.svg" },
    service: "UI/UX Design",
    amount: "$450",
    status: "revision",
    dueDate: "Mar 30, 2026",
  },
]

const recentMessages = [
  {
    sender: { name: "Sarah Wilson", avatar: "/placeholder.svg" },
    message: "Thanks for the update! The logo looks great so far.",
    time: "5 min ago",
    unread: true,
  },
  {
    sender: { name: "Mike Johnson", avatar: "/placeholder.svg" },
    message: "Can we schedule a call to discuss the project requirements?",
    time: "1 hour ago",
    unread: true,
  },
  {
    sender: { name: "Emily Chen", avatar: "/placeholder.svg" },
    message: "I left a 5-star review for your amazing work!",
    time: "3 hours ago",
    unread: false,
  },
]

const topServices = [
  { name: "Logo Design", orders: 45, revenue: "$6,750", rating: 4.9 },
  { name: "Website Development", orders: 23, revenue: "$18,400", rating: 4.8 },
  { name: "Social Media Kit", orders: 38, revenue: "$7,600", rating: 4.9 },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      )
    case "in_progress":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">
          <AlertCircle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    case "revision":
      return (
        <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">
          <AlertCircle className="h-3 w-3 mr-1" />
          Revision
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/analytics">
              <Calendar className="h-4 w-4 mr-2" />
              View Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/services/new">Create Service</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest client orders</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/orders">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={order.buyer.avatar} />
                    <AvatarFallback>
                      {order.buyer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{order.service}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {order.buyer.name} · {order.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">Due: {order.dueDate}</p>
                  </div>
                  <div className="hidden sm:block">{getStatusBadge(order.status)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Recent conversations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/messages">
                <MessageSquare className="h-4 w-4 mr-1" />
                View all
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMessages.map((msg, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={msg.sender.avatar} />
                      <AvatarFallback>
                        {msg.sender.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {msg.unread && (
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{msg.sender.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
            <CardDescription>Your best services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={service.name} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{service.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {service.orders} orders · {service.revenue}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{service.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Boost your visibility and attract more buyers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Profile photo added</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Skills & expertise added</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="text-sm">Add portfolio samples</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Add
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <span className="text-sm">Verify your identity</span>
                  </div>
                  <Button size="sm" variant="ghost">
                    Verify
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
