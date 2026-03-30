"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { 
  ArrowLeft, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  ShieldCheck,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

export default function BuyerJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()
  
  const [job, setJob] = useState<any>(null)
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch Job Details
      const { data: jobData } = await supabase
        .from("Job")
        .select(`
          *,
          category:Category(name_en)
        `)
        .eq("id", id)
        .eq("buyer_id", user.id)
        .single()

      if (jobData) {
        setJob(jobData)
        
        // Fetch Proposals
        const { data: propData } = await supabase
          .from("Proposal")
          .select(`
            *,
            seller:Profile!seller_id(id, full_name, avatar_url, username, seller_level, bio)
          `)
          .eq("job_id", id)
          .order("created_at", { ascending: false })
          
        setProposals(propData || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  const handleUpdateStatus = async (proposalId: string, newStatus: string) => {
    setUpdating(proposalId)
    try {
      const { error } = await supabase
        .from("Proposal")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", proposalId)

      if (error) throw error

      setProposals(prev => prev.map((p: any) => p.id === proposalId ? { ...p, status: newStatus } : p))
      toast.success(`Proposal ${newStatus} successfully`)
      
      // If accepted, we might want to update job status or create an order
      if (newStatus === "accepted") {
         await supabase.from("Job").update({ 
           status: "in_progress",
           updated_at: new Date().toISOString()
         }).eq("id", id)
         
         // Create Notification for Seller
         const sellerId = proposals.find(p => p.id === proposalId)?.seller_id
         if (sellerId) {
            await supabase.from("Notification").insert({
               id: crypto.randomUUID(),
               user_id: sellerId,
               type: 'success',
               title: 'Proposal Accepted!',
               body: `Your proposal for the job "${job.title}" has been accepted!`,
               link: `/dashboard/proposals`,
               is_read: false
            })
         }

         setJob((prev: any) => ({ ...prev, status: "in_progress" }))
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-border">
        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold">Job not found</h3>
        <p className="text-muted-foreground mb-6">This job may have been deleted or you don't have permission to view it.</p>
        <Button asChild variant="outline">
          <Link href="/dashboard/buyer/jobs">Back to My Jobs</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-white shadow-sm border">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <Badge variant="outline" className="bg-slate-50 border-slate-200 uppercase text-[10px] font-bold">
                {job.status.replace("_", " ")}
              </Badge>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl font-semibold">Edit Job</Button>
           <Button className="bg-slate-900 text-white rounded-xl shadow-md font-bold">Manage Budget</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Proposals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Proposals ({proposals.length})
            </h2>
          </div>

          {proposals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No proposals received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((prop) => {
                const seller = prop.seller || {}
                const initials = seller.full_name?.split(" ").map((n: any) => n[0]).join("").toUpperCase().slice(0, 2) || "U"
                
                return (
                  <div key={prop.id} className="bg-white border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Avatar className="h-16 w-16 border-2 border-slate-50 shadow-sm cursor-pointer" onClick={() => router.push(`/sellers/${seller.username}`)}>
                        <AvatarImage src={seller.avatar_url || ""} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-bold hover:text-indigo-600 transition-colors cursor-pointer" onClick={() => router.push(`/sellers/${seller.username}`)}>
                              {seller.full_name}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                              <span className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-current" /> 5.0</span>
                              <span>•</span>
                              <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[10px] uppercase font-bold">
                                {seller.seller_level} Seller
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {prop.status === "pending" ? (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(prop.id, "rejected")}
                                  disabled={updating === prop.id}
                                  className="text-red-500 hover:bg-red-50 rounded-xl"
                                >
                                  <XCircle className="h-4 w-4 mr-2" /> Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleUpdateStatus(prop.id, "accepted")}
                                  disabled={updating === prop.id}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" /> Accept Proposal
                                </Button>
                              </>
                            ) : (
                              <Badge className={
                                prop.status === "accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                "bg-red-50 text-red-700 border-red-200"
                              }>
                                {prop.status.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 mb-4">
                          <p className="text-slate-600 text-sm leading-relaxed italic">
                            "{prop.cover_letter}"
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                          <div className="flex items-center gap-1.5 text-slate-900">
                             <DollarSign className="h-4 w-4 text-emerald-600" />
                             {Number(prop.bid_amount_dzd).toLocaleString()} DZD
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                             <Clock className="h-4 w-4" />
                             {prop.delivery_time}
                          </div>
                          <Link href={`/dashboard/messages?id=${seller.id}`} className="flex items-center gap-1.5 text-indigo-600 hover:underline">
                             <MessageSquare className="h-4 w-4" />
                             Contact Freelancer
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar Info: Job Details Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-6 pb-4 border-b">Job Summary</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Category</label>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  {job.category?.name_en || "General"}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Budget</label>
                <div className="text-xl font-black text-slate-900">
                  {Number(job.budget_dzd).toLocaleString()} <span className="text-sm font-bold">DZD</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Desired Timeline</label>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-slate-400" />
                  {job.delivery_time || "Flexible"}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Required Skills</label>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill: string) => (
                    <span key={skill} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <p className="text-xs font-medium text-blue-700 leading-snug">
                    Payments are handled securely via Digithub Escrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
