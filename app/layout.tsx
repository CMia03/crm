import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const roboto = localFont({
  src: [
    {
      path: "../fonts/Roboto/static/Roboto-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Roboto/static/Roboto-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../fonts/Roboto/static/Roboto-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HR Manager - Gestion des Ressources Humaines",
  description: "Système de gestion des ressources humaines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-green-50/50">
          <Sidebar />
          <main className="flex-1 lg:ml-64 p-6 lg:p-8 min-h-screen">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
