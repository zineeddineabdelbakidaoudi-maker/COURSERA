import React from "react"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft, HeadphonesIcon } from "lucide-react"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center max-w-2xl animate-scale-in">
          {/* Cancel Icon */}
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_oklch(0.63_0.24_25_/_0.2)]">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Payment Cancelled
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your payment process was interrupted and no charges were made to your account. Your items are still saved in your cart.
          </p>

          <div className="bg-secondary/30 rounded-2xl p-6 mb-10 max-w-md mx-auto text-left border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-background rounded-xl flex items-center justify-center border border-border">
              <HeadphonesIcon className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Need help?</p>
              <Link href="/contact" className="text-sm text-primary hover:underline">Contact our support team</Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/cart">
              <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
                Return to Cart
                <ArrowLeft className="w-4 h-4" />
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
