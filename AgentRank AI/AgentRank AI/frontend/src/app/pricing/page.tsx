'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, Zap, Star, Shield, 
  CreditCard, Sparkles, AlertCircle,
  HelpCircle, ChevronDown, ArrowRight
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    desc: 'For new stores exploring AI discoverability.',
    features: [
      '1 Store analysis',
      'Basic AI perception report',
      'Policy clarity check',
      '3 Product optimizations',
      'Weekly scan updates',
    ],
    cta: 'Current Plan',
    current: true,
    color: 'border-white/10'
  },
  {
    name: 'Growth',
    price: '$49',
    popular: true,
    desc: 'For brands scaling their AI shopping presence.',
    features: [
      'Up to 3 Stores',
      'Full AI Perception Suite',
      'Automated product syncing',
      'Unlimted product rewrites',
      'Social proof API integration',
      'Daily scan updates',
      'Priority support',
    ],
    cta: 'Upgrade to Growth',
    color: 'border-violet-500/50 bg-violet-600/5 shadow-[0_0_40px_-15px_#7c3aed40]'
  },
  {
    name: 'Enterprise',
    price: '$199',
    desc: 'For established retailers and agencies.',
    features: [
      'Unlimited Stores',
      'Custom LLM training data',
      'White-label reporting',
      'Dedicated account manager',
      'Advanced API access',
      'Real-time indexing',
      'Custom SLA',
    ],
    cta: 'Contact Sales',
    color: 'border-cyan-500/30'
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Pricing Plans
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Plans that grow with <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">your store.</span>
          </h1>
          <p className="text-white/40 max-w-2xl mx-auto text-lg leading-relaxed">
            Stop being ignored by AI shopping agents. Choose the plan that helps you dominate the next era of commerce.
          </p>

          <div className="flex items-center justify-center gap-4 pt-6">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-full bg-white/5 border border-white/10 p-1 relative transition-all"
            >
              <motion.div 
                animate={{ x: isAnnual ? 24 : 0 }}
                className="w-4 h-4 rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/40'}`}>Annual</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">20% OFF</span>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20 px-4 md:px-0">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 group hover:scale-[1.02] ${plan.color}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-violet-600 text-white text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-violet-600/40">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-white/40 leading-relaxed min-h-[40px]">{plan.desc}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{isAnnual && plan.price !== '$0' ? `$${Math.round(parseInt(plan.price.slice(1)) * 0.8)}` : plan.price}</span>
                <span className="text-white/30 text-sm font-medium">/ month</span>
              </div>

              <Link 
                href="/signup"
                className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 mb-8 active:scale-95 ${
                  plan.current 
                  ? 'bg-white/5 border border-white/10 text-white/40 cursor-default pointer-events-none' 
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                }`}
              >
                {plan.cta}
                {!plan.current && <ArrowRight className="w-4 h-4" />}
              </Link>

              <div className="space-y-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">What's included</div>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-xs text-white/60">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section Preview */}
        <div className="max-w-3xl mx-auto text-center space-y-12 mb-20">
           <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
           <div className="space-y-4 text-left">
              {[
                { q: "How is AgentRank AI different from a chatbot?", a: "Unlike chatbots that interact with customers, AgentRank analyzes your store's underlying data and structure to ensure external AI agents (like Perplexity or ChatGPT) can understand and suggest your products accurately." },
                { q: "Does this work with customized Shopify themes?", a: "Yes. AgentRank scans the public and private API endpoints of your store, so it works regardless of your theme design." },
                { q: "Can I cancel my subscription any time?", a: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your settings page with no hidden fees." }
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl glass border border-white/5 hover:border-white/15 transition-all">
                  <h4 className="text-white font-bold mb-2 flex items-center justify-between">
                    {faq.q}
                    <Plus className="w-4 h-4 text-white/30" />
                  </h4>
                  <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
}
