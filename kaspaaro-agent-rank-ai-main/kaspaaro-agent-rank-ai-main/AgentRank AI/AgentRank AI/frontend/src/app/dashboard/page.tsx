'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3, AlertTriangle, CheckCircle, XCircle, ArrowRight,
  TrendingUp, Shield, FileText, Star, MessageSquare, Zap,
  Package, RefreshCw, ChevronRight, Brain, Loader2,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from 'recharts';
import { AnalysisResult } from '@/types/analysis';

// ── Sub-components ─────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const [animated, setAnimated] = useState(false);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (circumference * (animated ? score : 0)) / 100;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          className="score-ring" style={{ strokeDasharray: circumference, strokeDashoffset: offset, filter: `drop-shadow(0 0 8px ${color}60)` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{score}</span>
        <span className="text-xs text-white/40">out of 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, icon: Icon, color }: { label: string; score: number; icon: React.ElementType; color: string }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(score), 400); return () => clearTimeout(t); }, [score]);
  const statusColor = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  const barColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-4 p-4 glass rounded-xl border border-white/7 hover:border-white/15 transition-all">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}20` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-white">{label}</span>
          <span className={`text-sm font-bold ${statusColor}`}>{score}</span>
        </div>
        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, background: barColor }} />
        </div>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    HIGH: 'bg-red-500/15 text-red-300 border-red-500/30',
    MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    LOW: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[priority] || ''}`}>{priority}</span>;
}

// ── Main Dashboard ─────────────────────────────────────
function DashboardContent() {
  const searchParams = useSearchParams();
  const store = searchParams.get('store');
  
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    // 1. Try sessionStorage first (result passed from scan page)
    const cached = sessionStorage.getItem('agentrank_result');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AnalysisResult;
        // Normalise comparison
        const normalizedParsedStore = parsed.store.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        const normalizedCurrentStore = store.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        
        if (normalizedParsedStore === normalizedCurrentStore) {
          setData(parsed);
          setLoading(false);
          return;
        }
      } catch { /* ignore parse error */ }
    }

    // 2. Otherwise fetch directly (direct URL access or demo)
    fetch(`/api/analyze?store=${encodeURIComponent(store)}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Analysis failed');
        setData(json as AnalysisResult);
      })
      .catch((e: Error) => {
        console.error('Dashboard fetch error:', e);
        setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [mounted, store]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-sm text-white/50">
            {loading && store ? 'Running AI analysis…' : 'Loading dashboard…'}
          </p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2">No Store Selected</h2>
        <p className="text-sm text-white/50 mb-6">Please connect a store to view its analysis.</p>
        <Link href="/connect" className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all">
          Connect Store
        </Link>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-strong rounded-2xl p-8 border border-red-500/20 max-w-md text-center">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">Analysis Failed</h2>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">{error || 'No data available.'}</p>
          <Link href="/connect" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all">
            ← Try Another Store
          </Link>
        </div>
      </div>
    );
  }

  const scoreBreakdown = [
    { label: 'Product Descriptions', score: data.scores.productDescriptions.score, icon: Package, color: '#6366f1' },
    { label: 'Policies', score: data.scores.policies.score, icon: Shield, color: '#ef4444' },
    { label: 'FAQ Coverage', score: data.scores.faqCoverage.score, icon: MessageSquare, color: '#f59e0b' },
    { label: 'Trust Signals', score: data.scores.trustSignals.score, icon: Star, color: '#10b981' },
    { label: 'Metadata Quality', score: data.scores.metadataQuality.score, icon: FileText, color: '#22d3ee' },
  ];

  const analyzedAt = new Date(data.analyzedAt).toLocaleString();

  return (
    <div className="min-h-screen pt-16">

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Meta info bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-4 text-xs text-white/30 px-1">
          <span>🏪 {data.storeName}</span>
          <span>·</span>
          <span>📦 {data.productCount} products</span>
          <span>·</span>
          <span>📄 {data.pageCount} pages</span>
          <span>·</span>
          <span>🕒 Analyzed {analyzedAt}</span>
          <span className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Powered by Gemini AI
          </span>
        </motion.div>

        {/* Score row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-strong rounded-2xl p-6 border border-white/10 flex flex-col items-center text-center">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-4">AI Commerce Readiness</div>
              <ScoreRing score={data.overallScore} />
              <div className="mt-4">
                <div className={`text-lg font-semibold ${data.overallScore >= 80 ? 'text-emerald-400' : data.overallScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {data.overallScore >= 80 ? '🟢 AI-Ready' : data.overallScore >= 60 ? '🟡 Needs Work' : '🔴 Critical'}
                </div>
                <p className="text-xs text-white/40 mt-1">Based on {data.productCount} products & {data.pageCount} pages</p>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Score Breakdown</h2>
                <div className="flex gap-4">
                  <Link href={`/optimize?store=${encodeURIComponent(store)}`} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                    Optimize <ChevronRight className="w-3 h-3" />
                  </Link>
                  <Link href={`/faq-trust?store=${encodeURIComponent(store)}`} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
                    FAQ & Trust <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              {scoreBreakdown.map((item) => <ScoreBar key={item.label} {...item} />)}
            </div>
          </div>
        </motion.div>

        {/* Issues + AI Perception */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="grid lg:grid-cols-2 gap-6">
          {/* Critical Issues */}
          <div className="glass rounded-2xl p-6 border border-white/8">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-semibold text-white">Critical Issues</h2>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30">
                {data.criticalIssues.length} found
              </span>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {data.criticalIssues.map((issue) => (
                <div key={issue.id} className={`p-3 rounded-xl border ${issue.severity === 'high' ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                  <div className="flex items-start gap-2">
                    {issue.severity === 'high'
                      ? <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <div className="text-sm font-medium text-white">{issue.title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/5">
               <Link href={`/policies?store=${encodeURIComponent(store)}`} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all flex items-center justify-center gap-2">
                 View Policy Analysis <ChevronRight className="w-4 h-4" />
               </Link>
            </div>
          </div>

          {/* AI Perception */}
          <div className="glass rounded-2xl p-6 border border-white/8 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-semibold text-white">How AI Currently Sees You</h2>
              </div>
              <Link href={`/perception?store=${encodeURIComponent(store)}`} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
                Full Report <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex-1 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 mb-5">
              <div className="text-xs text-violet-300/60 font-mono mb-2">Gemini AI Analysis</div>
              <p className="text-sm text-white/80 leading-relaxed font-medium mb-2">"{data.aiPerception}"</p>
              {data.aiPerceptionDetail && (
                <p className="text-xs text-white/50 leading-relaxed italic mt-2">{data.aiPerceptionDetail}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(data.agentVisibility || []).map((agent) => {
                const vColor = agent.visibility === 'High' ? 'text-emerald-400' : agent.visibility === 'Medium' ? 'text-amber-400' : 'text-red-400';
                return (
                  <div key={agent.agent} className="text-center p-3 glass rounded-xl border border-white/8">
                    <div className="text-xs text-white/40 mb-1">{agent.agent}</div>
                    <div className={`text-xs font-bold ${vColor}`}>{agent.visibility}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-semibold text-white mb-5">Score Radar</h2>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={data.radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <Radar name="Store" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass rounded-2xl p-6 border border-white/8">
            <h2 className="text-sm font-semibold text-white mb-5">Score vs Benchmark</h2>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data.trendData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: 12 }} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" fill="url(#scoreGrad)" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="glass rounded-2xl p-6 border border-white/8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Prioritized Recommendations</h2>
          </div>
          <div className="space-y-3">
            {data.recommendations.map((rec, i) => (
              <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl border border-white/7 hover:border-white/15 transition-all group">
                <PriorityBadge priority={rec.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{rec.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{rec.category}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-semibold text-emerald-400">{rec.impact}</span>
                  <span className="text-xs text-white/30 hidden md:block">Effort: {rec.effort}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strengths across dimensions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-white/8">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">What's Working Well</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              ...data.scores.productDescriptions.strengths.map(s => ({ s, cat: 'Products' })),
              ...data.scores.policies.strengths.map(s => ({ s, cat: 'Policies' })),
              ...data.scores.faqCoverage.strengths.map(s => ({ s, cat: 'FAQ' })),
              ...data.scores.trustSignals.strengths.map(s => ({ s, cat: 'Trust' })),
              ...data.scores.metadataQuality.strengths.map(s => ({ s, cat: 'Metadata' })),
            ].slice(0, 9).map(({ s, cat }, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-white/80 leading-snug">{s}</div>
                  <div className="text-[10px] text-emerald-400/60 mt-0.5">{cat}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ROI Roadmap Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="glass-strong rounded-[2rem] border border-violet-500/20 overflow-hidden mb-12">
            <div className="p-8 border-b border-white/5 bg-gradient-to-r from-violet-600/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-violet-400" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Roadmap to AI Recommendations</h2>
                </div>
                <p className="text-sm text-white/40">Sequence of actions prioritized by ROI on AI search visibility.</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-violet-600/10 border border-violet-500/20">
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Estimated Conversion Lift</span>
                <span className="text-lg font-bold text-violet-400">+18.5% Index Potential</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 divide-x divide-white/5">
              {[
                { 
                  step: 1, 
                  title: 'Close Policy Trust Gaps', 
                  desc: 'Expand shipping policies to be data-readable. AI agents refuse to recommend items without clear delivery SLA.', 
                  impact: 'High',
                  effort: 'Low',
                  href: `/policies?store=${encodeURIComponent(store)}`
                },
                { 
                  step: 2, 
                  title: 'Deepen Content Semantic Depth', 
                  desc: 'Sync AI-optimized product descriptions that include material, use-case, and sizing schemas.', 
                  impact: 'Medium',
                  effort: 'Med',
                  href: `/optimize?store=${encodeURIComponent(store)}`
                },
                { 
                  step: 3, 
                  title: 'Embed Expert Metadata', 
                  desc: 'Define "founder expertise" signal and link verified expert reviews to boost merchant credibility.', 
                  impact: 'High',
                  effort: 'High',
                  href: `/faq-trust?store=${encodeURIComponent(store)}`
                },
              ].map((item) => (
                <Link key={item.step} href={item.href} className="p-8 space-y-4 hover:bg-white/5 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400 italic">
                      #{item.step}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{item.impact} Impact</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed min-h-[48px]">{item.desc}</p>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-white/20">
                     ROI: ~{item.impact === 'High' ? '14x' : '6x'} • {item.effort} Effort
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}
