import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "AgentRank AI — AI Commerce Readiness Analyzer for Shopify",
  description:
    "Understand how ChatGPT, Gemini, and AI shopping agents perceive your Shopify store. Analyze product descriptions, policies, trust signals, and metadata quality.",
  keywords: ["Shopify", "AI commerce", "AI readiness", "product optimization", "SEO"],
  openGraph: {
    title: "AgentRank AI",
    description: "Optimize your Shopify store for AI shopping agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased mesh-gradient min-h-screen">
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
