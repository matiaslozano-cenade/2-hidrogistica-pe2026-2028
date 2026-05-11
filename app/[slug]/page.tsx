import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Accion, AccionConArea, Area, Seguimiento } from "@/lib/types";
import { PanelArea } from "@/components/PanelArea";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: areaData, error: areaErr } = await supabase
    .from("2_hidrogistica_pe2026_areas")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (areaErr) throw areaErr;
  if (!areaData) notFound();
  const area = areaData as Area;

  const [accionesRes, seguimientosRes] = await Promise.all([
    supabase
      .from("2_hidrogistica_pe2026_acciones")
      .select("*")
      .eq("area_id", area.id)
      .order("orden")
      .order("id"),
    supabase
      .from("2_hidrogistica_pe2026_seguimientos")
      .select("*")
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  if (accionesRes.error) throw accionesRes.error;
  if (seguimientosRes.error) throw seguimientosRes.error;

  const accionesRaw = (accionesRes.data ?? []) as Accion[];
  const acciones: AccionConArea[] = accionesRaw.map((a) => ({ ...a, area }));
  const accionIds = new Set(acciones.map((a) => a.id));
  const seguimientos = ((seguimientosRes.data ?? []) as Seguimiento[]).filter(
    (s) => accionIds.has(s.accion_id)
  );

  return (
    <PanelArea area={area} acciones={acciones} seguimientos={seguimientos} />
  );
}
