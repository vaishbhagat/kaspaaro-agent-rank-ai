'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const scanSteps = [
  { id: 'products', label: 'Analyzing product descriptions', detail: 'Evaluating clarity, specificity, and AI-friendliness of your products…' },
  { id: 'policies', label: 'Evaluating trust signals', detail: 'Checking return policy, shipping terms, and policy completeness…' },
  { id: 'faq', label: 'Checking policy clarity', detail: 'Measuring FAQ coverage and common question resolution…' },
  { id: 'metadata', label: 'Measuring AI discoverability', detail: 'Analysing metadata quality, tags, and structured data…' },
  { id: 'recommendations', label: 'Generating AI recommendations', detail: 'Building your personalised action plan with Gemini AI…' },
];

function ScanPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = searchParams.get('store') || '';

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [error, setError] = useState('');
  const hasFetched = useRef(false);

  // Dot animation
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(id);
  }, []);

  // Drive the visual progress bar over ~12s (leaves room for AI calls)
  useEffect(() => {
    const stepDurations = [2000, 1800, 1600, 1800, 2200]; // ms per step
    let stepIndex = 0;
    const totalDuration = stepDurations.reduce((a, b) => a + b, 0);
    let totalElapsed = 0;

    const runStep = () => {
      if (stepIndex >= scanSteps.length) return;
      setCurrentStep(stepIndex);
      const duration = stepDurations[stepIndex];
      const startPct = (totalElapsed / totalDuration) * 90; // cap visual at 90%
      const endPct = ((totalElapsed + duration) / totalDuration) * 90;
      let elapsed = 0;
      const tick = 50;
      const id = setInterval(() => {
        elapsed += tick;
        const frac = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - frac, 3);
        setProgress(startPct + (endPct - startPct) * eased);
        if (elapsed >= duration) {
          clearInterval(id);
          setCompletedSteps((prev) => [...prev, stepIndex]);
          totalElapsed += duration;
          stepIndex++;
          runStep();
        }
      }, tick);
    };

    runStep();
  }, []);

  // Fetch real analysis
  useEffect(() => {
    if (!store || hasFetched.current) return;
    hasFetched.current = true;

    const analyze = async () => {
      try {
        const res = await fetch(`/api/analyze?store=${encodeURIComponent(store)}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Analysis failed. Please check the store URL and try again.');
          return;
        }

        // Store result in sessionStorage for dashboard to pick up
        sessionStorage.setItem('agentrank_result', JSON.stringify(data));

        // Jump to 100% and redirect
        setProgress(100);
        setCurrentStep(scanSteps.length - 1);
        setCompletedSteps([0, 1, 2, 3, 4]);
        setTimeout(() => {
          router.push(`/dashboard?store=${encodeURIComponent(store)}`);
        }, 800);
      } catch {
        setError('Network error. Make sure the store URL is correct and the store is publicly accessible.');
      }
    };

    analyze();
  }, [store, router]);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/50 mb-4">No store specified.</p>
          <Link href="/connect" className="text-violet-400 hover:underline">← Go back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-16">

      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-violet-500/8 animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-cyan-500/6" style={{ animation: 'spin-slow 12s linear infinite reverse' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/6 blur-3xl" />
          <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent animate-scan-line" />
        </div>

        <div className="w-full max-w-md relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass-strong rounded-2xl p-8 border border-white/10"
          >
            {/* Store badge */}
            <div className="flex items-center gap-3 mb-8 p-3 rounded-xl glass border border-white/8">
              <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-white/40">Scanning store</div>
                <div className="text-sm font-medium text-white truncate">{store}</div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 flex-shrink-0">Live</span>
            </div>

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-red-300 mb-1">Analysis Failed</div>
                    <p className="text-xs text-red-300/70 leading-relaxed">{error}</p>
                  </div>
                </div>
                <Link
                  href="/connect"
                  className="mt-3 block text-center text-xs text-white/50 hover:text-white border border-white/10 rounded-lg py-2 transition-colors"
                >
                  ← Try a different store
                </Link>
              </motion.div>
            )}

            {!error && (
              <>
                {/* Progress ring */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative w-28 h-28 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <circle
                        cx="60" cy="60" r="52"
                        fill="none"
                        stroke="url(#scanGrad)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="score-ring"
                        style={{ strokeDashoffset: 327 - (327 * progress) / 100 }}
                      />
                      <defs>
                        <linearGradient id="scanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                      <span className="text-xs text-white/40">complete</span>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-white text-center">
                    {progress >= 100 ? '✓ Analysis Complete!' : `Scanning${dots}`}
                  </h2>
                  <p className="text-xs text-white/40 text-center mt-1">
                    {progress >= 100 ? 'Redirecting to your dashboard…' : 'AI-powered analysis in progress'}
                  </p>
                </div>

                {/* Step list */}
                <div className="space-y-3">
                  {scanSteps.map((step, i) => {
                    const isCompleted = completedSteps.includes(i);
                    const isActive = currentStep === i && !isCompleted;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: i <= currentStep || isCompleted ? 1 : 0.3, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-xl transition-all ${isActive ? 'glass border border-violet-500/30 bg-violet-500/5' : ''}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted
                            ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                            : isActive
                            ? <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                            : <div className="w-4 h-4 rounded-full border border-white/20" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`text-sm font-medium transition-colors ${isCompleted ? 'text-white/50 line-through' : isActive ? 'text-white' : 'text-white/30'}`}>
                            {step.label}
                          </div>
                          <AnimatePresence>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-violet-300/70 mt-0.5 leading-relaxed"
                              >
                                {step.detail}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-white/8">
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-white/25 text-center mt-2">
                    Powered by Gemini AI · Real data from your store
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense>
      <ScanPageContent />
    </Suspense>
  );
}
