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
    "flowers Bangalore",
    "flower shop",
    "buy flowers online",
    "fresh flowers",
    "roses",
    "flower delivery",
    "gifts",
    "flower bouquet",
    "online flower store",
    "premium flowers",
    "wedding flowers",
    "birthday gifts",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "./favicon.png",
    apple: "./favicon.png",
  },
  openGraph: {
    title: "Bloom's Heaven - Premium Flower Shop in Bangalore",
    description:
      "Discover Bloom's Heaven – luxury flowers, roses, and gifts. Perfect bouquets for weddings, birthdays, and special occasions.",
    url: "https://bloomsheaven.com",
    siteName: "Bloom's Heaven",
    images: [
      {
        url: "./favicon.png",
        width: 800,
        height: 600,
        alt: "Bloom's Heaven Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloom's Heaven - Premium Flower Shop",
    description:
      "Fresh flowers, roses, bouquets, and elegant gifts – Bloom's Heaven, your one-stop flower shop in Bangalore.",
    images: ["./favicon.png"],
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
        <NextTopLoader
          color="#f3002dff"
          initialPosition={0.1}
          crawl={true}
          crawlSpeed={100}
          height={2}
          showSpinner={false}
          easing="cubic-bezier(0.4, 0, 0.2, 1)"
          speed={400}
          shadow="0 0 10px #2299dd,0 0 5px #2299dd"
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

        <p className="font-serif flex flex-col w-full justify-center items-center text-center text-xs sm:text-sm px-4 py-4 pb-3 sm:pb-4">
          <span>
            *Use Code <strong>Welcome5</strong> to avail 5% discount on a
            minimum purchase of Rs 2,000/-
          </span>
          <span className="text-red-600 font-semibold mt-1">
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
