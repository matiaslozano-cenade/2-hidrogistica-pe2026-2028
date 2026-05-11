"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Estado, Horizonte, Prioridad, Quarter } from "@/lib/types";

const QUARTER_INI: Record<Quarter, string> = {
  Q1: "2026-01-01",
  Q2: "2026-04-01",
  Q3: "2026-07-01",
  Q4: "2026-10-01",
};
const QUARTER_FIN: Record<Quarter, string> = {
  Q1: "2026-03-31",
  Q2: "2026-06-30",
  Q3: "2026-09-30",
  Q4: "2026-12-31",
};

export async function actualizarAccion(
  id: number,
  patch: {
    objetivo_estrategico?: string;
    plan_accion?: string;
    responsable?: string | null;
    equipo_apoyo?: string | null;
    kpi?: string | null;
    prioridad?: Prioridad;
    estado?: Estado;
    avance?: number;
    horizonte_anio?: Horizonte | null;
    inicio_quarter?: Quarter | null;
    fin_quarter?: Quarter | null;
    fecha_inicio?: string | null;
    fecha_fin?: string | null;
  }
) {
  const supabase = await createClient();

  if (patch.inicio_quarter && !patch.fecha_inicio) {
    patch.fecha_inicio = QUARTER_INI[patch.inicio_quarter];
  }
  if (patch.fin_quarter && !patch.fecha_fin) {
    patch.fecha_fin = QUARTER_FIN[patch.fin_quarter];
  }

  const { error } = await supabase
    .from("2_hidrogistica_pe2026_acciones")
    .update(patch)
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function agregarSeguimiento(
  accionId: number,
  nota: string,
  autor: string | null,
  fecha?: string
) {
  if (!nota.trim()) throw new Error("La nota no puede estar vacía");
  const supabase = await createClient();
  const { error } = await supabase
    .from("2_hidrogistica_pe2026_seguimientos")
    .insert({
      accion_id: accionId,
      nota: nota.trim(),
      autor: autor?.trim() || null,
      fecha: fecha || new Date().toISOString().slice(0, 10),
    });
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function eliminarSeguimiento(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("2_hidrogistica_pe2026_seguimientos")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}

export async function crearAccion(input: {
  area_id: number;
  objetivo_estrategico: string;
  plan_accion: string;
  responsable?: string | null;
  prioridad?: Prioridad;
  horizonte_anio?: Horizonte | null;
  inicio_quarter?: Quarter | null;
  fin_quarter?: Quarter | null;
}) {
  if (!input.objetivo_estrategico.trim())
    throw new Error("El objetivo estratégico es obligatorio");
  if (!input.plan_accion.trim())
    throw new Error("El plan de acción es obligatorio");

  const supabase = await createClient();

  const fecha_inicio = input.inicio_quarter
    ? QUARTER_INI[input.inicio_quarter]
    : null;
  const fecha_fin = input.fin_quarter ? QUARTER_FIN[input.fin_quarter] : null;

  const { data, error } = await supabase
    .from("2_hidrogistica_pe2026_acciones")
    .insert({
      area_id: input.area_id,
      objetivo_estrategico: input.objetivo_estrategico.trim(),
      plan_accion: input.plan_accion.trim(),
      responsable: input.responsable?.trim() || null,
      prioridad: input.prioridad ?? "Media",
      estado: "Pendiente",
      avance: 0,
      horizonte_anio: input.horizonte_anio ?? null,
      inicio_quarter: input.inicio_quarter ?? null,
      fin_quarter: input.fin_quarter ?? null,
      fecha_inicio,
      fecha_fin,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  return data.id as number;
}

export async function eliminarAccion(id: number) {
  const supabase = await createClient();

  const { error: errSeg } = await supabase
    .from("2_hidrogistica_pe2026_seguimientos")
    .delete()
    .eq("accion_id", id);
  if (errSeg) throw new Error(errSeg.message);

  const { error } = await supabase
    .from("2_hidrogistica_pe2026_acciones")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
