"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronRight, Zap, Globe, Search } from "lucide-react"
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
import { 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  ShoppingBag, 
  Heart 
} from "lucide-react"

const navLinks = [
  { href: "/services", label: "Explore Services" },
  { href: "/store", label: "Browse Products" },
  { href: "/how-it-works", label: "How It Works" },
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
    if (!profile) return "/dashboard"
    if (profile.role === 'admin') return "/admin"
    if (profile.role === 'publisher') return "/publisher"
    if (profile.role === 'buyer') return "/dashboard/buyer"
    return "/dashboard"
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "h-16 bg-background/95 backdrop-blur-md shadow-sm border-b border-border"
          : "h-20 bg-transparent"
      )}
    >
      <nav className="container mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Zap className="w-5 h-5 text-primary" />
            <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Digit<span className="text-primary">Hup</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </Button>

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
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="cursor-pointer gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                    {profile?.role && <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0 uppercase">{profile.role}</Badge>}
                  </Link>
                </DropdownMenuItem>
                {profile?.role === 'buyer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/orders" className="cursor-pointer gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/saved" className="cursor-pointer gap-2">
                        <Heart className="h-4 w-4" />
                        Saved Items
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
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
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Button>
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
              <div className="flex items-center p-4 border-b">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-lg font-bold">
                    Digit<span className="text-primary">Hup</span>
                  </span>
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
                      className="flex items-center justify-between px-4 py-3 text-base font-medium rounded-xl hover:bg-secondary transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
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
              <div className="p-4 border-t space-y-3">
                <Link href="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
