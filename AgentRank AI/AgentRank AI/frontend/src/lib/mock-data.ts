import { ShopifyRawData, AnalysisResult, ProductOptimization } from '@/types/analysis';

/**
 * Generates a realistic mock of Shopify store data based on the store name.
 * Used as a fallback for the hackathon demo if a real store can't be reached.
 */
export function generateMockShopifyData(storeHost: string): ShopifyRawData {
  const storeName = storeHost
    .replace('.myshopify.com', '')
    .split(/[-.]/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    storeName,
    storeUrl: storeHost,
    fetchedAt: new Date().toISOString(),
    products: [
      {
        id: 101,
        title: 'Premium Wireless Headphones',
        body_html: '<p>Experience crystal clear sound with our latest noise-cancelling technology.</p>',
        vendor: storeName,
        product_type: 'Electronics',
        handle: 'premium-wireless-headphones',
        tags: 'audio, headphones, wireless',
        images: [{ id: 1001, src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80' }],
        variants: [
          { id: 2001, title: 'Black', price: '199.00', sku: 'HW-BLK' },
          { id: 2002, title: 'Silver', price: '199.00', sku: 'HW-SLV' }
        ],
        options: [{ name: 'Color', values: ['Black', 'Silver'] }]
      },
      {
        id: 102,
        title: 'Minimalist Leather Wallet',
        body_html: '<p>Handcrafted from genuine Italian leather. Slim design for the modern professional.</p>',
        vendor: storeName,
        product_type: 'Accessories',
        handle: 'minimalist-leather-wallet',
        tags: 'wallet, leather, accessories',
        images: [{ id: 1002, src: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80' }],
        variants: [
          { id: 2003, title: 'Tan', price: '45.00', sku: 'WL-TAN' },
          { id: 2004, title: 'Dark Brown', price: '45.00', sku: 'WL-DB' }
        ],
        options: [{ name: 'Color', values: ['Tan', 'Dark Brown'] }]
      },
      {
        id: 103,
        title: 'Recycled Ocean Plastic Jacket',
        body_html: '<p>Sustainable fashion meets outdoor readiness. Water-resistant and warm.</p>',
        vendor: storeName,
        product_type: 'Apparel',
        handle: 'recycled-ocean-plastic-jacket',
        tags: 'jacket, sustainable, fashion',
        images: [{ id: 1003, src: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' }],
        variants: [
          { id: 2005, title: 'S', price: '120.00', sku: 'JK-S' },
          { id: 2006, title: 'M', price: '120.00', sku: 'JK-M' },
          { id: 2007, title: 'L', price: '120.00', sku: 'JK-L' }
        ],
        options: [{ name: 'Size', values: ['S', 'M', 'L'] }]
      }
    ],
    pages: [
      { id: 201, title: 'About Us', handle: 'about-us', body_html: '<p>We started with a simple mission: to create quality goods that last a lifetime.</p>' },
      { id: 202, title: 'Shipping Policy', handle: 'shipping', body_html: '<p>We ship worldwide. Standard delivery takes 5-7 business days.</p>' },
      { id: 203, title: 'Returns & Refunds', handle: 'returns', body_html: '<p>30-day money-back guarantee. Item must be in original condition.</p>' }
    ],
    collections: [
      { id: 301, title: 'Featured Products', handle: 'frontpage' },
      { id: 302, title: 'Best Sellers', handle: 'best-sellers' }
    ],
    blogs: [
      { id: 401, title: 'Why Sustainability Matters', handle: 'why-sustainability-matters' }
    ]
  };
}

/**
 * Generates a full AnalysisResult based on mock data.
 * Used if AI calls fail.
 */
export function generateMockResult(storeHost: string): AnalysisResult {
  const shopifyData = generateMockShopifyData(storeHost);
  const score = 72; // Consistent demo score

  return {
    store: storeHost,
    storeUrl: storeHost,
    storeName: shopifyData.storeName,
    overallScore: score,
    scores: {
      productDescriptions: { score: 65, label: 'Product Descriptions', issues: ['Short descriptions on 2 products'], strengths: ['Keywords present'], details: { productCount: 3, avgWordCount: 45 } },
      policies: { score: 85, label: 'Policies', issues: [], strengths: ['All core policies found'], details: { hasShipping: true, hasReturn: true, hasPrivacy: true, hasTerms: false } },
      faqCoverage: { score: 40, label: 'FAQ Coverage', issues: ['No FAQ page found'], strengths: [], details: { hasFaq: false } },
      trustSignals: { score: 90, label: 'Trust Signals', issues: [], strengths: ['Professional About page', 'Social links found'], details: { avgImages: 2.5 } },
      metadataQuality: { score: 75, label: 'Metadata Quality', issues: ['Missing tags on some items'], strengths: ['Product types set'], details: { tagCoverage: 80 } },
    },
    criticalIssues: [
      { id: 1, severity: 'high', title: 'Missing FAQ Page', desc: 'FAQ: No dedicated FAQ page was found. AI agents rely on FAQs to answer customer questions.', fix: 'Create an FAQ page covering shipping, returns, and common product questions.' },
      { id: 2, severity: 'medium', title: 'Short Product Descriptions', desc: 'Products: Average word count is below 100. AI agents need more detail to recommend your products.', fix: 'Expand your top 5 product descriptions to at least 150 words.' }
    ],
    recommendations: [
      { priority: 'HIGH', title: 'Create FAQ Page', impact: '+15 pts', effort: 'Low', category: 'FAQ' },
      { priority: 'MEDIUM', title: 'Expand Descriptions', impact: '+10 pts', effort: 'Medium', category: 'Products' }
    ],
    agentVisibility: [
      { agent: 'ChatGPT', visibility: 'Medium', reason: 'Basic store layout is understood, but specific product use-cases are thin.' },
      { agent: 'Gemini', visibility: 'High', reason: 'Policies are clear and easy for Gemini to extract.' },
      { agent: 'Perplexity', visibility: 'Low', reason: 'Lacks depth in long-tail SEO content and FAQ coverage.' }
    ],
    aiPerception: `${shopifyData.storeName} is partially visible to AI agents but requires more depth in product specifications and FAQ coverage to be highly recommended.`,
    aiPerceptionDetail: "Current policies are well-structured, which helps with trust. However, thin product descriptions mean AI agents might struggle to answer complex customer queries about your items.",
    productOptimizations: [
      {
        id: 101,
        name: 'Premium Wireless Headphones',
        original: 'Experience crystal clear sound with our latest noise-cancelling technology.',
        optimized: "Elevate your listening experience with our Premium Wireless Headphones. Engineered for audiophiles, these headphones feature state-of-the-art active noise-cancelling (ANC) technology that filters out up to 95% of ambient noise, perfect for travel or focusing in busy offices. With a 40-hour battery life and ergonomic memory foam ear cups, they provide all-day comfort and performance. The high-fidelity drivers deliver deep bass and crisp highs, making them ideal for everything from classical music to modern podcasts.",
        originalScore: 35,
        optimizedScore: 92,
        tags: ['anc headphones', 'wireless audio', 'noise cancelling', '40hr battery', 'hi-fi sound'],
        issues: ['Too short', 'Missing battery specs', 'No use-case mentioned'],
        improvements: ['Added battery life specs', 'Highlighted ANC technology', 'Defined target use-cases']
      }
    ],
    radarData: [
      { subject: 'Products', A: 65, fullMark: 100 },
      { subject: 'Policies', A: 85, fullMark: 100 },
      { subject: 'FAQ', A: 40, fullMark: 100 },
      { subject: 'Trust', A: 90, fullMark: 100 },
      { subject: 'Metadata', A: 75, fullMark: 100 },
    ],
    trendData: [
      { week: '3w ago', score: 58 },
      { week: '2w ago', score: 62 },
      { week: 'Last wk', score: 68 },
      { week: 'Today', score: 72 },
    ],
    analyzedAt: new Date().toISOString(),
    productCount: 3,
    pageCount: 3
  };
}
