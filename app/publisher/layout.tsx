import React from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  BookOpen, 
  Users, 
  Settings, 
  TrendingUp,
  LogOut,
  Bell
} from "lucide-react"

export const metadata = {
  title: "Publisher Dashboard | Digit Hup",
  description: "Dashboard for publishing digital products on Digit Hup.",
}

export default function PublisherLayout({ children }: { children: React.ReactNode }) {
  const navLinks = [
    { label: "Overview", href: "/publisher", icon: LayoutDashboard },
    { label: "My Products", href: "/publisher/products", icon: Package },
    { label: "Sales & Analytics", href: "/publisher/analytics", icon: TrendingUp },
    { label: "Discount Codes", href: "/publisher/discounts", icon: Tag },
    { label: "Students / Buyers", href: "/publisher/buyers", icon: Users },
    { label: "Store Settings", href: "/publisher/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r border-border flex flex-col hidden lg:flex">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/publisher" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-display font-semibold text-lg text-foreground">
              Publisher Hub
            </span>
          </Link>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-border">
          <Link href="/dashboard">
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
              <LogOut className="w-4 h-4" />
              Back to Main App
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-medium text-foreground text-sm">Welcome back to your Publisher Hub</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <span className="text-sm font-semibold text-accent">P</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
