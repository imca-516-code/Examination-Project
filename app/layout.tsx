import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { ExamStoreProvider } from "@/lib/exam-store"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "ExamPortal - Smart Online Examination System",
  description:
    "A comprehensive online examination management system with automated evaluation, proctoring, and analytics.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ExamStoreProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ExamStoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
