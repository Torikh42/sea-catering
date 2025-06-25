// RootLayout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "../styles/globals.css";
import Header from "@/components/Header";
import { getUser } from "@/auth/server"; // This is likely an async function

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SEA",
};

// Make the RootLayout function async
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Await the getUser() call to get the resolved user object
  const user = await getUser();
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header user={user} /> {/* Now 'user' will be the resolved User object or null */}
        {children}
        <Toaster />
      </body>
    </html>
  );
}