import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./language-constellation.css";
import "./orbital-archive.css";

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
    default: "Weijie Zhou — NLP & Large Language Models",
    template: "%s · Weijie Zhou",
  },
  description:
    "Weijie Zhou's portfolio — NLP, large language models, retrieval-augmented generation, knowledge graphs, and model adaptation.",
  openGraph: {
    title: "Weijie Zhou — NLP & Large Language Models",
    description:
      "From language data to grounded systems — an NLP and LLM portfolio by Weijie Zhou.",
    type: "website",
    images: [
      {
        url: "https://jimzhou03.github.io/og-v2.png",
        width: 1733,
        height: 907,
        alt: "Weijie Zhou — NLP and Large Language Models",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weijie Zhou — NLP & Large Language Models",
    description:
      "From language data to grounded systems — an NLP and LLM portfolio by Weijie Zhou.",
    images: ["https://jimzhou03.github.io/og-v2.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
