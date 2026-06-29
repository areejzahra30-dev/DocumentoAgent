"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  FolderKanban,
  FileText,
  Trash2,
  Loader2,
  AlertCircle,
  Bot,
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import { FileUpload } from "@/components/upload/file-upload"
import { AgentChat } from "@/components/agent/agent-chat"

type Project = {
  id: string
  name: string
  description: string | null
  file_count: number
  created_at: string
}

type ProjectFile = {
  id: string
  filename: string
  file_type: string
  file_size: number
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [files, setFiles] = useState<ProjectFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFiles, setShowFiles] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [proj, fileList] = await Promise.all([
        apiFetch<Project>(`/api/v1/projects/${projectId}`),
        apiFetch<ProjectFile[]>(`/api/v1/projects/${projectId}/files`),
      ])
      setProject(proj)
      setFiles(fileList)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleDeleteFile(fileId: string) {
    try {
      await apiFetch(`/api/v1/projects/${projectId}/files/${fileId}`, {
        method: "DELETE",
      })
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      setConfirmDelete(null)
    } catch (err: any) {
      console.error("Delete failed:", err)
    }
  }

  async function handleDeleteProject() {
    if (!confirm("Delete this project and all its files?")) return
    try {
      await apiFetch(`/api/v1/projects/${projectId}`, { method: "DELETE" })
      router.push("/dashboard/projects")
    } catch (err: any) {
      console.error("Delete project failed:", err)
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto text-center py-24">
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-destructive" />
        <p className="text-sm text-muted-foreground">{error || "Project not found"}</p>
        <button
          onClick={() => router.push("/dashboard/projects")}
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 px-5 text-sm font-medium text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard/projects")}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-heading font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {project.description}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDeleteProject}
          className="w-9 h-9 rounded-xl hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-all"
          title="Delete project"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4" style={{ minHeight: "calc(100vh - 200px)" }}>
        <div className="lg:col-span-2 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FileUpload projectId={projectId} onUploaded={fetchData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setShowFiles(!showFiles)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-medium">
                  Files ({files.length})
                </span>
              </div>
              <motion.span
                animate={{ rotate: showFiles ? 180 : 0 }}
                className="text-[10px] text-muted-foreground"
              >
                ▼
              </motion.span>
            </button>

            {showFiles && (
              <div className="border-t border-white/5">
                {files.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center px-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-2">
                      <FolderKanban className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      No files uploaded yet.
                    </p>
                    <p className="text-[10px] text-muted-foreground/40 mt-1">
                      Drag & drop files above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between px-3.5 py-2.5 group hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs truncate">{file.filename}</p>
                            <p className="text-[10px] text-muted-foreground/40">
                              {file.file_type} · {formatSize(file.file_size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          {confirmDelete === file.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="text-[10px] text-destructive hover:text-destructive/80 px-1.5 py-0.5 rounded"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(file.id)}
                              className="w-6 h-6 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass rounded-2xl p-4 flex flex-col"
          style={{ minHeight: "500px" }}
        >
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-medium">Agent</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <AgentChat
              projectId={projectId}
              projectName={project.name}
              hasFiles={files.length > 0}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
