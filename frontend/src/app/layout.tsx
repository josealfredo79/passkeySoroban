import type { Metadata } from "next";
import React from "react";
import VoiceAssistantWidget from "@/components/VoiceAssistantWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soroban Passkey Demo",
  description: "Passwordless authentication with Passkeys on Stellar/Soroban",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
        {/* VoiceAssistant flotante en toda la app */}
        <VoiceAssistantWidget />
      </body>
    </html>
  );
}
