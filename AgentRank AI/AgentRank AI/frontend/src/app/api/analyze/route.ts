import { NextRequest, NextResponse } from 'next/server';
import { fetchShopifyData, normalizeStoreUrl } from '@/lib/shopify';
import { runScoringEngine } from '@/lib/scorer';
import { generateAiPerception, rewriteProductDescriptions } from '@/lib/ai-insights';
import { generateMockShopifyData } from '@/lib/mock-data';
import { AnalysisResult } from '@/types/analysis';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60; // 60s timeout for AI calls

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawStore = searchParams.get('store') || '';

  if (!rawStore.trim()) {
    return NextResponse.json({ error: 'Missing store parameter' }, { status: 400 });
  }

  const storeHost = normalizeStoreUrl(rawStore);

  try {
    // Step 1 — Fetch real Shopify data
    let shopifyData = await fetchShopifyData(storeHost);

    // If real data fails, return an error instead of using mock data
    if (shopifyData.error) {
      console.warn(`[analyze] Real fetch failed for ${storeHost}. Error: ${shopifyData.error}`);
      return NextResponse.json({ error: shopifyData.error }, { status: 400 });
    }

    // Step 2 — Run deterministic scoring
    const { overallScore, breakdown, criticalIssues, recommendations } =
      runScoringEngine(shopifyData);

    // Step 3 — Run AI insights in parallel (perception + rewrites)
    const [aiPerceptionResult, productOptimizations] = await Promise.all([
      generateAiPerception(shopifyData, breakdown, overallScore),
      rewriteProductDescriptions(shopifyData),
    ]);

    // Step 4 — Build final result
    const result: AnalysisResult = {
      store: storeHost,
      storeUrl: storeHost,
      storeName: shopifyData.storeName,
      overallScore,
      scores: breakdown,
      criticalIssues,
      recommendations,
      agentVisibility: aiPerceptionResult.agentVisibility,
      aiPerception: aiPerceptionResult.summary,
      aiPerceptionDetail: aiPerceptionResult.detail,
      productOptimizations,
      radarData: [
        { subject: 'Products', A: breakdown.productDescriptions.score, fullMark: 100 },
        { subject: 'Policies', A: breakdown.policies.score, fullMark: 100 },
        { subject: 'FAQ', A: breakdown.faqCoverage.score, fullMark: 100 },
        { subject: 'Trust', A: breakdown.trustSignals.score, fullMark: 100 },
        { subject: 'Metadata', A: breakdown.metadataQuality.score, fullMark: 100 },
      ],
      // Trend data placeholder (will be overwritten if real data exists)
      trendData: [
        { week: '3w ago', score: Math.max(10, overallScore - 18) },
        { week: '2w ago', score: Math.max(10, overallScore - 10) },
        { week: 'Last wk', score: Math.max(10, overallScore - 4) },
        { week: 'Today', score: overallScore },
      ],
      analyzedAt: new Date().toISOString(),
      productCount: shopifyData.products.length,
      pageCount: shopifyData.pages.length,
    };

    // Step 4.5 — Fetch real trend data from Supabase if available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { data: history } = await supabase
          .from('analyses')
          .select('created_at, overall_score')
          .eq('store_url', storeHost)
          .order('created_at', { ascending: true }); // older to newer

        if (history && history.length > 0) {
          // Take up to the last 3 historical runs to form the trend with today's run
          const recent = history.slice(-3);
          const realTrendData = [];
          
          for (let i = 0; i < recent.length; i++) {
            const date = new Date(recent[i].created_at);
            realTrendData.push({
              week: `${date.getMonth()+1}/${date.getDate()}`,
              score: recent[i].overall_score
            });
          }
          realTrendData.push({ week: 'Today', score: overallScore });
          result.trendData = realTrendData;
        }
      } catch (e) {
        console.error('[analyze] Failed to fetch trend data:', e);
      }
    }

    // Step 5 — Save to Supabase DB if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const { error } = await supabase
          .from('analyses')
          .insert([
            {
              store_url: storeHost,
              store_name: shopifyData.storeName,
              overall_score: overallScore,
              result_data: result,
              created_at: new Date().toISOString(),
            }
          ]);
        if (error) {
          console.error('[analyze] Supabase insert error:', error);
        }
      } catch (dbErr) {
        console.error('[analyze] DB error:', dbErr);
      }
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    console.error('[analyze] error:', err);
    return NextResponse.json(
      { error: `Analysis failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 },
    );
  }
}
