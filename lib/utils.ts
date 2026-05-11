import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import type { Estado, Prioridad } from "./types";

export function diasRestantes(fechaFin: string | null): number | null {
  if (!fechaFin) return null;
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Santiago" })
  );
  return differenceInCalendarDays(parseISO(fechaFin), today);
}

export function formatFecha(fecha: string | null): string {
  if (!fecha) return "—";
  return format(parseISO(fecha), "dd MMM yyyy", { locale: es });
}

export function formatFechaCorta(fecha: string | null): string {
  if (!fecha) return "—";
  return format(parseISO(fecha), "dd/MM/yy");
}

export function formatPct(v: number): string {
  return `${Math.round(v * 100)}%`;
}

export function colorEstado(estado: Estado): string {
  switch (estado) {
    case "Completada":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "En curso":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "Bloqueada":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-zinc-100 text-zinc-700 ring-zinc-500/20";
  }
}

export function colorPrioridad(prioridad: Prioridad): string {
  switch (prioridad) {
    case "Alta":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "Media":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    default:
      return "bg-zinc-50 text-zinc-600 ring-zinc-500/20";
  }
}

export function colorDiasRestantes(dias: number | null, estado: Estado): string {
  if (estado === "Completada") return "text-emerald-700";
  if (dias === null) return "text-zinc-500";
  if (dias < 0) return "text-red-700 font-semibold";
  if (dias <= 14) return "text-amber-700 font-medium";
  if (dias <= 60) return "text-zinc-700";
  return "text-zinc-500";
}

export function labelDiasRestantes(dias: number | null): string {
  if (dias === null) return "Sin fecha";
  if (dias < 0) return `Vencida hace ${Math.abs(dias)} d`;
  if (dias === 0) return "Vence hoy";
  if (dias === 1) return "1 día";
  return `${dias} días`;
}

export function colorBarraEstado(estado: Estado): string {
  switch (estado) {
    case "Completada":
      return "bg-gradient-to-r from-emerald-500 to-emerald-400";
    case "En curso":
      return "bg-gradient-to-r from-blue-600 to-blue-400";
    case "Bloqueada":
      return "bg-gradient-to-r from-red-500 to-red-400";
    default:
      return "bg-gradient-to-r from-zinc-500 to-zinc-400";
  }
}
