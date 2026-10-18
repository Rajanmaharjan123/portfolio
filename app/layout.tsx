import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Maharjan Collection — Rajan Maharjan, Senior iOS Developer",
  description:
    "Senior iOS Developer in Kathmandu with 6+ years shipping Swift, SwiftUI and UIKit apps — WebRTC real-time communication, ARKit / RealityKit, LiDAR RoomPlan, ride-sharing and fintech. Available for freelance and full-time.",
  keywords: ["iOS developer", "Swift", "SwiftUI", "UIKit", "WebRTC", "ARKit", "RealityKit", "LiDAR", "RoomPlan", "Flutter", "fintech", "Nepal", "freelance"],
  openGraph: {
    title: "Rajan Maharjan — Senior iOS Developer",
    description: "Swift · SwiftUI · WebRTC · ARKit · RealityKit · LiDAR · Flutter — available for projects.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#120d0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Manrope:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
