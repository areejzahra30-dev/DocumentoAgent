"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  FolderKanban,
  Plus,
  FileText,
  Trash2,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react"
import { apiFetch, getToken } from "@/lib/api"

type Project = {
  id: string
  name: string
  description: string | null
  file_count: number
  updated_at: string
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchProjects = useCallback(async () => {
    try {
      const token = await getToken()
      if (!token) { setLoading(false); return }
      const data = await apiFetch<Project[]>("/api/v1/projects")
      setProjects(data)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  function handleCreated(project: Project) {
    setProjects((prev) => [project, ...prev])
    setShowModal(false)
    router.push(`/dashboard/projects/${project.id}`)
  }

  async function handleDelete(e: React.MouseEvent, projectId: string) {
    e.stopPropagation()
    if (!confirm("Delete this project and all its files?")) return
    try {
      await apiFetch(`/api/v1/projects/${projectId}`, { method: "DELETE" })
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
    } catch {
      // silently fail
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-heading font-bold mb-1">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your document generation projects.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 text-sm font-medium text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4">
              <FolderKanban className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              No projects yet.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-6">
              Create your first project to start generating documents.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 text-sm font-medium text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-3"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={item}
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
              className="glass rounded-2xl p-5 glass-hover group cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-sm font-semibold mb-0.5">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {project.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        {project.file_count} files
                      </span>
                      <span className="text-[11px] text-muted-foreground/60">
                        {new Date(project.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/projects/${project.id}`)
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, project.id)}
                    className="w-8 h-8 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <CreateProjectModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}

function CreateProjectModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated: (project: Project) => void
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError("Project name is required.")
      return
    }

    setSubmitting(true)

    try {
      const project = await apiFetch<Project>("/api/v1/projects", {
        method: "POST",
        body: JSON.stringify({
          name: trimmedName,
          description: description.trim() || null,
        }),
      })
      onCreated(project)
      setName("")
      setDescription("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md glass rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FolderKanban className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="font-heading text-sm font-semibold">
                    Create Project
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5 block">
                    Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="My Project"
                    autoFocus
                    className="w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase mb-1.5 block">
                    Description <span className="text-muted-foreground/40">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your project..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-11 rounded-xl border border-white/10 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-sm font-medium text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
