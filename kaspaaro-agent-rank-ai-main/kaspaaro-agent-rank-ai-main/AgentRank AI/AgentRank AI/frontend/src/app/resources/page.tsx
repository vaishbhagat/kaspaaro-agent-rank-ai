'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Search, Filter, 
  ArrowRight, FileText, Video, 
  Lightbulb, Sparkles, Brain, Code
} from 'lucide-react';
import Link from 'next/link';

const categories = ['All', 'Guides', 'AI Strategy', 'Shopify Tips', 'Case Studies'];

const articles = [
  {
    title: 'The Rise of AI Agents in E-commerce',
    desc: 'How ChatGPT and Perplexity are changing the product discovery journey for billions of shoppers.',
    cat: 'AI Strategy',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Optimizing Shopify Policies for Machine Reading',
    desc: 'A technical guide to structuring your shipping and return data for AI extraction reliability.',
    cat: 'Guides',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Case Study: How Oura Boosted AI Visibility',
    desc: 'Deep dive into the semantic changes that made Oura a top recommendation on Perplexity.',
    cat: 'Case Studies',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Future-Proofing Your Product Descriptions',
    desc: 'Moving beyond keywords: How to write for LLM semantic reasoning and intent mapping.',
    cat: 'Shopify Tips',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Understanding the AI Readiness Score',
    desc: 'The technical methodology behind AgentRank’s diagnostic engine and scoring tiers.',
    cat: 'Guides',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];

export default function ResourcesPage() {
  const [activeCat, setActiveCat] = useState('All');

  const filteredArticles = activeCat === 'All' 
    ? articles 
    : articles.filter(a => a.cat === activeCat);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4 md:px-0">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-widest"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Resource Hub
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Learn to dominate <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI Commerce.</span></h1>
            <p className="text-white/40 max-w-xl">Guides, studies, and deep-dives to help you bridge the AI Discoverability gap.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-violet-400 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search articles..."
                 className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500/50 transition-all w-full md:w-64"
               />
             </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-12 px-4 md:px-0">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setActiveCat(cat)}
               className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                 activeCat === cat 
                   ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30' 
                   : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 group cursor-pointer px-4 md:px-0"
        >
          <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-white/10 glass-strong">
             <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-violet-600/20" />
             <div className="absolute bottom-0 left-0 p-8 md:p-14 space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                   <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-widest">Featured</span>
                   <span className="text-white/40 text-xs font-medium">12 min read</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white group-hover:text-violet-400 transition-colors">The 2026 AI Shopping Report</h2>
                <p className="text-white/60 text-sm md:text-lg leading-relaxed">
                  Everything we learned analysis 10,000+ top Shopify stores and their performance across LLM recommendation engines.
                </p>
                <div className="pt-4 flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
                   Read Full Whitepaper <ArrowRight className="w-5 h-5" />
                </div>
             </div>
          </div>
        </motion.div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-0">
           {filteredArticles.map((article, i) => (
             <motion.div
               key={article.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="group cursor-pointer flex flex-col"
             >
               <div className="aspect-video rounded-3xl mb-6 border border-white/10 overflow-hidden relative bg-white/5">
                  <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4 p-2 rounded-xl glass border border-white/10 group-hover:scale-110 transition-transform z-10">
                     <FileText className="w-5 h-5 text-white/40" />
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-violet-400">
                     <span>{article.cat}</span>
                     <span className="text-white/20">{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">{article.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed line-clamp-2">
                    {article.desc}
                  </p>
               </div>
             </motion.div>
           ))}
        </div>


      </div>
    </div>
  );
}
