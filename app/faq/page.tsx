"use client"

import React from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    { q: "How do I become a seller?", a: "To become a seller, log into your account and click 'Become a Seller' in the top right menu. Complete the 5-step onboarding wizard to get approved." },
    { q: "What payment methods are supported?", a: "We proudly support local Algerian payment methods including CIB and Edahabia through Satim checkout, as well as Stripe for international cards." },
    { q: "How long do payouts take?", a: "Payouts are processed automatically every 2 weeks to your registered bank account once the funds clear the 14-day escrow protection period." },
    { q: "Are digital products instantly downloadable?", a: "Yes, once your checkout is complete, digital products are instantly available in your 'Purchases' dashboard." },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl animate-slide-up">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-lg">Everything you need to know about buying and selling on Digit Hup.</p>
          </div>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border px-6 py-2 rounded-2xl shadow-sm data-[state=open]:border-primary/50 transition-colors">
                <AccordionTrigger className="hover:no-underline font-semibold text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  )
}
