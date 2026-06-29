"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  FileCode,
  FileImage,
  FileSpreadsheet,
  File,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

type UploadingFile = {
  id: string
  name: string
  progress: number
  status: "uploading" | "done" | "error"
  error?: string
}

type Props = {
  projectId: string
  onUploaded: () => void
}

const ACCEPTED_TYPES = [
  ".pdf", ".docx", ".txt", ".md", ".csv", ".xlsx", ".pptx", ".json",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp",
  ".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".cpp", ".c", ".h",
  ".rb", ".go", ".rs", ".swift", ".kt", ".php", ".css", ".html",
  ".yaml", ".yml", ".toml", ".xml",
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext || ""))
    return <FileImage className="w-4 h-4 text-cyan-400" />
  if (["csv", "xlsx"].includes(ext || ""))
    return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
  if (["py", "js", "ts", "jsx", "tsx", "java", "cpp", "c", "h", "go", "rs"].includes(ext || ""))
    return <FileCode className="w-4 h-4 text-purple-400" />
  if (["pdf", "docx", "txt", "md"].includes(ext || ""))
    return <FileText className="w-4 h-4 text-pink-400" />
  return <File className="w-4 h-4 text-muted-foreground" />
}

async function getToken(): Promise<string | null> {
  try {
    const { authClient } = await import("@/lib/auth-client")
    const session = await authClient.getSession()
    return session?.data?.session?.token ?? null
  } catch {
    return null
  }
}

export function FileUpload({ projectId, onUploaded }: Props) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useCallback(async (file: File) => {
    const id = Math.random().toString(36).slice(2)
    const entry: UploadingFile = { id, name: file.name, progress: 0, status: "uploading" }
    setUploading((prev) => [...prev, entry])

    try {
      const token = await getToken()
      if (!token) throw new Error("Not authenticated")

      const form = new FormData()
      form.append("file", file)

      const xhr = new XMLHttpRequest()
      xhr.open("POST", `${API_URL}/api/v1/projects/${projectId}/files/upload`)

      xhr.setRequestHeader("Authorization", `Bearer ${token}`)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100)
          setUploading((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: pct } : u)),
          )
        }
      }

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            try {
              const body = JSON.parse(xhr.responseText)
              reject(new Error(body.detail || `Upload failed: ${xhr.status}`))
            } catch {
              reject(new Error(`Upload failed: ${xhr.status}`))
            }
          }
        }
        xhr.onerror = () => reject(new Error("Network error"))
        xhr.send(form)
      })

      setUploading((prev) =>
        prev.map((u) => (u.id === id ? { ...u, progress: 100, status: "done" } : u)),
      )
      onUploaded()
    } catch (err: any) {
      setUploading((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: "error", error: err.message } : u,
        ),
      )
    }
  }, [projectId, onUploaded])

  function handleFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      uploadFile(file)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
  }

  function dismissFile(id: string) {
    setUploading((prev) => prev.filter((u) => u.id !== id))
  }

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 ${
          dragging
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drop files here or click to browse
        </p>
        <p className="text-[11px] text-muted-foreground/40 mt-1">
          PDF, DOCX, TXT, MD, CSV, XLSX, PPTX, images, code
        </p>
      </div>

      <AnimatePresence>
        {uploading.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2 overflow-hidden"
          >
            {uploading.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="glass rounded-xl p-3"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                          className={`h-full rounded-full ${
                            file.status === "error"
                              ? "bg-destructive"
                              : file.status === "done"
                                ? "bg-emerald-500"
                                : "bg-gradient-to-r from-purple-500 to-cyan-500"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 w-8 text-right">
                        {file.progress}%
                      </span>
                    </div>
                    {file.error && (
                      <p className="text-[10px] text-destructive mt-1">{file.error}</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {file.status === "uploading" && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                    {file.status === "done" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {file.status === "error" && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  {file.status !== "uploading" && (
                    <button
                      onClick={() => dismissFile(file.id)}
                      className="w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
