import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Taro — Marketing Operating System", description: "One platform for all your digital marketing services." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
