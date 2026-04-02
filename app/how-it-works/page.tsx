"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus, Search, MessageSquare, ShieldCheck, CheckCircle2, ArrowRight, Award, Star, Clock, Users, TrendingUp, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import NeuralBackground from "@/components/ui/flow-field-background"

const steps = [
  { number: "01", icon: UserPlus, title: "Create Your Account", desc: "Sign up in seconds with Google, GitHub, or your email. No credit card required.", detail: "Your account is the key to the DigitHup ecosystem — post services, buy products, and manage projects all in one place.", color: "text-indigo-500 bg-indigo-500/10 border-indigo-200" },
  { number: "02", icon: Search, title: "Find What You Need", desc: "Browse thousands of verified Algerian freelancers or search for the perfect digital product.", detail: "Use smart filters — price, skill level, rating, delivery time — to find exactly what you need.", color: "text-violet-500 bg-violet-500/10 border-violet-200" },
  { number: "03", icon: MessageSquare, title: "Connect & Agree", desc: "Message sellers directly, discuss your brief, and agree on scope — all within the platform.", detail: "Our built-in chat keeps all communication in one place. Request a custom offer or pick a pre-defined package.", color: "text-purple-500 bg-purple-500/10 border-purple-200" },
  { number: "04", icon: ShieldCheck, title: "Pay & Receive Delivery", desc: "Pay with COD after you confirm the work. Buyer protection is always active.", detail: "Supports CIB, Edahabia, and bank transfer. You only pay when you're satisfied — zero upfront risk.", color: "text-emerald-500 bg-emerald-500/10 border-emerald-200" },
]

const stats = [
  { value: "2,400+", label: "Active Freelancers", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "48h", label: "Avg. First Reply", icon: Clock },
  { value: "DZD Only", label: "Local Payments", icon: TrendingUp },
]

const faqs = [
  { q: "How does payment work in Algeria?", a: "We support Cash on Delivery (COD), CIB, Edahabia, and bank transfer. You only pay after confirming the work meets your expectations." },
  { q: "Can I become a seller?", a: "Yes! After creating your account, go to your dashboard and click 'Become a Seller'. Submit your portfolio and you'll be reviewed within 48h." },
  { q: "What if I'm not satisfied with the work?", a: "You can request a revision, open a dispute, or get a refund. Buyer protection is always guaranteed." },
  { q: "Is this only for Algerians?", a: "Yes, DigitHup is built for the Algerian market. All prices are in DZD and payment methods are local-first." },
  { q: "What types of services can I find?", a: "You can find a wide range of digital services, including graphic design, web development, marketing, copywriting, and much more." },
]

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeStep, setActiveStep] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-white text-black selection:bg-blue-500/30">      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gray-500 backdrop-blur-sm">
        <div className="fixed inset-0 pointer-events-none z-0">
          <NeuralBackground
            color="#3b82f6"
            trailOpacity={0.15}
            particleCount={800}
            speed={0.8}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white z-[1]" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center">
          <Badge variant="outline" className="gap-1.5 mb-6 border-blue-500/30 bg-blue-500/10 text-blue-400">
            <Award className="w-3 h-3" /> Simple. Safe. Built for Algeria.
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">DigitHup</span> Works
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 font-medium">
            From signing up to receiving world-class work — your journey in 4 simple steps.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["✅ No upfront payment", "📦 COD supported", "🔒 Verified sellers"].map(b => (
              <span key={b} className="text-xs font-bold px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-600">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isOpen = activeStep === i
          return (
            <div key={i} onClick={() => setActiveStep(isOpen ? null : i)}
              className={`border rounded-2xl p-6 cursor-pointer transition-all duration-200 ${isOpen ? "border-primary/30 bg-muted/40 shadow-sm" : "border-border hover:border-primary/20 hover:bg-muted/20"}`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border shrink-0 ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step {step.number}</span>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mt-0.5">{step.desc}</p>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </div>
              {isOpen && (
                <div className="mt-4 pl-16 border-l-2 border-primary/20 ml-7">
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.detail}</p>
                  <Button asChild size="sm" className="mt-4 gap-2">
                    <Link href="/register">Get started <ArrowRight className="w-4 h-4" /></Link>
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="text-center">
                <Icon className="w-6 h-6 mx-auto text-primary mb-2" />
                <p className="text-3xl font-black mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-display font-bold text-center mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground text-center mb-10">Everything you need to know before getting started.</p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className={`border rounded-xl overflow-hidden cursor-pointer transition-all duration-150 ${openFaq === i ? "border-primary/30" : "border-border hover:border-primary/20"}`}>
              <div className="flex items-center justify-between p-5">
                <p className="font-semibold pr-4">{faq.q}</p>
                <ChevronRight className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
              </div>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="p-10 rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
          <h2 className="text-3xl font-display font-bold mb-3">Ready to start?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of Algerians building their future on DigitHup.</p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/register">Create Free Account <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
