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
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">DigitHup</span>
              </Link>
              <p className="text-sm text-background/70 leading-relaxed">
                Sell your skills. Buy what you need. Grow where you are.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3 mt-6">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Platform</h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language & Payment */}
            <div>
              <h3 className="font-semibold text-sm mb-4">Language</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  EN
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                  FR
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                  AR
                </button>
              </div>

              <h3 className="font-semibold text-sm mb-4">We Accept</h3>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 text-xs font-medium rounded bg-background/10">
                  Visa
                </div>
                <div className="px-3 py-1.5 text-xs font-medium rounded bg-background/10">
                  Mastercard
                </div>
                <div className="px-3 py-1.5 text-xs font-medium rounded bg-background/10">
                  Edahabia
                </div>
                <div className="px-3 py-1.5 text-xs font-medium rounded bg-background/10">
                  CIB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/60">
            <p>2026 Digit Hup. Made in Algeria - All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-background transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-background transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-background transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
