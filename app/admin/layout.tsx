import React from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Package, 
  ShoppingCart, 
  Settings, 
  ShieldCheck,
  LogOut,
  Bell
} from "lucide-react"
export const metadata = {
  title: "Admin Dashboard | Digit Hup",
  description: "Administrative dashboard for Digit Hup operations.",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Verification Queue", href: "/admin/verifications", icon: ShieldCheck },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
    { label: "Analytics & Reports", href: "/admin", icon: LayoutDashboard },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "Digital Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Package },
    { label: "Commissions", href: "/admin/commissions", icon: ShoppingCart },
    { label: "Orders & Disputes", href: "/admin/orders", icon: ShoppingCart },
    { label: "Settings", href: "/admin/settings", icon: Settings },
    { label: "🪄 Landing Generator", href: "/admin/landing-generator", icon: Package },
  ]

  return (
    <div className="min-h-screen relative flex bg-[#f4f4f5]">

      {/* Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col hidden lg:flex relative z-20">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-display font-semibold text-lg text-foreground">
              Admin Portal
            </span>
          </Link>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        
        {/* Bottom Actions */}
        <div className="p-4 border-t border-border">
          <Link href="/">
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
              Exit Admin
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <h2 className="font-semibold text-foreground tracking-tight">System Status: <span className="text-success ml-1">Operational</span></h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="text-sm font-semibold text-primary">A</span>
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
