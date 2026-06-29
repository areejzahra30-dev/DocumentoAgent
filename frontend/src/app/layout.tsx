import type { Metadata } from "next"
import { Orbitron, Space_Grotesk } from "next/font/google"
import "./globals.css"

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Documento Agent",
  description: "AI-powered README generator and document summarizer",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-float" />
          <div className="absolute top-[30%] right-[-15%] w-[35%] h-[35%] rounded-full bg-pink-600/15 blur-[100px] animate-float-delayed" />
          <div className="absolute bottom-[-15%] left-[20%] w-[45%] h-[45%] rounded-full bg-cyan-600/10 blur-[140px] animate-float-slow" />
          <div className="absolute top-[50%] left-[10%] w-[20%] h-[20%] rounded-full bg-violet-500/10 blur-[80px] animate-float" />
        </div>
        {children}
      </body>
    </html>
  )
}
