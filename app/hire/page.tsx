"use client"

import React, { useRef, useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Search,
  ShoppingBag,
  Star,
  MapPin,
  Briefcase,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

type Freelancer = {
  name: string;
  role: string;
  rating: number | string;
  jobSuccess: number;
  earned: string;
  hourlyRate: string;
  location: string;
  bio: string;
  skills: string[];
  imageUrl: string;
};

const hardcodedFreelancers: Freelancer[] = [
  {
    name: 'Amine K.',
    role: 'Senior UI/UX Designer',
    rating: 4.9,
    jobSuccess: 100,
    earned: '1.2M+ DZD',
    hourlyRate: '4500 DZD/hr',
    location: 'Algiers, Algeria',
    bio: 'Specializing in high-end 3D interfaces and conversion-optimized SaaS platforms.',
    skills: ['Figma', 'Spline', 'Webflow', 'Next.js'],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Sarah B.',
    role: 'Full-Stack Developer',
    rating: 5.0,
    jobSuccess: 98,
    earned: '850K+ DZD',
    hourlyRate: '5200 DZD/hr',
    location: 'Oran, Algeria',
    bio: 'Building scalable web applications with a focus on performance and clean architecture.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Mehdi L.',
    role: '3D Artist & Motion Designer',
    rating: 4.8,
    jobSuccess: 95,
    earned: '600K+ DZD',
    hourlyRate: '3800 DZD/hr',
    location: 'Constantine, Algeria',
    bio: 'Creating immersive 3D experiences and high-end product visualizations.',
    skills: ['Blender', 'After Effects', 'Three.js', 'Cinema 4D'],
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  },
];

const categories = [
  'All Talent',
  'UI/UX Design',
  'Web Development',
  '3D Modeling',
  'Digital Marketing',
  'Content Writing',
];

function TiltCard({ children, className = '' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    setStyle({
      transform: `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.01, 1.01, 1.01)`,
      transition: 'transform 0.1s ease-out',
      zIndex: 10,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out',
      zIndex: 1,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`will-change-transform ${className}`}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={style}
    >
      {children}
    </div>
  );
}

export default function HirePage() {
  const supabase = createClient();
  const [activeCategory, setActiveCategory] = useState('All Talent');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [freelancers, setFreelancers] = useState<Freelancer[]>(hardcodedFreelancers);

  useEffect(() => {
    async function fetchSellers() {
      const { data } = await supabase.from('Profile').select('*').in('role', ['seller', 'publisher']);
      if (data && data.length > 0) {
        const dbFreelancers = data.map((f: any) => ({
          name: f.full_name || f.username || 'Anonymous',
          role: f.seller_level === 'elite' ? 'Elite Seller' : 'Freelancer',
          rating: f.rating_avg || 5.0,
          jobSuccess: 100,
          earned: `${f.balance || 0} DZD`,
          hourlyRate: 'Custom Rate',
          location: 'Algeria',
          bio: f.bio || 'Professional freelancer',
          skills: f.skills || ['Digital Skills'],
          imageUrl: f.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
        }));
        setFreelancers([...dbFreelancers, ...hardcodedFreelancers]);
      }
    }
    fetchSellers();
  }, [supabase]);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 40,
      y: (clientY / window.innerHeight - 0.5) * 40,
    });
  };

  const filteredFreelancers = freelancers.filter(f => {
    if (activeCategory === 'All Talent') return true;
    if (activeCategory === 'Web Development' && (f.role.includes('Developer') || f.bio.includes('Web'))) return true;
    if (activeCategory === 'UI/UX Design' && (f.role.includes('Design') || f.bio.includes('UI/UX'))) return true;
    if (activeCategory === '3D Modeling' && (f.role.includes('3D') || f.bio.includes('Immersive'))) return true;
    return false;
  });

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] font-sans text-gray-900 selection:bg-black selection:text-white">      <main className="pt-20">
        {/* --- HERO SECTION --- */}
        <section 
          className="relative overflow-hidden bg-white px-6 py-24"
          onMouseMove={handleHeroMouseMove}
        >
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-30">
            {/* 3D-like background shapes with parallax */}
            <div 
              className="absolute h-64 w-64 translate-x-48 -translate-y-24 rotate-45 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-2xl transition-transform duration-500 ease-out" 
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(45deg)` }}
            />
            <div 
              className="absolute h-48 w-48 -translate-x-64 translate-y-12 rotate-12 rounded-full border border-gray-100 bg-gradient-to-tr from-gray-50 to-white shadow-xl transition-transform duration-700 ease-out" 
              style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px) rotate(12deg)` }}
            />
            <div 
              className="absolute h-[600px] w-[600px] rounded-full border border-gray-100 opacity-20 transition-transform duration-1000 ease-out" 
              style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-medium tracking-tight text-black md:text-7xl">
              Hire Top-Tier <br />
              <span className="text-black">Digital Talent</span>
            </h1>
            <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500">
              The premier marketplace for elite Algerian freelancers. From expert developers to visionary 3D artists.
            </p>

            {/* UPWORK-STYLE SEARCH & FILTERS */}
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              <div className="relative flex items-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-lg transition-shadow focus-within:shadow-xl">
                <Search className="ml-4 h-5 w-5 text-gray-400" />
                <Input
                  className="border-none bg-transparent py-6 text-lg placeholder:text-gray-400 focus-visible:ring-0"
                  placeholder="Search for skills (e.g. React, 3D Modeling, Python)"
                />
                <Button className="mr-1 h-12 rounded-xl bg-black px-8 text-white hover:bg-gray-800">
                  Search
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

        {/* --- FREELANCER GRID --- */}
        <section className="bg-[#fafafa] px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-2xl font-medium tracking-tight text-black">Recommended Talent</h2>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">{filteredFreelancers.length} Profiles found</span>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredFreelancers.map((f) => (
                <TiltCard
                  key={f.name}
                  className="group flex flex-col rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                >
                  <div className="mb-6 flex items-start gap-5">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                      <ImageWithFallback
                        alt={f.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={f.imageUrl}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-black group-hover:text-gray-700 transition-colors">
                        {f.name}
                      </h3>
                      <p className="text-sm font-medium text-gray-500">{f.role}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 border-none font-semibold">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Top Rated
                        </Badge>
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-600">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          {f.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-3 gap-4 border-y border-gray-50 py-4">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Job Success</p>
                      <p className="text-sm font-bold text-black">{f.jobSuccess}%</p>
                    </div>
                    <div className="text-center border-x border-gray-50">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Earned</p>
                      <p className="text-sm font-bold text-black">{f.earned}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Rate</p>
                      <p className="text-sm font-bold text-black">{f.hourlyRate}</p>
                    </div>
                  </div>

                  <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-gray-500">
                    {f.bio}
                  </p>

                  <div className="mb-8 flex flex-wrap gap-2">
                    {f.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <Button className="flex-1 rounded-2xl bg-black py-6 text-xs font-semibold tracking-wide text-white transition-all hover:bg-gray-800">
                      Contact Freelancer
                    </Button>
                    <button className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-white transition-colors hover:bg-gray-50">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* --- WHY CHOOSE DIGITHUB (PROFESSIONAL VALUE PROPS) --- */}
        <section className="bg-white px-6 py-24 border-t border-gray-100">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Why Businesses Choose DIGITHUB</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Access the top 3% of digital talent in Algeria through our secure and professional platform.</p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {[
                { 
                  icon: CheckCircle2, 
                  title: 'Rigorous Vetting', 
                  desc: 'Every freelancer undergoes a strict review of their portfolio, technical skills, and professional reliability.' 
                },
                { 
                  icon: ShieldCheck, 
                  title: 'Secure Payments', 
                  desc: 'Payments are held in escrow and only released when you are 100% satisfied with the delivered work.' 
                },
                { 
                  icon: Zap, 
                  title: 'Quality Assurance', 
                  desc: 'Our dedicated support team ensures every project meets international standards of digital excellence.' 
                },
              ].map((prop) => (
                <div key={prop.title} className="group p-8 rounded-[2rem] border border-gray-50 bg-[#fafafa] transition-all hover:bg-white hover:shadow-xl hover:border-gray-100">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                    <prop.icon className="h-7 w-7 text-black" />
                  </div>
                  <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-black">{prop.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{prop.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      
    </div>
  );
}
