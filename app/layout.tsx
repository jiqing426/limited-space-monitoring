import type { Metadata } from "next";
import Link from "next/link";
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
          <Link 
            href="/demo1" 
            style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.7)',
              color: '#4ecdc4',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }}
          >
            Demo1监测
          </Link>
          <Link 
            href="/demo2" 
            style={{
              padding: '8px 16px',
              background: 'rgba(0,0,0,0.7)',
              color: '#4ecdc4',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              border: '1px solid rgba(78, 205, 196, 0.3)'
            }}
          >
            Demo2监测
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
