import type { Metadata } from "next";
import localFont from "next/font/local";
import AuthProviderWrapper from "@/components/auth/auth-provider";
import "./globals.css";

const geistSans = localFont({
  src: [
    {
      path: "../public/fonts/Geist-VariableFont_wght.ttf",
    },
    {
      path: "../public/fonts/Geist-Italic-VariableFont_wght.ttf",
      style: "italic",
    },
  ],
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: [
    {
      path: "../public/fonts/GeistMono-VariableFont_wght.woff2",
    },
    {
      path: "../public/fonts/GeistMono-Italic-VariableFont_wght.woff2",
      style: "italic",
    },
  ],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Ticket Manager",
  description: "Sistema de gestion de tickets de soporte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
