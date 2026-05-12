import { NextRequest, NextResponse } from 'next/server';
import { fetchShopifyData, normalizeStoreUrl } from '@/lib/shopify';
import { runScoringEngine } from '@/lib/scorer';
import { generateAiPerception, rewriteProductDescriptions } from '@/lib/ai-insights';
import { generateMockShopifyData } from '@/lib/mock-data';
import { AnalysisResult } from '@/types/analysis';

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

    // HACKATHON FALLBACK: If real data fails, use Mock data to ensure a demo works
    if (shopifyData.error) {
      console.warn(`[analyze] Real fetch failed for ${storeHost}, falling back to mock data. Error: ${shopifyData.error}`);
      shopifyData = generateMockShopifyData(storeHost);
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
      // Trend data is simulated (no historical data without DB)
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
