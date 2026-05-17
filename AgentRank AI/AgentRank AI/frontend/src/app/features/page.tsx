'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, Package, Shield, 
  MessageSquare, Sparkles, Zap, Search, 
  Globe, TrendingUp, CheckCircle, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    title: 'AI Readiness Analyzer',
    desc: 'Deep-scan your entire Shopify store to measure how well AI models can parse your product data.',
    icon: BarChart3,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    span: 'md:col-span-2'
  },
  {
    title: 'Representation Simulator',
    desc: 'Preview how ChatGPT, Gemini, and Perplexity describe your brand to potential customers.',
    icon: Brain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Optimization Engine',
    desc: 'Automatically rewrite descriptions to include semantic keywords AI agents look for.',
    icon: Zap,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Policy Clarity Scanner',
    desc: 'Ensure your shipping and return policies are structured for agent-friendly extraction.',
    icon: Shield,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    span: 'md:col-span-2'
  },
  {
    title: 'Competitor Benchmarking',
    desc: 'See how your AI discoverability ranks against top brands in your niche.',
    icon: TrendingUp,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  {
    title: 'Semantic SEO Analysis',
    desc: 'Beyond keywords—analyze intent matching for next-gen search engines.',
    icon: Search,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10'
  }
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Capabilities
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white tracking-tight"
          >
            The Full Suite for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI Discoverability.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/40 leading-relaxed"
          >
            AgentRank is more than a scanner. It's a strategic platform to ensure your brand isn't left behind in the AI-first economy.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`group relative p-8 rounded-3xl glass border border-white/5 hover:border-white/10 transition-all ${feature.span || ''}`}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed mb-6">
                {feature.desc}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/20 group-hover:text-violet-400 transition-colors">
                Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">AI-Native Optimization</h2>
              <p className="text-white/40 leading-relaxed">
                Traditional SEO was built for keywords and backlink algorithms. AgentRank is built for LLM reasoning and semantic context.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { title: 'Confidence Scoring', desc: 'We verify if your site policies allow AI agents to safely recommend you.' },
                { title: 'Semantic Schema', desc: 'Inject machine-readable intent directly into your store description.' },
                { title: 'Intent Consistency', desc: 'Maintain a unified brand narrative across all AI platforms.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-violet-600/20 blur-[100px] rounded-full" />
            <div className="relative glass-strong rounded-[2.5rem] border border-white/10 p-2 shadow-2xl overflow-hidden aspect-video">
               <div className="w-full h-full bg-[#09090b] rounded-[2rem] p-8 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4 text-center">
                     <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center animate-pulse">
                        <Brain className="w-8 h-8 text-white" />
                     </div>
                     <div className="space-y-2">
                        <div className="text-white font-bold">Simulating Agent Logic...</div>
                        <div className="flex gap-1 justify-center">
                           <div className="w-8 h-1 bg-violet-500 rounded-full" />
                           <div className="w-12 h-1 bg-white/10 rounded-full" />
                           <div className="w-6 h-1 bg-white/10 rounded-full" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-1 rounded-[3rem] bg-gradient-to-r from-violet-600/20 via-cyan-600/20 to-violet-600/20 border border-white/5"
        >
          <div className="p-12 md:p-20 rounded-[2.9rem] bg-[#09090b] text-center space-y-8 overflow-hidden relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-violet-600/10 blur-[120px] pointer-events-none" />
             <h2 className="text-3xl md:text-5xl font-bold text-white max-w-2xl mx-auto">Ready to see your AI <span className="italic">Readiness?</span></h2>
             <p className="text-white/40 max-w-xl mx-auto">Connect your store in 60 seconds and get your first diagnostic report free.</p>
             <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="px-10 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                   Get Started Now
                </Link>
                <Link href="/how-it-works" className="px-10 py-4 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                   How It Works
                </Link>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
