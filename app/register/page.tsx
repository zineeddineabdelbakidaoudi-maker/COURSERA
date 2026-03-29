"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from 'motion/react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Briefcase, Zap, ShieldCheck, Star, ArrowLeft, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    const fullName = `${formData.firstName} ${formData.lastName}`.trim()

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: fullName,
          role: role,
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
    if (role === "seller") {
      router.push("/become-seller")
    } else {
      router.push("/dashboard/buyer")
    }
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

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];

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
            D I G I T H U P
          </Link>
          
          <div className="max-w-md">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="mb-6 text-5xl font-medium leading-[1.1] tracking-tight text-black">
                  {role === 'buyer' ? "Unlock your digital potential." : "Showcase your expertise to the world."}
                </h1>
                <p className="text-lg font-light text-gray-500">
                  Join thousands of {role === 'buyer' ? 'buyers' : 'creators'} building the future of the Algerian digital economy.
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
            © {new Date().getFullYear()} DIGITHUP. PROUDLY BUILT IN ALGERIA.
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
               <Link href="/" className="text-sm font-bold tracking-[0.2em] text-black">D I G I T H U P</Link>
            </div>

            <Card className="border-gray-100 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl overflow-hidden rounded-[2rem]">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <CardHeader className="space-y-1 pb-4 pt-8 px-8">
                    <CardTitle className="text-2xl font-semibold tracking-tight text-black">
                      Create an account
                    </CardTitle>
                    <CardDescription className="text-gray-500">
                      Enter your details to get started on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6 px-8 pb-8">
                    <Tabs 
                      value={role} 
                      onValueChange={(v) => setRole(v as 'buyer' | 'seller')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-gray-100/50 rounded-xl">
                        <TabsTrigger value="buyer" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black">
                          <User className="mr-2 h-4 w-4" />
                          Individual
                        </TabsTrigger>
                        <TabsTrigger value="seller" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black">
                          <Briefcase className="mr-2 h-4 w-4" />
                          Freelancer
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <form onSubmit={handleSubmit} className="grid gap-4 mt-2">
                      {errorMsg && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm mb-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <p>{errorMsg}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="first-name" className="text-gray-600">First Name</Label>
                          <Input 
                            id="first-name" 
                            placeholder="John" 
                            className="bg-white/50 border-gray-200 focus-visible:ring-black/5 rounded-xl h-11" 
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="last-name" className="text-gray-600">Last Name</Label>
                          <Input 
                            id="last-name" 
                            placeholder="Doe" 
                            className="bg-white/50 border-gray-200 focus-visible:ring-black/5 rounded-xl h-11" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      
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
                        
                        {/* Password Strength Meter */}
                        {formData.password && (
                          <div className="mt-1 space-y-2">
                            <div className="flex h-1 gap-1">
                              {[0, 1, 2, 3].map((i) => (
                                <div 
                                  key={i}
                                  className={`h-full flex-1 rounded-full transition-all duration-500 ${
                                    i < strength ? strengthColors[strength - 1] : 'bg-gray-100'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${
                              strength > 0 ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              Strength: <span className="text-black">{strength > 0 ? strengthLabels[strength - 1] : 'Too Short'}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white hover:bg-gray-800 h-11 rounded-xl font-semibold tracking-wide transition-all shadow-lg shadow-black/5 mt-2"
                      >
                        {isLoading ? "CREATING..." : `SIGN UP AS ${role.toUpperCase()}`}
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
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-black hover:underline cursor-pointer">
                      Sign in
                    </Link>
                  </div>
                </motion.div>
            </Card>
            
            <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-black">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-black">Privacy Policy</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

