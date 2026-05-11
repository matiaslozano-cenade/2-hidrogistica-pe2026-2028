"use client";

import { Search, X } from "lucide-react";

export type FiltrosState = {
  objetivo: string;
  responsable: string;
  prioridad: string;
  estado: string;
  horizonte: string;
  busqueda: string;
};

type Props = {
  filtros: FiltrosState;
  onChange: (f: FiltrosState) => void;
  objetivos: string[];
  responsables: string[];
  color: string;
};

const SELECT_CLS =
  "h-9 rounded-lg border border-zinc-200 bg-white px-2.5 text-sm text-zinc-800 shadow-sm transition-colors hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/30 focus:border-[#f4b41a]";

export function Filtros({
  filtros,
  onChange,
  objetivos,
  responsables,
}: Props) {
  const set = (patch: Partial<FiltrosState>) =>
    onChange({ ...filtros, ...patch });

  const filtrosActivos =
    filtros.objetivo !== "todos" ||
    filtros.responsable !== "todos" ||
    filtros.prioridad !== "todas" ||
    filtros.estado !== "todos" ||
    filtros.horizonte !== "todos" ||
    filtros.busqueda.trim().length > 0;

  const limpiar = () =>
    onChange({
      objetivo: "todos",
      responsable: "todos",
      prioridad: "todas",
      estado: "todos",
      horizonte: "todos",
      busqueda: "",
    });

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={filtros.busqueda}
          onChange={(e) => set({ busqueda: e.target.value })}
          placeholder="Buscar objetivo, plan, responsable, KPI…"
          className="h-9 w-full rounded-lg border border-zinc-200 bg-white pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#f4b41a]/30 focus:border-[#f4b41a]"
        />
      </div>

      <select
        className={SELECT_CLS}
        value={filtros.objetivo}
        onChange={(e) => set({ objetivo: e.target.value })}
      >
        <option value="todos">Todos los objetivos</option>
        {objetivos.map((o) => (
          <option key={o} value={o}>
            {o.length > 60 ? o.slice(0, 60) + "…" : o}
          </option>
        ))}
      </select>

      <select
        className={SELECT_CLS}
        value={filtros.responsable}
        onChange={(e) => set({ responsable: e.target.value })}
      >
        <option value="todos">Todos los responsables</option>
        {responsables.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <select
        className={SELECT_CLS}
        value={filtros.horizonte}
        onChange={(e) => set({ horizonte: e.target.value })}
      >
        <option value="todos">Todos los años</option>
        <option value="2026">2026</option>
        <option value="2027">2027</option>
        <option value="2028">2028</option>
      </select>

      <select
        className={SELECT_CLS}
        value={filtros.prioridad}
        onChange={(e) => set({ prioridad: e.target.value })}
      >
        <option value="todas">Todas las prioridades</option>
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Baja">Baja</option>
      </select>

      <select
        className={SELECT_CLS}
        value={filtros.estado}
        onChange={(e) => set({ estado: e.target.value })}
      >
        <option value="todos">Todos los estados</option>
        <option value="Pendiente">Pendiente</option>
        <option value="En curso">En curso</option>
        <option value="Completada">Completada</option>
        <option value="Bloqueada">Bloqueada</option>
      </select>

      {filtrosActivos && (
        <button
          onClick={limpiar}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
        >
          <X className="size-3.5" /> Limpiar
        </button>
      )}
    </div>
  );
}
