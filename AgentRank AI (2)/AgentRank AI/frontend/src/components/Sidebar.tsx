'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, LayoutDashboard, Sparkles, Shield, 
  MessageSquare, Brain, Settings, CreditCard, 
  BookOpen, LogOut, ChevronLeft, ChevronRight,
  Zap, Package, Search
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const menuItems = [
  { group: 'Analysis', items: [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'AI Perception', icon: Brain, href: '/perception' },
    { name: 'Product Optimization', icon: Package, href: '/optimize' },
    { name: 'Policy Analysis', icon: Shield, href: '/policies' },
    { name: 'FAQ & Trust', icon: MessageSquare, href: '/faq-trust' },
  ]},
  { group: 'Account', items: [
    { name: 'Settings', icon: Settings, href: '/settings' },
    { name: 'Plans & Billing', icon: CreditCard, href: '/pricing' },
    { name: 'Documentation', icon: BookOpen, href: '/docs' },
  ]}
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Hidden on landing, signin, signup
  const isAuthPage = pathname === '/signin' || pathname === '/signup';
  const isLandingPage = pathname === '/';
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isAuthPage || isLandingPage) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: collapsed ? (isMobile ? 0 : 80) : 260,
          x: isMobile && collapsed ? -260 : 0
        }}
        className={`fixed left-0 top-0 bottom-0 z-50 glass-strong border-r border-white/5 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1"
              >
                <span className="font-bold text-white tracking-tight">AgentRank</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
              </motion.div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-8 scrollbar-hide">
          {menuItems.map((group) => (
            <div key={group.group} className="space-y-1">
              {!collapsed && (
                <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 ml-1">
                  {group.group}
                </h3>
              )}
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20' 
                        : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-violet-400' : 'group-hover:scale-110 transition-transform'}`} />
                    {!collapsed && (
                      <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-[-12px] w-1 h-6 bg-violet-500 rounded-r-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-4">
          {!collapsed && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-600/10 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-white">Pro Upgrade</span>
              </div>
              <p className="text-[10px] text-white/40 mb-3 leading-relaxed">
                Get real-time AI API scanning and automated description syncing.
              </p>
              <Link 
                href="/pricing"
                className="w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-[10px] font-bold text-white transition-all shadow-lg shadow-violet-600/20 block text-center"
              >
                Upgrade Now
              </Link>
            </div>
          )}

          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-2`}>
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.avatar || 'JD'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate">{user?.name || 'Guest Merchant'}</div>
                <div className="text-[10px] text-white/30 truncate">Free Plan</div>
              </div>
            )}
            <button 
              onClick={() => signOut()}
              className={`p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 transition-all ${collapsed ? '' : ''}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapse Toggle (Desktop) */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all z-50 bg-[#09090b]"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        )}
      </motion.aside>

      {/* Spacer for main content */}
      <div 
        className="hidden lg:block transition-all duration-300 ease-in-out flex-shrink-0" 
        style={{ width: collapsed ? 80 : 260 }} 
      />

      {/* Mobile navbar toggle */}
      {isMobile && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed left-4 bottom-4 w-12 h-12 rounded-full gradient-brand shadow-2xl flex items-center justify-center text-white z-40 active:scale-90 transition-transform"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
