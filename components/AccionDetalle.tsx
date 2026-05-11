"use client";

import { useState, useTransition } from "react";
import { X, Trash2, Plus, Save } from "lucide-react";
import {
  actualizarAccion,
  agregarSeguimiento,
  eliminarSeguimiento,
} from "@/app/actions";
import type {
  AccionConArea,
  Estado,
  Horizonte,
  Prioridad,
  Quarter,
  Seguimiento,
} from "@/lib/types";
import {
  colorEstado,
  colorPrioridad,
  diasRestantes,
  formatFecha,
  labelDiasRestantes,
} from "@/lib/utils";

type Props = {
  accion: AccionConArea;
  seguimientos: Seguimiento[];
  onClose: () => void;
  color: string;
};

const FIELD =
  "block w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 shadow-sm transition-colors hover:border-zinc-300 focus:border-[#f4b41a] focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/30";
const LABEL =
  "text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500";

export function AccionDetalle({ accion, seguimientos, onClose, color }: Props) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({
    objetivo_estrategico: accion.objetivo_estrategico,
    plan_accion: accion.plan_accion,
    responsable: accion.responsable ?? "",
    equipo_apoyo: accion.equipo_apoyo ?? "",
    kpi: accion.kpi ?? "",
    prioridad: accion.prioridad,
    estado: accion.estado,
    avance: Math.round(Number(accion.avance) * 100),
    horizonte_anio: accion.horizonte_anio ? String(accion.horizonte_anio) : "",
    inicio_quarter: accion.inicio_quarter ?? "",
    fin_quarter: accion.fin_quarter ?? "",
    fecha_inicio: accion.fecha_inicio ?? "",
    fecha_fin: accion.fecha_fin ?? "",
  });

  const [nota, setNota] = useState("");
  const [autor, setAutor] = useState("");

  const dias = diasRestantes(form.fecha_fin || accion.fecha_fin);

  const guardar = () => {
    startTransition(async () => {
      try {
        await actualizarAccion(accion.id, {
          objetivo_estrategico: form.objetivo_estrategico.trim(),
          plan_accion: form.plan_accion.trim(),
          responsable: form.responsable.trim() || null,
          equipo_apoyo: form.equipo_apoyo.trim() || null,
          kpi: form.kpi.trim() || null,
          prioridad: form.prioridad as Prioridad,
          estado: form.estado as Estado,
          avance: Math.max(0, Math.min(100, form.avance)) / 100,
          horizonte_anio: form.horizonte_anio
            ? (Number(form.horizonte_anio) as Horizonte)
            : null,
          inicio_quarter: (form.inicio_quarter || null) as Quarter | null,
          fin_quarter: (form.fin_quarter || null) as Quarter | null,
          fecha_inicio: form.fecha_inicio || null,
          fecha_fin: form.fecha_fin || null,
        });
        onClose();
      } catch (e) {
        alert(`Error al guardar: ${(e as Error).message}`);
      }
    });
  };

  const agregarNota = () => {
    if (!nota.trim()) return;
    startTransition(async () => {
      try {
        await agregarSeguimiento(accion.id, nota, autor || null);
        setNota("");
      } catch (e) {
        alert(`Error: ${(e as Error).message}`);
      }
    });
  };

  const borrarNota = (id: number) => {
    if (!confirm("¿Eliminar este seguimiento?")) return;
    startTransition(async () => {
      try {
        await eliminarSeguimiento(id);
      } catch (e) {
        alert(`Error: ${(e as Error).message}`);
      }
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-zinc-900/40 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="px-6 py-5 text-white"
          style={{
            background: `linear-gradient(90deg, #0f1d33 0%, #1a2c4a 50%, ${color} 100%)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                {accion.area.nombre}
              </p>
              <h2 className="mt-1.5 text-lg font-semibold leading-tight">
                {accion.plan_accion}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">
                {accion.objetivo_estrategico}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-zinc-50 px-6 py-5">
          <section className="grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="col-span-2">
              <label className={LABEL}>Objetivo estratégico</label>
              <textarea
                className={`${FIELD} mt-1 min-h-[48px] resize-y`}
                value={form.objetivo_estrategico}
                onChange={(e) =>
                  setForm({ ...form, objetivo_estrategico: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className={LABEL}>Plan de acción</label>
              <textarea
                className={`${FIELD} mt-1 min-h-[48px] resize-y`}
                value={form.plan_accion}
                onChange={(e) =>
                  setForm({ ...form, plan_accion: e.target.value })
                }
              />
            </div>
            <div>
              <label className={LABEL}>Responsable</label>
              <input
                className={`${FIELD} mt-1`}
                value={form.responsable}
                onChange={(e) =>
                  setForm({ ...form, responsable: e.target.value })
                }
              />
            </div>
            <div>
              <label className={LABEL}>Equipo de apoyo</label>
              <input
                className={`${FIELD} mt-1`}
                value={form.equipo_apoyo}
                onChange={(e) =>
                  setForm({ ...form, equipo_apoyo: e.target.value })
                }
              />
            </div>
            <div className="col-span-2">
              <label className={LABEL}>KPI / Indicador</label>
              <input
                className={`${FIELD} mt-1`}
                value={form.kpi}
                onChange={(e) => setForm({ ...form, kpi: e.target.value })}
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
              <label className={LABEL}>Estado</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.estado}
                onChange={(e) =>
                  setForm({ ...form, estado: e.target.value as Estado })
                }
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En curso">En curso</option>
                <option value="Completada">Completada</option>
                <option value="Bloqueada">Bloqueada</option>
              </select>
            </div>

            <div className="col-span-2">
              <div className="flex items-center justify-between">
                <label className={LABEL}>Avance</label>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color }}
                >
                  {form.avance}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.avance}
                onChange={(e) =>
                  setForm({ ...form, avance: Number(e.target.value) })
                }
                className="mt-2 w-full"
                style={{ accentColor: color }}
              />
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full transition-[width] duration-300"
                  style={{
                    width: `${form.avance}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>

            <div>
              <label className={LABEL}>Horizonte (año)</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.horizonte_anio}
                onChange={(e) =>
                  setForm({ ...form, horizonte_anio: e.target.value })
                }
              >
                <option value="">—</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </div>
            <div />

            <div>
              <label className={LABEL}>Inicio (Quarter)</label>
              <select
                className={`${FIELD} mt-1`}
                value={form.inicio_quarter}
                onChange={(e) =>
                  setForm({ ...form, inicio_quarter: e.target.value })
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
                  setForm({ ...form, fin_quarter: e.target.value })
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
              <label className={LABEL}>Fecha inicio</label>
              <input
                type="date"
                className={`${FIELD} mt-1`}
                value={form.fecha_inicio}
                onChange={(e) =>
                  setForm({ ...form, fecha_inicio: e.target.value })
                }
              />
            </div>
            <div>
              <label className={LABEL}>Fecha fin</label>
              <input
                type="date"
                className={`${FIELD} mt-1`}
                value={form.fecha_fin}
                onChange={(e) =>
                  setForm({ ...form, fecha_fin: e.target.value })
                }
              />
            </div>
          </section>

          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-sm shadow-sm">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorEstado(
                form.estado as Estado
              )}`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {form.estado}
            </span>
            <span
              className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${colorPrioridad(
                form.prioridad as Prioridad
              )}`}
            >
              {form.prioridad}
            </span>
            <span className="text-zinc-700">
              {labelDiasRestantes(dias)}
              {form.fecha_fin ? ` (vence ${formatFecha(form.fecha_fin)})` : ""}
            </span>
          </div>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-zinc-900">
              Seguimientos
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-700 ring-1 ring-inset ring-zinc-200">
                {seguimientos.length}
              </span>
            </h3>

            <div className="mt-3 space-y-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <textarea
                className={`${FIELD} min-h-[60px] resize-y`}
                placeholder="Nota de avance, bloqueo o decisión…"
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <input
                  className={`${FIELD} flex-1`}
                  placeholder="Autor (opcional)"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                />
                <button
                  onClick={agregarNota}
                  disabled={pending || !nota.trim()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] px-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  <Plus className="size-4" /> Agregar
                </button>
              </div>
            </div>

            <ul className="mt-3 space-y-2">
              {seguimientos.map((s) => (
                <li
                  key={s.id}
                  className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors hover:border-amber-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs text-zinc-500">
                      <span className="font-medium tabular-nums text-zinc-700">
                        {formatFecha(s.fecha)}
                      </span>
                      {s.autor && (
                        <span className="text-zinc-500"> · {s.autor}</span>
                      )}
                    </div>
                    <button
                      onClick={() => borrarNota(s.id)}
                      className="rounded p-1 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-800">
                    {s.nota}
                  </p>
                </li>
              ))}
              {seguimientos.length === 0 && (
                <li className="rounded-xl border border-dashed border-zinc-200 bg-white p-4 text-center text-sm text-zinc-500">
                  Sin seguimientos todavía.
                </li>
              )}
            </ul>
          </section>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-zinc-200 bg-white px-6 py-3">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
          >
            Cerrar
          </button>
          <button
            onClick={guardar}
            disabled={pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] px-3.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="size-4" /> {pending ? "Guardando…" : "Guardar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
