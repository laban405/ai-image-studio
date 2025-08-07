import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500",  "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: "Mikrosell Image Studio",
  description: "AI-powered image generator and editor",
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
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#B17E64" },
      }}
    >
      <html lang="en" suppressHydrationWarning className={ubuntu.className}>
        <body >
          <ThemeProvider
            attribute="class"
            // defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            defaultTheme="light"
             forcedTheme="light" 
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
