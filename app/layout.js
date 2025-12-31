import { Geist, Geist_Mono } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
// import "../styles/animation.css";
import "../styles/theme.css";
import ReduxProvider from "./store/ReduxProvider";
import Navbar from "../components/navbar.jsx";
import NextTopLoader from "nextjs-toploader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bloom's Heaven - Premium Flower Shop in Bangalore",
  description:
    "Bloom's Heaven is your premium online and offline flower shop in Bangalore. Fresh flowers, roses, bouquets, and elegant gifts for every occasion. Order now and spread happiness!",
  keywords: [
    "Bloom's Heaven",
    "flower shop Bangalore",
    "buy flowers online",
    "fresh flowers",
    "roses",
    "flower delivery",
    "gifts",
    "flower bouquet",
    "wedding flowers",
    "birthday gifts",
    "online flower store",
    "premium flowers",
    "luxury bouquets"
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  manifest: "/manifest.json",
  openGraph: {
    title: "Bloom's Heaven - Premium Flower Shop in Bangalore",
    description:
      "Discover Bloom's Heaven – luxury flowers, bouquets, and gifts. Perfect for weddings, birthdays, and special occasions.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Bloom's Heaven",
    images: [
      {
        url: "/favicon-512.png",
        width: 512,
        height: 512,
        alt: "Bloom's Heaven Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-9565136805142676" />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SpeedInsights/>
        
        <NextTopLoader
          color="#f3002dff"
          initialPosition={0.1}
          crawl={true}
          crawlSpeed={100}
          height={4}
          showSpinner={false}
          easing="cubic-bezier(0.4, 0, 0.2, 1)"
          speed={400}
          shadow="0 0 10px #f3002dff,0 0 5px #f04949ff"
        />

        <Toaster
          position="top-center"
          toastOptions={{
            // Default style for all toasts
            style: {
              background: "#1E293B", // Tailwind's slate-800
              color: "#fff",
              border: "1px solid #334155", // slate-700
              borderRadius: "10px",
              padding: "4px 20px",
            },

            // Success toast styles
            success: {
              iconTheme: {
                primary: "#22c55e", // green-500
                secondary: "#1E293B",
              },
            },

            // Error toast styles
            error: {
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#1E293B",
              },
            },
            
          }}
        />

        <p className="font-serif flex flex-col w-full justify-center items-center text-center text-xs sm:text-sm px-4 py-3">
          {/* <span>
            *Use Code <strong>Welcome5</strong> to avail 5% discount on a
            minimum purchase of Rs 2,000/-
          </span> */}
          <span className="text-red-600 font-semibold">
            🚚 We currently deliver only across Bangalore 🌸
          </span>
        </p>

        <ReduxProvider>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <Navbar />
          {children}
        </GoogleOAuthProvider>
        </ReduxProvider>

        <Footer />
      </body>
    </html>
  );
}
