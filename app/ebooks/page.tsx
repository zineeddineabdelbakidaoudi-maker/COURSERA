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
  BookOpen,
  Book,
  PenTool,
  Terminal,
  LineChart,
  Globe,
  MoreHorizontal,
  FileText,
  Bookmark,
  Sparkles,
  Zap,
  Coffee
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

type Ebook = {
  id: number | string;
  title: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  rating: number;
  pages: number;
  format: string;
  badge?: string;
  date: string;
};

const hardcodedEbooks: Ebook[] = [
  {
    id: 1,
    title: 'The Algerian Digital Creator',
    price: 2500,
    category: 'Business',
    description: 'A comprehensive guide to scaling your freelance business in Algeria.',
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    pages: 145,
    format: 'PDF / EPUB',
    badge: 'Bestseller',
    date: '2024-03-01'
  },
  {
    id: 2,
    title: 'UI Design Fundamentals',
    price: 3800,
    category: 'Design',
    description: 'Master the visual principles behind world-class digital interfaces.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    pages: 210,
    format: 'Interactive PDF',
    date: '2024-02-15'
  },
  {
    id: 3,
    title: 'Python for Automators',
    price: 4200,
    category: 'Tech',
    description: 'Learn to write clean, effective scripts to save hours of manual work.',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    pages: 180,
    format: 'PDF / Kindle',
    badge: 'Premium',
    date: '2024-03-10'
  },
  {
    id: 4,
    title: 'Scaling Personal Growth',
    price: 0,
    category: 'Growth',
    description: 'Mindset shifts and productivity systems for the modern era.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    pages: 85,
    format: 'EPUB',
    badge: 'Free',
    date: '2024-03-25'
  },
  {
    id: 5,
    title: 'Marketing Alchemy',
    price: 2900,
    category: 'Business',
    description: 'Transform your digital presence with psychological marketing tactics.',
    imageUrl: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    pages: 120,
    format: 'PDF',
    date: '2024-01-20'
  },
  {
    id: 6,
    title: 'JavaScript Deep Dive',
    price: 5500,
    category: 'Tech',
    description: 'From syntax to systems: a complete journey through modern JS.',
    imageUrl: 'https://images.unsplash.com/photo-1532012197367-6849fd11b29d?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    pages: 320,
    format: 'PDF / EPUB',
    badge: 'New',
    date: '2024-03-28'
  }
];

const categories = [
  { name: 'All', icon: Globe },
  { name: 'Business', icon: LineChart },
  { name: 'Design', icon: PenTool },
  { name: 'Tech', icon: Terminal },
  { name: 'Growth', icon: Sparkles }
];

const otherCategories = [
  { name: 'Guides', icon: Bookmark },
  { name: 'Case Studies', icon: FileText },
  { name: 'Lifestyle', icon: Coffee },
  { name: 'Automation', icon: Zap },
  { name: 'Research', icon: BookOpen }
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

function EbookCard({ ebook }: { ebook: Ebook }) {
  return (
    <TiltCard className="group cursor-pointer rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)]">
      <div className="relative mb-6 h-52 overflow-hidden rounded-2xl bg-gray-50">
        {ebook.badge && (
          <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
            {ebook.badge}
          </span>
        )}
        <div className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold backdrop-blur-md">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          {ebook.rating.toFixed(1)}
        </div>
        <ImageWithFallback
          alt={ebook.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={ebook.imageUrl}
        />
      </div>

      <div className="px-2 pb-2">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">{ebook.category}</span>
          <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500">
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {ebook.pages} Pages</span>
            <span className="flex items-center gap-1"><Book className="h-3 w-3" /> {ebook.format}</span>
          </div>
        </div>

        <h3 className="mb-3 text-lg font-semibold leading-tight text-black group-hover:text-gray-700 transition-colors line-clamp-1">
          {ebook.title}
        </h3>

        <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-xl font-bold text-black">{ebook.price === 0 ? 'FREE' : `${ebook.price} DZD`}</span>
          <button className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[10px] font-bold text-white transition-all hover:bg-gray-800">
            GET EBOOK
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </TiltCard>
  );
}

export default function EbooksPage() {
  const supabase = createClient();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [ebooks, setEbooks] = useState<Ebook[]>(hardcodedEbooks);

  useEffect(() => {
    async function fetchDBProducts() {
      const { data } = await supabase.from('DigitalProduct').select('*').in('category', ['Ebook', 'Guide']).eq('status', 'live');
      if (data && data.length > 0) {
        const dbEbooks = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: parseFloat(d.price) || 0,
          category: 'Business', // fallback
          description: d.description || 'Premium Ebook',
          imageUrl: d.cover_image || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80',
          rating: 5.0,
          pages: 100,
          format: 'PDF',
          badge: 'New',
          date: d.created_at
        }));
        setEbooks([...dbEbooks, ...hardcodedEbooks]);
      }
    }
    fetchDBProducts();
  }, [supabase]);

  const filteredEbooks = ebooks.filter(ebook => {
    const matchesCategory = selectedCategory === 'All' || ebook.category === selectedCategory || (otherCategories.some(c => c.name === ebook.category) && selectedCategory === ebook.category);
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ebook.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = priceRange === 'all' || 
                         (priceRange === 'under-3000' && ebook.price < 3000) ||
                         (priceRange === '3000-6000' && ebook.price >= 3000 && ebook.price <= 6000) ||
                         (priceRange === 'above-6000' && ebook.price > 6000) ||
                         (priceRange === 'free' && ebook.price === 0);
    
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'popularity') return b.pages - a.pages; // Simplified proxy for depth
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">      
      <div className="relative z-10">
        <main className="mx-auto max-w-7xl px-6 pt-32 pb-24">
          <header className="relative z-20 mb-12">
            <div className="opacity-100">
              <h1 className="mb-4 text-4xl font-medium tracking-tight text-black md:text-5xl">
                Deepen Your Knowledge
              </h1>
              <p className="text-lg font-light text-gray-500">
                Actionable guides and digital books from leading experts in the industry.
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
                  <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 py-2">Niche Categories</DropdownMenuLabel>
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

          {/* Ebooks Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredEbooks.length > 0 ? (
                filteredEbooks.map((ebook) => (
                  <motion.div
                    key={ebook.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link href={`/store/${ebook.id}`}>
                      <EbookCard ebook={ebook} />
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
                  <h3 className="mb-2 text-xl font-medium text-black">No ebooks found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search query to find the perfect book.</p>
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
