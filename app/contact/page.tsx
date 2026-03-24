import React from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Contact Us | Digit Hup",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <h1 className="text-4xl font-display font-bold mb-4">Contact Support</h1>
          <p className="text-muted-foreground mb-10">We're here to help. Reach out to us via email or WhatsApp.</p>
          
          <form className="bg-card p-8 rounded-3xl border border-border text-left shadow-premium space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full h-12 px-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea rows={5} className="w-full p-4 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/50 outline-none resize-none" />
            </div>
            <Button className="w-full bg-primary text-white rounded-full h-12 text-base">Send Message</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
