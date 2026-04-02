"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from 'motion/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Zap, ShieldCheck, Star, ArrowLeft, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      setErrorMsg(error.message)
      setIsLoading(false)
      return
    }

    // Support 'next' redirect parameter with role-based validation
    const { data: { user } } = await supabase.auth.getUser()
    const searchParams = new URLSearchParams(window.location.search)
    let next = searchParams.get('next')

    if (user) {
      const { data: profile } = await supabase
        .from('Profile')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile) {
        // Resolve role-based specific paths if next is generic
        if (next === '/dashboard' || next?.startsWith('/dashboard?')) {
          if (profile.role === 'buyer') next = '/dashboard/buyer'
          if (profile.role === 'admin') next = '/admin'
          if (profile.role === 'publisher') next = '/publisher'
        }

        // Final routing
        if (next) {
          router.push(next)
          return
        }

        // Default role-based landing pages if no 'next' is provided
        if (profile.role === 'admin') {
          router.push("/admin")
          return
        }
        if (profile.role === 'publisher') {
          router.push("/publisher")
          return
        }
        if (profile.role === 'seller') {
          router.push("/dashboard")
          return
        }
        if (profile.role === 'buyer') {
          router.push("/dashboard/buyer")
          return
        }
      }
    }

    router.push(next || "/dashboard/buyer")
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    setErrorMsg("")
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#FAFAFA] font-sans text-gray-900 selection:bg-black selection:text-white">
      <div className="relative z-10 flex min-h-screen">
        {/* Left Column - Branding (Desktop Only) */}
        <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-black transition-opacity hover:opacity-70"
          >
            <ArrowLeft className="h-4 w-4" />
            D I G I T H U B
          </Link>
          
          <div className="max-w-md">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="mb-6 text-5xl font-medium leading-[1.1] tracking-tight text-black">
                  Welcome back to DIGITHUB.
                </h1>
                <p className="text-lg font-light text-gray-500">
                  Log in to access your digital assets, continue your learning, or manage your freelancer profile.
                </p>
              </motion.div>
            
            <div className="mt-12 space-y-6">
              {[
                { icon: Zap, text: "Instant access to premium assets" },
                { icon: ShieldCheck, text: "Secure local payment integration" },
                { icon: Star, text: "Vetted community of experts" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4 text-sm font-medium text-gray-600"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm border border-gray-100">
                    <item.icon className="h-4 w-4 text-black" />
                  </div>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-xs font-medium tracking-wide text-gray-400">
            © {new Date().getFullYear()} DIGITHUB. PROUDLY BUILT IN ALGERIA.
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 flex justify-between items-center lg:hidden">
               <Link href="/" className="text-sm font-bold tracking-[0.2em] text-black">D I G I T H U B</Link>
            </div>

            <Card className="border-gray-100 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl overflow-hidden rounded-[2rem]">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CardHeader className="space-y-1 pb-4 pt-8 px-8">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-black">
                      Sign in
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Welcome back! Log in to your DIGITHUB account.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 px-8 pb-8">
                    
                    <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
                      {errorMsg && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm mb-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <p>{errorMsg}</p>
                        </div>
                      )}

                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-600">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="bg-white/50 border-gray-200 focus-visible:ring-black/5 rounded-xl h-11" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-600">Password</Label>
                          <Link href="/forgot-password" className="text-xs font-semibold text-gray-500 hover:text-black">
                             Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                           <Input 
                             id="password" 
                             type={showPassword ? "text" : "password"} 
                             placeholder="••••••••" 
                             className="bg-white/50 border-gray-200 focus-visible:ring-black/5 rounded-xl h-11 pr-10" 
                             value={formData.password}
                             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                             required
                           />
                           <button
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                           >
                             {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                           </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 my-2">
                        <Checkbox
                          id="remember"
                          className="border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, rememberMe: checked as boolean })
                          }
                        />
                        <Label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">
                          Remember me for 30 days
                        </Label>
                      </div>

                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white hover:bg-gray-800 h-11 rounded-xl font-semibold tracking-wide transition-all shadow-lg shadow-black/5 mt-2"
                      >
                        {isLoading ? "SIGNING IN..." : "SIGN IN"}
                      </Button>
                    </form>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-100" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" type="button" onClick={() => handleOAuthLogin('google')} className="h-11 rounded-xl border-gray-100 bg-white/50 hover:bg-gray-50 transition-colors text-black">
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                           <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                           <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                           <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                           <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" type="button" onClick={() => handleOAuthLogin('github')} className="h-11 rounded-xl border-gray-100 bg-white/50 hover:bg-gray-50 transition-colors text-black">
                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </Button>
                    </div>
                  </CardContent>
                  <div className="px-8 pb-8 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-semibold text-black hover:underline cursor-pointer">
                      Sign up
                    </Link>
                  </div>
                </motion.div>
            </Card>
            
          </motion.div>
        </div>
      </div>
    </div>
  )
}
