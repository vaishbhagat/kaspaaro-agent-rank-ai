'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, Globe, Shield, 
  Sparkles, Zap, Search, 
  ArrowRight, Store, FileSearch, 
  Cpu, MousePointerClick, Rocket
} from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    title: 'Connect Shopify Store',
    desc: 'Enter your .myshopify.com URL and authorize our app. We use secure read-only API access to analyze your store metadata.',
    icon: Store,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10'
  },
  {
    title: 'Deep AI-Native Scan',
    desc: 'Our engine parses product descriptions, shipping policies, returns, and metadata through the same lenses used by ChatGPT and Gemini.',
    icon: FileSearch,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'Identify Discovery Gaps',
    desc: 'Acknowledge missing FAQ coverage, ambiguous policies, or weak trust signals that prevent AI agents from recommending your products.',
    icon: Search,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Deploy Recommendations',
    desc: 'Receive a prioritized action plan to improve your AI visibility. Use our AI-optimized description rewrites to boost clarity.',
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Analyze & Scale',
    desc: 'Monitor your progress with our dynamic AI Readiness Score. See your brand sentiment improve across multiple AI agents over time.',
    icon: Rocket,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-32 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest"
          >
            <Cpu className="w-3.5 h-3.5" />
            The Methodology
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            How we solve the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI Discoverability Gap.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 leading-relaxed"
          >
            Our 5-step workflow transforms your store into a machine-readable commerce powerhouse.
          </motion.p>
        </div>

        {/* Workflow Section */}
        <div className="relative space-y-32">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-violet-500/50 via-cyan-500/50 to-violet-500/50 hidden lg:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-32 ${
                i % 2 === 0 ? '' : 'lg:flex-row-reverse'
              }`}
            >
              {/* Text Side */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                 <div className="flex items-center justify-center lg:justify-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${step.bg} flex items-center justify-center`}>
                       <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="text-xs font-bold text-white/30 tracking-widest uppercase italic">Step 0{i + 1}</div>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{step.title}</h3>
                 <p className="text-white/40 leading-relaxed text-sm md:text-base">
                   {step.desc}
                 </p>
              </div>

              {/* Visualization Side */}
              <div className="flex-1 w-full lg:w-auto">
                 <div className="glass-strong rounded-[2.5rem] border border-white/5 p-8 aspect-video flex items-center justify-center relative overflow-hidden group shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 group-hover:opacity-100 transition-opacity" />
                    <div className="relative text-center space-y-4">
                       <div className="w-16 h-16 rounded-full bg-[#0a0a0c] border border-white/10 flex items-center justify-center mx-auto shadow-xl">
                          <step.icon className={`w-7 h-7 ${step.color} animate-pulse`} />
                       </div>
                       <div className="h-2 w-32 bg-white/5 rounded-full mx-auto overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            transition={{ duration: 2, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integration Preview */}
        <div className="mt-40 p-12 md:p-20 rounded-[3rem] glass border border-white/5 text-center">
           <h2 className="text-3xl font-bold text-white mb-6">Seamless Infrastructure</h2>
           <p className="text-white/40 max-w-xl mx-auto mb-12">
             AgentRank fits into your existing tech stack without a single line of code. Connect once, optimize forever.
           </p>
           <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                 <span className="text-emerald-400">S</span> Shopify
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                 ChatGPT
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                 Gemini
              </div>
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                 Perplexity
              </div>
           </div>
        </div>

        {/* Final CTA */}
        <div className="mt-40 text-center space-y-8">
           <h2 className="text-4xl font-bold text-white">Stop being ignored by <span className="text-violet-400">AI Agents.</span></h2>
           <Link href="/connect" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] active:scale-95 group">
             Get Started Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  );
}
