"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BookOpen, LayoutDashboard, Tags, Users, Package, Settings, Menu, X, Bell, ChevronDown, LogOut, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import NeuralBackground from "@/components/ui/flow-field-background"

const sidebarItems = [
  { title: "Dashboard Overview", href: "/publisher", icon: LayoutDashboard },
  { title: "Publish Product", href: "/publisher/products", icon: Package },
  { title: "Commission Calculator", href: "/publisher/commission", icon: LayoutDashboard },
]

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user)
        supabase.from("Profile").select("full_name, avatar_url, role, is_publisher").eq("id", user.id).single().then(({ data }) => setProfile(data))
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Publisher"
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen relative bg-slate-50 dark:bg-background">
      <div className="fixed inset-0 pointer-events-none z-0">
        <NeuralBackground color="#38bdf8" trailOpacity={0.15} particleCount={400} speed={0.8} />
      </div>
      <div className="fixed inset-0 bg-gradient-to-b from-slate-50/0 via-slate-50/80 to-slate-50 dark:from-background/0 dark:via-background/80 dark:to-background z-[1] pointer-events-none" />

      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white/80 dark:bg-card/80 backdrop-blur-3xl border-r border-border transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full relative z-20">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link href="/publisher" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-sm block leading-none">Publisher</span>
                <span className="text-xs text-muted-foreground">Digit Hup</span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button>
          </div>

          <div className="px-3 py-4 border-b">
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200 gap-1">
              <ShieldCheck className="w-3 h-3" /> Publisher Access
            </Badge>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-purple-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-3 border-t space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors text-sm">
              <LayoutDashboard className="h-4 w-4" /> Back to My Dashboard
            </Link>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9"><AvatarImage src={profile?.avatar_url || ""} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground">Publisher</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-white/80 dark:bg-background/80 backdrop-blur-xl shadow-sm">
          <div className="flex items-center justify-between h-full px-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8"><AvatarImage src={profile?.avatar_url || ""} /><AvatarFallback>{initials}</AvatarFallback></Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>{displayName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link href="/publisher/settings"><Settings className="h-4 w-4 mr-2" />Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" />My Dashboard</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
