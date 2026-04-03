"use client"

import React, { useRef, useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Search,
  ShoppingBag,
  Star,
  ChevronDown,
  Filter,
  Users,
  Clock,
  Layout,
  Code,
  Zap,
  Globe,
  BrainCircuit,
  MoreHorizontal,
  Camera,
  Music,
  PenTool,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

type Course = {
  id: number | string;
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  students: number;
  duration: string;
  badge?: string;
  date: string;
};

const hardcodedCourses: Course[] = [
  {
    id: 1,
    title: 'Advanced UI/UX Design',
    price: 4500,
    category: 'Design',
    description: 'Learn to build world-class interfaces with Figma and Next.js.',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    students: 1240,
    duration: '12h 30m',
    badge: 'Bestseller',
    date: '2024-03-01'
  },
  {
    id: 2,
    title: 'Full-Stack Automation',
    price: 6200,
    category: 'Automation',
    description: 'Automate business workflows using Python and Zapier.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    students: 850,
    duration: '15h 45m',
    date: '2024-02-15'
  },
  {
    id: 3,
    title: 'Digital Marketing Pro',
    price: 3800,
    category: 'Marketing',
    description: 'Master social media algorithms and paid ads for MENA region.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    students: 2100,
    duration: '10h 20m',
    badge: 'New',
    date: '2024-03-10'
  },
  {
    id: 4,
    title: 'AI Engineering with Python',
    price: 8500,
    category: 'AI',
    description: 'Build and deploy LLM-powered applications from scratch.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    students: 420,
    duration: '22h 15m',
    badge: 'Premium',
    date: '2024-03-25'
  },
  {
    id: 5,
    title: 'Webflow for Freelancers',
    price: 2500,
    category: 'Development',
    description: 'Launch high-paying websites without writing complex code.',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    students: 1560,
    duration: '8h 50m',
    date: '2024-01-20'
  },
  {
    id: 6,
    title: 'Copywriting That Sells',
    price: 1800,
    category: 'Marketing',
    description: 'Master the art of persuasive writing for digital products.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    students: 980,
    duration: '6h 15m',
    date: '2024-02-28'
  }
];

const categories = [
  { name: 'All', icon: Globe },
  { name: 'Design', icon: Layout },
  { name: 'Development', icon: Code },
  { name: 'Automation', icon: Zap },
  { name: 'Marketing', icon: ShoppingBag },
  { name: 'AI', icon: BrainCircuit }
];

const otherCategories = [
  { name: 'Photography', icon: Camera },
  { name: 'Music', icon: Music },
  { name: 'Content Creation', icon: PenTool },
  { name: 'Business', icon: BarChart3 },
  { name: 'Finance', icon: TrendingUp }
];

const footerColumns = [
  {
    title: 'Platform',
    links: ['About Us', 'Become a Publisher', 'Careers', 'Affiliate Program'],
  },
  {
    title: 'Browse',
    links: ['Premium Courses', 'Notion Templates', 'Automation Scripts', 'Hire Freelancers'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy'],
  },
];

function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    setStyle({
      transform: `perspective(1000px) rotateX(${y * -10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`,
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

function CourseCard({ course }: { course: Course }) {
  return (
    <TiltCard className="group cursor-pointer rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
      <div className="relative mb-6 h-52 overflow-hidden rounded-2xl bg-gray-50">
        {course.badge && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            {course.badge}
          </span>
        )}
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold backdrop-blur-md">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          {course.rating.toFixed(1)}
        </div>
        <ImageWithFallback
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={course.imageUrl}
        />
      </div>

      <div className="px-2 pb-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{course.category}</span>
          <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {course.students}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-semibold leading-tight text-black group-hover:text-gray-700 transition-colors line-clamp-1">
          {course.title}
        </h3>

        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-xl font-bold text-black">{course.price === 0 ? 'Free' : `${course.price} DZD`}</span>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-black transition-all hover:bg-black hover:text-white">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

export default function CoursesPage() {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDBProducts() {
      const { data } = await supabase.from('DigitalProduct').select('*').eq('category', 'Course').eq('status', 'live');
      if (data && data.length > 0) {
        const dbCourses = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: parseFloat(d.price) || 0,
          category: 'Development', // default fallback, could be smarter
          description: d.description || 'Instructor course',
          imageUrl: d.cover_image || 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80',
          rating: 5.0,
          students: 0,
          duration: '10h 0m',
          badge: 'New',
          date: d.created_at
        }));
        setCourses(dbCourses || []);
      }
    }
    fetchDBProducts();
  }, [supabase]);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceRange === 'all' || 
                         (priceRange === 'under-3000' && course.price < 3000) ||
                         (priceRange === '3000-6000' && course.price >= 3000 && course.price <= 6000) ||
                         (priceRange === 'above-6000' && course.price > 6000) ||
                         (priceRange === 'free' && course.price === 0);
    
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popularity') return b.students - a.students;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">      
      <div className="relative z-10">
        <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
        <header className="relative z-20 mb-12">
          <div className="opacity-100">
            <h1 className="mb-4 text-4xl font-medium tracking-tight text-black md:text-5xl">
              Master New Skills
            </h1>
            <p className="text-lg font-light text-gray-500">
              Browse premium courses designed for the modern digital economy.
            </p>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="sticky top-24 z-40 mb-12 flex flex-col gap-6 rounded-[2rem] border border-gray-100 bg-white/50 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat.name
                    ? 'bg-black text-white shadow-lg shadow-black/10'
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-black/20 hover:text-black'
                }`}
              >
                <cat.icon className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            ))}
            
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-all whitespace-nowrap border border-gray-100 hover:border-black/20 hover:text-black ${
                  otherCategories.some(c => c.name === selectedCategory) ? 'bg-black text-white' : 'bg-white text-gray-500'
                }`}>
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  Other
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-gray-100 shadow-xl">
                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">More Categories</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-50" />
                {otherCategories.map((cat) => (
                  <DropdownMenuItem 
                    key={cat.name} 
                    onClick={() => setSelectedCategory(cat.name)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <cat.icon className="h-4 w-4 text-gray-500" />
                    <span className="text-xs font-medium">{cat.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[140px] rounded-full bg-white border-gray-100 h-10 text-xs font-semibold hover:border-black/20 transition-all outline-none focus:ring-0">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-100 bg-white shadow-xl">
                  <SelectItem value="all" className="rounded-lg">All Prices</SelectItem>
                  <SelectItem value="free" className="rounded-lg">Free</SelectItem>
                  <SelectItem value="under-3000" className="rounded-lg">Under 3000 DZD</SelectItem>
                  <SelectItem value="3000-6000" className="rounded-lg">3000 - 6000 DZD</SelectItem>
                  <SelectItem value="above-6000" className="rounded-lg">Above 6000 DZD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-5 py-2.5 text-xs font-semibold text-black hover:border-black/20 transition-all h-10">
                  <Filter className="h-3 w-3" />
                  Sort By
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 bg-white/95 backdrop-blur-md border-gray-100 shadow-xl">
                <DropdownMenuItem onClick={() => setSortBy('newest')} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  <span className="text-xs font-medium">Newest First</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('popularity')} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  <span className="text-xs font-medium">Most Popular</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('rating')} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  <span className="text-xs font-medium">Top Rated</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-50" />
                <DropdownMenuItem onClick={() => setSortBy('price-asc')} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  <span className="text-xs font-medium">Price: Low to High</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('price-desc')} className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50">
                  <span className="text-xs font-medium">Price: High to Low</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Course Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/store/${course.id}`}>
                    <CourseCard course={course} />
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Search className="h-8 w-8 text-gray-300" />
                </div>
                <h3 className="mb-2 text-xl font-medium text-black">No courses found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setPriceRange('all');
                  }}
                  className="mt-6 font-semibold text-black underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      
    </div>
  </div>
);
}
