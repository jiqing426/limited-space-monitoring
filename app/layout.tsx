import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "有限空间气体监测系统",
  description: "有限空间气体监测系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
