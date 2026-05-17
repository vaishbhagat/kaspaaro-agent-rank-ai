'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, ArrowLeft, MessageSquare, Shield, 
  HelpCircle, CheckCircle, XCircle, AlertTriangle, 
  Sparkles, Star, Heart, Users, ShieldCheck, 
  MessageCircle, Copy, Loader2, ArrowRight
} from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';

function FaqTrustContent() {
  const searchParams = useSearchParams();
  const store = searchParams.get('store') || 'agentrank-demo.myshopify.com';
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const faqScore = data?.scores.faqCoverage.score || 0;
  const trustScore = data?.scores.trustSignals.score || 0;

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
              <MessageCircle className="w-5 h-5 text-amber-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">FAQ & Trust Signals</h1>
            </div>
            <p className="text-white/50 text-sm">
              AI agents use FAQs to answer customer questions and trust signals to evaluate merchant credibility.
            </p>
          </div>
          <Link href={`/dashboard?store=${encodeURIComponent(store)}`} className="text-sm text-white/50 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/10 transition-all">
            <ArrowLeft className="w-4 h-4" />Back to Dashboard
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-violet-400 animate-spin" />
            <p className="text-sm text-white/40">Analyzing trust signals...</p>
          </div>
        ) : !data ? (
          <div className="text-center py-20 glass rounded-2xl border border-white/10">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-bold text-white mb-2">No analysis found</h2>
            <p className="text-white/40 mb-6 max-w-md mx-auto">We couldn't find a recent scan for this store. Start a new scan to see the full report.</p>
            <Link href="/connect" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-bold transition-all hover:bg-violet-500">
              New Scan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-amber-500/10 flex items-center gap-6"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="#f59e0b" strokeWidth="8" strokeLinecap="round"
                      style={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * faqScore) / 100 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
                    {faqScore}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">FAQ Coverage</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Measured against 12 critical questions AI agents ask about your store.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-emerald-500/10 flex items-center gap-6"
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle 
                      cx="50" cy="50" r="45" fill="none" 
                      stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                      style={{ strokeDasharray: 283, strokeDashoffset: 283 - (283 * trustScore) / 100 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
                    {trustScore}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Trust Signals</h3>
                  <p className="text-sm text-white/40 leading-relaxed">
                    Evaluates brand history, contact clarity, and social proof transparency.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Main Sections */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* FAQ Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Recommended FAQs</h2>
                </div>
                
                <div className="space-y-4">
                  {[
                    { q: "Where do you ship from?", a: `Orders from ${data.storeName} are processed and shipped from our fulfilment centre in London, UK.`, impact: 'High' },
                    { q: "How do I track my order?", a: "Once your order is dispatched, you will receive an email with a tracking link from our carrier (Royal Mail or DHL).", impact: 'Medium' },
                    { q: "What is your return process?", a: "To start a return, email us at support@store.com with your order number. We'll provide a prepaid label within 24 hours.", impact: 'High' },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-2xl p-5 border border-white/8 space-y-3 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span className="text-sm font-bold text-white">{item.q}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.impact === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed italic">"{item.a}"</p>
                      <button 
                        onClick={() => handleCopy(item.a, `faq-${i}`)}
                        className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white/40 hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Copy className="w-3 h-3" />
                        {copied === `faq-${i}` ? 'Copied to clipboard' : 'Copy Recommendation'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Signals Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-white uppercase tracking-widest">Trust Optimization</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { title: 'Brand Story Consistency', status: 'missing', fix: 'Add a "Made by" or "Founder Note" to your About page to give AI agents a merchant identity to verify.', icon: Heart },
                    { title: 'Social Proof Transparency', status: 'warning', fix: 'Integrate verified review counts into your product schema so AI agents can quote your 4.8/5 rating.', icon: Star },
                    { title: 'Contact Accessibility', status: 'good', fix: 'Your store has clear contact info, which AI agents use to verify business legitimacy.', icon: Users },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.1 }}
                      className="glass rounded-2xl p-5 border border-white/8"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === 'good' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-white">{item.title}</h3>
                            {item.status === 'good' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-xs text-white/40 leading-relaxed">{item.fix}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-[10px] text-white/20">Impact: </span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map(dot => (
                                <div key={dot} className={`w-3 h-1 rounded-full ${dot <= (item.status === 'missing' ? 3 : 2) ? 'bg-violet-500' : 'bg-white/10'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Insights Panel */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-600/10 to-cyan-600/10 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span className="text-sm font-bold text-white">AI Trust Insights</span>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    AI agents like ChatGPT are programmed to avoid recommending stores that feel "anonymous". Adding a physical address, a real phone number, and a named founder significantly increases your conversion confidence score.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FaqTrustPage() {
  return <Suspense><FaqTrustContent /></Suspense>;
}
