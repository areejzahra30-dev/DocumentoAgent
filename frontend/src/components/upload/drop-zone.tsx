"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  File,
  X,
  CheckCircle2,
  FileText,
  Image,
  Code,
  Table,
  Presentation,
  FileJson,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "uploading" | "done" | "error"
}

const fileIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  docx: FileText,
  txt: FileText,
  md: FileText,
  jpg: Image,
  jpeg: Image,
  png: Image,
  gif: Image,
  webp: Image,
  csv: Table,
  xlsx: Table,
  pptx: Presentation,
  json: FileJson,
  js: Code,
  ts: Code,
  py: Code,
  java: Code,
  cpp: Code,
  rs: Code,
  go: Code,
}

function getFileIcon(ext: string) {
  const Icon = fileIcons[ext] || File
  return Icon
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED_TYPES = [
  ".pdf", ".docx", ".txt", ".md",
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
  ".csv", ".xlsx", ".pptx",
  ".json", ".xml", ".yaml", ".yml", ".toml",
  ".js", ".ts", ".py", ".java", ".cpp", ".c", ".h", ".rs", ".go", ".rb",
  ".php", ".swift", ".kt", ".html", ".css", ".scss", ".less",
]

export function DropZone() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    setDragError(null)
    const newFiles: UploadedFile[] = []
    const existingNames = new Set(files.map((f) => f.name))

    for (const file of Array.from(incoming)) {
      if (existingNames.has(file.name)) continue

      const ext = file.name.split(".").pop()?.toLowerCase() || ""
      if (!ACCEPTED_TYPES.includes(`.${ext}`)) {
        setDragError(`Unsupported file type: .${ext}`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setDragError(`${file.name} exceeds the 10 MB limit`)
        continue
      }

      newFiles.push({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type: ext,
        progress: 0,
        status: "uploading",
      })
    }

    if (newFiles.length === 0) return

    setFiles((prev) => [...prev, ...newFiles])

    newFiles.forEach((f) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 5
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setFiles((prev) =>
            prev.map((pf) =>
              pf.id === f.id ? { ...pf, progress: 100, status: "done" } : pf
            )
          )
        } else {
          setFiles((prev) =>
            prev.map((pf) =>
              pf.id === f.id ? { ...pf, progress: Math.min(progress, 99) } : pf
            )
          )
        }
      }, 200)
    })
  }, [files])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files)
      }
    },
    [addFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className="space-y-4">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-purple-500 bg-purple-500/10 scale-[1.02]"
            : "border-white/10 hover:border-purple-500/50 hover:bg-white/[0.02]"
        }`}
        onClick={() => inputRef.current?.click()}
        whileHover={{ scale: 1.005 }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />

        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-cyan-500/20 pointer-events-none"
          />
        )}

        <motion.div
          animate={isDragging ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
          className="relative z-10"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">
            {isDragging ? "Drop your files here" : "Upload your files"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto leading-relaxed">
            Drag & drop your project files, source code, documents, or images.
            <br />
            <span className="text-xs opacity-60">
              PDF, DOCX, TXT, MD, CSV, XLSX, PPTX, Images, Source Code & more
            </span>
          </p>
          <span className="inline-flex h-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/15 px-5 text-sm font-medium transition-all duration-200">
            Browse Files
          </span>
          <p className="text-xs text-muted-foreground/50 mt-3">
            Max 10 MB per file
          </p>
        </motion.div>
      </motion.div>

      {dragError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center"
        >
          {dragError}
        </motion.div>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {files.map((file) => {
                const Icon = getFileIcon(file.type)
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    className="glass rounded-xl p-3 flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className={`h-full rounded-full transition-colors duration-300 ${
                              file.status === "done"
                                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                                : "bg-gradient-to-r from-purple-500 to-cyan-500"
                            }`}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {file.status === "done"
                            ? formatSize(file.size)
                            : `${Math.round(file.progress)}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {file.status === "done" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <span className="w-4 h-4 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(file.id)
                        }}
                        className="p-1 rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
