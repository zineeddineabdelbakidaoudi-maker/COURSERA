"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  FileText,
  Settings,
  CreditCard,
  BarChart3,
  Heart,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User,
  HelpCircle,
  Plus,
  Package,
  BookOpen,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const sidebarItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Services", href: "/dashboard/services", icon: Briefcase },
  { title: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Earnings", href: "/dashboard/earnings", icon: CreditCard },
  { title: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { title: "Reviews", href: "/dashboard/reviews", icon: FileText },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profile } = await supabase
          .from("Profile")
          .select("full_name, avatar_url, role, seller_level, username, publisher_status")
          .eq("id", user.id)
          .single()
        setProfile(profile)
      }
    }
    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
  const levelLabel = profile?.seller_level ? profile.seller_level.charAt(0).toUpperCase() + profile.seller_level.slice(1) + " Seller" : "Seller"

  return (
    <div className="min-h-screen relative bg-[#f4f4f5]">

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">D</span>
              </div>
              <span className="font-bold text-lg">Digit Hup</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
  
          </nav>

          {/* Quick Action */}
          <div className="p-4 border-t">
            <Button className="w-full" asChild>
              <Link href="/dashboard/services/new">
                <Plus className="h-4 w-4 mr-2" />
                New Service
              </Link>
            </Button>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{levelLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-white shadow-sm">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm flex-1" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Publisher Dashboard Button — appears only for enabled publishers */}
              {profile?.publisher_status === "enabled" && (
                <Button
                  asChild
                  size="sm"
                  className="hidden sm:flex gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] border-none transition-all hover:scale-[1.02]"
                >
                  <Link href="/publisher">
                    <BookOpen className="h-4 w-4" />
                    Publisher
                  </Link>
                </Button>
              )}

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/dashboard/messages">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="hidden sm:flex" asChild>
                <Link href="/faq"><HelpCircle className="h-5 w-5" /></Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline font-medium">{displayName.split(" ")[0]}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{displayName}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/sellers/${profile?.username || "me"}`}>
                      <User className="h-4 w-4 mr-2" />View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4 mr-2" />Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[100vw] lg:max-w-[calc(100vw-16rem)] p-4 md:p-6 lg:p-8 relative z-10">{children}</main>
      </div>
    </div>
  )
}
