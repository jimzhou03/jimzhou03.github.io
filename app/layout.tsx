import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./language-constellation.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jimzhou03.github.io"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Jim Zhou — Computational Linguistics & NLP",
    template: "%s · Jim Zhou",
  },
  description:
    "Jim Zhou's portfolio — computational linguistics, NLP, retrieval, knowledge graphs, and a new chapter in Germany.",
  openGraph: {
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Language, retrieval and knowledge — a computational linguistics portfolio by Jim Zhou.",
    type: "website",
    images: [
      {
        url: "https://jimzhou03.github.io/og.png",
        width: 1660,
        height: 947,
        alt: "Jim Zhou — Computational Linguistics and NLP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jim Zhou — Computational Linguistics & NLP",
    description:
      "Language, retrieval and knowledge — a computational linguistics portfolio by Jim Zhou.",
    images: ["https://jimzhou03.github.io/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
