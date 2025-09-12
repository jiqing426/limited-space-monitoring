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
        {/* 导航栏 */}
        <nav style={{
          position: 'fixed',
          top: 18,
          left: 200,
          zIndex: 9999,
          display: 'flex',
          gap: '10px'
        }}>
        </nav>
        {children}
      </body>
    </html>
  );
}
