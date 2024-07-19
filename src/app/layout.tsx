import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | bugbook",
    default: "bugbook",
  },
  description: "The social media app for powernerds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}


//* Dynamic Page Titles
/**
 * The template string "%s | bugbook" provides a structured format for generating the <title> tag of your web pages dynamically.
 * %s acts as a placeholder that can be replaced with actual content specific to each page.
 * The default property ("bugbook") provides a fallback title in case the dynamic content for %s is not provided or available. This ensures that every page has a consistent base title if no specific title is defined.
 * 
 */