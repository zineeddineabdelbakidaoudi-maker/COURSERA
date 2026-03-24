import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Download, FileText } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center max-w-2xl animate-scale-in">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_oklch(0.72_0.19_155_/_0.2)]">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Thank you for your purchase. Your order <span className="font-mono text-foreground font-medium">#ORD-84920</span> has been confirmed. A receipt has been sent to your email.
          </p>

          <div className="bg-secondary/30 rounded-2xl p-6 mb-10 max-w-md mx-auto text-left border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Digital Products are ready!</p>
              <Link href="/dashboard/purchases" className="text-sm text-primary hover:underline">Download from your dashboard</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/purchases">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
                View My Purchases
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full gap-2 px-8">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
