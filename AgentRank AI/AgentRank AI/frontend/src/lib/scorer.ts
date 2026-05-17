import {
  ShopifyRawData, ShopifyProduct, ShopifyPage,
  ScoreBreakdown, ScoreDimension, CriticalIssue, Recommendation,
} from '@/types/analysis';
import { stripHtml, wordCount } from './shopify';

// ── Helpers ─────────────────────────────────────────────
function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(n)));
}

function findPage(pages: ShopifyPage[], keywords: string[]): ShopifyPage | undefined {
  return pages.find((p) =>
    keywords.some(
      (kw) =>
        p.handle.includes(kw) ||
        p.title.toLowerCase().includes(kw),
    ),
  );
}

// ── 1. Product Descriptions ──────────────────────────────
function scoreProductDescriptions(products: ShopifyProduct[]): ScoreDimension {
  if (products.length === 0) {
    return {
      score: 0,
      label: 'Product Descriptions',
      issues: ['No products found on this store'],
      strengths: [],
      details: { productCount: 0, avgWordCount: 0 },
    };
  }

  const MATERIAL_KEYWORDS = ['cotton', 'polyester', 'leather', 'wood', 'metal', 'plastic',
    'organic', 'synthetic', 'wool', 'silk', 'nylon', 'bamboo', 'material', 'fabric',
    'made of', 'made from', 'composition', 'ingredients'];
  const SIZE_KEYWORDS = ['size', 'sizing', 'fit', 'measurement', 'dimension', 'width',
    'height', 'length', 'cm', 'inch', 'oz', 'gram', 'kg', 'lb'];
  const USE_KEYWORDS = ['designed for', 'perfect for', 'ideal for', 'great for', 'use for',
    'suitable for', 'best for', 'meant for'];

  const scores: number[] = [];
  const wordCounts: number[] = [];
  let hasMaterial = 0, hasSize = 0, hasUseCase = 0, tooShort = 0;

  for (const product of products) {
    const text = stripHtml(product.body_html || '').toLowerCase();
    const wc = wordCount(text);
    wordCounts.push(wc);

    let s = 0;
    // Word count score (0–60)
    if (wc >= 200) s += 60;
    else if (wc >= 150) s += 50;
    else if (wc >= 80) s += 35;
    else if (wc >= 30) s += 20;
    else { s += 0; tooShort++; }

    // Bonuses (0–40)
    const hasMat = MATERIAL_KEYWORDS.some((k) => text.includes(k));
    const hasSz = SIZE_KEYWORDS.some((k) => text.includes(k));
    const hasUse = USE_KEYWORDS.some((k) => text.includes(k));
    if (hasMat) { s += 15; hasMaterial++; }
    if (hasSz) { s += 15; hasSize++; }
    if (hasUse) { s += 10; hasUseCase++; }

    scores.push(clamp(s));
  }

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const avgWC = Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length);

  const issues: string[] = [];
  const strengths: string[] = [];

  if (tooShort > 0) issues.push(`${tooShort} product${tooShort > 1 ? 's have' : ' has'} descriptions under 30 words`);
  if (hasMaterial < products.length * 0.5) issues.push('Most products lack material or ingredient details');
  if (hasSize < products.length * 0.4) issues.push('Sizing and dimension info missing on most products');
  if (hasUseCase < products.length * 0.3) issues.push('Product use-cases are unclear — AI agents need context');
  if (avgWC < 80) issues.push(`Average description is only ${avgWC} words — aim for 150+`);

  if (hasMaterial >= products.length * 0.5) strengths.push('Most products mention materials');
  if (avgWC >= 100) strengths.push(`Good average description length (${avgWC} words)`);
  if (hasSize >= products.length * 0.4) strengths.push('Sizing/dimension info present on most products');

  return {
    score: clamp(avgScore),
    label: 'Product Descriptions',
    issues,
    strengths,
    details: { productCount: products.length, avgWordCount: avgWC, tooShort },
  };
}

// ── 2. Policies ──────────────────────────────────────────
function scorePolicies(pages: ShopifyPage[]): ScoreDimension {
  const shippingPage = findPage(pages, ['shipping', 'delivery', 'ship-']);
  const returnPage = findPage(pages, ['return', 'refund', 'exchange', 'cancel']);
  const privacyPage = findPage(pages, ['privacy']);
  const termsPage = findPage(pages, ['terms', 'tos', 'legal']);

  const shippingText = stripHtml(shippingPage?.body_html || '');
  const returnText = stripHtml(returnPage?.body_html || '');
  const privacyText = stripHtml(privacyPage?.body_html || '');

  const shippingWC = wordCount(shippingText);
  const returnWC = wordCount(returnText);
  const privacyWC = wordCount(privacyText);

  let score = 0;
  const issues: string[] = [];
  const strengths: string[] = [];

  // Shipping (30 pts)
  if (shippingPage) {
    score += shippingWC > 200 ? 30 : shippingWC > 80 ? 20 : 10;
    if (shippingWC > 200) strengths.push('Detailed shipping policy found');
    else if (shippingWC < 80) issues.push('Shipping policy is too brief — add delivery timeframes');
    if (!shippingText.toLowerCase().includes('day') && !shippingText.toLowerCase().includes('week'))
      issues.push('No delivery timeframe mentioned in shipping policy');
  } else {
    issues.push('No shipping policy page found — critical for AI agents');
  }

  // Returns (30 pts)
  if (returnPage) {
    score += returnWC > 200 ? 30 : returnWC > 80 ? 20 : 10;
    if (returnWC > 200) strengths.push('Comprehensive return/refund policy exists');
    else if (returnWC < 80) issues.push('Return policy is too short — expand it for customer confidence');
  } else {
    issues.push('No return or refund policy found — biggest AI trust blocker');
  }

  // Privacy (20 pts)
  if (privacyPage && privacyWC > 100) {
    score += 20;
    strengths.push('Privacy policy present and detailed');
  } else if (privacyPage) {
    score += 10;
    issues.push('Privacy policy exists but is too brief');
  } else {
    issues.push('No privacy policy page found');
  }

  // Terms (20 pts)
  if (termsPage) {
    score += 20;
    strengths.push('Terms of service page found');
  } else {
    issues.push('No terms of service page found');
  }

  return {
    score: clamp(score),
    label: 'Policies',
    issues,
    strengths,
    details: {
      hasShipping: !!shippingPage,
      hasReturn: !!returnPage,
      hasPrivacy: !!privacyPage,
      hasTerms: !!termsPage,
      shippingWC,
      returnWC,
    },
  };
}

// ── 3. FAQ Coverage ──────────────────────────────────────
function scoreFaqCoverage(pages: ShopifyPage[], products: ShopifyProduct[]): ScoreDimension {
  const faqPage = findPage(pages, ['faq', 'frequently', 'question', 'help', 'support']);
  const faqText = stripHtml(faqPage?.body_html || '').toLowerCase();
  const faqWC = wordCount(faqText);

  const FAQ_TOPICS = [
    { key: 'return', label: 'Returns' },
    { key: 'ship', label: 'Shipping' },
    { key: 'size', label: 'Sizing' },
    { key: 'payment', label: 'Payment' },
    { key: 'track', label: 'Order tracking' },
    { key: 'cancel', label: 'Cancellations' },
    { key: 'discount', label: 'Discounts/promo' },
    { key: 'contact', label: 'Contact info' },
  ];

  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 0;
  const covered: string[] = [];
  const missing: string[] = [];

  if (faqPage) {
    score += 40;
    strengths.push('FAQ page exists');
    if (faqWC > 500) { score += 20; strengths.push('FAQ page is detailed and comprehensive'); }
    else if (faqWC > 200) { score += 10; }
    else { issues.push('FAQ page exists but has very little content'); }

    for (const topic of FAQ_TOPICS) {
      if (faqText.includes(topic.key)) { score += 5; covered.push(topic.label); }
      else missing.push(topic.label);
    }
    if (missing.length > 0) issues.push(`FAQ missing: ${missing.slice(0, 4).join(', ')}`);
    if (covered.length > 0) strengths.push(`Covers: ${covered.slice(0, 4).join(', ')}`);
  } else {
    issues.push('No FAQ page found — AI agents rely heavily on FAQ content');
    // Partial credit if some pages contain FAQ-like content
    const allPageText = pages.map((p) => stripHtml(p.body_html || '')).join(' ').toLowerCase();
    const anyCovered = FAQ_TOPICS.filter((t) => allPageText.includes(t.key));
    if (anyCovered.length > 2) { score += 15; strengths.push('Some FAQ info scattered across pages'); }

    for (const topic of FAQ_TOPICS) missing.push(topic.label);
    issues.push(`No coverage of: ${missing.slice(0, 4).join(', ')}`);
  }

  return {
    score: clamp(score),
    label: 'FAQ Coverage',
    issues,
    strengths,
    details: { hasFaq: !!faqPage, faqWordCount: faqWC, topicsCovered: covered.length, topicsTotal: FAQ_TOPICS.length },
  };
}

// ── 4. Trust Signals ─────────────────────────────────────
function scoreTrustSignals(
  products: ShopifyProduct[],
  pages: ShopifyPage[],
  data: ShopifyRawData,
): ScoreDimension {
  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 0;

  // Multiple product images
  const avgImages = products.length > 0
    ? products.reduce((a, p) => a + p.images.length, 0) / products.length
    : 0;
  if (avgImages >= 3) { score += 25; strengths.push(`Strong product imagery (avg ${avgImages.toFixed(1)} images)`); }
  else if (avgImages >= 2) { score += 15; strengths.push('Multiple product images present'); }
  else { score += 5; issues.push('Most products have only one image — add lifestyle/detail shots'); }

  // About page
  const aboutPage = findPage(pages, ['about', 'our-story', 'story', 'brand']);
  if (aboutPage && wordCount(stripHtml(aboutPage.body_html || '')) > 100) {
    score += 20;
    strengths.push('Detailed "About" page found — builds brand trust');
  } else if (aboutPage) {
    score += 10;
    issues.push('"About" page exists but is too brief');
  } else {
    issues.push('No "About" or brand story page — reduces AI trust score');
  }

  // Blog presence
  if (data.blogs.length > 0) {
    score += 20;
    strengths.push('Blog present — content marketing boosts AI authority');
  } else {
    issues.push('No blog found — blogs increase AI discoverability');
  }

  // Contact page
  const contactPage = findPage(pages, ['contact', 'reach', 'get-in-touch']);
  if (contactPage) {
    score += 20;
    strengths.push('Contact page found — trust signal for buyers');
  } else {
    issues.push('No contact page found');
  }

  // Vendor set on products
  const vendorSet = products.filter((p) => p.vendor && p.vendor.toLowerCase() !== 'shopify').length;
  if (vendorSet > products.length * 0.7) {
    score += 15;
    strengths.push('Brand/vendor consistently set on products');
  } else {
    issues.push('Vendor/brand name not consistently set on products');
  }

  return {
    score: clamp(score),
    label: 'Trust Signals',
    issues,
    strengths,
    details: { avgImages: Math.round(avgImages * 10) / 10, hasAbout: !!aboutPage, hasBlog: data.blogs.length > 0, hasContact: !!contactPage },
  };
}

// ── 5. Metadata Quality ──────────────────────────────────
function scoreMetadataQuality(products: ShopifyProduct[], data: ShopifyRawData): ScoreDimension {
  if (products.length === 0) {
    return { score: 0, label: 'Metadata Quality', issues: ['No products found'], strengths: [], details: {} };
  }

  const issues: string[] = [];
  const strengths: string[] = [];
  let score = 0;

  // Tags
  const withTags = products.filter((p) => p.tags && p.tags.trim().length > 0);
  const tagRatio = withTags.length / products.length;
  if (tagRatio >= 0.8) { score += 25; strengths.push(`${Math.round(tagRatio * 100)}% of products have tags`); }
  else if (tagRatio >= 0.4) { score += 12; issues.push(`Only ${Math.round(tagRatio * 100)}% of products have tags`); }
  else { issues.push('Most products have no tags — AI agents use tags for categorisation'); }

  // Avg tag count
  const avgTags = withTags.length > 0
    ? withTags.reduce((a, p) => a + p.tags.split(',').length, 0) / withTags.length
    : 0;
  if (avgTags >= 5) { score += 15; strengths.push(`Good tag depth (avg ${avgTags.toFixed(1)} tags)`); }
  else if (avgTags >= 2) { score += 8; }
  else if (withTags.length > 0) { issues.push('Products have very few tags — add more descriptive tags'); }

  // Product type
  const withType = products.filter((p) => p.product_type && p.product_type.trim().length > 0);
  if (withType.length > products.length * 0.7) {
    score += 20;
    strengths.push('Product types are set — helps AI categorise items');
  } else {
    issues.push('Product type field not set on most products');
  }

  // Variants
  const withVariants = products.filter((p) => p.variants.length > 1);
  if (withVariants.length > products.length * 0.5) {
    score += 20;
    strengths.push('Products have multiple variants (sizes, colors)');
  } else {
    issues.push('Few products have variants — add size/colour options where relevant');
  }

  // Collections
  if (data.collections.length >= 3) {
    score += 20;
    strengths.push(`${data.collections.length} collections organise the store well`);
  } else if (data.collections.length > 0) {
    score += 10;
    issues.push('Few collections — add more to help AI understand store structure');
  } else {
    issues.push('No collections found — organise products into categories');
  }

  return {
    score: clamp(score),
    label: 'Metadata Quality',
    issues,
    strengths,
    details: {
      tagCoverage: Math.round(tagRatio * 100),
      avgTags: Math.round(avgTags * 10) / 10,
      collectionCount: data.collections.length,
      productTypeSet: withType.length,
    },
  };
}

// ── Build critical issues list ────────────────────────────
function buildCriticalIssues(breakdown: ScoreBreakdown): CriticalIssue[] {
  const issues: CriticalIssue[] = [];
  let id = 1;

  const addIssues = (dim: ScoreDimension, category: string) => {
    dim.issues.forEach((issue) => {
      const severity: 'high' | 'medium' | 'low' =
        dim.score < 30 ? 'high' : dim.score < 60 ? 'medium' : 'low';
      issues.push({
        id: id++,
        severity,
        title: issue,
        desc: `${category}: ${issue}`,
        fix: `Review and improve your ${category.toLowerCase()} to boost AI discoverability.`,
      });
    });
  };

  addIssues(breakdown.policies, 'Policies');
  addIssues(breakdown.faqCoverage, 'FAQ');
  addIssues(breakdown.productDescriptions, 'Product Descriptions');
  addIssues(breakdown.trustSignals, 'Trust Signals');
  addIssues(breakdown.metadataQuality, 'Metadata');

  // Sort: high → medium → low, max 8
  return issues
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.severity] - order[b.severity];
    })
    .slice(0, 8);
}

// ── Build recommendations list ────────────────────────────
function buildRecommendations(breakdown: ScoreBreakdown): Recommendation[] {
  const recs: Recommendation[] = [];

  const dims = [
    { dim: breakdown.policies, category: 'Policies' },
    { dim: breakdown.faqCoverage, category: 'FAQ' },
    { dim: breakdown.productDescriptions, category: 'Products' },
    { dim: breakdown.trustSignals, category: 'Trust' },
    { dim: breakdown.metadataQuality, category: 'Metadata' },
  ];

  for (const { dim, category } of dims) {
    const priority: 'HIGH' | 'MEDIUM' | 'LOW' =
      dim.score < 40 ? 'HIGH' : dim.score < 70 ? 'MEDIUM' : 'LOW';
    const gain = Math.round((100 - dim.score) * 0.3);
    dim.issues.slice(0, 2).forEach((issue) => {
      recs.push({
        priority,
        title: issue,
        impact: `+${gain} pts`,
        effort: dim.score < 30 ? 'Low' : 'Medium',
        category,
      });
    });
  }

  return recs
    .sort((a, b) => {
      const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 8);
}

// ── Main scorer export ────────────────────────────────────
export function runScoringEngine(data: ShopifyRawData): {
  overallScore: number;
  breakdown: ScoreBreakdown;
  criticalIssues: CriticalIssue[];
  recommendations: Recommendation[];
} {
  const productDescriptions = scoreProductDescriptions(data.products);
  const policies = scorePolicies(data.pages);
  const faqCoverage = scoreFaqCoverage(data.pages, data.products);
  const trustSignals = scoreTrustSignals(data.products, data.pages, data);
  const metadataQuality = scoreMetadataQuality(data.products, data);

  const breakdown: ScoreBreakdown = {
    productDescriptions,
    policies,
    faqCoverage,
    trustSignals,
    metadataQuality,
  };

  const overallScore = clamp(
    Math.round(
      productDescriptions.score * 0.25 +
      policies.score * 0.25 +
      faqCoverage.score * 0.20 +
      trustSignals.score * 0.15 +
      metadataQuality.score * 0.15,
    ),
  );

  return {
    overallScore,
    breakdown,
    criticalIssues: buildCriticalIssues(breakdown),
    recommendations: buildRecommendations(breakdown),
  };
}
