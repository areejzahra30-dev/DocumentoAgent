"use client"

import { motion } from "framer-motion"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="glass rounded-3xl p-8 glow">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold gradient-text mb-1">
              Documento
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-Powered Document Intelligence
            </p>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
