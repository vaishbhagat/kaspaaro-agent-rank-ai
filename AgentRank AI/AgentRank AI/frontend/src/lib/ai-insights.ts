import { ShopifyRawData, ScoreBreakdown, AgentVisibility, ProductOptimization } from '@/types/analysis';
import { stripHtml } from './shopify';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('No Gemini API key');

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

// ── AI Perception Summary ─────────────────────────────────
export async function generateAiPerception(
  data: ShopifyRawData,
  scores: ScoreBreakdown,
  overallScore: number,
): Promise<{ summary: string; detail: string; agentVisibility: AgentVisibility[] }> {
  const topProducts = data.products.slice(0, 5).map((p) => ({
    name: p.title,
    desc: stripHtml(p.body_html || '').slice(0, 300),
    tags: p.tags,
  }));

  const pageList = data.pages.map((p) => p.title).join(', ') || 'None';

  const prompt = `You are an AI shopping agent analyst. Analyze this Shopify store and explain how AI shopping agents (like ChatGPT, Gemini, Perplexity) currently perceive it.

Store: ${data.storeName} (${data.storeUrl})
Overall AI Readiness Score: ${overallScore}/100

Score Breakdown:
- Product Descriptions: ${scores.productDescriptions.score}/100
- Policies: ${scores.policies.score}/100
- FAQ Coverage: ${scores.faqCoverage.score}/100
- Trust Signals: ${scores.trustSignals.score}/100
- Metadata Quality: ${scores.metadataQuality.score}/100

Sample Products (top 5):
${topProducts.map((p) => `• ${p.name}: "${p.desc.slice(0, 150)}..." Tags: ${p.tags || 'none'}`).join('\n')}

Pages found: ${pageList}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "summary": "One concise sentence (max 25 words) describing how AI agents currently see this store.",
  "detail": "2-3 sentences explaining the store's strengths and biggest gaps from an AI agent perspective. Be specific and actionable.",
  "chatgptVisibility": "High|Medium|Low|Very Low",
  "chatgptReason": "One sentence why.",
  "geminiVisibility": "High|Medium|Low|Very Low",
  "geminiReason": "One sentence why.",
  "perplexityVisibility": "High|Medium|Low|Very Low",
  "perplexityReason": "One sentence why."
}`;

  try {
    const raw = await callGemini(prompt);
    // Clean response — sometimes Gemini wraps in ```json
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      summary: parsed.summary ?? fallbackPerception(overallScore, data.storeName),
      detail: parsed.detail ?? '',
      agentVisibility: [
        { agent: 'ChatGPT', visibility: parsed.chatgptVisibility ?? visibilityFromScore(overallScore), reason: parsed.chatgptReason ?? '' },
        { agent: 'Gemini', visibility: parsed.geminiVisibility ?? visibilityFromScore(overallScore), reason: parsed.geminiReason ?? '' },
        { agent: 'Perplexity', visibility: parsed.perplexityVisibility ?? visibilityFromScore(overallScore), reason: parsed.perplexityReason ?? '' },
      ],
    };
  } catch {
    return fallbackAiPerception(overallScore, data.storeName, scores);
  }
}

// ── Product Description Rewriter ──────────────────────────
export async function rewriteProductDescriptions(
  data: ShopifyRawData,
): Promise<ProductOptimization[]> {
  // Pick up to 3 products with the weakest descriptions
  const sorted = [...data.products]
    .filter((p) => p.body_html)
    .sort((a, b) => {
      const wA = (stripHtml(a.body_html || '').split(/\s+/).length);
      const wB = (stripHtml(b.body_html || '').split(/\s+/).length);
      return wA - wB;
    })
    .slice(0, 3);

  if (sorted.length === 0) return [];

  const results: ProductOptimization[] = [];

  for (const product of sorted) {
    const originalText = stripHtml(product.body_html || '');
    const originalWC = originalText.split(/\s+/).filter(Boolean).length;
    const originalScore = Math.min(100, Math.round((originalWC / 200) * 60) + (product.tags ? 20 : 0) + (product.images.length > 1 ? 20 : 0));

    const prompt = `You are an AI commerce optimization expert. Rewrite this Shopify product description to be highly discoverable by AI shopping agents like ChatGPT and Gemini.

Product: ${product.title}
Current description: "${originalText.slice(0, 500)}"
Product tags: ${product.tags || 'none'}
Variants: ${product.variants.map((v) => v.title).join(', ') || 'none'}

Rules:
- Write 150-200 words
- Include material/ingredient details if relevant
- Add specific use-cases and who it's for
- Include sizing/measurement guidance if applicable
- Use natural language, not keyword stuffing
- Start with the most compelling benefit

Respond ONLY with valid JSON (no markdown):
{
  "optimized": "The full rewritten product description here.",
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    try {
      const raw = await callGemini(prompt);
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      const optimizedWC = (parsed.optimized || '').split(/\s+/).filter(Boolean).length;
      const optimizedScore = Math.min(100, Math.round((optimizedWC / 200) * 60) + 40);

      results.push({
        id: product.id,
        name: product.title,
        original: originalText.slice(0, 600) || 'No description provided.',
        optimized: parsed.optimized || '',
        originalScore,
        optimizedScore,
        tags: parsed.suggestedTags || product.tags.split(',').map((t: string) => t.trim()).slice(0, 6),
        issues: [
          originalWC < 30 ? 'Very short description' : originalWC < 80 ? 'Description too brief' : 'Could be more specific',
          !product.tags ? 'No tags set' : 'Tags could be expanded',
          product.images.length < 2 ? 'Only one product image' : '',
        ].filter(Boolean),
        improvements: parsed.improvements || ['Added specific details', 'Improved AI readability', 'Better use-case clarity'],
      });
    } catch {
      results.push({
        id: product.id,
        name: product.title,
        original: originalText.slice(0, 600) || 'No description provided.',
        optimized: `[AI rewrite unavailable — API error. Original: ${originalText.slice(0, 300)}]`,
        originalScore,
        optimizedScore: originalScore,
        tags: product.tags.split(',').map((t: string) => t.trim()).slice(0, 6),
        issues: ['Description could be improved'],
        improvements: [],
      });
    }
  }

  return results;
}

// ── Fallback helpers (no API needed) ─────────────────────
function visibilityFromScore(score: number): 'High' | 'Medium' | 'Low' | 'Very Low' {
  if (score >= 80) return 'High';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'Low';
  return 'Very Low';
}

function fallbackPerception(score: number, storeName: string): string {
  if (score >= 80) return `${storeName} is well-structured for AI agent recommendations with strong content signals.`;
  if (score >= 60) return `${storeName} is partially visible to AI agents but key trust signals are missing.`;
  if (score >= 40) return `${storeName} has limited AI discoverability due to thin product content and missing policies.`;
  return `${storeName} is largely invisible to AI shopping agents — critical content gaps need addressing.`;
}

function fallbackAiPerception(
  score: number,
  storeName: string,
  scores: ScoreBreakdown,
): { summary: string; detail: string; agentVisibility: AgentVisibility[] } {
  const v = visibilityFromScore(score);
  return {
    summary: fallbackPerception(score, storeName),
    detail: `Policy score is ${scores.policies.score}/100 and product descriptions score ${scores.productDescriptions.score}/100. ${
      scores.policies.score < 50
        ? 'Missing policies are the primary blocker for AI agent recommendations.'
        : 'Improving product description depth will have the highest impact.'
    }`,
    agentVisibility: [
      { agent: 'ChatGPT', visibility: v, reason: `Overall store completeness score: ${score}/100` },
      { agent: 'Gemini', visibility: v, reason: `Policy completeness: ${scores.policies.score}/100` },
      { agent: 'Perplexity', visibility: v, reason: `Content depth: ${scores.productDescriptions.score}/100` },
    ],
  };
}
