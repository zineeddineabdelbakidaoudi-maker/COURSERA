"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Plus, Briefcase, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default function BuyerJobsPage() {
  const supabase = createClient()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("Job")
        .select("*, proposals:Proposal(id)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        setJobs(data)
      }
      setLoading(false)
    }
    fetchJobs()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage the jobs you've posted and review proposals.</p>
        </div>
        <Button asChild className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md border-0">
          <Link href="/dashboard/buyer/jobs/create">
            <Plus className="h-4 w-4" />
            Post a Job
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border mt-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No jobs posted yet</h3>
          <p className="text-muted-foreground mb-6">Create your first job post to start receiving proposals from talented freelancers.</p>
          <Button asChild>
            <Link href="/dashboard/buyer/jobs/create">Post a Job Now</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 mt-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-card border border-border rounded-xl p-6 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{job.title}</h3>
                    <Badge variant="secondary" className={
                      job.status === 'open' ? "bg-green-50 text-green-700 border-green-200" :
                      job.status === 'in_progress' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-gray-100 text-gray-700 border-gray-200"
                    }>
                      {job.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 max-w-3xl mb-4">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                    <span className="flex items-center gap-1"><FileText className="h-4 w-4" /> {job.proposals?.length || 0} Proposals</span>
                  </div>
                </div>
                <div className="flex md:flex-col justify-end gap-2 md:w-32">
                  <Button variant="outline" className="w-full">View Details</Button>
                  <Button variant="default" className="w-full bg-black hover:bg-gray-800 text-white shadow-none">Review</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
