import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clinic Management System",
  description: "Manage your clinic's patients and appointments efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
