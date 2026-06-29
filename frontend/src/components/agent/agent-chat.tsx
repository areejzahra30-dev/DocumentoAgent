"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Check,
  Download,
} from "lucide-react"
import { apiFetch } from "@/lib/api"

type Message = {
  id: string
  role: "user" | "agent"
  text: string
  timestamp: Date
}

type Generation = {
  id: string
  project_id: string
  type: string
  status: string
  output_content: string | null
  error_message: string | null
  created_at: string
  completed_at: string | null
}

type Props = {
  projectId: string
  projectName: string
  hasFiles: boolean
}

async function createGeneration(
  projectId: string,
  type: string,
): Promise<Generation> {
  return apiFetch<Generation>(`/api/v1/projects/${projectId}/generations`, {
    method: "POST",
    body: JSON.stringify({ type }),
  })
}

async function pollGeneration(id: string): Promise<Generation> {
  return apiFetch<Generation>(`/api/v1/generations/${id}`)
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export function AgentChat({ projectId, projectName, hasFiles }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "agent",
      text: `👋 Welcome to **${projectName}**!\n\nUpload files to your project, then I can help you generate a **README** or **summary** of your content.`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [running, setRunning] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const addMessage = useCallback(
    (role: "user" | "agent", text: string) => {
      const msg: Message = {
        id: Math.random().toString(36).slice(2),
        role,
        text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, msg])
      return msg
    },
    [],
  )

  async function runGeneration(type: "readme" | "summary") {
    if (running) return
    setRunning(type)

    const label = type === "readme" ? "README" : "Summary"
    addMessage("agent", `🧠 Generating **${label}**... This may take a moment.`)

    try {
      const gen = await createGeneration(projectId, type)

      let current = gen
      while (current.status === "processing") {
        await sleep(2000)
        current = await pollGeneration(current.id)
      }

      setMessages((prev) => prev.slice(0, -1))

      if (current.status === "completed" && current.output_content) {
        addMessage("agent", `✅ **${label} generated successfully!**\n\n\`\`\`markdown\n${current.output_content}\n\`\`\``)
      } else {
        addMessage(
          "agent",
          `❌ **${label} generation failed.**\n\n${current.error_message || "Unknown error"}`,
        )
      }
    } catch (err: any) {
      setMessages((prev) => prev.slice(0, -1))
      addMessage("agent", `❌ **Error:** ${err.message}`)
    } finally {
      setRunning(null)
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || running) return
    setInput("")

    addMessage("user", text)
    addMessage("agent", "🤔 Thinking...")

    const lower = text.toLowerCase()

    if (lower.includes("readme")) {
      setRunning("readme")
      setMessages((prev) => prev.slice(0, -1))
      await runGeneration("readme")
    } else if (lower.includes("summar")) {
      setRunning("summary")
      setMessages((prev) => prev.slice(0, -1))
      await runGeneration("summary")
    } else {
      setTimeout(() => {
        setMessages((prev) => prev.slice(0, -1))
        if (!hasFiles) {
          addMessage(
            "agent",
            "📂 **No files uploaded yet.** Please upload some files first, then ask me to generate a README or summary.",
          )
        } else {
          addMessage(
            "agent",
            "💡 I can help you with:\n\n" +
              "• **Generate a README** — Click the button or type *\"generate readme\"*\n" +
              "• **Generate a Summary** — Click the button or type *\"generate summary\"*\n\n" +
              "What would you like to do?",
          )
        }
      }, 800)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function copyOutput(text: string, id: string) {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function extractCode(text: string): string | null {
    const match = text.match(/```markdown\n([\s\S]*?)```/)
    return match ? match[1].trim() : null
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
            >
              {msg.role === "agent" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-purple-600/30 to-pink-500/30 border border-purple-500/20"
                    : "glass"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="text-sm whitespace-pre-wrap leading-relaxed prose prose-invert max-w-none">
                    <FormattedMessage text={msg.text} />
                    {extractCode(msg.text) && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() =>
                            copyOutput(extractCode(msg.text)!, msg.id)
                          }
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          {copiedId === msg.id ? "Copied!" : "Copy"}
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([extractCode(msg.text)!], {
                              type: "text/markdown",
                            })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}-readme.md`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3 shrink-0">
        <button
          onClick={() => runGeneration("readme")}
          disabled={!!running}
          className={`flex-1 h-9 rounded-xl text-[11px] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
            running === "readme"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white animate-pulse"
              : "border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {running === "readme" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <FileText className="w-3 h-3" />
          )}
          {running === "readme" ? "Generating..." : "README"}
        </button>
        <button
          onClick={() => runGeneration("summary")}
          disabled={!!running}
          className={`flex-1 h-9 rounded-xl text-[11px] font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
            running === "summary"
              ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white animate-pulse"
              : "border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {running === "summary" ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          {running === "summary" ? "Generating..." : "Summary"}
        </button>
      </div>

      <div className="flex items-end gap-2 mt-2 shrink-0">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to generate a README or summary..."
            rows={1}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all duration-300 resize-none"
            style={{ minHeight: 40, maxHeight: 120 }}
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = "auto"
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`
            }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || !!running}
          className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function FormattedMessage({ text }: { text: string }) {
  const parts = text.split(/(```markdown\n[\s\S]*?```)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```markdown")) {
          const code = part.replace(/```markdown\n?/, "").replace(/```$/, "").trim()
          return (
            <pre key={i} className="mt-2 p-3 rounded-xl bg-black/40 border border-white/5 overflow-x-auto text-xs leading-relaxed">
              <code>{code}</code>
            </pre>
          )
        }
        return <span key={i}>{renderInline(part)}</span>
      })}
    </>
  )
}

function renderInline(text: string) {
  const lines = text.split("\n")
  return lines.map((line, i) => {
    if (line.startsWith("•") || line.startsWith("-")) {
      return (
        <span key={i} className="block ml-2">
          {line}
          <br />
        </span>
      )
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground">
          {line.slice(2, -2)}
          <br />
        </strong>
      )
    }
    const rendered = line
      .split(/(\*\*[^*]+\*\*)/g)
      .map((seg, j) =>
        seg.startsWith("**") && seg.endsWith("**") ? (
          <strong key={j} className="text-foreground">{seg.slice(2, -2)}</strong>
        ) : (
          <span key={j}>{seg}</span>
        ),
      )
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    )
  })
}
