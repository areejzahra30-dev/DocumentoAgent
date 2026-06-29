"use client"

import { motion } from "framer-motion"
import { FolderKanban, FileText, Upload, Sparkles } from "lucide-react"

const stats = [
  {
    label: "Active Projects",
    value: "0",
    icon: FolderKanban,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    label: "Generations",
    value: "0",
    icon: Sparkles,
    gradient: "from-pink-500 to-cyan-500",
  },
  {
    label: "Files Uploaded",
    value: "0",
    icon: Upload,
    gradient: "from-cyan-500 to-purple-500",
  },
]

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-heading font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back — here is your overview.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-5 glass-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-purple-400" />
          <h2 className="font-heading text-sm font-semibold">
            Recent Activity
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-sm text-muted-foreground">
            No activity yet. Start by creating a project and uploading files.
          </p>
          <a
            href="/dashboard/projects"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 text-sm font-medium text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300"
          >
            Create Project
          </a>
        </div>
      </motion.div>
    </div>
  )
}
