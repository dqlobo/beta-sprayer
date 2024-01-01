import { Card } from "flowbite-react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "./navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Beta Sprayer",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navigation />
        <div className="flex flex-grow items-center justify-center">
          <div className="w-2/4">
            <Card>{children}</Card>
          </div>
        </div>
      </body>
    </html>
  )
}
