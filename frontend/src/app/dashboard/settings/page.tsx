"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, User, Mail, Bell, Shield, Save } from "lucide-react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-heading font-bold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold">Profile</h2>
              <p className="text-xs text-muted-foreground">
                Update your personal information.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5 block">
                Name
              </label>
              <input
                defaultValue=""
                placeholder="Your name"
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5 block">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  Email
                </div>
              </label>
              <input
                defaultValue=""
                placeholder="you@example.com"
                type="email"
                className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-cyan-500 flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold">
                Notifications
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure how you receive updates.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Email notifications for completed generations",
              "Weekly summary of your activity",
              "Product updates and new features",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500 transition-colors duration-300" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white peer-checked:translate-x-4 transition-transform duration-300" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold">Privacy</h2>
              <p className="text-xs text-muted-foreground">
                Data handling and privacy preferences.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              "Store uploaded files for future use",
              "Include project data in anonymous usage analytics",
            ].map((label) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 rounded-full bg-white/10 peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-cyan-500 transition-colors duration-300" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white peer-checked:translate-x-4 transition-transform duration-300" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex justify-end"
        >
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 text-sm font-medium text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </motion.div>
      </form>
    </div>
  )
}
