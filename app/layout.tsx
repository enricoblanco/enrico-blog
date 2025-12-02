import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "Enrico Cidade Blanco",
  description: "Personal blog by Enrico Cidade Blanco - Software Engineer",
  authors: [{ name: "Enrico Cidade Blanco" }],
  openGraph: {
    title: "Enrico Cidade Blanco",
    description: "Personal blog by Enrico Cidade Blanco - Software Engineer",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: "Enrico Cidade Blanco",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Enrico Cidade Blanco",
    description: "Personal blog by Enrico Cidade Blanco - Software Engineer",
    creator: "@enricocity",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${courierPrime.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
