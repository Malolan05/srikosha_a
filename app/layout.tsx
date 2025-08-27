import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Śrīkoṣa",
  description: "Explore the sacred texts of the Śrī Vaiṣṇava Sampradāya",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <SpeedInsights />
            <Analytics />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

