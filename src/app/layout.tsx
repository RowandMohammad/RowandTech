import "./globals.css";
import { Inter, Merriweather } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SupabaseAuthProvider } from "@/lib/contexts/SupabaseAuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-merriweather",
});

export const metadata = {
  title: "RowandTech - Cutting-edge Tech Insights",
  description:
    "In-depth AI & Data Engineering guides for real-world solutions by Rowand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-900">
        <SupabaseAuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
