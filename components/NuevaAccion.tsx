"use client";

import { useState, useTransition } from "react";
import { X, Plus } from "lucide-react";
import { crearAccion } from "@/app/actions";
import type { Area, Horizonte, Prioridad, Quarter } from "@/lib/types";

type Props = {
  area: Area;
  objetivos: string[];
  onClose: () => void;
};

const FIELD =
  "block w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 focus:border-[#f4b41a] focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/30";
const LABEL =
  "text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500";

export function NuevaAccion({ area, objetivos, onClose }: Props) {
  const [pending, startTransition] = useTransition();
  const [objetivoNuevo, setObjetivoNuevo] = useState(false);
  const [form, setForm] = useState({
    objetivo_estrategico: objetivos[0] ?? "",
    plan_accion: "",
    responsable: "",
    prioridad: "Media" as Prioridad,
    horizonte_anio: "" as "" | "2026" | "2027" | "2028",
    inicio_quarter: "" as "" | Quarter,
    fin_quarter: "" as "" | Quarter,
  });

  const color = area.color ?? "#1a2c4a";

  const guardar = () => {
    if (!form.objetivo_estrategico.trim() || !form.plan_accion.trim()) {
      alert("Objetivo estratégico y plan de acción son obligatorios");
      return;
    }
    startTransition(async () => {
      try {
        await crearAccion({
          area_id: area.id,
          objetivo_estrategico: form.objetivo_estrategico,
          plan_accion: form.plan_accion,
          responsable: form.responsable || null,
          prioridad: form.prioridad,
          horizonte_anio: form.horizonte_anio
            ? (Number(form.horizonte_anio) as Horizonte)
            : null,
          inicio_quarter: (form.inicio_quarter || null) as Quarter | null,
          fin_quarter: (form.fin_quarter || null) as Quarter | null,
        });
        onClose();
      } catch (e) {
        alert(`Error al crear: ${(e as Error).message}`);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm animate-fade-in-up p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-center justify-between px-5 py-4 text-white"
          style={{
            background: `linear-gradient(90deg, #0f1d33 0%, #1a2c4a 50%, ${color} 100%)`,
          }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
              {area.nombre}
            </p>
            <h2 className="mt-0.5 text-base font-semibold leading-tight">
              Nueva acción
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-50 px-5 py-4">
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="col-span-2">
              <div className="flex items-center justify-between">
                <label className={LABEL}>Objetivo estratégico *</label>
                {objetivos.length > 0 && (
                  <button
                    onClick={() => setObjetivoNuevo(!objetivoNuevo)}
                    className="text-[10px] font-semibold uppercase tracking-wider text-[#b8830a] hover:text-[#d99a0e]"
                  >
                    {objetivoNuevo ? "Elegir existente" : "Crear nuevo"}
                  </button>
                )}
              </div>
              {objetivoNuevo || objetivos.length === 0 ? (
                <textarea
                  className={`${FIELD} mt-1 min-h-[60px] resize-y`}
                  placeholder="Nuevo objetivo estratégico"
                  value={form.objetivo_estrategico}
                  onChange={(e) =>
                    setForm({ ...form, objetivo_estrategico: e.target.value })
                  }
                />
              ) : (
                <select
                  className={`${FIELD} mt-1`}
                  value={form.objetivo_estrategico}
                  onChange={(e) =>
                    setForm({ ...form, objetivo_estrategico: e.target.value })
                  }
                >
                  {objetivos.map((o) => (
                    <option key={o} value={o}>
                      {o.length > 80 ? o.slice(0, 80) + "…" : o}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-span-2">
              <label className={LABEL}>Plan de acción *</label>
              <textarea
                className={`${FIELD} mt-1 min-h-[60px] resize-y`}
                placeholder="Acción concreta a realizar"
                value={form.plan_accion}
                onChange={(e) =>
                  setForm({ ...form, plan_accion: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className={LABEL}>Responsable</label>
              <input
                className={`${FIELD} mt-1`}
                placeholder="Nombre del responsable (opcional)"
                value={form.responsable}
                onChange={(e) =>
                  setForm({ ...form, responsable: e.target.value })
                }
              />
            </div>

            <div>
              <label className={LABEL}>Prioridad</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.prioridad}
                onChange={(e) =>
                  setForm({ ...form, prioridad: e.target.value as Prioridad })
                }
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Horizonte (año)</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.horizonte_anio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horizonte_anio: e.target.value as "" | "2026" | "2027" | "2028",
                  })
                }
              >
                <option value="">—</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>

            <div>
              <label className={LABEL}>Inicio (Quarter)</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.inicio_quarter}
                onChange={(e) =>
                  setForm({
                    ...form,
                    inicio_quarter: e.target.value as "" | Quarter,
                  })
                }
              >
                <option value="">—</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Fin (Quarter)</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.fin_quarter}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fin_quarter: e.target.value as "" | Quarter,
                  })
                }
              >
                <option value="">—</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-white px-5 py-3">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] px-3.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" /> {pending ? "Creando…" : "Crear acción"}
          </button>
        </footer>
      </div>
    </div>
  );
}
