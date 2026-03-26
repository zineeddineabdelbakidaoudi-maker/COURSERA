"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, DollarSign, Star, Briefcase, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function AnalyticsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ earnings: 0, ordersCompleted: 0, avgRating: 0, services: 0 })
  const [services, setServices] = useState<any[]>([])

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    // Orders as seller
    const { data: orders } = await supabase
      .from("Order")
      .select("price_dzd, status, service_id")
      .eq("seller_id", user.id)

    const completed = (orders || []).filter(o => o.status === "completed")
    const earnings = completed.reduce((sum, o) => sum + parseFloat(o.price_dzd || 0), 0)

    // Reviews
    const { data: reviews } = await supabase
      .from("Review")
      .select("rating_overall")
      .eq("reviewed_user_id", user.id)
    const avgRating = reviews && reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating_overall, 0) / reviews.length)
      : 0

    // My services
    const { data: svcData } = await supabase
      .from("Service")
      .select("id, title, status")
      .eq("seller_id", user.id)

    setStats({
      earnings,
      ordersCompleted: completed.length,
      avgRating: parseFloat(avgRating.toFixed(1)),
      services: (svcData || []).length,
    })
    setServices(svcData || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const statCards = [
    { label: "Total Earnings", value: `${stats.earnings.toLocaleString()} DZD`, icon: DollarSign, color: "text-green-500" },
    { label: "Orders Completed", value: stats.ordersCompleted.toString(), icon: BarChart3, color: "text-purple-500" },
    { label: "Avg. Rating", value: stats.avgRating > 0 ? `${stats.avgRating} ★` : "N/A", icon: Star, color: "text-amber-500" },
    { label: "My Services", value: stats.services.toString(), icon: Briefcase, color: "text-blue-500" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground">Track your performance and earnings.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border-border shadow-sm">
              <CardContent className="p-5">
                <Icon className={`w-5 h-5 ${s.color} mb-3`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />My Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No services published yet.</p>
          ) : (
            <div className="space-y-3">
              {services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium">{svc.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${svc.status === "live" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}`}>
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
