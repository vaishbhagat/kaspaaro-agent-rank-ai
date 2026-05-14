'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, ArrowLeft, Package, CheckCircle, Sparkles, Copy, Tag, Layers, Loader2 } from 'lucide-react';
import { AnalysisResult, ProductOptimization } from '@/types/analysis';

function OptimizeContent() {
  const searchParams = useSearchParams();
  const store = searchParams.get('store') || '';
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(0);
  const [copied, setCopied] = useState(false);

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

  const products: ProductOptimization[] = data?.productOptimizations ?? [];
  const product = products[selectedProduct];

  const handleCopy = () => {
    if (!product) return;
    navigator.clipboard.writeText(product.optimized);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-16">

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Product Optimization</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">Gemini AI</span>
          </div>
          <p className="text-white/50 text-sm">AI-powered rewrites of your weakest product descriptions, generated from your actual store data.</p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              <span className="text-sm text-white/40">Loading product data…</span>
            </div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 mb-4">No product optimizations available.</p>
            <Link href="/connect" className="text-violet-400 hover:underline text-sm">← Scan a store first</Link>
          </div>
        )}

        {!loading && products.length > 0 && (
          <>
            {/* Product tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {products.map((p, i) => (
                <button key={p.id} onClick={() => setSelectedProduct(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedProduct === i ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25' : 'glass border border-white/10 text-white/60 hover:text-white'}`}>
                  {p.name.length > 30 ? p.name.slice(0, 30) + '…' : p.name}
                </button>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Original */}
              <motion.div key={`orig-${selectedProduct}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-red-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-xs font-semibold text-red-300 uppercase tracking-widest">Original</span>
                  </div>
                  <span className="text-sm font-bold text-red-400">{product.originalScore}/100</span>
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4 italic min-h-[120px]">
                  "{product.original || 'No description found.'}"
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Issues Found</p>
                  {product.issues.map((issue) => (
                    <div key={issue} className="flex items-center gap-2 text-xs text-red-300/80">
                      <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />{issue}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Optimized */}
              <motion.div key={`opt-${selectedProduct}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="glass rounded-2xl p-6 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-widest">AI Optimized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-400">{product.optimizedScore}/100</span>
                    <button onClick={handleCopy}
                      className="text-xs px-2 py-1 rounded-lg glass border border-white/10 text-white/50 hover:text-white transition-all flex items-center gap-1">
                      <Copy className="w-3 h-3" />{copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 min-h-[120px]">"{product.optimized}"</p>
                <div className="space-y-2">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Improvements Made</p>
                  {product.improvements.map((imp) => (
                    <div key={imp} className="flex items-center gap-2 text-xs text-emerald-300/80">
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{imp}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tags & Metadata */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 border border-white/8">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Recommended Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.filter(Boolean).map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">#{tag.trim()}</span>
                  ))}
                  {product.tags.length === 0 && <span className="text-xs text-white/30">No tags found on this product</span>}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/8">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-violet-400" />
                  <h3 className="text-sm font-semibold text-white">Score Impact</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">Before optimization</span>
                    <span className="text-red-400 font-bold">{product.originalScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/50">After optimization</span>
                    <span className="text-emerald-400 font-bold">{product.optimizedScore}/100</span>
                  </div>
                  <div className="h-px bg-white/8" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white font-medium">Score improvement</span>
                    <span className="text-violet-400 font-bold">+{product.optimizedScore - product.originalScore} pts</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default function OptimizePage() {
  return <Suspense><OptimizeContent /></Suspense>;
}
