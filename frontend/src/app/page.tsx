"use client"

import { motion } from "framer-motion"
import { FileText, Sparkles, Upload, Zap } from "lucide-react"

const features = [
  {
    icon: Upload,
    title: "Smart Upload",
    desc: "Drag & drop any project file — code, docs, images, and more.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "AI-Powered",
    desc: "Gemini 2.5 Flash analyzes your content through a multi-stage pipeline.",
    gradient: "from-pink-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "README Generator",
    desc: "Generate professional GitHub README files in seconds.",
    gradient: "from-cyan-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Smart Summaries",
    desc: "Get structured summaries of any uploaded material.",
    gradient: "from-purple-500 to-cyan-500",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center relative overflow-hidden">
      <main className="flex flex-1 w-full max-w-5xl flex-col items-center justify-center py-20 px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-glow" />
            Powered by Gemini 2.5 Flash
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">Documento</span>{" "}
          <span className="text-foreground">Agent</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl leading-relaxed"
        >
          Upload your projects and documents. Our AI analyzes, structures, and
          generates professional README files or intelligent summaries.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex gap-4 mb-20"
        >
          <a
            href="/sign-up"
            className="group relative inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium bg-primary text-primary-foreground overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_oklch(0.65_0.18_280/0.4)]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">Get Started Free</span>
          </a>
          <a
            href="/sign-in"
            className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium glass glass-hover"
          >
            Sign In
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-5 glass-hover group cursor-default"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-heading text-sm font-semibold mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
