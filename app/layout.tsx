import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YOUR_NAME — AI Builder",
  description: "探索 RAG、知识图谱与智能系统的个人作品集。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={geistMono.variable}>{children}</body>
    </html>
  );
}
