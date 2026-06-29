"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { signInSchema, type SignInValues } from "@/lib/auth-schemas"
import { syncUserToBackend } from "@/lib/user-sync"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  })

  async function onSubmit(data: SignInValues) {
    setLoading(true)
    setError(null)

    const { error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      setError(authError.message || "Invalid email or password")
      setLoading(false)
      return
    }

    await syncUserToBackend()
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive text-center"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="you@example.com"
            className="pl-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300"
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-destructive ml-1">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 h-11 bg-white/5 border-white/10 rounded-xl focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all duration-300"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive ml-1">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:from-purple-500 hover:via-pink-400 hover:to-cyan-400 text-white font-medium transition-all duration-300 hover:shadow-[0_0_25px_oklch(0.65_0.18_280/0.3)] group"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Sign In
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <a
          href="/sign-up"
          className="text-primary hover:text-purple-300 transition-colors font-medium"
        >
          Sign Up
        </a>
      </p>
    </motion.form>
  )
}
