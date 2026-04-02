"use client"

import React, { useRef, useState, useEffect, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Globe,
  Search,
  ShoppingBag,
  Star,
  Zap,
} from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { createClient } from '@/lib/supabase/client';

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

type Course = {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  badge?: {
    label: string;
    dark?: boolean;
    icon?: 'star';
  };
};

const hardcodedCourses: Course[] = [
  {
    title: 'Advanced UI/UX Design',
    price: '4500 DZD',
    description:
      'Learn to build world-class interfaces with Figma and Next.js. From wireframes to functional prototypes.',
    imageUrl:
      'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'A designer working on premium interface layouts',
    badge: {
      label: 'Bestseller',
      icon: 'star',
    },
  },
  {
    title: 'Full-Stack Automation',
    price: '6200 DZD',
    description:
      'Automate business workflows using Python, Zapier, and custom API integrations.',
    imageUrl:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'A developer workspace focused on automation systems',
  },
  {
    title: 'Digital Marketing Pro',
    price: '3800 DZD',
    description:
      'Master social media algorithms, paid ads, and content strategy for the MENA region.',
    imageUrl:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    imageAlt: 'A modern marketing team collaborating around campaign planning',
    badge: {
      label: 'New Release',
      dark: true,
    },
  },
];

const quickLinks = [
  { title: 'Templates', description: 'Notion, Figma, and Webflow.', path: '/templates' },
  { title: 'eBooks', description: 'Actionable guides and strategies.', path: '/ebooks' },
];

const valueProps = [
  {
    icon: CheckCircle,
    title: 'Curated Quality',
    description:
      'Every course, tool, and template is manually vetted by our team before reaching the platform.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description:
      'Gain immediate access to your digital assets and course materials the moment checkout completes.',
  },
  {
    icon: Globe,
    title: 'Local Excellence',
    description:
      'Built for the Algerian market, bridging global digital standards with local payment realities.',
  },
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

function TiltCard({ children, className = '' }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) {
      return;
    }

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;

    setStyle({
      transform: `perspective(1000px) rotateX(${y * -15}deg) rotateY(${x * 15}deg) scale3d(1.02, 1.02, 1.02)`,
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
    <TiltCard className="group cursor-pointer rounded-[2rem] border border-gray-100 bg-[#f8f9fa] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="relative mb-6 h-64 overflow-hidden rounded-2xl bg-gray-200">
        {course.badge ? (
          <span
            className={[
              'absolute left-4 top-4 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm',
              course.badge.dark
                ? 'bg-black text-white'
                : 'bg-white/90 text-black backdrop-blur',
            ].join(' ')}
          >
            {course.badge.icon === 'star' ? (
              <Star className="h-3 w-3 fill-current text-yellow-500" />
            ) : null}
            {course.badge.label}
          </span>
        ) : null}

        <ImageWithFallback
          alt={course.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={course.imageUrl}
        />
      </div>

      <div className="px-2 pb-4">
        <div className="mb-2 flex items-start justify-between gap-4">
          <h3 className="text-xl font-medium text-black">{course.title}</h3>
          <span className="text-lg font-semibold text-black">{course.price}</span>
        </div>

        <p className="mb-6 text-sm leading-6 text-gray-500 line-clamp-2">{course.description}</p>

        <button className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-black transition-colors duration-300 group-hover:bg-black group-hover:text-white">
          Enroll Now
        </button>
      </div>
    </TiltCard>
  );
}

export default function LandingPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>(hardcodedCourses);

  useEffect(() => {
    // Attempt to fetch from Supabase. If empty, fall back to hardcoded.
    async function fetchDBProducts() {
      const { data } = await supabase
        .from("DigitalProduct")
        .select("id, title, description, price, cover_image, status")
        .eq('status', 'live')
        .limit(3);

      if (data && data.length > 0) {
        // Map DB models to CourseCard type
        const newCourses = data.map((d: any) => ({
          title: d.title,
          price: d.price ? `${parseFloat(d.price).toLocaleString()} DZD` : 'Free',
          description: d.description || 'No description provided.',
          imageUrl: d.cover_image || 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80',
          imageAlt: d.title,
          badge: {
            label: 'DB Product',
            dark: true
          }
        }));
        
        // If we don't have 3 from DB, fill the rest with hardcoded
        const merged = [...newCourses, ...hardcodedCourses.slice(newCourses.length)].slice(0, 3);
        setCourses(merged);
      }
    }
    fetchDBProducts();
  }, [supabase]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fafafa] font-sans text-gray-900 selection:bg-black selection:text-white">      <main>
        <section className="relative min-h-screen overflow-hidden px-6 pt-20">
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-40">
            <div className="absolute h-[800px] w-[800px] rounded-full border border-gray-200" />
            <div className="absolute h-[600px] w-[600px] rounded-full border border-gray-200" />
            <div className="absolute h-[400px] w-[400px] rounded-full border border-gray-200" />
          </div>

          <div className="relative z-10 mx-auto flex min-h-[calc(100svh-5rem)] max-w-4xl flex-col items-center justify-center text-center">
            <h1 className="mb-6 text-6xl font-medium leading-[1.1] tracking-tight text-black md:text-8xl">
              Where Talent Meets
              <br />
              <span className="text-black">Opportunity</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg font-light text-gray-500 md:text-xl">
              Your unified gateway to digital products, premium courses, and specialized services in Algeria.
            </p>

            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/register" className="w-full rounded-full border border-gray-200 bg-gray-100 px-8 py-4 text-sm font-semibold tracking-wide text-black transition-all hover:bg-gray-200 sm:w-auto text-center">
                GET STARTED
              </Link>
              <button className="group flex w-full items-center justify-center rounded-full px-8 py-4 text-sm font-semibold tracking-wide text-gray-500 transition-all hover:text-black sm:w-auto">
                HOW IT WORKS
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </section>

        <section className="relative z-20 bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-medium tracking-tight text-black">Master Your Craft</h2>
                <p className="text-gray-500">Premium courses designed for the modern digital economy.</p>
              </div>

              <Link href="/courses" className="hidden items-center text-sm font-medium transition-colors hover:text-gray-600 sm:flex">
                View all courses
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.title} course={course} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fafafa] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-medium tracking-tight text-black">Explore the Ecosystem</h2>
              <p className="mx-auto max-w-2xl text-gray-500">
                Everything you need to build, scale, and automate your digital presence.
              </p>
            </div>

            <div className="grid auto-rows-[240px] grid-cols-1 gap-6 md:grid-cols-4">
              <Link
                href="/automation"
                className="group relative flex flex-col justify-end overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:col-span-2 md:row-span-2"
              >
                <img
                  alt="Automation dashboard visuals"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
                  src="https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                <div className="relative z-10">
                  <h3 className="mb-2 text-3xl font-medium text-black">Automations and Tools</h3>
                  <p className="mb-6 max-w-sm text-gray-600">
                    Plug-and-play scripts and software to save you hundreds of hours.
                  </p>
                  <span className="inline-block rounded-full border border-gray-200 bg-white/80 px-6 py-2 text-sm font-medium backdrop-blur transition-colors group-hover:bg-black group-hover:text-white">
                    Browse Automations
                  </span>
                </div>
              </Link>

              <Link
                href="/hire"
                className="group flex items-center justify-between rounded-[2rem] border border-gray-100 bg-gradient-to-br from-gray-100 to-gray-50 p-8 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 md:col-span-2"
              >
                <div>
                  <h3 className="mb-2 text-2xl font-medium text-black">Hire Freelancers</h3>
                  <p className="max-w-xs text-sm text-gray-500">
                    Connect with top-tier local talent for your next big project.
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-sm transition-all group-hover:-translate-y-1 group-hover:bg-black group-hover:text-white">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </Link>

              {quickLinks.map((item) => (
                <Link
                  key={item.title}
                  href={item.path}
                  className="group flex flex-col justify-between rounded-[2rem] border border-gray-100 bg-white p-8 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  <div>
                    <h3 className="text-xl font-medium text-black">{item.title}</h3>
                    <p className="mb-4 mt-2 text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 transition-colors group-hover:bg-black group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:text-left">
              {valueProps.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="flex flex-col items-center md:items-start">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-100 bg-gray-50">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="mb-3 text-lg font-medium uppercase tracking-wide text-black">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
