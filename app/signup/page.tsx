"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Shield, Star, Zap, User, Mail, UserPlus, Briefcase, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleNext = () => {
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("All fields are required")
        return
      }
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        setError("Please enter a valid email")
        return
      }
    }
    if (step === 3) {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
    }
    setError("")
    setStep(s => Math.min(s + 1, 4))
  }

  const handleSignup = async () => {
    if (!agreed) {
      setError("Please agree to the Terms of Service")
      return
    }
    setError("")
    setLoading(true)
    
    // Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          full_name: `${formData.firstName} ${formData.lastName}`,
          role: role,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Automatically create a profile or rely on existing Supabase triggers if configured.
    // If we need to write to Profile explicitly since we seeded directly:
    if (authData.user) {
      const { error: profileError } = await supabase.from('Profile').upsert({
        id: authData.user.id,
        email: formData.email,
        full_name: `${formData.firstName} ${formData.lastName}`,
        role: role,
        country: 'DZ',
        created_at: new Date().toISOString()
      })
      if (profileError) {
        console.error("Profile creation error:", profileError)
      }
    }

    router.push(role === 'buyer' ? '/dashboard/buyer' : '/dashboard')
  }

  return (
    <div className="min-h-screen w-full flex bg-[#F9FAFB] font-sans selection:bg-black selection:text-white">
      {/* LEFT COLUMN - HERO */}
      <div className="hidden lg:flex flex-col justify-between w-2/5 p-12 relative overflow-hidden bg-white border-r border-gray-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> D I G I T H U B
          </Link>
        </div>

        <div className="relative z-10 mt-12 mb-auto">
          <h1 className="text-4xl xl:text-5xl font-black text-black leading-tight mb-6">
            Unlock your digital potential.
          </h1>
          <p className="text-gray-600 text-lg mb-12 max-w-md">
            Join thousands of learners building the future of the Algerian digital economy.
          </p>

          <div className="space-y-6">
            {[
              { icon: Zap, text: "Instant access to premium assets" },
              { icon: Shield, text: "Secure local payment integration" },
              { icon: Star, text: "Vetted community of experts" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                  <f.icon className="w-5 h-5 text-black" />
                </div>
                <span className="text-sm font-medium text-gray-700">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          © {new Date().getFullYear()} DIGITHUB. PROUDLY BUILT IN ALGERIA.
        </div>
      </div>

      {/* RIGHT COLUMN - FORM */}
      <div className="w-full lg:w-3/5 flex flex-col items-center justify-center p-6 md:p-12 min-h-screen">
        <div className="w-full max-w-xl">
          
          {/* Header steps */}
          <div className="flex items-center gap-2 mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? 'bg-black text-white' : step === s ? 'bg-black text-white ring-4 ring-gray-100' : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 4 && <div className={`w-12 h-0.5 mx-2 ${step > s ? 'bg-black' : 'bg-gray-100'}`} />}
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                
                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Create your account</div>
                    <h2 className="text-2xl font-bold mb-8">Choose your role</h2>
                    
                    <div className="space-y-4">
                      <button onClick={() => setRole('buyer')} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${role === 'buyer' ? 'bg-black border-black text-white' : 'border-gray-200 hover:border-black bg-white'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${role === 'buyer' ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Buyer / Learner</div>
                          <div className={`text-sm ${role === 'buyer' ? 'text-gray-300' : 'text-gray-500'}`}>I want to buy products and hire talent.</div>
                        </div>
                      </button>

                      <button onClick={() => setRole('seller')} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${role === 'seller' ? 'bg-black border-black text-white' : 'border-gray-200 hover:border-black bg-white'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${role === 'seller' ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-lg">Freelancer / Creator</div>
                          <div className={`text-sm ${role === 'seller' ? 'text-gray-300' : 'text-gray-500'}`}>I want to sell my work and services.</div>
                        </div>
                      </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-black">Already have an account? Login</Link>
                      <button onClick={handleNext} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-3 font-semibold transition-all flex items-center gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Personal Details</div>
                    <h2 className="text-2xl font-bold mb-8">We'd love to know you</h2>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">FIRST NAME</label>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input type="text" placeholder="Amine" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">LAST NAME</label>
                        <div className="relative">
                          <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input type="text" placeholder="B." value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-2">EMAIL ADDRESS</label>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type="email" placeholder="amine@algeria.dz" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all" />
                      </div>
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}

                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="text-sm font-semibold text-gray-500 hover:text-black">Back</button>
                      <button onClick={handleNext} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-3 font-semibold transition-all flex items-center gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Security</div>
                    <h2 className="text-2xl font-bold mb-8">Secure your account</h2>
                    
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 mb-2">PASSWORD</label>
                      <div className="relative">
                        <Shield className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-12 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all" />
                        <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-xs font-bold text-gray-500 mb-2">CONFIRM PASSWORD</label>
                      <div className="relative">
                        <Shield className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 py-4 pl-12 pr-12 text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl mb-4">
                      <div className="text-xs font-bold mb-3 text-gray-500">PASSWORD REQUIREMENTS</div>
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm font-medium ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                          <Check className="w-4 h-4" /> At least 8 characters
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-medium ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <Check className="w-4 h-4" /> One uppercase letter
                        </div>
                        <div className={`flex items-center gap-2 text-sm font-medium ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                          <Check className="w-4 h-4" /> One number
                        </div>
                      </div>
                    </div>

                    {error && <div className="text-red-500 text-sm font-medium mt-2">{error}</div>}

                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <button onClick={() => setStep(2)} className="text-sm font-semibold text-gray-500 hover:text-black">Back</button>
                      <button onClick={handleNext} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-3 font-semibold transition-all flex items-center gap-2">
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Confirmation</div>
                    <h2 className="text-2xl font-bold mb-8">Ready to launch</h2>
                    
                    <div className="bg-gray-50 p-6 rounded-3xl mb-8 space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed">
                        <span className="text-gray-500 text-sm font-bold">ACCOUNT TYPE</span>
                        <span className="font-bold capitalize">{role}</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed">
                        <span className="text-gray-500 text-sm font-bold">NAME</span>
                        <span className="font-bold">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm font-bold">EMAIL</span>
                        <span className="font-bold">{formData.email}</span>
                      </div>
                    </div>

                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5 border ${agreed ? 'bg-black border-black' : 'bg-white border-gray-300 group-hover:border-black'}`}>
                        {agreed && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={agreed} onChange={() => setAgreed(!agreed)} />
                      <span className="text-sm font-medium text-gray-600 leading-relaxed">
                        I agree to the <a href="#" className="text-black underline">Terms of Service</a> and <a href="#" className="text-black underline">Privacy Policy</a>, and I understand email verification may be required.
                      </span>
                    </label>

                    {error && <div className="text-red-500 text-sm font-medium mt-6">{error}</div>}

                    <div className="mt-10 pt-6 border-t border-gray-50 flex items-center justify-between">
                      <button onClick={() => setStep(3)} className="text-sm font-semibold text-gray-500 hover:text-black">Back</button>
                      <button onClick={handleSignup} disabled={loading} className="bg-black text-white hover:bg-gray-800 rounded-2xl px-6 py-3 font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                        {loading ? 'Creating...' : 'Create account'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
