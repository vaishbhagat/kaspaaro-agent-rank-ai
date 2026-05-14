'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Brain, ArrowLeft, Globe, 
  TrendingUp, AlertTriangle, Loader2, ArrowRight,
  Target, Zap, Shield, Search, Award, Info
} from 'lucide-react';
import { 
  RadarChart, PolarGrid, PolarAngleAxis, Radar, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import { AnalysisResult } from '@/types/analysis';

function BenzmarksContent() {
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

  const benchmarkData = [
    { subject: 'Policies', User: data?.scores.policies.score || 0, Industry: 72, Leader: 94 },
    { subject: 'Products', User: data?.scores.productDescriptions.score || 0, Industry: 65, Leader: 98 },
    { subject: 'Trust', User: data?.scores.trustSignals.score || 0, Industry: 58, Leader: 85 },
    { subject: 'Discovery', User: data?.overallScore || 0, Industry: 60, Leader: 92 },
    { subject: 'Metadata', User: data?.scores.metadataQuality.score || 0, Industry: 45, Leader: 88 },
  ];

  const comparisonData = [
    { name: 'Your Store', score: data?.overallScore || 0, fill: '#8b5cf6' },
    { name: 'Fashion Avg', score: 64, fill: '#3b82f6' },
    { name: 'Top 1% Stores', score: 92, fill: '#10b981' },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-rose-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Competitor Benchmarking</h1>
            </div>
            <p className="text-white/50 text-sm">
              Measure your AI readiness against the industry and category leaders.
            </p>
          </div>
          <Link href={`/dashboard?store=${encodeURIComponent(store)}`} className="text-sm text-white/50 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />Back to Dashboard
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
            <p className="text-sm text-white/40">Aggregating industry benchmarks...</p>
          </div>
        ) : !data ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/10 text-white/40">Analysis data missing.</div>
        ) : (
          <div className="space-y-8">
            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-2 gap-8">
               {/* Radar Comparison */}
               <motion.div 
                 initial={{ opacity: 0, x: -20 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="glass rounded-[2rem] p-8 border border-white/10"
               >
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-bold text-white">Attribute Benchmarking</h2>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <div className="w-2 h-2 rounded-full bg-violet-500" /> You
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Industry Avg
                      </div>
                   </div>
                 </div>
                 
                 <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <RadarChart cx="50%" cy="50%" outerRadius="80%" data={benchmarkData}>
                       <PolarGrid stroke="rgba(255,255,255,0.05)" />
                       <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                       <Radar name="Industry" dataKey="Industry" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                       <Radar name="Your Store" dataKey="User" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={3} />
                       <Tooltip 
                         contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         itemStyle={{ fontSize: '12px' }}
                       />
                     </RadarChart>
                   </ResponsiveContainer>
                 </div>
               </motion.div>

               {/* Comparison Bar Chart */}
               <motion.div 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="glass rounded-[2rem] p-8 border border-white/10"
               >
                 <div className="flex items-center justify-between mb-8">
                   <h2 className="text-lg font-bold text-white">The Competitive Gap</h2>
                   <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold">
                     {Math.round(92 - data.overallScore)}% Gap to Top 1%
                   </div>
                 </div>

                 <div className="h-[300px] mb-8">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={comparisonData} layout="vertical">
                       <XAxis type="number" hide domain={[0, 100]} />
                       <YAxis dataKey="name" type="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} width={100} axisLine={false} tickLine={false} />
                       <Tooltip 
                         cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                         contentStyle={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                       />
                       <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={40} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>

                 <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                   <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold text-white">Benchmark Recommendation</span>
                   </div>
                   <p className="text-xs text-white/40 leading-relaxed">
                     Industry leaders in **Fashion & Apparel** achieve 90+ discovery scores by using "Size-Oriented Schema" and "Material Traceability" policies. Your metadata is currently 15% below category standards.
                   </p>
                 </div>
               </motion.div>
            </div>

            {/* Detailed Table */}
            <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
               <div className="p-8 border-b border-white/5">
                 <h2 className="text-lg font-bold text-white">Metric Comparison</h2>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-[#121214]">
                       <tr>
                         <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Metric</th>
                         <th className="px-8 py-4 text-[10px] font-bold text-violet-400 uppercase tracking-widest">Your Score</th>
                         <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Fashion Avg</th>
                         <th className="px-8 py-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Leader</th>
                         <th className="px-8 py-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Advice</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {[
                         { m: 'Policy Transparency', u: data.scores.policies.score, a: 68, l: 92, d: 'Focus on shipping SLAs' },
                         { m: 'Contextual Depth', u: data.scores.productDescriptions.score, a: 55, l: 96, d: 'Use descriptive use-cases' },
                         { m: 'Metadata Quality', u: data.scores.metadataQuality.score, a: 42, l: 89, d: 'Add structured JSON-LD' },
                         { m: 'Trust Signalling', u: data.scores.trustSignals.score, a: 60, l: 85, d: 'Add founder backstory' },
                       ].map((row, i) => (
                         <tr key={i} className="hover:bg-white/5 transition-colors">
                           <td className="px-8 py-5 text-sm font-bold text-white">{row.m}</td>
                           <td className="px-8 py-5">
                             <div className="flex items-center gap-2">
                               <span className="text-sm text-white font-medium">{row.u}</span>
                               <div className={`w-1.5 h-1.5 rounded-full ${row.u < row.a ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                             </div>
                           </td>
                           <td className="px-8 py-5 text-sm text-white/40">{row.a}</td>
                           <td className="px-8 py-5 text-sm font-bold text-emerald-400">{row.l}</td>
                           <td className="px-8 py-5 text-xs text-white/30 italic">{row.d}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* Summary Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Industry Ranking', value: 'Top 35%', icon: TrendingUp, color: 'text-blue-400' },
                { title: 'Discovery Gap', value: '-12 pts', icon: AlertTriangle, color: 'text-rose-400' },
                { title: 'Confidence Tier', value: 'Silver', icon: Award, color: 'text-amber-400' },
              ].map((card, i) => (
                <div key={i} className="glass rounded-2xl p-6 border border-white/8 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${card.color}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{card.title}</div>
                    <div className="text-xl font-bold text-white">{card.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BenchmarksPage() {
  return <Suspense><BenzmarksContent /></Suspense>;
}
