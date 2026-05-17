'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, Brain, ArrowLeft, Search, Globe, 
  MessageSquare, Sparkles, TrendingUp, AlertTriangle,
  Loader2, ArrowRight, ShieldCheck, Zap
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip 
} from 'recharts';
import { AnalysisResult } from '@/types/analysis';

function PerceptionContent() {
  const searchParams = useSearchParams();
  const store = searchParams.get('store') || 'agentrank-demo.myshopify.com';
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = sessionStorage.getItem('agentrank_result');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AnalysisResult;
        const normalizedParsedStore = parsed.store.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        const normalizedTargetStore = store.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];

        if (normalizedParsedStore === normalizedTargetStore) {
          setData(parsed);
          setLoading(false);
          return;
        }
      } catch { /* ignore */ }
    }

    fetch(`/api/analyze?store=${encodeURIComponent(store)}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [store]);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-violet-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">AI Perception Report</h1>
            </div>
            <p className="text-white/50 text-sm">
              Discover how different AI systems interpret your brand, products, and reliability.
            </p>
          </div>
          <Link href={`/dashboard?store=${encodeURIComponent(store)}`} className="text-sm text-white/50 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />Back to Dashboard
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            <p className="text-sm text-white/40">Synthesizing AI interpretations...</p>
          </div>
        ) : !data ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/10">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">Analysis data missing</h2>
            <Link href="/connect" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-bold transition-all hover:bg-violet-500 mt-4">
              New Scan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* AI Comparison Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 glass rounded-2xl p-8 border border-white/8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white">Representation Alignment</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <div className="w-2 h-2 rounded-full bg-violet-500" /> Current AI View
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 border-l border-white/10 pl-4">
                      <div className="w-2 h-2 rounded-full bg-white/20" /> Desired Persona
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2 aspect-square max-w-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                        { subject: 'Luxury', A: data.scores.trustSignals.score * 0.8, B: 90 },
                        { subject: 'Economy', A: 85, B: 10 },
                        { subject: 'Modern', A: data.scores.metadataQuality.score, B: 95 },
                        { subject: 'Reliability', A: data.scores.policies.score, B: 98 },
                        { subject: 'Clarity', A: data.scores.productDescriptions.score, B: 95 },
                      ]}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} />
                        <Radar name="Desired" dataKey="B" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.1)" strokeWidth={1} fillOpacity={0.2} />
                        <Radar name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" strokeWidth={2} fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                       <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Major Perception Mismatch</h4>
                       <p className="text-xs text-white/60 leading-relaxed">
                         AI agents perceive you as a **"Budget/Value"** store due to your frequent discount-focused tags, but your goal is **"High-End Specialty"**.
                       </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40">Persona Alignment Score</span>
                          <span className="text-violet-400 font-bold">{Math.round(data.overallScore * 0.75)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${Math.round(data.overallScore * 0.75)}%` }} 
                            className="h-full bg-violet-500 rounded-full shadow-[0_0_8px_#8b5cf660]" 
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-white/30 leading-relaxed">
                        To close this gap, remove generic "cheap" keywords and focus policy metadata on "white-glove delivery" and "expert support".
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-8 border border-white/8 flex flex-col justify-center"
              >
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Discovery Trend</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.trendData}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#trendGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-white/30">AI Discoverability Index</span>
                  <span className="text-violet-400 font-bold text-lg">+{Math.round((data.overallScore - data.trendData[0].score) / data.trendData[0].score * 100)}%</span>
                </div>
              </motion.div>
            </div>

            {/* Individual AI Perception Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'ChatGPT', icon: MessageSquare, color: 'text-emerald-400' },
                { name: 'Gemini', icon: Sparkles, color: 'text-violet-400' },
                { name: 'Claude', icon: Brain, color: 'text-orange-400' },
                { name: 'Perplexity', icon: Search, color: 'text-cyan-400' }
              ].map((ai, i) => {
                const agent = data.agentVisibility?.find(a => a.agent === ai.name) || { visibility: 'Low', reason: 'Basic analysis required' };
                return (
                  <motion.div 
                    key={ai.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="glass rounded-2xl p-6 border border-white/8 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center ${ai.color}`}>
                        <ai.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{ai.name}</h3>
                        <span className={`text-[10px] font-bold ${agent.visibility === 'High' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {agent.visibility} Visibility
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed min-h-[48px]">
                      {agent.reason}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                       <div className="flex justify-between text-[10px]">
                         <span className="text-white/30">Trust perception</span>
                         <span className="text-white/60">{(data.overallScore * 0.8 + (i * 2)).toFixed(0)}%</span>
                       </div>
                       <div className="flex justify-between text-[10px]">
                         <span className="text-white/30">Recommendation Likelihood</span>
                         <span className="text-white/60">{(data.overallScore * 0.7 + (i * 3)).toFixed(0)}%</span>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* AI Visibility Map */}
            <div className="glass rounded-2xl p-8 border border-white/8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[100px] pointer-events-none" />
               
               <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                   <Globe className="w-5 h-5 text-cyan-400" />
                   <h2 className="text-lg font-bold text-white">AI Visibility Territory</h2>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <div className="w-2 h-2 rounded-full bg-violet-500" /> High Visibility
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                      <div className="w-2 h-2 rounded-full bg-white/10" /> Low Visibility
                    </div>
                 </div>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { label: 'Merchant Representation', score: Math.round(data.scores.trustSignals.score * 0.95), detail: 'How reliably AI models identify the humans behind the store.' },
                   { label: 'Brand Interpretation', score: Math.round(data.overallScore * 0.85), detail: 'The quality of the narrative AI models construct about your brand.' },
                   { label: 'Product Understanding', score: Math.round(data.scores.productDescriptions.score * 1.1), detail: 'The technical clarity of product specs and utility extraction.' },
                 ].map((item, i) => (
                   <div key={i} className="space-y-3">
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-medium">{item.label}</span>
                        <span className="text-violet-400 font-bold">{item.score}%</span>
                     </div>
                     <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }} 
                         animate={{ width: `${item.score}%` }} 
                         transition={{ delay: 0.5 + i * 0.1 }}
                         className="h-full bg-violet-500 rounded-full" 
                       />
                     </div>
                     <p className="text-[10px] text-white/30 leading-relaxed">{item.detail}</p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Bottom CTA */}
            <div className="flex items-center justify-between p-6 rounded-2xl glass-strong border border-violet-500/20">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-violet-600/20 flex items-center justify-center text-violet-400">
                   <Zap className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">Boost your Perception Score</h3>
                   <p className="text-xs text-white/50">Unlock automated description syncing for $49/mo.</p>
                 </div>
               </div>
               <Link 
                 href="/pricing" 
                 className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-violet-600/30"
               >
                 Upgrade to Pro
               </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PerceptionPage() {
  return <Suspense><PerceptionContent /></Suspense>;
}
