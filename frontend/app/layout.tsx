import { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARP MOTORS | Premium Rentals",
  description: "Modern vehicle rental ecosystem",
  manifest: "/manifest.json",
};

// This prevents the "zoom-on-tap" effect on mobile inputs
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Utilizes the full screen on notched iPhones
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="antialiased">
        {children}
      </body>
    </html>
  );
}