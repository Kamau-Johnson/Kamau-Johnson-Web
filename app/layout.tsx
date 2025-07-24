import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kamau Johnson - Software Developer | Data Scientist",
  description:
    "I build intelligent, scalable software solutions using Python and data. Full Stack Developer and Data Scientist specializing in modern web technologies and machine learning.",
  keywords: [
    "Software Developer",
    "Data Scientist",
    "Python",
    "React",
    "Next.js",
    "Machine Learning",
    "Full Stack Developer",
    "Kenya",
    "Nairobi",
    "Web Development",
    "Data Analysis",
  ],
  authors: [{ name: "Kamau Johnson", url: "https://kamaujohnson.dev" }],
  creator: "Kamau Johnson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kamaujohnson.dev",
    title: "Kamau Johnson - Software Developer | Data Scientist",
    description:
      "I build intelligent, scalable software solutions using Python and data. Professional portfolio showcasing projects in web development and data science.",
    siteName: "Kamau Johnson Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamau Johnson - Software Developer | Data Scientist",
    description:
      "I build intelligent, scalable software solutions using Python and data. Check out my portfolio!",
    creator: "@kamaujohnson", // Update with your real Twitter handle if available
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
