import React from "react"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "About Us | Digit Hup",
  description: "Learn more about Digit Hup, Algeria's premier digital marketplace.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Empowering Algeria's Digital Future.</h1>
          <p className="text-xl text-muted-foreground mb-12">Digit Hup is more than a marketplace. It's an ecosystem for freelancers, creators, and businesses to thrive in the digital economy.</p>
          
          <div className="grid sm:grid-cols-3 gap-8 text-left mt-16">
            <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-3 text-primary">Trust & Security</h3>
              <p className="text-muted-foreground">Every transaction is protected. We use local DZD payment gates ensuring zero international friction.</p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-3 text-accent">Top Talent</h3>
              <p className="text-muted-foreground">We carefully vet our sellers to ensure you only get high-quality services and digital products.</p>
            </div>
            <div className="p-6 bg-secondary/50 rounded-2xl border border-border">
              <h3 className="text-xl font-bold mb-3 text-warning">Growth</h3>
              <p className="text-muted-foreground">With our integrated learning paths, you can evolve from a novice to an Elite seller in months.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
