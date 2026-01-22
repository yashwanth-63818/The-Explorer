import { Playfair_Display, Inter, Libre_Baskerville } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-baskerville",
  display: "swap",
});

export const metadata = {
  title: "The Explorer | Travel Magazine",
  description: "A travel blog inspired by Bucketlistly, featuring immersive stories and guides.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${baskerville.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen relative">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
