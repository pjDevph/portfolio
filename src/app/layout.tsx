import type { Metadata } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import { AssistantWidget } from "@/components/assistant-chat";


export const metadata: Metadata = {
  title: { default: "Prince John Gandollas — Full-Stack Engineer", template: "%s — Prince John Gandollas" },
  description: "Full-Stack Engineer specializing in production web, mobile, backend, offline-first, payment, and multi-tenant systems.",
  metadataBase: new URL(siteUrl),
  openGraph: { title: "Prince John Gandollas — Full-Stack Engineer", description: "Production web, mobile, backend, offline-first, payment, and multi-tenant systems.", type: "website", siteName: "Prince John Gandollas" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body suppressHydrationWarning>{children}<AssistantWidget /></body></html>;
}
