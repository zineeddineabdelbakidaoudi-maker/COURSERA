import Link from "next/link"
import { CheckCircle2, Package, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  const orderId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">Order Placed! 🎉</h1>
        <p className="text-muted-foreground mb-2">Your order has been confirmed successfully.</p>
        <p className="text-sm font-semibold text-primary mb-6">{orderId}</p>
        <p className="text-sm text-muted-foreground mb-8">The seller will contact you via WhatsApp shortly to confirm details and arrange delivery. Thank you for choosing Digit Hup!</p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/dashboard/buyer/orders" className="gap-2"><Package className="w-4 h-4" />Track Order</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/" className="gap-2"><Home className="w-4 h-4" />Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
