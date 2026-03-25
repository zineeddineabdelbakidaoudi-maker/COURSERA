import Link from "next/link"
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Order Cancelled</h1>
        <p className="text-muted-foreground mb-8">Your order was not placed. Your cart items are still saved — you can go back and complete your purchase anytime.</p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/cart" className="gap-2"><ShoppingCart className="w-4 h-4" />Back to Cart</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/services" className="gap-2"><ArrowLeft className="w-4 h-4" />Browse More</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
