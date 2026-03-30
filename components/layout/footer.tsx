import Link from "next/link"
import { Zap, Instagram, Linkedin, Facebook, Youtube, Twitter } from "lucide-react"

const footerLinks = {
  platform: [
    { href: "/services", label: "Explore Services" },
    { href: "/store", label: "Browse Products" },
    { href: "/become-a-seller", label: "Become a Seller" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/pricing", label: "Pricing" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/press", label: "Press Kit" },
    { href: "/careers", label: "Careers" },
    { href: "/affiliates", label: "Affiliate Program" },
  ],
  support: [
    { href: "/help", label: "Help Center" },
    { href: "https://wa.me/213XXXXXXXXX", label: "WhatsApp Support" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
}

const socialLinks = [
  { href: "https://instagram.com/digithup", icon: Instagram, label: "Instagram" },
  { href: "https://linkedin.com/company/digithup", icon: Linkedin, label: "LinkedIn" },
  { href: "https://facebook.com/digithup", icon: Facebook, label: "Facebook" },
  { href: "https://youtube.com/@digithup", icon: Youtube, label: "YouTube" },
  { href: "https://twitter.com/digithup", icon: Twitter, label: "Twitter" },
]

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-900 mt-auto">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Brand Column */}
            <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tight">DIGITHUB</span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                The premier marketplace for digital creators, learners, and businesses in Algeria. Sell your skills, buy what you need, and grow where you are.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-4 mt-8">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-display">Platform</h3>
              <ul className="space-y-4">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-display">Support</h3>
              <ul className="space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language & Badges */}
            <div>
              <h3 className="font-bold text-[11px] uppercase tracking-[0.2em] text-slate-400 mb-6 font-display">Region</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                <button className="px-4 py-2 text-[10px] font-black rounded-lg border border-slate-900 bg-slate-900 text-white uppercase tracking-wider">
                  EN
                </button>
                <button className="px-4 py-2 text-[10px] font-black rounded-lg border border-slate-200 hover:border-slate-900 transition-all uppercase tracking-wider">
                  FR
                </button>
                <button className="px-4 py-2 text-[10px] font-black rounded-lg border border-slate-200 hover:border-slate-900 transition-all uppercase tracking-wider font-cairo">
                  AR
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Secure Payments</p>
                <div className="flex flex-wrap gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                   <div className="text-[10px] font-black tracking-tighter italic border p-1 rounded">VISA</div>
                   <div className="text-[10px] font-black tracking-tighter italic border p-1 rounded">MASTER</div>
                   <div className="text-[10px] font-black tracking-tighter italic border p-1 rounded">EDAHABIA</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-slate-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-medium tracking-wide text-slate-400 uppercase">
            <div className="flex items-center gap-2">
              <span>© 2026 DIGITHUB</span>
              <span className="h-4 w-[1px] bg-slate-200" />
              <span>Made in Algeria</span>
            </div>
            <div className="flex items-center gap-8">
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms 
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-slate-900 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
