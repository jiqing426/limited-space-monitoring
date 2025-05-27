import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3D Model Viewer - MX1",
  description: "Interactive 3D model viewer for MX1.glb",
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
