'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, ArrowRight, Globe, 
  Mail, Lock, User, CheckCircle, Sparkles,
  Store
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', store: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await signUp(formData.name, formData.email, formData.password);
    setLoading(false);
    if (res.success) {
      router.push('/connect');
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="min-h-screen flex text-white overflow-hidden">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#09090b] relative z-10 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8 py-10"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-violet-600/30">
               <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AgentRank</span>
          </Link>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="text-white/40">Join the next generation of Shopify merchants.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Full Name</label>
                 <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10 text-sm"
                      placeholder="Alex Smith"
                    />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Shopify Domain</label>
                 <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      type="text" 
                      required
                      value={formData.store}
                      onChange={e => setFormData({...formData, store: e.target.value})}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10 text-sm"
                      placeholder="mystore"
                    />
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Work Email</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                 <input 
                   type="email" 
                   required
                   value={formData.email}
                   onChange={e => setFormData({...formData, email: e.target.value})}
                   className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10 text-sm"
                   placeholder="alex@brand.com"
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                 <input 
                   type="password" 
                   required
                   value={formData.password}
                   onChange={e => setFormData({...formData, password: e.target.value})}
                   className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-white/10 text-sm"
                   placeholder="••••••••"
                 />
              </div>
            </div>

            <div className="pt-4 space-y-4">
               <button 
                 type="submit"
                 disabled={loading}
                 className="w-full py-4 rounded-xl gradient-brand text-white font-bold transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
               >
                 {loading ? <span className="animate-pulse">Creating account...</span> : <>Start Analysis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
               </button>
               <p className="text-[10px] text-white/30 text-center leading-relaxed">
                  By signing up, you agree to our <Link href="#" className="underline">Terms</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
               </p>
            </div>
          </form>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-[#09090b] px-4 text-white/20 tracking-widest">Fast Track</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black hover:bg-white/90 transition-all text-xs font-bold">
                Connect Shopify
             </button>
             <button 
               type="button" 
               onClick={signInWithGoogle} 
               className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold"
             >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 opacity-70" alt="Google" /> Google
             </button>
          </div>

          <p className="text-center text-sm text-white/40">
            Already have an account? <Link href="/signin" className="text-violet-400 font-bold hover:text-white transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Column - Presentation */}
      <div className="hidden lg:flex flex-1 relative bg-[#0a0a0c] items-center justify-center overflow-hidden border-l border-white/5">
         <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-transparent to-cyan-600/10" />
         
         {/* Animated Grid */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff11 1px, transparent 0)', backgroundSize: '40px 40px' }} />
         
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative max-w-md p-10 bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl space-y-8"
         >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
               <Sparkles className="w-3.5 h-3.5" />
               New Era of Commerce
            </div>
            
            <h2 className="text-3xl font-bold leading-tight">
               Don't leave your discovery to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">chance.</span>
            </h2>
            
            <p className="text-white/50 text-sm leading-relaxed">
              Join thousands of Shopify merchants who are already optimizing their stores for the future of AI-assisted shopping.
            </p>

            <div className="space-y-4 pt-4 border-t border-white/5">
               {[
                 { label: 'Real-time Scanning', value: 'Instant' },
                 { label: 'AI Accuracy', value: '99.9%' },
                 { label: 'Global Ranking', value: 'Included' }
               ].map(stat => (
                 <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-xs text-white/30">{stat.label}</span>
                    <span className="text-xs font-bold text-white">{stat.value}</span>
                 </div>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
}
