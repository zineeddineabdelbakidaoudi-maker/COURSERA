import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with realistic Algerian data...')

  // 1. Create or Find Categories
  const categoryData = [
    { name_en: 'Development & IT', name_ar: 'البرمجة وتقنية المعلومات', name_fr: 'Développement & Informatique', slug: 'development-it', type: 'both' as const },
    { name_en: 'Design & Creative', name_ar: 'التصميم والإبداع', name_fr: 'Design & Créatif', slug: 'design-creative', type: 'both' as const },
    { name_en: 'Digital Marketing', name_ar: 'التسويق الرقمي', name_fr: 'Marketing Digital', slug: 'digital-marketing', type: 'both' as const },
    { name_en: 'Writing & Translation', name_ar: 'الكتابة والترجمة', name_fr: 'Écriture & Traduction', slug: 'writing-translation', type: 'both' as const },
    { name_en: 'Video & Animation', name_ar: 'الفيديو والأنيميشن', name_fr: 'Vidéo & Animation', slug: 'video-animation', type: 'both' as const }
  ]

  const categories = []
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, is_active: true }
    })
    categories.push(cat)
  }

  // 2. Mock Users (Profiles)
  // Generating realistic IDs instead of using actual auth tokens, 
  // relying on DB allowing inserts directly to Profile.
  const profiles = [
    { id: '11111111-1111-1111-1111-111111111111', email: 'amine.dev@algeria.dz', full_name: 'Amine B.', role: 'seller' as const, seller_level: 'pro' as const, is_verified: true, bio: 'Full Stack Laravel & Next.js Developer from Algiers. 5+ years experience.', rating_avg: 4.8 },
    { id: '22222222-2222-2222-2222-222222222222', email: 'sarah.design@algeria.dz', full_name: 'Sarah K.', role: 'publisher' as const, seller_level: 'elite' as const, is_verified: true, bio: 'UI/UX Designer specializing in SaaS and E-commerce. Based in Oran.', rating_avg: 4.9 },
    { id: '33333333-3333-3333-3333-333333333333', email: 'business-owner@algeria.dz', full_name: 'Karim E-commerce', role: 'buyer' as const, is_verified: false, bio: 'Looking for talented Algerian freelancers to scale my local businesses.', rating_avg: 0 }
  ]

  for (const p of profiles) {
    await prisma.profile.upsert({
      where: { email: p.email },
      update: {},
      create: p
    })
  }

  // 3. Digital Products
  const products = [
    {
      title: 'Complete E-Commerce UI Kit for Figma',
      slug: 'complete-ecommerce-ui-kit-figma',
      description: 'A comprehensive, modern UI kit tailored for Algerian e-commerce. Contains over 250+ components, auto-layout built, and fully responsive mobile screens.',
      price_dzd: 4500,
      type: 'template' as const,
      status: 'live' as const,
      category_id: categories[1].id,
      publisher_id: '22222222-2222-2222-2222-222222222222',
      file_url: 'dummy-url.zip',
      license_type: 'personal' as const,
      language: 'en' as const,
      rating_avg: 4.7,
      total_reviews: 12,
      tags: ['Figma', 'UI Kit', 'E-commerce', 'Design']
    },
    {
      title: 'Mastering Laravel 11 for Beginners (Video Course)',
      slug: 'mastering-laravel-11-beginners',
      description: 'A complete step-by-step video course in Arabic (Darija) showing you how to build a robust SaaS application using Laravel 11 and Livewire.',
      price_dzd: 9500,
      type: 'course' as const,
      status: 'live' as const,
      category_id: categories[0].id,
      publisher_id: '11111111-1111-1111-1111-111111111111',
      file_url: 'dummy-url-course.zip',
      license_type: 'personal' as const,
      language: 'ar' as const,
      rating_avg: 4.9,
      total_reviews: 89,
      tags: ['Laravel', 'PHP', 'Backend', 'Web Dev']
    }
  ]

  for (const prod of products) {
    await prisma.digitalProduct.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod
    })
  }

  // 4. Jobs
  const jobs = [
    {
      title: '3D Landing Page for E-commerce Platform',
      description: 'We are looking for a visionary 3D designer to create an immersive landing page for our new tech store in Setif. Must be proficient in Spline and React Three Fiber.',
      budget_dzd: 45000,
      category_id: categories[1].id,
      buyer_id: '33333333-3333-3333-3333-333333333333',
      skills: ['Spline', 'React', 'Three.js', 'UI/UX'],
      status: 'open' as const,
      delivery_time: '14 days'
    },
    {
      title: 'Python Automation Script for Real Estate',
      description: 'Need a developer to build a web scraper that collects property data from Ouedkniss and saves it to a Notion database.',
      budget_dzd: 15000,
      category_id: categories[0].id,
      buyer_id: '33333333-3333-3333-3333-333333333333',
      skills: ['Python', 'BeautifulSoup', 'Notion API', 'Automation'],
      status: 'open' as const,
      delivery_time: '3 days'
    }
  ]

  for (const job of jobs) {
    // Can't upsert directly without a unique key, check if title exists roughly, or just create it.
    const exists = await prisma.job.findFirst({ where: { title: job.title } })
    if (!exists) {
      await prisma.job.create({ data: job })
    }
  }

  // 5. Services
  const services = [
    {
      title: 'I will develop a modern React & Next.js Website',
      slug: 'develop-modern-react-nextjs-website',
      description: 'Get a blazing fast, SEO optimized web app built using the latest App Router Next.js architecture.',
      category_id: categories[0].id,
      seller_id: '11111111-1111-1111-1111-111111111111',
      status: 'live' as const,
      tags: ['Next.js', 'React', 'TailwindCSS'],
      rating_avg: 5.0,
      total_reviews: 4
    },
    {
      title: 'I will design a timeless brand identity and logo',
      slug: 'design-timeless-brand-identity',
      description: 'Professional branding kit adapted perfectly to the Algerian and MENA market aesthetic.',
      category_id: categories[1].id,
      seller_id: '22222222-2222-2222-2222-222222222222',
      status: 'live' as const,
      tags: ['Logo Design', 'Branding', 'Illustrator'],
      rating_avg: 4.8,
      total_reviews: 17
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    })
  }

  console.log('Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
