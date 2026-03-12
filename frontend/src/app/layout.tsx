import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/config/branding";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} – ${BRAND.tagline}`,
  description: BRAND.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-app text-foreground antialiased">
        <ThemeProvider>
          <div className="bg-gradient-radial from-surface/60 via-app to-app dark:from-surface-dark/60 dark:via-background-dark/95 dark:to-background-dark min-h-screen">
            <div className="noise-overlay pointer-events-none" />
            <AuthProvider>
              {children}
            </AuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
