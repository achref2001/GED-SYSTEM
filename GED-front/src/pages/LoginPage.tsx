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
      const data = await authApi.login({ email, password })
      const tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || ''
      }
      login(data.user, tokens)
      toast.success('Access Granted. Entering Vault...')
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 800)
    } catch (err: any) {
      toast.error('Authentication failed. Verify credentials.')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh font-sans overflow-hidden p-6 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, -40, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-20 w-[700px] h-[700px] bg-violet-500/10 rounded-full blur-[140px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0, 0.71, 0.2, 1.01] }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/30"
          >
            <FolderOpen className="w-10 h-10 text-white stroke-[2]" />
          </motion.div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">
            GED<span className="text-indigo-600">Sphere</span>
          </h1>
          <p className="text-slate-500 text-sm font-semibold uppercase tracking-[0.3em] pl-1">
            Enterprise Intelligence Platform
          </p>
        </div>

        <div className="glass p-10 rounded-[2.5rem] border border-white/50 relative group">
          <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] -z-10 group-hover:bg-white/50 transition-colors duration-500" />
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[11px] font-bold text-slate-400 pl-1 uppercase tracking-widest">
                  Identity Token
                </Label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors duration-300" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 bg-white/50 border-white/80 focus:bg-white focus:ring-indigo-500/10 focus:border-indigo-500/50 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm placeholder:text-slate-300"
                    placeholder="name@enterprise.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <Label htmlFor="password" className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Encryption Key
                  </Label>
                  <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                    Lost?
                  </button>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors duration-300" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 bg-white/50 border-white/80 focus:bg-white focus:ring-indigo-500/10 focus:border-indigo-500/50 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-sm placeholder:text-slate-300"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 font-black uppercase tracking-[0.2em] text-[11px] transition-all group flex items-center justify-center gap-4 active:scale-[0.98]" 
              disabled={isSyncing}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Establishing Link...
                </>
              ) : (
                <>
                  Initialize System
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200/50 flex flex-col items-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Credentials Layer</p>
            <div className="flex gap-4">
              <div className="px-5 py-2.5 rounded-xl bg-slate-900/5 border border-slate-200 text-[10px] font-black text-slate-600">
                admin@ged.com
              </div>
              <div className="px-5 py-2.5 rounded-xl bg-slate-900/5 border border-slate-200 text-[10px] font-black text-slate-600">
                password
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-8 text-slate-400 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">ISO 27001 Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Next-Gen Engine</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

