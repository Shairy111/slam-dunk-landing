import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const anton = Anton({ 
  weight: "400", 
  subsets: ["latin"],
  variable: "--font-anton" 
});

export const metadata: Metadata = {
  title: "Aero Dunk | Next-Gen Basketballs",
  description: "Experience the future of basketball with Aero Dunk's micro-texture technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
