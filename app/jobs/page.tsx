"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
import { createClient } from '@/lib/supabase/client';

type Job = {
  id: string;
  title: string;
  postedTime: string;
  proposals: string;
  budget: string;
  level: string;
  type: string;
  description: string;
  category: string;
  ownerVerified: boolean;
  skills: string[];
};

const hardcodedJobs: Job[] = [
  {
    id: '1',
    title: '3D Landing Page for E-commerce Platform',
    postedTime: '2 hours ago',
    proposals: '10 to 15',
    budget: '45,000 DZD',
    level: 'Expert',
    type: 'Fixed-price',
    description: 'We are looking for a visionary 3D designer to create an immersive landing page for our new tech store. Must be proficient in Spline and React Three Fiber.',
    category: '3D Modeling',
    ownerVerified: true,
    skills: ['Spline', 'React', 'Three.js', 'UI/UX'],
  },
  {
    id: '2',
    title: 'Python Automation Script for Real Estate',
    postedTime: '5 hours ago',
    proposals: '5 to 10',
    budget: '3,500 DZD / hr',
    level: 'Intermediate',
    type: 'Hourly',
    description: 'Need a developer to build a web scraper that collects property data from Ouedkniss and saves it to a Notion database.',
    category: 'Automation',
    ownerVerified: true,
    skills: ['Python', 'BeautifulSoup', 'Notion API', 'Automation'],
  },
  {
    id: '3',
    title: 'Complete Branding & Logo Design for Startup',
    postedTime: '1 day ago',
    proposals: '20 to 30',
    budget: '25,000 DZD',
    level: 'Intermediate',
    type: 'Fixed-price',
    description: 'Looking for a creative graphic designer to build our brand identity from scratch. Includes logo, typography, and color palette.',
    category: 'Design',
    ownerVerified: false,
    skills: ['Adobe Illustrator', 'Branding', 'Typography', 'Logo Design'],
  },
];

const categories = ['All Jobs', 'UI/UX Design', 'Web Dev', '3D Art', 'Automation', 'Video Editing'];

export default function JobsPage() {
  const supabase = createClient();
  const [activeCategory, setActiveCategory] = useState('All Jobs');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDBJobs() {
      const { data } = await supabase.from('Job').select('*').eq('status', 'open').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        const newJobs = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          postedTime: new Date(d.created_at).toLocaleDateString(),
          proposals: '0',
          budget: `${parseFloat(d.budget).toLocaleString()} DZD`,
          level: d.experience_level || 'Intermediate',
          type: 'Fixed-price',
          description: d.description,
          category: d.category,
          ownerVerified: true,
          skills: d.skills || [],
        }));
        
        const merged = dbJobs || [];
        setJobs(merged);
      }
    }
    fetchDBJobs();
  }, [supabase]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 50,
      y: (clientY / window.innerHeight - 0.5) * 50,
    });
  };

  const filteredJobs = jobs.filter(job => {
    if (activeCategory === 'All Jobs') return true;
    return job.category.includes(activeCategory) || job.skills.some(s => s.includes(activeCategory));
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans text-gray-900 selection:bg-black selection:text-white">      <main className="pt-20">
        <section 
          className="relative overflow-hidden bg-white px-6 py-24 border-b border-gray-50"
          onMouseMove={handleHeroMouseMove}
        >
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-20">
            <div 
              className="absolute h-48 w-48 translate-x-72 -translate-y-32 rotate-12 rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-2xl transition-transform duration-500 ease-out" 
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(12deg)` }}
            >
              <Briefcase className="absolute inset-0 m-auto h-20 w-20 text-gray-200" />
            </div>
            <div 
              className="absolute h-40 w-40 -translate-x-80 translate-y-16 -rotate-12 rounded-full border border-gray-200 bg-gradient-to-tr from-gray-50 to-white shadow-xl transition-transform duration-700 ease-out" 
              style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(-12deg)` }}
            >
              <Zap className="absolute inset-0 m-auto h-16 w-16 text-gray-200" />
            </div>
            <div 
              className="absolute h-[500px] w-[500px] rounded-full border border-gray-100 opacity-20 transition-transform duration-1000 ease-out" 
              style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-medium tracking-tight text-black md:text-7xl">
              Find Your Next <br />
              <span className="text-black">Digital Project</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500">
              The premier marketplace for high-paying digital jobs in Algeria. Connect with businesses looking for your specific expertise.
            </p>

            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              <div className="relative flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-shadow focus-within:shadow-lg">
                <Search className="ml-4 h-5 w-5 text-gray-400" />
                <Input
                  className="border-none bg-transparent py-6 text-lg placeholder:text-gray-400 focus-visible:ring-0"
                  placeholder="Search for jobs (e.g. 3D Artist, Python dev)"
                />
                <Button className="mr-1 h-12 rounded-xl bg-black px-8 text-white hover:bg-gray-800">
                  Find Work
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={[
                      'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                      activeCategory === cat
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black',
                    ].join(' ')}
                  >
                    {cat}
                  </button>
                ))}
                <button className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-500 hover:border-black hover:text-black transition-colors">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tight text-black">Jobs you might like</h2>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{filteredJobs.length} Jobs found</span>
            </div>

            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className="group flex flex-col rounded-3xl border border-gray-100 bg-white p-8 transition-all hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-medium text-black group-hover:text-gray-700 transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                        {job.ownerVerified && (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-none font-semibold">
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Payment Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Posted {job.postedTime}</span>
                        <span className="flex items-center gap-1 font-medium text-black"><DollarSign className="h-4 w-4" /> {job.budget}</span>
                        <span className="font-medium text-gray-400">• {job.type}</span>
                        <span className="font-medium text-gray-400">• {job.level}</span>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="rounded-full bg-black px-8 py-6 text-sm font-semibold tracking-wide text-white transition-all hover:bg-gray-800">
                          Submit Proposal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] rounded-[2rem] border-none shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-medium">{job.title}</DialogTitle>
                          <DialogDescription className="text-gray-500 pt-2 leading-relaxed">
                            {job.description}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 border-t border-gray-100 pt-6">
                          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-black">Required Skills</h4>
                          <div className="flex flex-wrap gap-2 mb-8">
                            {job.skills.map(skill => (
                              <span key={skill} className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-100">
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Cover Letter</label>
                              <textarea 
                                className="mt-2 w-full rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm outline-none focus:border-black transition-colors"
                                placeholder="Why are you the best fit for this project?"
                                rows={4}
                              />
                            </div>
                            <Button className="w-full rounded-2xl bg-black py-7 text-sm font-semibold tracking-wide text-white transition-all hover:bg-gray-800">
                              Send Proposal
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-6">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-100"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                      <Users className="h-3 w-3" />
                      Proposals: <span className="text-black font-bold">{job.proposals}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-full border-gray-200 px-10 py-6 text-sm font-semibold tracking-wide text-black hover:bg-gray-50">
                Load More Jobs
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#FAFAFA] px-6 py-24 border-t border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">How to Get Hired</h2>
              <p className="text-gray-500">Follow our proven workflow to secure high-paying digital jobs.</p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { step: '01', title: 'Find Work', desc: 'Browse the latest high-end jobs and filter by your specific expertise.' },
                { step: '02', title: 'Apply', desc: 'Submit a professional proposal showcasing your skills and portfolio.' },
                { step: '03', title: 'Get Paid', desc: 'Complete the project and receive your payment securely via DIGITHUB.' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <span className="text-xl font-bold text-black">{s.step}</span>
                  </div>
                  <h3 className="mb-3 text-lg font-bold uppercase tracking-wide text-black">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
