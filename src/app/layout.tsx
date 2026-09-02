import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: { default: "Prince John Gandollas — Full-Stack Engineer", template: "%s — Prince John Gandollas" },
  description: "Full-Stack Engineer specializing in production web, mobile, backend, offline-first, payment, and multi-tenant systems.",
  metadataBase: new URL(siteUrl),
  openGraph: { title: "Prince John Gandollas — Full-Stack Engineer", description: "Production web, mobile, backend, offline-first, payment, and multi-tenant systems.", type: "website" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
