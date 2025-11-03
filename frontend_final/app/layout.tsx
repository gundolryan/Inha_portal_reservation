// 🎯 app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// ReservationProvider와 AuthProvider를 불러옵니다.
import { ReservationProvider } from "@/contexts/ReservationContext"; 
import { AuthProvider } from "@/contexts/AuthContext"; // 👈 [NEW] AuthProvider import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "학교 시설 예약 시스템",
  description: "인하대학교 온라인 시설예약 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 1. AuthProvider가 가장 바깥쪽에서 로그인 상태를 관리합니다. */}
        <AuthProvider> 
          {/* 2. ReservationProvider가 안쪽에서 예약 데이터를 관리합니다. */}
          <ReservationProvider>
            {children} {/* app/page.tsx (AppRouter)가 여기에 렌더링됩니다. */}
          </ReservationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}