'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const ADMIN_EMAIL = 'matias.lozano@cenadechile.com'

type Usuario = {
  id: string
  email: string
  nombre: string | null
  rol: 'admin' | 'lector'
  activo: boolean
  creado_en: string
}

export default function AdminUsuariosPage() {
  const supabase = createClient()
  const [esAdmin, setEsAdmin] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  // Formulario nuevo usuario
  const [formEmail, setFormEmail]     = useState('')
  const [formNombre, setFormNombre]   = useState('')
  const [formPass, setFormPass]       = useState('')
  const [formRol, setFormRol]         = useState<'lector' | 'admin'>('lector')
  const [creando, setCreando]         = useState(false)
  const [msgCrear, setMsgCrear]       = useState('')
  const [eliminando, setEliminando]   = useState<string | null>(null)
  const [confirmar, setConfirmar]     = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.email !== ADMIN_EMAIL) {
        setLoading(false)
        return
      }
      setEsAdmin(true)
      await cargarUsuarios()
      setLoading(false)
    }
    init()
  }, [])

  async function cargarUsuarios() {
    const { data } = await supabase
      .from('2_hidrogistica_usuarios')
      .select('*')
      .order('creado_en')
    setUsuarios((data ?? []) as Usuario[])
  }

  async function crearUsuario(e: React.FormEvent) {
    e.preventDefault()
    setCreando(true)
    setMsgCrear('')
    const { error } = await supabase.rpc('crear_usuario_hidrogistica', {
      p_email:   formEmail.trim(),
      p_password: formPass,
      p_nombre:  formNombre.trim() || formEmail.trim(),
      p_rol:     formRol,
    })
    if (error) {
      setMsgCrear(`Error: ${error.message}`)
    } else {
      setMsgCrear('✓ Usuario creado correctamente.')
      setFormEmail(''); setFormNombre(''); setFormPass(''); setFormRol('lector')
      await cargarUsuarios()
    }
    setCreando(false)
  }

  async function eliminarUsuario(uid: string) {
    setEliminando(uid)
    const { error } = await supabase.rpc('eliminar_usuario_hidrogistica', {
      p_user_id: uid,
    })
    if (error) {
      alert(`Error al eliminar: ${error.message}`)
    } else {
      await cargarUsuarios()
    }
    setEliminando(null)
    setConfirmar(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-400">Cargando…</p>
      </div>
    )
  }

  if (!esAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50">
        <p className="text-zinc-600 text-lg font-semibold">Acceso restringido</p>
        <p className="text-zinc-400 text-sm">Solo el administrador puede acceder a esta sección.</p>
        <Link href="/" className="text-sm text-[#f4b41a] hover:underline">← Volver al inicio</Link>
      </div>
    )
  }

  const ROL_COLOR: Record<string, string> = {
    admin:  'bg-amber-100 text-amber-700 border border-amber-200',
    lector: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-zinc-700">Inicio</Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium">Gestión de usuarios</span>
        </nav>

        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Gestión de usuarios</h1>
        <p className="text-sm text-zinc-500 mb-8">Usuarios con acceso al portal Hidrogistica PE 2026-2028.</p>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
            <p className="font-semibold text-zinc-800 text-sm">
              Usuarios activos <span className="ml-1 text-zinc-400 font-normal">({usuarios.length})</span>
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-100">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Nombre / Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">Creado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-800">{u.nombre ?? '—'}</p>
                    <p className="text-xs text-zinc-400">{u.email}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ROL_COLOR[u.rol]}`}>
                      {u.rol === 'admin' ? 'Admin' : 'Lector'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs text-zinc-400">
                    {new Date(u.creado_en).toLocaleDateString('es-CL')}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {u.email !== ADMIN_EMAIL && (
                      confirmar === u.id ? (
                        <span className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setConfirmar(null)}
                            className="text-xs text-zinc-500 hover:text-zinc-700"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => eliminarUsuario(u.id)}
                            disabled={eliminando === u.id}
                            className="text-xs font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {eliminando === u.id ? 'Eliminando…' : 'Confirmar'}
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmar(u.id)}
                          className="text-xs text-zinc-400 hover:text-red-600 transition-colors"
                        >
                          Eliminar
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Formulario crear usuario */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6">
          <h2 className="font-semibold text-zinc-800 mb-4">Agregar usuario</h2>
          <form onSubmit={crearUsuario} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  placeholder="usuario@empresa.cl"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={e => setFormNombre(e.target.value)}
                  placeholder="Nombre completo"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Contraseña *</label>
                <input
                  type="password"
                  required
                  value={formPass}
                  onChange={e => setFormPass(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-600 mb-1">Rol</label>
                <select
                  value={formRol}
                  onChange={e => setFormRol(e.target.value as 'lector' | 'admin')}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/50"
                >
                  <option value="lector">Lector</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {msgCrear && (
              <p className={`text-sm ${msgCrear.startsWith('✓') ? 'text-emerald-600' : 'text-red-500'}`}>
                {msgCrear}
              </p>
            )}

            <button
              type="submit"
              disabled={creando}
              className="bg-[#f4b41a] hover:bg-[#f9d057] text-[#07101f] font-bold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {creando ? 'Creando…' : 'Crear usuario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
