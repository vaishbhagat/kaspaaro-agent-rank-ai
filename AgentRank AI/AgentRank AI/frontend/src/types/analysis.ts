// ── Shopify raw data types ──────────────────────────────
export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  handle: string;
  variants: { id: number; title: string; price: string; sku: string }[];
  images: { id: number; src: string }[];
  options: { name: string; values: string[] }[];
}

export interface ShopifyPage {
  id: number;
  title: string;
  handle: string;
  body_html: string;
}

export interface ShopifyCollection {
  id: number;
  title: string;
  handle: string;
}

export interface ShopifyBlog {
  id: number;
  title: string;
  handle: string;
}

export interface ShopifyRawData {
  products: ShopifyProduct[];
  pages: ShopifyPage[];
  collections: ShopifyCollection[];
  blogs: ShopifyBlog[];
  storeName: string;
  storeUrl: string;
  fetchedAt: string;
  error?: string;
}

// ── Score types ─────────────────────────────────────────
export interface ScoreDimension {
  score: number;
  label: string;
  issues: string[];
  strengths: string[];
  details: Record<string, number | string | boolean>;
}

export interface ScoreBreakdown {
  productDescriptions: ScoreDimension;
  policies: ScoreDimension;
  faqCoverage: ScoreDimension;
  trustSignals: ScoreDimension;
  metadataQuality: ScoreDimension;
}

export interface CriticalIssue {
  id: number;
  severity: 'high' | 'medium' | 'low';
  title: string;
  desc: string;
  fix: string;
}

export interface Recommendation {
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  impact: string;
  effort: 'Low' | 'Medium' | 'High';
  category: string;
}

export interface AgentVisibility {
  agent: string;
  visibility: 'High' | 'Medium' | 'Low' | 'Very Low';
  reason: string;
}

export interface ProductOptimization {
  id: number;
  name: string;
  original: string;
  optimized: string;
  originalScore: number;
  optimizedScore: number;
  tags: string[];
  issues: string[];
  improvements: string[];
}

// ── Full analysis result ─────────────────────────────────
export interface AnalysisResult {
  store: string;
  storeUrl: string;
  storeName: string;
  overallScore: number;
  scores: ScoreBreakdown;
  criticalIssues: CriticalIssue[];
  recommendations: Recommendation[];
  agentVisibility: AgentVisibility[];
  aiPerception: string;
  aiPerceptionDetail: string;
  productOptimizations: ProductOptimization[];
  radarData: { subject: string; A: number; fullMark: number }[];
  trendData: { week: string; score: number }[];
  analyzedAt: string;
  productCount: number;
  pageCount: number;
}
