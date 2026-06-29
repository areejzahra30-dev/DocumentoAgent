"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  History,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react"

type Generation = {
  id: string
  project: string
  type: string
  status: "completed" | "failed" | "in_progress"
  createdAt: string
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    label: "Failed",
  },
  in_progress: {
    icon: Loader2,
    color: "text-amber-400",
    label: "In Progress",
  },
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function HistoryPage() {
  const [generations] = useState<Generation[]>([])

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-heading font-bold mb-1">History</h1>
        <p className="text-sm text-muted-foreground">
          View your past document generations.
        </p>
      </motion.div>

      {generations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <History className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              No generation history yet.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Your generated documents will appear here.
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {generations.map((gen) => {
            const StatusIcon = statusConfig[gen.status].icon
            const isActive = gen.status === "in_progress"

            return (
              <motion.div
                key={gen.id}
                variants={item}
                className={`glass rounded-2xl p-4 glass-hover group ${
                  isActive ? "ring-1 ring-amber-500/20" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center shrink-0`}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-semibold mb-0.5">
                        {gen.project}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground/60">
                          {gen.type}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground/60">
                          <Clock className="w-3 h-3" />
                          {gen.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`flex items-center gap-1.5 text-xs font-medium ${statusConfig[gen.status].color}`}
                  >
                    <StatusIcon
                      className={`w-3.5 h-3.5 ${isActive ? "animate-spin" : ""}`}
                    />
                    {statusConfig[gen.status].label}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
