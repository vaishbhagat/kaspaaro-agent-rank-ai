'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, Shield, XCircle, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { AnalysisResult, ScoreDimension } from '@/types/analysis';

const statusConfig = {
  good:     { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle,  label: 'Good' },
  warning:  { color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',     icon: AlertTriangle, label: 'Needs Attention' },
  critical: { color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20',         icon: XCircle,       label: 'Critical' },
};

function getStatus(score: number): 'good' | 'warning' | 'critical' {
  if (score >= 70) return 'good';
  if (score >= 40) return 'warning';
  return 'critical';
}

function PolicyCard({ title, dim, missing }: { title: string; dim: ScoreDimension; missing?: boolean }) {
  const status = getStatus(dim.score);
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden border border-white/8">
      <div className={`flex items-center justify-between px-6 py-4 border-b border-white/8 ${missing ? 'bg-red-500/5' : ''}`}>
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 ${cfg.color}`} />
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {missing && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">Missing</span>}
        </div>
        <div className={`text-2xl font-bold ${cfg.color}`}>
          {dim.score}<span className="text-sm text-white/30 font-normal">/100</span>
        </div>
      </div>
      <div className="p-6 grid md:grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Issues</p>
          <div className="space-y-2">
            {dim.issues.length === 0
              ? <p className="text-xs text-white/30 italic">No critical issues</p>
              : dim.issues.map((issue) => (
                <div key={issue} className="flex items-start gap-2 text-xs text-red-300/80">
                  <XCircle className="w-3 h-3 text-red-400 flex-shrink-0 mt-0.5" />{issue}
                </div>
              ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Strengths</p>
          <div className="space-y-2">
            {dim.strengths.length === 0
              ? <p className="text-xs text-white/30 italic">None detected</p>
              : dim.strengths.map((s) => (
                <div key={s} className="flex items-start gap-2 text-xs text-emerald-300/80">
                  <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />{s}
                </div>
              ))}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
          <div className="text-xs font-semibold text-violet-300 mb-2">Quick Fix</div>
          <p className="text-xs text-white/60 leading-relaxed">
            {dim.score < 30
              ? `Creating a ${title.toLowerCase()} page is the highest-impact action you can take. AI agents require this to recommend your store.`
              : dim.score < 60
              ? `Expand your ${title.toLowerCase()} with more detail — AI agents need clear, complete information to trust and recommend your store.`
              : `Your ${title.toLowerCase()} is in good shape. Minor improvements can push you above 80.`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function PoliciesContent() {
  const searchParams = useSearchParams();
  const store = searchParams.get('store') || '';
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Try sessionStorage first
    const cached = sessionStorage.getItem('agentrank_result');
    const targetStore = store || 'agentrank-demo.myshopify.com';

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as AnalysisResult;
        const normalizedParsedStore = parsed.store.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
        const normalizedTargetStore = targetStore.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];

        if (normalizedParsedStore === normalizedTargetStore) {
          setData(parsed);
          setLoading(false);
          return;
        }
      } catch { /* ignore parse error */ }
    }

    // 2. Otherwise fetch directly
    fetch(`/api/analyze?store=${encodeURIComponent(targetStore)}`)
      .then(r => {
        if (!r.ok) throw new Error('Fetch failed');
        return r.json();
      })
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [store]);

  const summaryCards = data ? [
    { title: 'Policies',        score: data.scores.policies.score },
    { title: 'FAQ Coverage',    score: data.scores.faqCoverage.score },
    { title: 'Trust Signals',   score: data.scores.trustSignals.score },
    { title: 'Metadata',        score: data.scores.metadataQuality.score },
  ] : [];

  return (
    <div className="min-h-screen pt-16">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Policy Analysis</h1>
          </div>
          <p className="text-white/50 text-sm">
            Policies are the #1 factor AI agents use when deciding whether to recommend your store.
            {data && <span className="text-white/30"> · Real data from {data.storeName}</span>}
          </p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              <span className="text-sm text-white/40">Loading policy data…</span>
            </div>
          </div>
        )}

        {!loading && !data && (
          <div className="text-center py-20">
            <p className="text-white/40 mb-4">No data available.</p>
            <Link href="/connect" className="text-violet-400 hover:underline text-sm">← Scan a store first</Link>
          </div>
        )}

        {!loading && data && (
          <>
            {/* Summary strip */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {summaryCards.map(({ title, score }) => {
                const st = getStatus(score);
                const cfg = statusConfig[st];
                const Ico = cfg.icon;
                return (
                  <div key={title} className={`p-4 rounded-xl border ${cfg.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Ico className={`w-4 h-4 ${cfg.color}`} />
                      <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                    <div className="text-sm font-medium text-white mb-1">{title}</div>
                    <div className={`text-2xl font-bold ${cfg.color}`}>{score}</div>
                    <div className="text-xs text-white/30">/ 100</div>
                  </div>
                );
              })}
            </motion.div>

            {/* Detailed policy cards */}
            <div className="space-y-6">
              <PolicyCard
                title="Store Policies (Shipping, Returns, Privacy)"
                dim={data.scores.policies}
                missing={data.scores.policies.score < 20}
              />
              <PolicyCard
                title="FAQ Coverage"
                dim={data.scores.faqCoverage}
                missing={data.scores.faqCoverage.score < 20}
              />
              <PolicyCard
                title="Trust Signals"
                dim={data.scores.trustSignals}
              />
              <PolicyCard
                title="Metadata Quality"
                dim={data.scores.metadataQuality}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PoliciesPage() {
  return <Suspense><PoliciesContent /></Suspense>;
}
