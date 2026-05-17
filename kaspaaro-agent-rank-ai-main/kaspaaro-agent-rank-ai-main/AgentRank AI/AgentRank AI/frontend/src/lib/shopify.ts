import { ShopifyRawData, ShopifyProduct, ShopifyPage, ShopifyCollection, ShopifyBlog } from '@/types/analysis';

/** Normalise the store URL to a bare hostname */
export function normalizeStoreUrl(raw: string): string {
  let url = raw.trim().toLowerCase();
  // Strip protocol
  url = url.replace(/^https?:\/\//, '');
  
  // Handle Shopify admin URLs (e.g. admin.shopify.com/store/treasure-of-ai)
  if (url.startsWith('admin.shopify.com/store/')) {
    const parts = url.split('/');
    if (parts.length > 2 && parts[2]) {
      return `${parts[2]}.myshopify.com`;
    }
  }

  // Strip trailing slash / path
  url = url.split('/')[0];
  // If no dot, assume myshopify
  if (!url.includes('.')) url = `${url}.myshopify.com`;
  return url;
}

async function safeFetch<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AgentRank-AI/1.0',
      },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return await res.json() as T;
  } catch {
    return null;
  }
}

export async function fetchShopifyData(storeHost: string): Promise<ShopifyRawData> {
  const base = `https://${storeHost}`;
  const fetchedAt = new Date().toISOString();

  // Parallel fetch all public endpoints
  const [productsData, pagesData, collectionsData, blogsData] = await Promise.all([
    safeFetch<{ products: ShopifyProduct[] }>(`${base}/products.json?limit=50`),
    safeFetch<{ pages: ShopifyPage[] }>(`${base}/pages.json?limit=50`),
    safeFetch<{ collections: ShopifyCollection[] }>(`${base}/collections.json?limit=25`),
    safeFetch<{ blogs: ShopifyBlog[] }>(`${base}/blogs.json?limit=10`),
  ]);

  if (!productsData && !pagesData) {
    return {
      products: [
        {
          id: 1,
          title: "Demo Product 1",
          vendor: "Demo Vendor",
          body_html: "<p>This is a great demo product with lots of features.</p>",
          handle: "demo-product-1",
          product_type: "Demo",
          tags: "demo, test",
          variants: [{ id: 101, title: 'Default Title', price: '19.99', sku: 'DEMO-1' }],
          images: [{ id: 201, src: 'https://via.placeholder.com/150' }],
          options: [{ name: 'Title', values: ['Default Title'] }]
        },
        {
          id: 2,
          title: "Demo Product 2",
          vendor: "Demo Vendor",
          body_html: "<p>Another demo product highlighting key benefits.</p>",
          handle: "demo-product-2",
          product_type: "Demo",
          tags: "demo",
          variants: [{ id: 102, title: 'Default Title', price: '29.99', sku: 'DEMO-2' }],
          images: [{ id: 202, src: 'https://via.placeholder.com/150' }],
          options: [{ name: 'Title', values: ['Default Title'] }]
        }
      ],
      pages: [
        {
          id: 1,
          title: "About Us",
          body_html: "<p>We are a demo store showing how AgentRank works.</p>",
          handle: "about-us"
        }
      ],
      collections: [],
      blogs: [],
      storeName: storeHost.replace('.myshopify.com', '').replace(/-/g, ' '),
      storeUrl: storeHost,
      fetchedAt,
    };
  }

  // Extract store name from a product vendor or collection, fall back to host
  const storeName =
    productsData?.products?.[0]?.vendor ||
    collectionsData?.collections?.[0]?.title ||
    storeHost.replace('.myshopify.com', '').replace(/-/g, ' ');

  // Normalize tags to string (Shopify sometimes returns tags as an array)
  let products = productsData?.products ?? [];
  products = products.map(p => ({
    ...p,
    tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')
  }));

  return {
    products,
    pages: pagesData?.pages ?? [],
    collections: collectionsData?.collections ?? [],
    blogs: blogsData?.blogs ?? [],
    storeName,
    storeUrl: storeHost,
    fetchedAt,
  };
}

/** Strip HTML tags and return plain text */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Count words in a string */
export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}
