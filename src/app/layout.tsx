import type { Metadata } from "next";
import { SEO } from "@/lib/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: SEO.title,
  description: SEO.description,
  keywords: [...SEO.keywords],
  // 本機教學環境先維持不被搜尋引擎索引；正式上線時改成 { index: true, follow: true }
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
