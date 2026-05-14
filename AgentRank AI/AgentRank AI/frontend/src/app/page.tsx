'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import {
  ArrowRight, Zap, Shield, TrendingUp, Brain, Search, Star,
  CheckCircle, ChevronRight, Sparkles, BarChart3, Globe, MessageSquare,
  XCircle, AlertTriangle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Perception Analysis',
    description: 'Understand exactly how ChatGPT, Gemini, and Perplexity perceive and represent your store to shoppers.',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
  },
  {
    icon: Search,
    title: 'Discoverability Score',
    description: 'Get a comprehensive AI readiness score with granular breakdowns across 5 key dimensions.',
    color: 'from-cyan-400 to-blue-500',
    glow: 'rgba(34,211,238,0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Prioritized Recommendations',
    description: 'Receive a ranked action plan — HIGH, MEDIUM, LOW priority — so you know exactly what to fix first.',
    color: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16,185,129,0.3)',
  },
  {
    icon: Shield,
    title: 'Trust Signal Audit',
    description: 'Identify missing return policies, weak product descriptions, and low FAQ coverage instantly.',
    color: 'from-orange-400 to-red-500',
    glow: 'rgba(249,115,22,0.3)',
  },
  {
    icon: Zap,
    title: 'Instant Policy Check',
    description: 'Evaluate shipping clarity, refund transparency, and policy completeness against AI agent expectations.',
    color: 'from-yellow-400 to-orange-500',
    glow: 'rgba(234,179,8,0.3)',
  },
  {
    icon: Star,
    title: 'Metadata Quality',
    description: 'Audit product tags, categories, variants, and structured data for maximum AI agent compatibility.',
    color: 'from-pink-400 to-rose-500',
    glow: 'rgba(244,63,94,0.3)',
  },
];

const stats = [
  { value: '10K+', label: 'Stores Analyzed' },
  { value: '94%', label: 'Avg. Score Improvement' },
  { value: '3x', label: 'AI Recommendation Rate' },
  { value: '< 2min', label: 'Full Analysis Time' },
];

const testimonials = [
  {
    quote: "AgentRank showed us our product descriptions were invisible to AI agents. After fixing them, our AI-driven traffic tripled in 30 days.",
    name: "Sarah K.",
    role: "Founder",
    company: "Bloom & Co.",
    avatar: "SK",
    color: "from-violet-500 to-purple-600",
  },
  {
    quote: "The policy clarity score alone was eye-opening. We had no idea AI agents were skipping us due to missing return info.",
    name: "Marcus T.",
    role: "Head of eCommerce",
    company: "Stride Athletics",
    avatar: "MT",
    color: "from-cyan-400 to-blue-500",
  },
  {
    quote: "Best tool for understanding AI commerce readiness. The before/after comparison made the ROI immediately obvious.",
    name: "Priya M.",
    role: "Growth Lead",
    company: "Luna Skincare",
    avatar: "PM",
    color: "from-emerald-400 to-teal-500",
  },
];

const aiAgents = [
  { name: 'ChatGPT', icon: '🤖' },
  { name: 'Gemini', icon: '✨' },
  { name: 'Perplexity', icon: '🔍' },
  { name: 'Copilot', icon: '🪟' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const ctaHref = isAuthenticated ? '/connect' : '/signup';

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/30 text-sm text-violet-300 mb-8"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Commerce Readiness Platform for Shopify
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            Optimize your Shopify Store
            <br />
            <span className="gradient-text-hero">for AI Shopping Agents</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Understand how <strong className="text-white/80">ChatGPT, Gemini, and AI commerce systems</strong> perceive your store and
            improve your AI discoverability to drive more sales from the next wave of AI-powered shoppers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href={ctaHref}
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all hover:shadow-2xl hover:shadow-violet-500/30 active:scale-95 glow-brand"
            >
              Analyze My Store
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-8 py-4 rounded-xl glass border border-white/10 text-white/80 font-medium text-base hover:text-white hover:border-white/20 transition-all"
            >
              View Demo Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* AI Agents pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center justify-center gap-3 mt-12 mb-16"
          >
            <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Analyzed by</span>
            {aiAgents.map((agent) => (
              <div key={agent.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/10 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                <span>{agent.icon}</span>
                <span>{agent.name}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="pt-10 border-t border-white/5"
          >
             <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-8">Trusted by Modern Shopify Pioneers</p>
             <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
                {['OURA', 'ALLBIRDS', 'HARRY\'S', 'CASPER', 'GLOSSIER'].map(brand => (
                  <span key={brand} className="text-xl font-black text-white tracking-tighter">{brand}</span>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Dashboard preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-5xl mx-auto mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#09090b] z-10 pointer-events-none" style={{ top: '60%' }} />
          <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden p-6 shadow-2xl">
            {/* Mock dashboard header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">fashionstore.myshopify.com</div>
                  <div className="text-xs text-white/40">Last analyzed: just now</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                72 / 100
              </div>
            </div>
            {/* Score bars */}
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: 'Product Desc.', score: 65, color: 'bg-amber-500' },
                { label: 'Policies', score: 45, color: 'bg-red-500' },
                { label: 'FAQ Coverage', score: 30, color: 'bg-red-500' },
                { label: 'Trust Signals', score: 78, color: 'bg-emerald-500' },
                { label: 'Metadata', score: 82, color: 'bg-violet-500' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="h-24 bg-white/5 rounded-lg flex items-end justify-center p-2 mb-2">
                    <div
                      className={`w-full rounded-md ${item.color} opacity-80 transition-all`}
                      style={{ height: `${item.score}%` }}
                    />
                  </div>
                  <div className="text-xs text-white/50">{item.label}</div>
                  <div className="text-sm font-bold text-white">{item.score}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── AI Visibility Preview Section ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-widest">
              Live Simulation
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              A single ambiguity can make you <span className="text-violet-500 italic">invisible.</span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed">
              When a shopper asks "What are the best sustainable running shoes for under $100?", AI agents don't just search keywords. They evaluate **Policy Depth**, **Product Nuance**, and **Merchant Credibility**. 
            </p>
            <div className="space-y-4">
              {[
                { label: 'Semantic Discovery Rate', value: '+300%', color: 'text-emerald-400' },
                { label: 'Recommendation Potential', value: 'Silver Tier', color: 'text-blue-400' },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl glass border border-white/5">
                   <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                   <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Interactive Visibility Gauge */}
             <div className="glass-strong rounded-[3rem] border border-white/10 p-10 bg-black/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6">
                   <Zap className="w-6 h-6 text-violet-500 animate-pulse" />
                </div>
                <div className="text-center space-y-6">
                   <div className="relative w-48 h-48 mx-auto">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                         <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gaugeGrad)" strokeWidth="8" strokeDasharray="283" strokeDashoffset="80" strokeLinecap="round" className="animate-gauge-float" />
                         <defs>
                            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                               <stop offset="0%" stopColor="#8b5cf6" />
                               <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                         </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-bold text-white tracking-tighter">72</span>
                         <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Readiness</span>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="text-sm font-bold text-white">AI Visibility Index</div>
                      <p className="text-[10px] text-white/40 leading-relaxed px-4">
                        Based on analysis of 124 product variants and 4 policies. You are currently in the **"Middle Market"** tier for Perplexity.
                      </p>
                   </div>
                   <div className="flex justify-center gap-2 pt-4">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-8 h-1.5 rounded-full ${i <= 4 ? 'bg-violet-500' : 'bg-white/10'}`} />
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── Before vs After Section ── */}
      <section className="py-24 px-6 border-t border-white/5 bg-gradient-to-b from-transparent to-violet-600/5">
        <div className="max-w-5xl mx-auto text-center mb-16 space-y-4">
           <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">The AI-Optimization <span className="text-violet-400">Difference.</span></h2>
           <p className="text-white/40">Watch how AgentRank transforms "Keyword-Rich" text into "Agent-Readable" intelligence.</p>
        </div>
        
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
           {/* Before */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass rounded-3xl p-8 border border-red-500/10 relative"
           >
              <div className="absolute top-4 right-6 text-[10px] font-black text-red-500 uppercase tracking-widest">Standard SEO</div>
              <h3 className="text-sm font-bold text-white/80 mb-4 flex items-center gap-2">
                 <XCircle className="w-4 h-4 text-red-500" />
                 Low AI Discoverability
              </h3>
              <div className="bg-red-500/5 rounded-xl p-4 font-mono text-[11px] text-white/40 leading-relaxed border border-red-500/10">
                 {`"These sustainable shoes are great for running. Made with recycled plastic bottles, they are eco-friendly and comfortable for daily wear. Buy now for 20% off."`}
              </div>
              <ul className="mt-6 space-y-3">
                 {[
                   { t: 'Ambiguous material origin', icon: AlertTriangle },
                   { t: 'Missing specific use-case metrics', icon: AlertTriangle },
                   { t: 'Agent-unfriendly pricing structure', icon: AlertTriangle },
                 ].map((li, i) => (
                   <li key={i} className="flex gap-2 text-xs text-white/30 italic">
                      <li.icon className="w-3.5 h-3.5 text-red-500 flex-shrink-0" /> {li.t}
                   </li>
                 ))}
              </ul>
           </motion.div>

           {/* After */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass rounded-3xl p-8 border border-emerald-500/20 relative shadow-[0_0_50px_rgba(16,185,129,0.1)]"
           >
              <div className="absolute top-4 right-6 text-[10px] font-black text-emerald-500 uppercase tracking-widest">AgentRank Optimized</div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                 <CheckCircle className="w-4 h-4 text-emerald-400" />
                 High AI Recommendation Likelihood
              </h3>
              <div className="bg-emerald-500/5 rounded-xl p-4 font-mono text-[11px] text-emerald-400/80 leading-relaxed border border-emerald-500/10">
                 {`"Performance running footwear utilizing GRS-certified recycled PET (85%). Engineered for neutral pronation with an 8mm drop. Durability peak at 500+ km."`}
              </div>
              <ul className="mt-6 space-y-3">
                 {[
                   { t: 'Semantic material certification', icon: Sparkles },
                   { t: 'Agent-readable performance data', icon: Sparkles },
                   { t: 'Explicit technical use-case mapping', icon: Sparkles },
                 ].map((li, i) => (
                   <li key={i} className="flex gap-2 text-xs font-medium text-emerald-400">
                      <li.icon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {li.t}
                   </li>
                 ))}
              </ul>
           </motion.div>
        </div>
      </section>

      {/* ── Evaluation Section ── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How AI Agents <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Evaluate You.</span></h2>
             <p className="text-white/40">Our engine simulates the decision-making process of 4 top LLM shopping crawlers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: 'Brand Persona', desc: 'Is your brand identity consistent enough for an LLM to form a "trust memory"?', score: 'Low Rank' },
              { t: 'Policy Validity', desc: 'Can an agent extract a 100% accurate refund SLA without hallucinating?', score: 'High Hallucination' },
              { t: 'Social Proof', desc: 'Transparent review schemas that agents can quote as "External Consensus".', score: 'Invisible' },
              { t: 'Entity Linking', desc: 'Does the agent see you as a "verified merchant" across the wider web?', score: 'Weak Signal' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-3xl glass border border-white/5 hover:border-violet-500/40 hover:bg-violet-600/5 transition-all text-center lg:text-left"
              >
                 <div className="absolute top-4 right-6 text-[8px] font-bold text-white/20 uppercase">Core Dimension</div>
                 <h3 className="text-sm font-bold text-white mb-3">{item.t}</h3>
                 <p className="text-xs text-white/40 leading-relaxed mb-6">{item.desc}</p>
                 <div className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full w-fit mx-auto lg:mx-0 group-hover:bg-rose-500 group-hover:text-white transition-all">
                    {item.score}
                 </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials & Success ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-violet-400 fill-violet-400" />)}
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Trusted by the Next Generation</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8 border border-white/7"
              >
                <p className="text-white/70 text-sm leading-relaxed mb-8 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-xs font-bold text-white`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest">{t.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories Section ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-center lg:text-left">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Merchant Success Stories</h2>
              <p className="text-white/40 max-w-xl">Real-world results from Shopify stores that bridged the AI discovery gap.</p>
            </div>
            <Link href="/resources" className="text-sm font-bold text-violet-400 hover:text-white flex items-center gap-2 group mx-auto lg:mx-0">
               View Case Studies <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                company: 'Luxe Furniture', 
                story: 'Transitioned from invisible search results to appearing in 85% of Perplexity furniture queries.',
                impact: '+220% Revenue',
                metric: 'AI Visibility Score: 94'
              },
              { 
                company: 'Green Tech', 
                story: 'Identified that missing refund window schemas were causing AI agents to skip recommendations.',
                impact: '+45% Conversion',
                metric: 'SLA Trust Rank: #1'
              }
            ].map((caseStudy, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-1 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-white/0 hover:from-violet-600/20 transition-all cursor-pointer"
              >
                <div className="bg-[#09090b] rounded-[2.4rem] p-10 h-full">
                  <div className="flex justify-between items-start mb-10">
                    <h3 className="text-2xl font-bold text-white">{caseStudy.company}</h3>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">Result: {caseStudy.impact}</div>
                  </div>
                  <p className="text-white/50 leading-relaxed mb-10 text-lg">"{caseStudy.story}"</p>
                  <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-violet-400">
                    <Sparkles className="w-4 h-4" /> {caseStudy.metric}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
             <p className="text-white/40">Everything you need to know about AI-native optimization.</p>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "What exactly is 'AI-Native Optimization'?", a: "Traditional SEO focuses on legacy algorithms. AI-native optimization focuses on the semantic and policy requirements that LLMs (Large Language Models) use to deem a merchant 'recommending-worthy'." },
              { q: "Will this help with regular Google SEO?", a: "Yes. Google's Search Generative Experience (SGE) uses the same AI-reasoning principles. Improving your AI score directly correlates with better SGE placement." },
              { q: "Is my store data safe?", a: "We use official Shopify OAuth and read-only API access. We never access your financial data or customer PII—only your public-facing product and policy configuration." }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-[2rem] glass border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                   <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{faq.q}</h3>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white transition-all">+</div>
                </div>
                <p className="text-sm text-white/50 leading-relaxed max-w-2xl">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
           <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight mb-8">
              Don't be invisible to the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Next Wave.</span>
           </h2>
           <Link
             href={ctaHref}
             className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
           >
             <Zap className="w-5 h-5" />
             Get Started Now
             <ArrowRight className="w-5 h-5" />
           </Link>
           <p className="mt-8 text-white/30 text-xs">Join 12,000+ Shopify merchants optimizing for AI discoverability.</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-brand flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">AgentRank AI</span>
          </div>
          <p className="text-xs text-white/30">© 2026 AgentRank AI. Built for the AI commerce era.</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
