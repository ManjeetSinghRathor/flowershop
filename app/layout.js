import { Geist, Geist_Mono } from "next/font/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
// import "../styles/animation.css";
import "../styles/theme.css";
// import ReduxProvider from '../store/ReduxProvider.js';
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
  title: "flowershop.com",
  description: "flowershop.com - Your one-stop shop for all flower needs!",
  manifest: "/manifest.json",
  icons: {
    icon: "./logo.png",
    apple: "./logo.png",
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
              padding: "8px 20px",
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

        <p className="font-serif flex flex-wrap w-full justify-center items-center text-center text-xs sm:text-sm px-4 pt-4 pb-2 sm:pb-4">
          *Use Code &quot;Welcome5&quot; to avail 5% discount on a minimum
          purchase of Rs 2,000/-
        </p>
        {/* <ReduxProvider> */}
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <Navbar />
          {children}
        </GoogleOAuthProvider>
        {/* </ReduxProvider> */}

        <Footer />
      </body>
    </html>
  );
}
