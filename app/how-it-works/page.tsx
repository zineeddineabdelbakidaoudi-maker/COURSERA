"use client"

import React, { useState, useRef } from "react"
import Link from "next/link"
import {
  UserPlus, Search, MessageSquare, ShieldCheck, Star, CheckCircle2,
  ArrowRight, Zap, Clock, Award, Users, TrendingUp, ChevronRight
} from "lucide-react"

const steps = [
  {
    number: "01", icon: UserPlus, title: "Create Your Account",
    desc: "Sign up in seconds with Google, GitHub, or your email. No credit card required.",
    detail: "Your account is the key to the entire DigitHup ecosystem — post services, buy products, and manage your projects all in one place.",
    color: "#6366f1", glow: "rgba(99,102,241,0.3)"
  },
  {
    number: "02", icon: Search, title: "Find What You Need",
    desc: "Browse thousands of verified Algerian freelancers or search for the perfect digital product.",
    detail: "Use smart filters (price, skill level, rating, delivery time) to narrow down to exactly the right person or product for your needs.",
    color: "#8b5cf6", glow: "rgba(139,92,246,0.3)"
  },
  {
    number: "03", icon: MessageSquare, title: "Connect & Agree",
    desc: "Message sellers directly, share your brief, and agree on scope — all within the platform.",
    detail: "Our built-in messaging system keeps all communication in one place. Request a custom offer or use a pre-defined package.",
    color: "#a78bfa", glow: "rgba(167,139,250,0.3)"
  },
  {
    number: "04", icon: ShieldCheck, title: "Secure Payment & Delivery",
    desc: "Place your order with COD. Funds are reserved, the seller gets paid only on delivery.",
    detail: "Algeria-first payment: pay via CIB, Edahabia or bank transfer after you're satisfied. No PayPal, no stress.",
    color: "#34d399", glow: "rgba(52,211,153,0.3)"
  },
]

const stats = [
  { value: "2,400+", label: "Active Freelancers", icon: Users },
  { value: "98%", label: "Satisfaction Rate", icon: Star },
  { value: "48h", label: "Avg. First Reply", icon: Clock },
  { value: "DZD Only", label: "Local Payments", icon: TrendingUp },
]

const faqs = [
  { q: "How does payment work in Algeria?", a: "We support Cash on Delivery (COD), CIB, Edahabia, and bank transfer. You only pay after you've confirmed the work meets your expectations." },
  { q: "Can I become a seller?", a: "Yes! After creating your account, go to your dashboard and click 'Become a Seller'. Submit your portfolio and you'll be reviewed within 48h." },
  { q: "What if I'm not satisfied with the work?", a: "You can request a revision, open a dispute, or get a refund through our mediation process. Buyer protection is always guaranteed." },
  { q: "Is this only for Algerians?", a: "Yes, DigitHup is built for the Algerian market. All prices are in DZD and payment methods are local." },
]

function Card3D({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)")

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(10px)`)
  }
  const handleMouseLeave = () => setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg)")

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.15s ease", ...style }}>
      {children}
    </div>
  )
}

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div style={{ background: "#020817", color: "#f8fafc", minHeight: "100vh", fontFamily: "system-ui, sans-serif", overflowX: "hidden" }}>
      {/* NAV */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(2,8,23,0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Zap size={16} color="white" /></div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#f8fafc" }}>Digit<span style={{ color: "#818cf8" }}>Hup</span></span>
        </Link>
        <div style={{ display: "flex", gap: 24 }}>
          {[{ href: "/", l: "Home" }, { href: "/services", l: "Services" }, { href: "/store", l: "Products" }].map(n => (
            <Link key={n.href} href={n.href} style={{ color: "rgba(248,250,252,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>{n.l}</Link>
          ))}
        </div>
        <Link href="/register" style={{ padding: "8px 20px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700 }}>Get Started</Link>
      </header>

      {/* HERO */}
      <section style={{ paddingTop: 160, paddingBottom: 80, textAlign: "center", padding: "160px 24px 80px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15), transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 18px", borderRadius: 100, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", color: "#818cf8", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <Award size={14} /> Simple. Safe. Algerian.
          </div>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: 20 }}>
            How <span style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DigitHup</span> Works
          </h1>
          <p style={{ color: "rgba(248,250,252,0.55)", fontSize: 18, maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            From signing up to receiving world-class work — here's your journey in 4 simple steps.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {[{ icon: CheckCircle2, t: "No upfront payment" }, { icon: CheckCircle2, t: "COD supported" }, { icon: CheckCircle2, t: "Verified sellers" }].map(b => (
              <span key={b.t} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 100, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", fontSize: 13 }}>
                <b.icon size={14} color="#34d399" /> {b.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS — 3D CARDS */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {steps.map((step, i) => {
            const Icon = step.icon
            const isActive = activeStep === i
            return (
              <Card3D key={i}>
                <div onClick={() => setActiveStep(i)}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, padding: 48, borderRadius: 28, background: isActive ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)", border: `1px solid ${isActive ? step.color + "50" : "rgba(255,255,255,0.07)"}`, cursor: "pointer", boxShadow: isActive ? `0 0 60px ${step.glow}` : "none", transition: "all 0.3s ease" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                      <div style={{ width: 64, height: 64, borderRadius: 20, background: `linear-gradient(135deg, ${step.color}30, ${step.color}15)`, border: `1px solid ${step.color}40`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${step.glow}` }}>
                        <Icon size={28} color={step.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: step.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Step {step.number}</p>
                        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>{step.title}</h2>
                      </div>
                    </div>
                    <p style={{ fontSize: 16, color: "rgba(248,250,252,0.65)", lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                  <div style={{ display: isActive ? "flex" : "none", flexDirection: "column", justifyContent: "center", paddingLeft: 24, borderLeft: `2px solid ${step.color}30` }}>
                    <p style={{ fontSize: 15, color: "rgba(248,250,252,0.5)", lineHeight: 1.8 }}>{step.detail}</p>
                    <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 24, color: step.color, textDecoration: "none", fontWeight: 700, fontSize: 14 }}>
                      Get started <ArrowRight size={16} />
                    </Link>
                  </div>
                  {!isActive && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 96, fontWeight: 900, color: "rgba(255,255,255,0.04)", fontVariantNumeric: "tabular-nums" }}>{step.number}</div>
                    </div>
                  )}
                </div>
              </Card3D>
            )
          })}
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: "80px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.03)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <Card3D key={i}>
                <div style={{ textAlign: "center", padding: 32, borderRadius: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <Icon size={24} color="#818cf8" style={{ margin: "0 auto 12px" }} />
                  <p style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1px" }}>{s.value}</p>
                  <p style={{ fontSize: 13, color: "rgba(248,250,252,0.4)", marginTop: 6 }}>{s.label}</p>
                </div>
              </Card3D>
            )
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 24px 120px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-1px", textAlign: "center", marginBottom: 16 }}>Frequently Asked Questions</h2>
          <p style={{ color: "rgba(248,250,252,0.45)", textAlign: "center", marginBottom: 48, fontSize: 16 }}>Everything you need to know before getting started.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ borderRadius: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${openFaq === i ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{faq.q}</p>
                  <ChevronRight size={18} style={{ color: "#818cf8", transform: openFaq === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
                </div>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px", color: "rgba(248,250,252,0.55)", fontSize: 14, lineHeight: 1.8 }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "0 24px 100px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "60px 40px", borderRadius: 28, background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.25)", boxShadow: "0 40px 100px rgba(99,102,241,0.1)" }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-1px", marginBottom: 16 }}>Ready to start?</h2>
          <p style={{ color: "rgba(248,250,252,0.55)", fontSize: 16, marginBottom: 36 }}>Join thousands of Algerians building their future on DigitHup.</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 40px", borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white", textDecoration: "none", fontSize: 16, fontWeight: 800 }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
