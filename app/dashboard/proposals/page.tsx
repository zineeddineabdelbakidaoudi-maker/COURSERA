"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { FileText, Clock, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"

export default function SellerProposalsPage() {
  const supabase = createClient()
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProposals() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("Proposal")
        .select("*, job:Job(title, budget_dzd, status)")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setProposals(data)
      }
      setLoading(false)
    }
    fetchProposals()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Proposals</h1>
          <p className="text-muted-foreground mt-1">Track the status of jobs you've applied for.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border mt-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No proposals yet</h3>
          <p className="text-muted-foreground mb-6">Start browsing jobs and submit proposals to get hired.</p>
          <Button asChild className="bg-black hover:bg-gray-800 text-white rounded-xl">
            <Link href="/jobs"><Search className="h-4 w-4 mr-2" /> Find Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {proposals.map((prop) => (
            <div key={prop.id} className="bg-card border border-border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/jobs`} className="text-lg font-bold hover:underline">{prop.job?.title || "Unknown Job"}</Link>
                    <Badge variant="secondary" className={
                      prop.status === 'pending' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      prop.status === 'accepted' ? "bg-green-50 text-green-700 border-green-200" :
                      prop.status === 'rejected' ? "bg-red-50 text-red-700 border-red-200" :
                      "bg-gray-100 text-gray-700 border-gray-200"
                    }>
                      {prop.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl mb-4 italic px-4 py-2 bg-muted/50 rounded-lg border border-border/50">
                    "{prop.cover_letter}"
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" /> Submitted {prop.created_at ? formatDistanceToNow(new Date(prop.created_at), { addSuffix: true }) : ""}
                    </span>
                    <span className="text-black bg-gray-100 px-2 py-0.5 rounded-md">Bid: {Number(prop.bid_amount_dzd).toLocaleString()} DZD</span>
                    <span className="text-black bg-gray-100 px-2 py-0.5 rounded-md">Time: {prop.delivery_time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
