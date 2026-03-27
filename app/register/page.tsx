"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, AlertCircle, Globe } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [accountType, setAccountType] = useState("buyer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessInfo: "",
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.name,
          role: accountType,
          business_info: formData.businessInfo.trim() || null,
        }
      }
    })

    if (error) {
      setErrorMsg(error.message)
      setIsLoading(false)
      return
    }

    // Success
    setIsLoading(false)
    if (accountType === "seller") {
      router.push("/become-seller")
    } else if (accountType === "buyer") {
      router.push("/dashboard/buyer")
    } else {
      router.push("/dashboard")
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setErrorMsg("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="mb-8">
            <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-3xl">D</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Whether you&apos;re looking for digital services or ready to offer your skills, Digit Hup is your platform for success.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  Your payments are protected with our escrow system
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verified Professionals</h3>
                <p className="text-sm text-muted-foreground">
                  Work with trusted and vetted service providers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Our team is here to help you succeed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">D</span>
                </div>
                <span className="font-bold text-xl">Digit Hup</span>
              </div>
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>
                Join thousands of users on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={accountType} onValueChange={setAccountType} className="mb-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buyer">I want to buy</TabsTrigger>
                  <TabsTrigger value="seller">I want to sell</TabsTrigger>
                </TabsList>
                <TabsContent value="buyer" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Find and hire talented professionals for your projects.
                  </p>
                </TabsContent>
                <TabsContent value="seller" className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Offer your services and products to a global audience.
                  </p>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3 text-destructive text-sm mb-4">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{errorMsg}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessInfo">Business Name / Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="businessInfo"
                      type="text"
                      placeholder="e.g. MyBrand.com or Studio Name"
                      className="pl-10"
                      value={formData.businessInfo}
                      onChange={(e) => setFormData({ ...formData, businessInfo: e.target.value })}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Helps freelancers understand your needs better.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              strength >= level
                                ? strength <= 1
                                  ? "bg-red-500"
                                  : strength <= 2
                                  ? "bg-orange-500"
                                  : strength <= 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {strength <= 1 && "Weak password"}
                        {strength === 2 && "Fair password"}
                        {strength === 3 && "Good password"}
                        {strength === 4 && "Strong password"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeTerms: checked as boolean })
                    }
                    required
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg" 
                  disabled={isLoading || !formData.agreeTerms}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" onClick={() => handleOAuthLogin('google')}>
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" onClick={() => handleOAuthLogin('github')}>
                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
