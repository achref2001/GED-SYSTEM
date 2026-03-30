import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../services/api/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { 
  FolderOpen, Lock, Mail, Eye, EyeOff, 
  ArrowRight, ShieldCheck, Sparkles, Loader2 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@ged.com')
  const [password, setPassword] = useState('password')
  const [showPassword, setShowPassword] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSyncing(true)
    
    try {
      // Step 1: Exchange credentials for tokens
      const data = await authApi.login({ email, password })
      
      // Step 2: Extract data from response - assuming backend matches my previous impl
      const tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || ''
      }
      
      // Step 3: Hydrate the store
      login(data.user, tokens)
      
      toast.success('Synchronization established. Redirecting to vault...')
      
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 500)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      const errorMessage = typeof detail === 'string' 
        ? detail 
        : Array.isArray(detail)
          ? detail[0]?.msg
          : 'Authentication failed. Please verify your credentials.'
      toast.error(errorMessage)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans overflow-hidden">
      {/* LEFT: Immersive Brand Narrative */}
      <div className="hidden lg:flex lg:w-[60%] bg-slate-900 items-center justify-center relative overflow-hidden">
        {/* Abstract Dynamic Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-[10%] left-[10%] w-[800px] h-[800px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl px-12 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-blue-500/20 rotate-3 transition-transform hover:rotate-0 duration-500">
            <FolderOpen className="w-12 h-12 text-white stroke-[2.5]" />
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none italic">GED<span className="text-blue-500">System</span> V2</h1>
          <p className="text-slate-400 text-xl font-bold leading-relaxed mb-12 uppercase tracking-widest pl-1">
             Enterprise-grade document intelligence and collaborative storage.
          </p>
          
          <div className="grid grid-cols-3 gap-6">
             {[
               { icon: ShieldCheck, label: 'Encrypted V2' },
               { icon: Sparkles, label: 'OCR Ready' },
               { icon: Lock, label: 'Audit Trail' }
             ].map((item, i) => (
               <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                   <item.icon className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{item.label}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT: Login Engine Interface */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white relative">
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="space-y-4">
             <div className="lg:hidden w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-6 shadow-xl shadow-blue-500/20">
                <FolderOpen className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight italic">Initialize Session.</h2>
             <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase tracking-widest pl-1 italic">Authorized access point for GED vault synchronization.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="space-y-2 group">
                    <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-blue-600 transition-colors">Access Identifier</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors stroke-[3]" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-14 pl-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold transition-all shadow-inner placeholder:italic placeholder:text-slate-300"
                          placeholder="primary@enterprise.com"
                          required
                        />
                    </div>
                </div>

                <div className="space-y-2 group">
                    <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 group-focus-within:text-blue-600 transition-colors">Encryption Key</Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors stroke-[3]" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-14 pl-12 pr-12 bg-slate-50 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xs font-bold transition-all shadow-inner placeholder:italic placeholder:text-slate-300"
                          placeholder="••••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} className="stroke-[3]" /> : <Eye size={16} className="stroke-[3]" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                   <div className="w-5 h-5 rounded-lg border-2 border-slate-100 bg-slate-50 flex items-center justify-center transition-all group-hover:border-blue-500/30">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-600 opacity-0 group-hover:opacity-10 scale-50 transition-all" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Persistent Link</span>
                </label>
                <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors underline decoration-blue-100 decoration-2 underline-offset-4 italic">Lost Key?</button>
            </div>

            <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-600/30 font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 group flex items-center gap-4 italic" 
                disabled={isSyncing}
            >
                {isSyncing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Synchronizing Session...
                    </>
                ) : (
                    <>
                      Establish Identity
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform stroke-[3]" />
                    </>
                )}
            </Button>
          </form>

          <footer className="pt-12 border-t border-slate-50 flex flex-col items-center">
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.1em] mb-4">Demo Credentials Layer</p>
             <div className="flex gap-4">
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/50">admin@ged.com</span>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/50">password</span>
             </div>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}
