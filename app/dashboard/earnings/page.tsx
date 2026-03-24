"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Building2,
  Download,
  Calendar,
} from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "earning",
    description: "Logo Design Service - Order #ORD-001",
    amount: 42.5,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: 2,
    type: "earning",
    description: "Website Development - Order #ORD-002",
    amount: 170.0,
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: 3,
    type: "withdrawal",
    description: "Withdrawal to Bank Account",
    amount: -500.0,
    date: "2024-01-13",
    status: "completed",
  },
  {
    id: 4,
    type: "earning",
    description: "Marketing Kit - Order #ORD-003",
    amount: 63.75,
    date: "2024-01-12",
    status: "pending",
  },
  {
    id: 5,
    type: "earning",
    description: "UI/UX Design - Order #ORD-004",
    amount: 127.5,
    date: "2024-01-11",
    status: "completed",
  },
  {
    id: 6,
    type: "refund",
    description: "Refund - Order #ORD-005",
    amount: -25.0,
    date: "2024-01-10",
    status: "completed",
  },
]

const monthlyEarnings = [
  { month: "Aug", amount: 1200 },
  { month: "Sep", amount: 1850 },
  { month: "Oct", amount: 2100 },
  { month: "Nov", amount: 1900 },
  { month: "Dec", amount: 2450 },
  { month: "Jan", amount: 2847 },
]

function getTransactionIcon(type: string) {
  switch (type) {
    case "earning":
      return <ArrowUpRight className="h-4 w-4 text-green-500" />
    case "withdrawal":
      return <ArrowDownRight className="h-4 w-4 text-blue-500" />
    case "refund":
      return <ArrowDownRight className="h-4 w-4 text-red-500" />
    default:
      return <DollarSign className="h-4 w-4" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">Completed</Badge>
    case "pending":
      return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-0">Pending</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function EarningsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const maxEarning = Math.max(...monthlyEarnings.map((m) => m.amount))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Earnings</h1>
          <p className="text-muted-foreground mt-1">Track your revenue and manage withdrawals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Wallet className="h-4 w-4 mr-2" />
            Withdraw Funds
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold mt-1">$2,847.50</p>
                <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Clearance</p>
                <p className="text-3xl font-bold mt-1">$191.25</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />3 orders clearing
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold mt-1">$2,847</p>
                <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Best month yet!
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <p className="text-3xl font-bold mt-1">$12,450</p>
                <p className="text-sm text-muted-foreground mt-1">Since joining</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-transparent p-0 gap-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Transactions
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Withdrawals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Monthly earnings for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyEarnings.map((month) => (
                    <div key={month.month} className="flex items-center gap-4">
                      <span className="w-8 text-sm text-muted-foreground">{month.month}</span>
                      <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(month.amount / maxEarning) * 100}%` }}
                        />
                      </div>
                      <span className="w-20 text-sm font-medium text-right">${month.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your withdrawal methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-muted-foreground">****4567 - Chase Bank</p>
                  </div>
                  <Badge>Primary</Badge>
                </div>
                <div className="p-4 rounded-xl border flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">john.doe@email.com</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>All your earnings and withdrawals</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Filter by date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(transaction.status)}
                      <p
                        className={`font-semibold ${
                          transaction.amount > 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Withdrawal</CardTitle>
              <CardDescription>Transfer your available balance to your payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">Available for withdrawal</p>
                <p className="text-4xl font-bold mt-2">$2,847.50</p>
                <p className="text-sm text-muted-foreground mt-2">Minimum withdrawal: $50.00</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Withdrawal Amount</label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full h-12 pl-8 pr-4 rounded-lg border bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Withdraw to</label>
                  <div className="mt-2 p-4 rounded-xl border flex items-center gap-4">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Bank Account - ****4567</p>
                      <p className="text-sm text-muted-foreground">Chase Bank</p>
                    </div>
                    <Button variant="ghost" size="sm">Change</Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing time</span>
                    <span>3-5 business days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing fee</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Request Withdrawal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
