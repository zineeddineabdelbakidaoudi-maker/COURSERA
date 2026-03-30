"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { FileText, Clock, Search, DollarSign } from "lucide-react"
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Proposals</h1>
          <p className="text-slate-500 mt-1 font-medium">Track the status of jobs you've applied for and manage your bids.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 shadow-sm">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 mt-6 shadow-sm">
          <div className="mx-auto w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 border border-slate-100">
            <FileText className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No proposals yet</h3>
          <p className="text-slate-500 mb-8 font-medium max-w-sm mx-auto">Start browsing high-end jobs and submit tailored proposals to win your next project.</p>
          <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 px-8 font-bold shadow-lg transition-all hover:scale-105">
            <Link href="/jobs"><Search className="h-4 w-4 mr-2" /> Find Jobs</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 mt-6">
          {proposals.map((prop) => (
            <div key={prop.id} className="bg-white border border-slate-100 rounded-[2rem] p-8 transition-all hover:shadow-xl hover:border-slate-200 group">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <Link href={`/jobs`} className="text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">{prop.job?.title || "Unknown Job"}</Link>
                    <Badge variant="secondary" className={
                      `px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${
                        prop.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-200" :
                        prop.status === 'accepted' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        prop.status === 'rejected' ? "bg-rose-50 text-rose-700 border-rose-200" :
                        "bg-slate-100 text-slate-700 border-slate-200"
                      }`
                    }>
                      {prop.status}
                    </Badge>
                  </div>
                  
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 mb-6 relative">
                    <p className="text-slate-600 text-sm leading-relaxed italic line-clamp-3">
                      "{prop.cover_letter}"
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 text-sm font-bold">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4.5 w-4.5 text-slate-300" /> 
                      Submitted {prop.created_at ? formatDistanceToNow(new Date(prop.created_at), { addSuffix: true }) : ""}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-100">
                       <DollarSign className="h-4 w-4 text-emerald-600" />
                       <span className="text-emerald-700">{Number(prop.bid_amount_dzd).toLocaleString()} DZD</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-700">
                       <Clock className="h-4 w-4" />
                       <span>{prop.delivery_time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center md:items-start justify-end">
                   <Button variant="ghost" className="rounded-xl text-slate-400 hover:text-slate-900 font-bold" asChild>
                     <Link href="/dashboard/messages">Contact Client</Link>
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
