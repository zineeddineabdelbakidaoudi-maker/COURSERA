"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronRight, Search, ShoppingBag, Globe, LogOut, LayoutDashboard, Settings, Heart, User as UserIcon, Zap, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GlobalSearch } from "@/components/ui/global-search"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform } from "motion/react"

const navLinks = [
  { href: "/courses", label: "COURSES" },
  { href: "/automation", label: "AUTOMATION" },
  { href: "/templates", label: "TEMPLATES" },
  { href: "/ebooks", label: "EBOOKS" },
  { href: "/tools", label: "TOOLS" },
  { href: "/hire", label: "HIRE" },
  { href: "/jobs", label: "JOBS" },
]

const languages = [
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Francais" },
  { code: "ar", label: "AR", full: "العربية" },
]

export function Navbar() {
  const supabase = createClient()
  const router = useRouter()
  const [scrolled, setScrolled] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState("en")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [unreadCount, setUnreadCount] = React.useState(0)
  const { scrollY } = useScroll()
  const [hidden, setHidden] = React.useState(false)

  // Mouse tilt logic
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-20, 20], [2, -2]), { stiffness: 100, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-20, 20], [-2, 2]), { stiffness: 100, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    mouseX.set(x / 50)
    mouseY.set(y / 50)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 150) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data: profile } = await supabase
          .from('Profile')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
      setLoading(false)
      if (user) {
        const { count } = await supabase
          .from('Notification')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false)
        setUnreadCount(count || 0)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        setProfile(null)
      } else {
        fetchUser()
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const getDashboardLink = () => {
    if (profile.role === 'admin') return "/admin"
    if (profile.role === 'publisher') return "/publisher"
    if (profile.role === 'seller') return "/dashboard"
    return "/services"
  }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 transform-gpu",
        scrolled 
          ? "top-4 mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-1" 
          : "bg-transparent h-24"
      )}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-base font-black tracking-[0.3em] text-slate-900 z-50 relative group">
          DIGITHUB
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-slate-900 transition-all group-hover:w-full" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-all hover:text-slate-900 hover:tracking-[0.2em] duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-6">
          <Link href="/hire">
            <Button variant="outline" className="h-9 rounded-xl border-slate-200 text-[10px] font-black tracking-widest px-6 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
              HIRE ME
            </Button>
          </Link>

          <div className="h-4 w-px bg-slate-200 mx-2" />

          <Search className="h-4 w-4 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" onClick={() => setSearchOpen(true)} />
          
          <Link href="/cart" className="relative">
            <ShoppingBag className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" />
          </Link>

          <Link href="/dashboard/notifications" className="relative">
            <Bell className="h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-slate-900" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-1 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="w-4 h-4" />
                {languages.find((l) => l.code === currentLang)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setCurrentLang(lang.code)}
                  className={cn(currentLang === lang.code && "bg-secondary")}
                >
                  {lang.full}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-border p-0 overflow-hidden">
                  <Avatar className="h-full w-full">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      <UserIcon className="h-5 w-5 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">{profile?.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground truncate w-[180px]">{user.email}</p>
                  </div>
                </div>
                <hr className="my-1 border-border" />
                {profile?.role !== 'buyer' && (
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      {profile?.role === 'admin' ? 'Admin Panel' : profile?.role === 'publisher' ? 'Publisher Panel' : 'Seller Dashboard'}
                      {profile?.role && <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 uppercase">{profile.role}</Badge>}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/orders" className="cursor-pointer gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/saved" className="cursor-pointer gap-2">
                    <Heart className="h-4 w-4" />
                    Saved Items
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer/settings" className="cursor-pointer gap-2">
                    <Settings className="h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <hr className="my-1 border-border" />
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="text-[11px] font-black tracking-widest text-slate-900 hover:opacity-70 transition-all">
                SIGN IN
              </Link>
              <Link href="/register" className="rounded-full bg-slate-900 px-8 py-3 text-[11px] font-black tracking-widest text-white transition-all hover:bg-slate-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                SIGN UP
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-96 p-0">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center p-4 border-b border-gray-100">
                <Link href="/" className="text-sm font-bold tracking-[0.2em] text-black" onClick={() => setMobileMenuOpen(false)}>
                  D I G I T H U B
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="flex-1 overflow-auto py-4">
                <div className="px-4 space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-xs font-medium tracking-wide text-gray-600 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Language Selector */}
                <div className="px-4 mt-6">
                  <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Language
                  </p>
                  <div className="flex gap-2 px-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setCurrentLang(lang.code)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                          currentLang === lang.code
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary hover:bg-secondary/80"
                        )}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-gray-100 space-y-3">
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-semibold tracking-wide border-gray-200">
                    SIGN IN
                  </Button>
                </Link>
                <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white text-xs font-semibold tracking-wide">
                    SIGN UP
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </motion.header>
  )
}
