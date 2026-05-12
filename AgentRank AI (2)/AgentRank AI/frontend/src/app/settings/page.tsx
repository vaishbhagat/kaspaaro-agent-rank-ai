'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Bell, Globe, Shield, 
  CreditCard, Users, Link as LinkIcon, 
  Trash2, Save, CheckCircle, Smartphone, 
  Key, Mail, ExternalLink, Moon, Sun
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'persona', label: 'Brand Persona', icon: Sparkles },
  { id: 'account', label: 'Account', icon: Settings },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

function Sparkles({ className }: { className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-violet-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-white/50 text-sm">
            Manage your account preferences, connected stores, and team members.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                    : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-violet-400' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="glass-strong rounded-3xl border border-white/8 p-8"
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Profile Settings</h2>
                    <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-white/5 border border-white/5">
                      <div className="text-3xl font-bold w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white">
                        {user?.avatar || 'JD'}
                      </div>
                      <div>
                        <button className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all mb-2">
                          Upload New Avatar
                        </button>
                        <p className="text-[10px] text-white/30">JPG, GIF or PNG. Max size of 800K</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all opacity-60 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white">Merchant Details</h3>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Shopify Domain</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="store-name"
                          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500/50 transition-all"
                        />
                        <div className="flex items-center px-4 rounded-xl bg-white/5 border border-white/10 text-white/30 text-sm">
                          .myshopify.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'persona' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-6">Brand Persona</h2>
                    <p className="text-sm text-white/40 mb-8">
                      Define how you want AI shopping agents to represent your store. This baseline is used to measure "Perception Mismatch".
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Primary Market Positioning</label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          { id: 'premium', label: 'Premium & Luxury', desc: 'Higher price point, focus on quality and status.' },
                          { id: 'budget', label: 'Budget & Value', desc: 'Focus on affordability and practical utility.' },
                          { id: 'eco', label: 'Eco-Friendly & Ethical', desc: 'Focus on sustainability and social impact.' },
                          { id: 'tech', label: 'Tech & Performance', desc: 'Focus on specs, innovation, and metrics.' },
                        ].map((p) => (
                          <button key={p.id} className="text-left p-4 rounded-2xl glass border border-white/5 hover:border-violet-500/50 transition-all group">
                            <div className="text-sm font-bold text-white mb-1">{p.label}</div>
                            <p className="text-[10px] text-white/40 leading-relaxed">{p.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                       <label className="text-xs font-bold text-white/50 uppercase tracking-widest px-1">Brand Voice</label>
                       <div className="flex flex-wrap gap-2">
                         {['Playful', 'Authoritative', 'Minimalist', 'Expert', 'Warm', 'Industrial'].map(tag => (
                           <button key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/20 transition-all">
                             {tag}
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-white mb-6">Connected Apps</h2>
                  {[
                    { name: 'Shopify Admin', status: 'Connected', icon: Smartphone, desc: 'Sync product data and metadata automatically.' },
                    { name: 'Slack Notifications', status: 'Configure', icon: Bell, desc: 'Get AI readiness alerts in your Slack channels.' },
                    { name: 'Google Search Console', status: 'Connect', icon: Globe, desc: 'Correlate AI visibility with search performance.' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 rounded-2xl glass border border-white/5 hover:border-white/15 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <integration.icon className="w-5 h-5 text-white/60" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">{integration.name}</h3>
                          <p className="text-[10px] text-white/40">{integration.desc}</p>
                        </div>
                      </div>
                      <button className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                        integration.status === 'Connected' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}>
                        {integration.status}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'account' && (
                 <div className="space-y-8">
                    <h2 className="text-lg font-bold text-white mb-6">Account Management</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-2xl glass border border-white/5">
                        <div>
                          <h3 className="text-sm font-bold text-white">Interface Theme</h3>
                          <p className="text-[10px] text-white/40">Switch between light and dark mode</p>
                        </div>
                        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
                          <button className="p-1.5 px-3 rounded-lg bg-violet-600 text-white"><Moon className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 px-3 rounded-lg text-white/40 hover:text-white transition-colors"><Sun className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                         <h3 className="text-sm font-bold text-red-400 mb-2">Danger Zone</h3>
                         <p className="text-xs text-red-400/60 mb-4">Permanently delete your store analysis and all historical data. This action cannot be undone.</p>
                         <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold transition-all">
                           <Trash2 className="w-3.5 h-3.5" />
                           Delete Account
                         </button>
                      </div>
                    </div>
                 </div>
              )}

              <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] text-white/20 uppercase tracking-widest">
                  {saved ? 'Changes saved successfully' : 'Unsaved changes may be lost'}
                </p>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 rounded-xl text-white/40 hover:text-white transition-colors text-sm font-bold">
                    Discard
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all shadow-lg shadow-violet-600/30 active:scale-95 disabled:opacity-50"
                  >
                    {saving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-4 h-4" /> Save Changes</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
