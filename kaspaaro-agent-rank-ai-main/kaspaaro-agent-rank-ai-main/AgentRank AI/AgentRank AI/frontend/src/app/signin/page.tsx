'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, ArrowRight, Globe, 
  Mail, Lock, User, CheckCircle, Sparkles 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signIn(email, password);
    setLoading(false);
    if (res.success) {
      router.push('/dashboard');
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen flex text-white overflow-hidden">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#09090b] relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-violet-600/30">
               <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AgentRank</span>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-white/40">Enter your credentials to access your store insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10"
                     placeholder="name@store.com"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Password</label>
                  <Link href="#" className="text-xs text-violet-400 hover:text-white transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                   <input 
                     type="password" 
                     required
                     value={password}
                     onChange={e => setPassword(e.target.value)}
                     className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10"
                     placeholder="••••••••"
                   />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl gradient-brand text-white font-bold transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
            >
              {loading ? <span className="animate-pulse">Signing in...</span> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>



          <p className="text-center text-sm text-white/40">
            Don't have an account? <Link href="/signup" className="text-violet-400 font-bold hover:text-white transition-colors">Sign up for free</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Presentation */}
      <div className="hidden lg:flex flex-1 relative bg-[#0d0d0f] items-center justify-center overflow-hidden border-l border-white/5">
         <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10" />
         
         {/* Animated Background Graphics */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full" />
         
         {/* Content Card */}
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8 }}
           className="relative max-w-lg p-10 space-y-8"
         >
            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(124,58,237,0.2)]">
               <Sparkles className="w-8 h-8" />
            </div>
            
            <h2 className="text-4xl font-bold leading-tight">
               Build your store's <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI Trust Network.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                "Measure multi-agent perception in seconds.",
                "Generate high-fidelity product rewrites.",
                "Bridge the policy-to-machine extraction gap.",
                "Benchmark against industry leaders."
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                     <CheckCircle className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-white/60 font-medium">{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-10 flex items-center gap-6">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0d0d0f] ${i%2===0 ? 'bg-violet-600' : 'bg-cyan-600'} flex items-center justify-center text-[10px] font-bold`}>U{i}</div>)}
               </div>
               <div className="text-xs text-white/30">Trusted by **500+** Shopify Pioneers.</div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
