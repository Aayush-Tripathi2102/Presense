import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Velora — Growth Operating System",
  description: "AI-powered digital growth OS: SEO, content, social, paid, reputation, analytics in one profile."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 text-zinc-950 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
