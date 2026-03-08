import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/navbar";
import { AuthProvider } from "./components/AuthProvider";
import { RenderNavbar } from "./components/renderNavbar";
import { SocketManager } from "./components/socketManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ttrpg simulator",
  description: "kompjuterska pismenost skill ckeck",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SocketManager>
            <RenderNavbar />
            {children}
          </SocketManager>
        </AuthProvider>
      </body>
    </html>
  );
}
