"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { eliminarAccion } from "@/app/actions";
import type { AccionConArea, Area, Seguimiento } from "@/lib/types";
import { Filtros, type FiltrosState } from "./Filtros";
import { Resumen } from "./Resumen";
import { TablaAcciones } from "./TablaAcciones";
import { AccionDetalle } from "./AccionDetalle";
import { NuevaAccion } from "./NuevaAccion";

type Props = {
  area: Area;
  acciones: AccionConArea[];
  seguimientos: Seguimiento[];
};

export function PanelArea({ area, acciones, seguimientos }: Props) {
  const [filtros, setFiltros] = useState<FiltrosState>({
    objetivo: "todos",
    responsable: "todos",
    prioridad: "todas",
    estado: "todos",
    horizonte: "todos",
    busqueda: "",
  });
  const [accionSeleccionada, setAccionSeleccionada] =
    useState<AccionConArea | null>(null);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [, startDelete] = useTransition();

  const handleDelete = (a: AccionConArea) => {
    if (
      !confirm(
        `¿Eliminar la acción "${a.plan_accion}"?\n\nEsto borra también todos sus seguimientos. No se puede recuperar.`
      )
    )
      return;
    startDelete(async () => {
      try {
        await eliminarAccion(a.id);
      } catch (e) {
        alert(`Error al eliminar: ${(e as Error).message}`);
      }
    });
  };

  const objetivos = useMemo(() => {
    const set = new Set<string>();
    acciones.forEach((a) => set.add(a.objetivo_estrategico));
    return Array.from(set);
  }, [acciones]);

  const responsables = useMemo(() => {
    const set = new Set<string>();
    acciones.forEach((a) => a.responsable && set.add(a.responsable));
    return Array.from(set).sort();
  }, [acciones]);

  const accionesFiltradas = useMemo(() => {
    return acciones.filter((a) => {
      if (filtros.objetivo !== "todos" && a.objetivo_estrategico !== filtros.objetivo)
        return false;
      if (
        filtros.responsable !== "todos" &&
        a.responsable !== filtros.responsable
      )
        return false;
      if (filtros.prioridad !== "todas" && a.prioridad !== filtros.prioridad)
        return false;
      if (filtros.estado !== "todos" && a.estado !== filtros.estado)
        return false;
      if (
        filtros.horizonte !== "todos" &&
        String(a.horizonte_anio ?? "") !== filtros.horizonte
      )
        return false;
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase();
        const haystack = [
          a.objetivo_estrategico,
          a.plan_accion,
          a.kpi ?? "",
          a.responsable ?? "",
          a.equipo_apoyo ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [acciones, filtros]);

  const seguimientosPorAccion = useMemo(() => {
    const map = new Map<number, Seguimiento[]>();
    seguimientos.forEach((s) => {
      if (!map.has(s.accion_id)) map.set(s.accion_id, []);
      map.get(s.accion_id)!.push(s);
    });
    return map;
  }, [seguimientos]);

  return (
    <div className="min-h-screen">
      <TopBar
        area={area}
        totalAcciones={acciones.length}
        accionesFiltradas={accionesFiltradas.length}
      />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
        <Resumen acciones={accionesFiltradas} area={area} />

        <div className="mt-6">
          <Filtros
            filtros={filtros}
            onChange={setFiltros}
            objetivos={objetivos}
            responsables={responsables}
            color={area.color ?? "#1a2c4a"}
          />
        </div>

        <div className="mt-4">
          <TablaAcciones
            acciones={accionesFiltradas}
            seguimientosPorAccion={seguimientosPorAccion}
            onSelect={setAccionSeleccionada}
            onDelete={handleDelete}
            onNueva={() => setMostrarNueva(true)}
            color={area.color ?? "#1a2c4a"}
          />
        </div>

        {accionSeleccionada && (
          <AccionDetalle
            accion={accionSeleccionada}
            seguimientos={
              seguimientosPorAccion.get(accionSeleccionada.id) ?? []
            }
            onClose={() => setAccionSeleccionada(null)}
            color={area.color ?? "#1a2c4a"}
          />
        )}

        {mostrarNueva && (
          <NuevaAccion
            area={area}
            objetivos={objetivos}
            onClose={() => setMostrarNueva(false)}
          />
        )}
      </main>
    </div>
  );
}

function TopBar({
  area,
  totalAcciones,
  accionesFiltradas,
}: {
  area: Area;
  totalAcciones: number;
  accionesFiltradas: number;
}) {
  const color = area.color ?? "#1a2c4a";
  return (
    <header
      className="relative overflow-hidden border-b shadow-lg"
      style={{
        background: `linear-gradient(90deg, #0f1d33 0%, #1a2c4a 50%, ${color} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-72 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          aria-label="Volver al panel principal"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="rounded-md bg-white px-2 py-1 ring-2 ring-white/30">
          <Image
            src="/hidrogistica-logo.png"
            alt="Hidrogistica"
            width={100}
            height={48}
            className="h-8 w-auto"
            priority
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
            Plan Estratégico 2026-2028 · Hidrogistica
          </p>
          <h1 className="text-base font-bold uppercase leading-tight text-white sm:text-lg">
            {area.nombre}
          </h1>
        </div>

        <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur">
          <span className="font-bold tabular-nums">{accionesFiltradas}</span>
          <span className="text-white/70"> de {totalAcciones} acciones</span>
        </div>
      </div>
    </header>
  );
}
