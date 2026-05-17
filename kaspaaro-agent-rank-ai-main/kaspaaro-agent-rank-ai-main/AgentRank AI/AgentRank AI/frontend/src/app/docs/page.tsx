'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, Search, ChevronRight, BarChart3, 
  Sparkles, Shield, Rocket, Zap, 
  ArrowRight, FileText, Code, Globe, CheckCircle
} from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    items: [
      { id: 'intro', title: 'What is AgentRank?', icon: Rocket },
      { id: 'how-it-works', title: 'How it Works', icon: Zap },
      { id: 'connect', title: 'Connecting your Store', icon: Globe },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'visibility', title: 'AI Visibility Score', icon: BarChart3 },
      { id: 'perception', title: 'AI Perception Engine', icon: Sparkles },
      { id: 'trust', title: 'Trust Signals & Policies', icon: Shield },
    ]
  },
  {
    title: 'Optimization',
    items: [
      { id: 'descriptions', title: 'Product Descriptions', icon: FileText },
      { id: 'metadata', title: 'Structured Metadata', icon: Code },
    ]
  }
];

export default function DocsPage() {
  const [activeItem, setActiveItem] = useState('intro');

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-12">
        {/* Docs Sidebar */}
        <div className="w-64 flex-shrink-0 hidden lg:block sticky top-32 h-[calc(100vh-160px)] overflow-y-auto pr-4 scrollbar-hide">
          <div className="space-y-8">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search docs..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500/50 transition-all"
              />
            </div>

            {sections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-2 mb-3">
                  {section.title}
                </h3>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveItem(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeItem === item.id 
                        ? 'bg-violet-600/10 text-violet-400' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <motion.div
            key={activeItem}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-violet max-w-none"
          >
            <div className="flex items-center gap-2 text-violet-400 text-xs font-bold mb-6">
              Docs <ChevronRight className="w-3 h-3 text-white/20" /> {sections.flatMap(s => s.items).find(i => i.id === activeItem)?.title}
            </div>
            
            {activeItem === 'intro' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">Introduction to AgentRank AI</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  Welcome to AgentRank AI, the first platform designed to optimize Shopify stores for the AI-driven economy. 
                  Today, consumers are increasingly using AI shopping agents (like ChatGPT, Gemini, and Perplexity) to find products. 
                </p>
                <div className="p-6 rounded-2xl bg-violet-600/10 border border-violet-500/20 mb-10">
                   <h3 className="text-lg font-bold text-white mb-4">The Bridge to AI Commerce</h3>
                   <p className="text-sm text-white/70 leading-relaxed">
                     Standard SEO was built for keywords. **AgentRank focuses on semantic clarity for Large Language Models (LLMs).** 
                     We bridge the gap between your raw store data and the high-level reasoning AI models use to recommend products.
                   </p>
                </div>
              </>
            )}

            {activeItem === 'how-it-works' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">How it Works</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  AgentRank uses a proprietary evaluation engine that mimics the reasoning patterns of the world's most advanced LLMs.
                </p>
                <div className="space-y-6 mb-10">
                  {[
                    { step: '01', title: 'Data Extraction', desc: 'We securely scan your product meta-fields, policy pages, and trust signals via the Shopify API.' },
                    { step: '02', title: 'Agent Simulation', desc: 'Your data is run through our simulation layer to see how different AI agents interpret your brand.' },
                    { step: '03', title: 'Gap Identification', desc: 'Our engine flags missing schemas or ambiguous language that causes "Agent Hallucination".' }
                  ].map((s) => (
                    <div key={s.step} className="flex gap-4 p-4 rounded-xl glass border border-white/5">
                      <span className="text-violet-500 font-black text-xl">{s.step}</span>
                      <div>
                        <h4 className="text-white font-bold text-sm mb-1">{s.title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeItem === 'visibility' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">AI Visibility Score</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  The Visibility Score is a weighted metric (0-100) representing your likelihood of being recommended by a top-tier AI shopping agent.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="p-5 rounded-2xl glass border border-white/5">
                    <h4 className="text-white font-bold mb-2">80 - 100: AI Powerhouse</h4>
                    <p className="text-xs text-white/40">Highly structured data with clear semantic intent. Minimal hallucinations.</p>
                  </div>
                  <div className="p-5 rounded-2xl glass border border-white/5">
                    <h4 className="text-white font-bold mb-2">Below 50: At Risk</h4>
                    <p className="text-xs text-white/40">Critical policy gaps and thin descriptions causing visibility drop-off.</p>
                  </div>
                </div>
              </>
            )}

            {activeItem === 'perception' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">AI Perception Engine</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  AI models don't just see pixels; they see relationships. Our Perception Engine audits how agents categorize your "Store Persona."
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex gap-3 text-sm text-white/60"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> **Brand Voice Audit:** Are agents describing you as "Luxury" or "Budget"?</li>
                  <li className="flex gap-3 text-sm text-white/60"><CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" /> **Niche Clustering:** How does ChatGPT group you with your competitors?</li>
                </ul>
              </>
            )}

            {activeItem === 'trust' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">Trust Signals & Policies</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  AI agents are risk-averse. If they can't find a clear refund SLA or shipping timeline, they will skip your store to avoid misleading the user.
                </p>
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-8">
                  <h4 className="text-amber-400 font-bold mb-2">The Transparency Multiplier</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Stores with clear, machine-readable return policies see a **40% higher** recommendation rate in Perplexity agents.</p>
                </div>
              </>
            )}

            {activeItem === 'descriptions' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">Product Descriptions</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                  Moving from "Keyword Density" to "Semantic Depth." Learn how to write descriptions that provide the technical context agents need.
                </p>
                <div className="bg-[#111114] rounded-2xl p-6 border border-white/5 font-mono text-[11px] leading-relaxed mb-8">
                  <span className="text-white/20">// Avoid this:</span><br/>
                  <span className="text-red-400">"This shirt is great and eco-friendly. Buy now."</span><br/><br/>
                  <span className="text-white/20">// Use this:</span><br/>
                  <span className="text-emerald-400">"Constructed from GRS-certified recycled cotton (60%) with a reinforced 220 GSM weave for dual-season utility."</span>
                </div>
              </>
            )}
            
            {activeItem === 'metadata' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">Structured Metadata</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                   Meta-fields are the "cheat sheet" for AI crawlers. Ensure your JSON-LD and Shopify tags are optimized for entity extraction.
                </p>
              </>
            )}

            {activeItem === 'connect' && (
              <>
                <h1 className="text-4xl font-bold text-white mb-6">Connecting your Store</h1>
                <p className="text-lg text-white/60 leading-relaxed mb-8">
                   AgentRank connects to Shopify via OAuth and Read-Only API access. We never access your billing, customer data, or private orders.
                </p>
              </>
            )}

            <Link 
              href="/signup"
              className="group p-1 rounded-[2rem] bg-gradient-to-r from-violet-600 to-cyan-600 cursor-pointer overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] mt-12 block"
            >
               <div className="bg-[#09090b] rounded-[1.9rem] p-8 h-full flex items-center justify-between group-hover:bg-[#111114] transition-all">
                  <div>
                    <h3 className="text-white font-bold mb-1">Ready to start?</h3>
                    <p className="text-sm text-white/40">Connect your store and get your first AI Readiness scan.</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-violet-500 transition-transform group-hover:translate-x-2" />
               </div>
            </Link>
            
            <div className="mt-20 pt-8 border-t border-white/5 flex items-center justify-between text-white/30 text-xs">
               <span>Last updated: May 11, 2026</span>
               <div className="flex gap-4">
                 <button className="hover:text-white transition-colors">Edit on GitHub</button>
                 <button className="hover:text-white transition-colors">Was this helpful?</button>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Nav */}
        <div className="w-48 flex-shrink-0 hidden xl:block sticky top-32 h-fit border-l border-white/5 pl-6">
          <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">On this page</h4>
          <ul className="space-y-3 text-xs text-white/40">
             <li className="text-violet-400 font-medium">Introduction</li>
             <li className="hover:text-white/70 transition-colors">The problem we solve</li>
             <li className="hover:text-white/70 transition-colors">Core Principles</li>
             <li className="hover:text-white/70 transition-colors">Next Steps</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
