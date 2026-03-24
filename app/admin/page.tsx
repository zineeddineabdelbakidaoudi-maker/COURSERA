"use client"

import React from "react"
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Revenue", value: "8,450,000 DZD", icon: CreditCard, trend: "+12.5%" },
    { label: "Active Services", value: "4,510", icon: Briefcase, trend: "+3.2%" },
    { label: "Verified Users", value: "1,240", icon: Users, trend: "+8.1%" },
    { label: "Pending Verifications", value: "32", icon: ShieldAlert, trend: "Requires Action", alert: true },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-semibold mb-2">Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. System is running smoothly.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-card rounded-2xl border ${stat.alert ? 'border-warning/50 shadow-sm' : 'border-border'} p-6`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.alert ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {!stat.alert && (
                <div className="flex items-center gap-1 text-success text-sm font-medium">
                  {stat.trend}
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-semibold tracking-tight">{stat.value}</h3>
              {stat.alert && (
                <p className="text-sm text-warning font-medium mt-2">{stat.trend}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tables & Queues (Mockup for now) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Approvals */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Recent Seller Activations</h3>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-sm font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">ID Verification Passed</p>
                  </div>
                </div>
                <div className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded">
                  Approved
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged Disputes */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-foreground">Active Disputes</h3>
            <button className="text-sm text-primary font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4 flex flex-col items-center justify-center h-48">
            <AlertTriangle className="w-8 h-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No active disputes requiring mediation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
