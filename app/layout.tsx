import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jimzhou03-pixel-lab.weijiezhou03.chatgpt.site"),
  title: "Jim Zhou — Computational Linguistics & NLP",
  description:
    "A growing portfolio exploring computational linguistics, NLP, retrieval-augmented generation, and knowledge graphs.",
  openGraph: {
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Language, knowledge, and intelligence — projects and notes by Jim Zhou.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Language, knowledge, and intelligence — projects and notes by Jim Zhou.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geistMono.variable}>{children}</body>
    </html>
  );
}
