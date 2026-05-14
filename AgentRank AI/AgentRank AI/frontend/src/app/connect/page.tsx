'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, BarChart3, Sparkles, ChevronLeft, Store } from 'lucide-react';

const demoStores = [
  { name: 'Fashion Forward', url: 'fashionforward.myshopify.com', category: 'Apparel', score: 72 },
  { name: 'Tech Gadgets Co.', url: 'techgadgets.myshopify.com', category: 'Electronics', score: 58 },
  { name: 'Organic Glow', url: 'organicglow.myshopify.com', category: 'Beauty', score: 84 },
];

export default function ConnectPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter your Shopify store URL');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate validation then navigate to scan
    await new Promise((r) => setTimeout(r, 600));
    const encoded = encodeURIComponent(url.trim());
    router.push(`/scan?store=${encoded}`);
  };

  const handleDemo = (storeUrl: string) => {
    setIsLoading(true);
    router.push(`/scan?store=${encodeURIComponent(storeUrl)}&demo=true`);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-600/30">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Connect Your Store</h1>
              <p className="text-white/50 text-sm">Enter your Shopify store URL to begin the AI readiness scan.</p>
            </div>

            {/* Form card */}
            <div className="glass-strong rounded-2xl p-6 border border-white/10 mb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-white/60 block mb-2">Shopify Store URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => { setUrl(e.target.value); setError(''); }}
                      placeholder="yourstore.myshopify.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs mt-2">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Starting Scan…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Start AI Scan
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-white/30">or try a demo store</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              {/* Demo stores */}
              <div className="space-y-3">
                {demoStores.map((store) => (
                  <button
                    key={store.url}
                    onClick={() => handleDemo(store.url)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass border border-white/8 hover:border-white/20 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center">
                        <Store className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{store.name}</div>
                        <div className="text-xs text-white/40">{store.url}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        store.score >= 80
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : store.score >= 60
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {store.score}/100
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white/70 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-xs text-white/25">
              🔒 We only read product and policy data. We never modify your store.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
