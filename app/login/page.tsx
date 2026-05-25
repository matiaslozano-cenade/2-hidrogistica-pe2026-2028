'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07101f]">
      {/* Fondo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#f4b41a]/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#1a2c4a]/40 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md px-6">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/80 backdrop-blur-sm p-10 shadow-2xl shadow-[#f4b41a]/10">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-full max-w-[240px] mb-6 rounded-xl bg-white p-5 shadow-lg shadow-[#f4b41a]/20 ring-1 ring-white/10">
              <Image
                src="/hidrogistica-logo.png"
                alt="Hidrogistica"
                width={480}
                height={240}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f4b41a]">
              Plan Estratégico 2026-2028
            </p>
            <h1 className="mt-2 text-2xl font-bold text-white">Bienvenido</h1>
            <p className="mt-1 text-sm text-zinc-400">Ingresa con tu cuenta corporativa</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@hidrogistica.cl"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/60 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/60 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#f4b41a] hover:bg-[#f9d057] text-[#07101f] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Hidrogistica · Portal interno · Mantenido por Cenade
          </p>
        </div>
      </div>
    </div>
  )
}
