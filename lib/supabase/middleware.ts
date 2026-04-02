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
    // IMPORTANT: We must merge the cookies from our supabaseResponse into the redirect response!
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // Role-based guards only if user is signed in
  if (user) {
    const { data: profile } = await supabase
      .from('Profile')
      .select('role, publisher_status')
      .eq('id', user.id)
      .single()

    const role = profile?.role
    const isPublisher = profile?.publisher_status === 'enabled'

    // Function to create a redirect with cookies
    const createRedirect = (path: string) => {
      const redirectResponse = NextResponse.redirect(new URL(path, request.url))
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      return redirectResponse
    }

    // Admin routes: only admins
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return createRedirect('/dashboard/buyer')
    }

    // Publisher routes: only publishers and admins
    if (pathname.startsWith('/publisher') && role !== 'admin' && !isPublisher) {
      return createRedirect('/dashboard/buyer')
    }

    // Seller dashboard: only sellers and admins
    // We check if it starts with /dashboard but NOT /dashboard/buyer
    if (pathname.startsWith('/dashboard') && !pathname.startsWith('/dashboard/buyer') && role !== 'seller' && role !== 'admin') {
      if (role === 'buyer') return createRedirect('/dashboard/buyer')
      if (isPublisher) return createRedirect('/publisher')
      return createRedirect('/')
    }

    // Buyer dashboard: only buyers and admins
    if (pathname.startsWith('/dashboard/buyer') && role !== 'buyer' && role !== 'admin') {
      if (role === 'seller') return createRedirect('/dashboard')
    }
  }

  return supabaseResponse
}
