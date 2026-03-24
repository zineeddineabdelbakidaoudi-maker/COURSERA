"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ChevronRight, Zap, Globe, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { GlobalSearch } from "@/components/ui/global-search"

const navLinks = [
  { href: "/services", label: "Explore Services" },
  { href: "/store", label: "Browse Products" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/pricing", label: "Pricing" },
]

const languages = [
  { code: "en", label: "EN", full: "English" },
  { code: "fr", label: "FR", full: "Francais" },
  { code: "ar", label: "AR", full: "العربية" },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [currentLang, setCurrentLang] = React.useState("en")
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
