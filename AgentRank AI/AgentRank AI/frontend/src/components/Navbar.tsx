'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, LogOut, User, ChevronDown, Zap, Menu, X, Play } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (pathname === '/signin' || pathname === '/signup') return null;

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Demo', href: '/dashboard' },
    { name: 'Resources', href: '/resources' },
    { name: 'Docs', href: '/docs' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ${
      scrolled 
        ? 'h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl' 
        : 'h-20 border-b border-transparent bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-lg tracking-tight leading-none">AgentRank</span>
            <span className="text-[10px] text-violet-400 font-bold uppercase tracking-widest mt-0.5">AI Commerce</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-white/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/signin"
                className="px-5 py-2 rounded-xl text-white/50 hover:text-white text-sm font-medium transition-all hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-black hover:bg-white/90 text-sm font-bold transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/connect"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/10 border border-violet-500/30 text-violet-300 text-xs font-bold hover:bg-violet-600/20 transition-all"
              >
                <Zap className="w-3 h-3" />
                Analyze Store
              </Link>
              
              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full glass border border-white/10 hover:border-white/20 transition-all shadow-xl"
                >
                  <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-[10px] font-black text-white ring-2 ring-violet-500/20">
                    {user?.avatar || 'JD'}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-3 w-64 glass-strong rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-2"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <div className="text-sm font-bold text-white truncate">{user?.name}</div>
                        <div className="text-[10px] text-white/40 truncate">{user?.email}</div>
                      </div>
                      
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                        <Play className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                        <User className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <button 
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/5 rounded-lg"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Content */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-[#09090b] border-l border-white/10 z-[60] lg:hidden p-6 pt-24"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-white/60 hover:text-white py-2"
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="h-px bg-white/5 my-4" />
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-xl bg-white/5 text-white text-sm font-bold"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center rounded-xl bg-white text-black text-sm font-bold"
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <button 
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full py-3 text-center rounded-xl bg-red-500/10 text-red-400 text-sm font-bold"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
