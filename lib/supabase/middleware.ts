import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Routes that require authentication
  const authRequired = ['/dashboard', '/admin', '/publisher', '/checkout', '/cart']
  const needsAuth = authRequired.some(path => pathname.startsWith(path))

  if (needsAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Role-based guarsd only if user is signed in
  if (user) {
    const { data: profile } = await supabase
      .from('Profile')
      .select('role, publisher_status')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    const isPublisher = profile?.publisher_status === 'enabled'

    // Admin routes: only admins
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/buyer', request.url))
    }

    // Publisher routes: only publishers and admins
    if (pathname.startsWith('/publisher') && role !== 'admin' && !isPublisher) {
      return NextResponse.redirect(new URL('/dashboard/buyer', request.url))
    }

    // Seller dashboard: only sellers and admins
    if (pathname === '/dashboard' && role !== 'seller' && role !== 'admin') {
      if (role === 'buyer') return NextResponse.redirect(new URL('/dashboard/buyer', request.url))
      if (isPublisher) return NextResponse.redirect(new URL('/publisher', request.url))
    }

    // Buyer dashboard: only buyers and admins
    if (pathname.startsWith('/dashboard/buyer') && role !== 'buyer' && role !== 'admin') {
      if (role === 'seller') return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}
