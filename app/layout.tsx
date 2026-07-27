import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jimzhou03-pixel-lab.weijiezhou03.chatgpt.site"),
  title: {
    default: "Jim Zhou — Computational Linguistics & NLP",
    template: "%s · Jim Zhou",
  },
  description:
    "A digital garden for computational linguistics, NLP, retrieval-augmented generation, knowledge graphs, and a master's journey in Germany.",
  openGraph: {
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Projects, notes, and a growing computational linguistics journey by Jim Zhou.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Projects, notes, and a growing computational linguistics journey by Jim Zhou.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
