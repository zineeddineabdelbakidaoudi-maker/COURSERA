"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import {
  Search,
  CheckCircle2,
  Filter,
  Briefcase,
  Clock,
  Users,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Navbar } from '@/components/layout/navbar';
import { AnimatedPageWrapper } from '@/components/ui/animated-page-wrapper';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function JobsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All Jobs');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [q, setQ] = useState("");

  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All Jobs']);
  const [loading, setLoading] = useState(true);

  // Proposal Form State
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      const { data: jobData } = await supabase
        .from('Job')
        .select(`
          *,
          category:Category(name_en),
          buyer:Profile!buyer_id(full_name, avatar_url, role),
          proposals:Proposal(id)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      setJobs(jobData || []);

      const { data: catData } = await supabase.from('Category').select('name_en').eq('type', 'services');
      if (catData) {
        setCategories(['All Jobs', ...catData.map(c => c.name_en)]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 50,
      y: (clientY / window.innerHeight - 0.5) * 50,
    });
  };

  const filteredJobs = jobs.filter(job => {
    const catName = job.category?.name_en || "Other";
    if (activeCategory !== 'All Jobs' && catName !== activeCategory) return false;
    if (q && !job.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const submitProposal = async (jobId: string) => {
    if (!session) {
      toast.error("Please sign in to submit a proposal");
      router.push("/login");
      return;
    }

    if (!coverLetter || !bidAmount || !deliveryTime) {
      toast.error("Please fill all proposal fields");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('Proposal').insert({
      job_id: jobId,
      seller_id: session.user.id,
      cover_letter: coverLetter,
      bid_amount_dzd: parseFloat(bidAmount),
      delivery_time: deliveryTime,
      status: 'pending',
      updated_at: new Date().toISOString()
    });

    setSubmitting(false);

    if (error) {
      toast.error("Error submitting proposal");
      console.error(error);
    } else {
      toast.success("Proposal submitted successfully!");
      setCoverLetter("");
      setBidAmount("");
      setDeliveryTime("");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f4f5] font-sans text-slate-800 selection:bg-slate-900 selection:text-white">
      <Navbar />

      <AnimatedPageWrapper>
        <main className="pt-20 relative">
          
          {/* WHITE BACKGROUND */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-[#f4f4f5]" />

          {/* --- HERO SECTION --- */}
          <section 
            className="relative overflow-hidden px-6 py-24 z-10"
            onMouseMove={handleHeroMouseMove}
          >
            <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-70">
              {/* 3D-like work symbols with parallax */}
              <div 
                className="absolute h-48 w-48 translate-x-72 -translate-y-32 rotate-12 rounded-3xl border border-slate-200 bg-white shadow-2xl transition-transform duration-500 ease-out" 
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(12deg)` }}
              >
                <Briefcase className="absolute inset-0 m-auto h-20 w-20 text-slate-100" />
              </div>
              <div 
                className="absolute h-40 w-40 -translate-x-80 translate-y-16 -rotate-12 rounded-full border border-slate-200 bg-white shadow-xl transition-transform duration-700 ease-out" 
                style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(-12deg)` }}
              >
                <Zap className="absolute inset-0 m-auto h-16 w-16 text-slate-100" />
              </div>
              <div 
                className="absolute h-[500px] w-[500px] rounded-full border border-slate-200 opacity-20 transition-transform duration-1000 ease-out" 
                style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
              />
            </div>

            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-slate-900 md:text-7xl">
                Find Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Digital Project</span>
              </h1>
              <p className="mx-auto mb-12 max-w-2xl text-lg font-medium text-slate-600 leading-relaxed">
                The premier marketplace for high-paying digital jobs in Algeria. Connect with businesses looking for your specific expertise.
              </p>

              {/* UPWORK-STYLE SEARCH & FILTERS */}
              <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <div className="relative flex items-center overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-lg transition-shadow focus-within:shadow-xl">
                  <Search className="ml-4 h-5 w-5 text-slate-400" />
                  <Input
                    className="border-none bg-transparent py-5 text-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 px-4"
                    placeholder="Search for jobs (e.g. 3D Artist, Python dev)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  <Button className="mr-1 h-12 rounded-xl bg-slate-900 px-8 text-white font-bold hover:bg-slate-800 transition-all shadow-md">
                    Find Work
                  </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={[
                        'rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 shadow-sm border',
                        activeCategory === cat
                          ? 'bg-slate-900 border-slate-900 text-white'
                          : 'bg-white border-border text-slate-600 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- JOBS LIST --- */}
          <section className="relative z-10 px-6 py-20">
            <div className="mx-auto max-w-5xl">
              <div className="mb-12 flex items-center justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Jobs you might like</h2>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{filteredJobs.length} Jobs found</span>
              </div>

              <div className="space-y-6">
                {loading ? (
                  <div className="space-y-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-[2.5rem] bg-slate-100 animate-pulse border border-border" />)}
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-24 bg-white/50 backdrop-blur-xl border border-border rounded-[3rem]">
                     <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-slate-100 border border-border flex items-center justify-center shadow-sm">
                       <Briefcase className="w-10 h-10 text-slate-400" />
                     </div>
                     <p className="text-xl font-bold text-slate-600">No jobs match your criteria.</p>
                  </div>
                ) : filteredJobs.map((job) => {
                  const postedTime = job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true }) : '';
                  const proposalsCount = job.proposals?.length || 0;
                  
                  return (
                    <div 
                      key={job.id}
                      className="group flex flex-col rounded-[2.5rem] border border-border bg-white p-8 transition-all hover:-translate-y-1 hover:border-slate-300 shadow-sm hover:shadow-xl"
                    >
                      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                        <div className="flex-1">
                          <div className="mb-3 flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer leading-tight">
                              {job.title}
                            </h3>
                            {job.buyer?.role === 'buyer' && (
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 uppercase tracking-wider text-[10px]">
                                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                                Verified Payment
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-sm font-semibold text-slate-500">
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Posted {postedTime}</span>
                            <span className="flex items-center gap-1.5 text-slate-900"><DollarSign className="h-4 w-4" /> {Number(job.budget_dzd).toLocaleString()} DZD</span>
                            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.delivery_time || "Flexible"}</span>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="shrink-0 rounded-2xl bg-slate-900 px-8 h-14 text-sm font-bold tracking-wide text-white transition-all hover:bg-slate-800 shadow-md">
                              Submit Proposal
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] border border-border shadow-2xl p-8 bg-white/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-3xl font-extrabold text-slate-900 leading-tight">{job.title}</DialogTitle>
                              <DialogDescription className="text-slate-600 pt-4 leading-relaxed text-base">
                                {job.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-8 border-t border-border pt-8">
                              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900">Required Skills</h4>
                              <div className="flex flex-wrap gap-2 mb-8">
                                {job.skills?.map((skill: string) => (
                                  <span key={skill} className="rounded-xl bg-slate-50 dark:bg-secondary/50 border border-border px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Bid Amount (DZD)</label>
                                    <Input 
                                      type="number"
                                      placeholder="e.g. 5000"
                                      value={bidAmount}
                                      onChange={e => setBidAmount(e.target.value)}
                                      className="rounded-xl border-border bg-white h-12 px-4 shadow-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Delivery Time</label>
                                    <Input 
                                      placeholder="e.g. 3 Days"
                                      value={deliveryTime}
                                      onChange={e => setDeliveryTime(e.target.value)}
                                      className="rounded-xl border-border bg-white h-12 px-4 shadow-sm"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Cover Letter</label>
                                  <textarea 
                                    className="mt-2 w-full rounded-2xl border border-border bg-white p-4 text-sm outline-none focus:border-slate-900 transition-all shadow-sm text-slate-900"
                                    placeholder="Why are you the best fit for this project? Include relevant experience and portfolio links."
                                    rows={5}
                                    value={coverLetter}
                                    onChange={e => setCoverLetter(e.target.value)}
                                  />
                                </div>
                                <Button 
                                  onClick={() => submitProposal(job.id)}
                                  disabled={submitting}
                                  className="w-full rounded-2xl bg-slate-900 h-14 text-sm font-bold tracking-wide text-white transition-all hover:bg-slate-800 mt-4 disabled:opacity-50 shadow-md"
                                >
                                  {submitting ? 'Submitting...' : 'Send Proposal'}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <p className="mb-8 line-clamp-2 text-base leading-relaxed text-slate-600">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {job.skills?.slice(0, 3).map((skill: string) => (
                            <span
                              key={skill}
                              className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills && job.skills.length > 3 && (
                             <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
                               +{job.skills.length - 3}
                             </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Users className="h-4 w-4" />
                          Proposals: <span className="text-slate-900">{proposalsCount}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredJobs.length > 0 && (
                <div className="mt-16 text-center">
                  <Button variant="outline" className="rounded-[2rem] h-14 border-border px-10 text-sm font-bold tracking-wide text-slate-900 hover:bg-slate-50 bg-white shadow-sm">
                    Load More Jobs
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* --- HOW IT WORKS (FOR FREELANCERS) --- */}
          <section className="relative z-10 px-6 py-24 border-t border-border bg-white/50">
            <div className="mx-auto max-w-7xl">
              <div className="mb-20 text-center">
                <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900">How to Get Hired</h2>
                <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium leading-relaxed">Follow our proven workflow to secure high-paying digital jobs.</p>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {[
                  { step: '01', title: 'Find Work', desc: 'Browse the latest high-end jobs and filter by your specific expertise.' },
                  { step: '02', title: 'Apply', desc: 'Submit a professional proposal showcasing your skills and portfolio.' },
                  { step: '03', title: 'Get Paid', desc: 'Complete the project and receive your payment securely via DIGITHUB.' },
                ].map((s) => (
                  <div key={s.step} className="text-center group bg-white p-10 rounded-[3rem] border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 shadow-sm border border-border transition-transform group-hover:scale-110">
                      <span className="text-2xl font-black text-slate-900">{s.step}</span>
                    </div>
                    <h3 className="mb-4 text-xl font-extrabold uppercase tracking-wide text-slate-900">{s.title}</h3>
                    <p className="text-base leading-relaxed font-medium text-slate-600">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </AnimatedPageWrapper>
    </div>
  );
}
