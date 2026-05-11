"use client";

import type { AccionConArea, Seguimiento } from "@/lib/types";
import {
  colorEstado,
  colorPrioridad,
  colorDiasRestantes,
  colorBarraEstado,
  diasRestantes,
  formatFechaCorta,
  labelDiasRestantes,
} from "@/lib/utils";
import { MessageSquare, Pencil, Trash2, Plus } from "lucide-react";

type Props = {
  acciones: AccionConArea[];
  seguimientosPorAccion: Map<number, Seguimiento[]>;
  onSelect: (a: AccionConArea) => void;
  onDelete: (a: AccionConArea) => void;
  onNueva: () => void;
  color: string;
};

export function TablaAcciones({
  acciones,
  seguimientosPorAccion,
  onSelect,
  onDelete,
  onNueva,
}: Props) {
  const botonNueva = (
    <button
      onClick={onNueva}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] px-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110"
    >
      <Plus className="size-4" /> Nueva acción
    </button>
  );

  if (acciones.length === 0) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-700">
            Acciones del plan
          </p>
          {botonNueva}
        </div>
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center text-sm text-zinc-500 shadow-sm">
          No hay acciones que coincidan con los filtros.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">
          Acciones del plan{" "}
          <span className="ml-1 text-xs text-zinc-500">
            ({acciones.length})
          </span>
        </p>
        {botonNueva}
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-[0.12em] text-zinc-600">
              <tr>
                <th className="px-3 py-3 text-left font-semibold">Objetivo</th>
                <th className="px-3 py-3 text-left font-semibold">Acción</th>
                <th className="px-3 py-3 text-left font-semibold">Responsable</th>
                <th className="px-3 py-3 text-left font-semibold">Plazo</th>
                <th className="px-3 py-3 text-left font-semibold">Estado</th>
                <th className="px-3 py-3 text-right font-semibold">Avance</th>
                <th className="px-3 py-3 text-center font-semibold">Notas</th>
                <th className="w-20 px-2 py-3 text-center font-semibold">⚙</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {acciones.map((a) => {
                const dias = diasRestantes(a.fecha_fin);
                const segs = seguimientosPorAccion.get(a.id)?.length ?? 0;
                const pct = Math.round(Number(a.avance) * 100);
                return (
                  <tr
                    key={a.id}
                    onClick={() => onSelect(a)}
                    className="group cursor-pointer transition-colors hover:bg-amber-50/30"
                  >
                    <td className="px-3 py-3 align-top">
                      <p className="line-clamp-2 max-w-[220px] text-xs text-zinc-600">
                        {a.objetivo_estrategico}
                      </p>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <p className="font-medium text-zinc-900 transition-colors group-hover:text-[#1a2c4a]">
                        {a.plan_accion}
                      </p>
                      {a.kpi && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">
                          KPI: {a.kpi}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <p className="text-zinc-700">{a.responsable ?? "—"}</p>
                      {a.equipo_apoyo && (
                        <p className="text-xs text-zinc-500">+ {a.equipo_apoyo}</p>
                      )}
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="flex flex-wrap items-center gap-1">
                        {a.horizonte_anio && (
                          <span className="inline-flex items-center rounded bg-[#1a2c4a] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                            {a.horizonte_anio}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${colorPrioridad(
                            a.prioridad
                          )}`}
                        >
                          {a.prioridad}
                        </span>
                      </div>
                      {(a.inicio_quarter || a.fin_quarter) && (
                        <p className="mt-1 text-xs tabular-nums text-zinc-700">
                          {a.inicio_quarter ?? "?"} → {a.fin_quarter ?? "?"}
                        </p>
                      )}
                      <p className="text-xs tabular-nums text-zinc-400">
                        {formatFechaCorta(a.fecha_inicio)} –{" "}
                        {formatFechaCorta(a.fecha_fin)}
                      </p>
                      <p
                        className={`mt-0.5 text-xs tabular-nums ${colorDiasRestantes(
                          dias,
                          a.estado
                        )}`}
                      >
                        {labelDiasRestantes(dias)}
                      </p>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorEstado(
                          a.estado
                        )}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {a.estado}
                      </span>
                    </td>
                    <td className="px-3 py-3 align-top text-right">
                      <p className="text-sm font-semibold tabular-nums text-zinc-900">
                        {pct}%
                      </p>
                      <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full transition-[width] duration-700 ease-out ${colorBarraEstado(
                            a.estado
                          )}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top text-center">
                      {segs > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 ring-1 ring-inset ring-zinc-200">
                          <MessageSquare className="size-3" /> {segs}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="px-2 py-3 align-middle">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelect(a);
                          }}
                          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-amber-50 hover:text-[#b8830a]"
                          aria-label="Editar acción"
                          title="Editar"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(a);
                          }}
                          className="rounded-md p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label="Eliminar acción"
                          title="Eliminar"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
