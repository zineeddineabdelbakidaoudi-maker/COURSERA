"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  Users,
  Briefcase,
  Package,
  ShoppingCart,
  ShieldAlert,
  ArrowUpRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
    products: 0,
    orders: 0,
    pendingVerifications: 0,
    disputes: 0,
  })
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [
        { count: userCount },
        { count: serviceCount },
        { count: productCount },
        { count: orderCount },
        { count: pendingCount },
        { data: recentUserData },
        { data: recentOrderData },
      ] = await Promise.all([
        supabase.from("Profile").select("id", { count: "exact" }),
        supabase.from("Service").select("id", { count: "exact" }),
        supabase.from("DigitalProduct").select("id", { count: "exact" }),
        supabase.from("Order").select("id", { count: "exact" }),
        supabase.from("Profile").select("id", { count: "exact" }).eq("verification_status", "pending"),
        supabase.from("Profile").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("Order").select("id, status, price_dzd, created_at, buyer:Profile!buyer_id(full_name), service:Service(title)").order("created_at", { ascending: false }).limit(5),
      ])

      setStats({
        users: userCount || 0,
        services: serviceCount || 0,
        products: productCount || 0,
        orders: orderCount || 0,
        pendingVerifications: pendingCount || 0,
        disputes: 0,
      })
      setRecentUsers(recentUserData || [])
      setRecentOrders(recentOrderData || [])
    } catch (e) {
      console.error("Admin stats error:", e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const kpis = [
    { label: "Total Users", value: stats.users.toLocaleString(), icon: Users, trend: null, alert: false },
    { label: "Active Services", value: stats.services.toLocaleString(), icon: Briefcase, trend: null, alert: false },
    { label: "Digital Products", value: stats.products.toLocaleString(), icon: Package, trend: null, alert: false },
    { label: "Pending Verifications", value: stats.pendingVerifications.toString(), icon: ShieldAlert, trend: stats.pendingVerifications > 0 ? "Requires Action" : "All clear", alert: stats.pendingVerifications > 0 },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">Live platform statistics. All data from Supabase.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((stat, i) => (
          <div key={i} className={`bg-card rounded-2xl border ${stat.alert ? "border-orange-400/50" : "border-border"} p-6 shadow-sm`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.alert ? "bg-orange-500/10 text-orange-500" : "bg-primary/10 text-primary"}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.alert && stat.value !== "0" && (
                <span className="text-xs font-semibold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">Action needed</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold">{stat.value}</h3>
            {stat.alert && (
              <Link href="/admin/verifications" className="text-xs text-orange-500 font-medium hover:underline mt-2 block">
                Review verifications →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Total Orders & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Users</h3>
            <Link href="/admin/users" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users registered yet.</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">{u.full_name?.charAt(0) || "U"}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground capitalize">{u.role} · {new Date(u.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ShoppingCart className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-sm">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{o.service?.title || "Order"}</p>
                    <p className="text-xs text-muted-foreground">{o.buyer?.full_name} · {new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{parseFloat(o.price_dzd || 0).toLocaleString()} DZD</p>
                    <p className="text-xs capitalize text-muted-foreground">{o.status?.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Manage Users", href: "/admin/users", icon: Users },
          { label: "Services", href: "/admin/services", icon: Briefcase },
          { label: "Digital Products", href: "/admin/products", icon: Package },
          { label: "Verifications", href: "/admin/verifications", icon: ShieldAlert },
        ].map(q => (
          <Link key={q.href} href={q.href} className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all shadow-sm group">
            <q.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-sm font-medium">{q.label}</span>
            <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}
