import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Accion, Area } from "@/lib/types";
import { ArrowRight, Droplets, Truck, Package, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const ICONOS: Record<string, React.ComponentType<{ className?: string }>> = {
  "servicio-mercado-del-agua": Droplets,
  "cadena-de-suministro": Package,
  "operacion-logistica": Truck,
};

export default async function Home() {
  const supabase = await createClient();

  const [areasRes, accionesRes] = await Promise.all([
    supabase
      .from("2_hidrogistica_pe2026_areas")
      .select("*")
      .order("orden"),
    supabase
      .from("2_hidrogistica_pe2026_acciones")
      .select("*"),
  ]);

  if (areasRes.error) throw areasRes.error;
  if (accionesRes.error) throw accionesRes.error;

  const areas = (areasRes.data ?? []) as Area[];
  const acciones = (accionesRes.data ?? []) as Accion[];

  const accionesPorArea = new Map<number, Accion[]>();
  acciones.forEach((a) => {
    if (!accionesPorArea.has(a.area_id)) accionesPorArea.set(a.area_id, []);
    accionesPorArea.get(a.area_id)!.push(a);
  });

  const totalAcciones = acciones.length;
  const completadas = acciones.filter((a) => a.estado === "Completada").length;
  const enCurso = acciones.filter((a) => a.estado === "En curso").length;
  const avanceGlobal =
    totalAcciones === 0
      ? 0
      : acciones.reduce((s, a) => s + Number(a.avance), 0) / totalAcciones;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundDeco />

      <main className="relative mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14 lg:py-20">
        <header className="flex flex-col items-center text-center">
          <Link
            href="https://hidrogistica.portalcenade.cl"
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur transition-colors hover:border-zinc-300 hover:text-zinc-900"
          >
            ← Portal Hidrogistica
          </Link>

          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl shadow-[#f4b41a]/10 ring-1 ring-zinc-200">
            <Image
              src="/hidrogistica-logo.png"
              alt="Hidrogistica"
              width={480}
              height={240}
              className="h-auto w-full"
              priority
            />
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4b41a]">
            Plan Estratégico
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Hidrogistica 2026 — 2028
          </h1>
          <p className="mt-3 max-w-xl text-sm text-zinc-600 sm:text-base">
            Selecciona el área que te corresponde para gestionar acciones,
            responsables, avances y seguimientos.
          </p>
        </header>

        <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard
            label="Avance global"
            value={`${Math.round(avanceGlobal * 100)}%`}
            sub={`${totalAcciones} acciones`}
            tone="navy"
          />
          <KpiCard
            label="Completadas"
            value={completadas.toString()}
            sub={`${totalAcciones === 0 ? 0 : Math.round((completadas / totalAcciones) * 100)}%`}
            Icon={CheckCircle2}
            tone="emerald"
          />
          <KpiCard
            label="En curso"
            value={enCurso.toString()}
            sub={`${totalAcciones === 0 ? 0 : Math.round((enCurso / totalAcciones) * 100)}%`}
            Icon={Clock}
            tone="yellow"
          />
          <KpiCard
            label="Áreas"
            value={areas.length.toString()}
            sub="planes activos"
            tone="zinc"
          />
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const accs = accionesPorArea.get(area.id) ?? [];
            const total = accs.length;
            const completed = accs.filter((a) => a.estado === "Completada").length;
            const avg =
              total === 0
                ? 0
                : accs.reduce((s, a) => s + Number(a.avance), 0) / total;
            const Icon = ICONOS[area.slug] ?? Package;
            return (
              <AreaCard
                key={area.id}
                area={area}
                total={total}
                completed={completed}
                avancePromedio={avg}
                Icon={Icon}
              />
            );
          })}
        </section>

        <footer className="mt-14 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-500">
          <p>
            Hidrogistica · Plan Estratégico 2026-2028 · Mantenido por{" "}
            <span className="text-zinc-700">Cenade</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

type AreaCardProps = {
  area: Area;
  total: number;
  completed: number;
  avancePromedio: number;
  Icon: React.ComponentType<{ className?: string }>;
};

function AreaCard({ area, total, completed, avancePromedio, Icon }: AreaCardProps) {
  const pct = Math.round(avancePromedio * 100);
  const color = area.color ?? "#1a2c4a";
  return (
    <Link
      href={`/${area.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#f4b41a]/40 hover:shadow-lg hover:shadow-[#f4b41a]/10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-30"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex size-12 items-center justify-center rounded-xl ring-1"
          style={{
            backgroundColor: `${color}15`,
            color: color,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--tw-ring-color" as any]: `${color}40`,
          }}
        >
          <Icon className="size-6" />
        </div>
        <ArrowRight className="size-5 text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-700" />
      </div>

      <h3 className="relative mt-5 text-base font-bold uppercase tracking-tight text-zinc-900">
        {area.nombre}
      </h3>
      <p className="relative mt-1.5 text-xs text-zinc-500">
        {total} acción{total === 1 ? "" : "es"} · {completed} completada
        {completed === 1 ? "" : "s"}
      </p>

      <div className="relative mt-5">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-zinc-500">
            Avance
          </span>
          <span className="text-base font-bold tabular-nums" style={{ color }}>
            {pct}%
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <div
        className="relative mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
        style={{ backgroundColor: `${color}12`, color }}
      >
        Abrir plan
        <ArrowRight className="size-3.5" />
      </div>
    </Link>
  );
}

type KpiCardProps = {
  label: string;
  value: string;
  sub: string;
  Icon?: React.ComponentType<{ className?: string }>;
  tone: "navy" | "emerald" | "yellow" | "zinc";
};

function KpiCard({ label, value, sub, Icon, tone }: KpiCardProps) {
  const styles = {
    navy: {
      card: "border-[#1a2c4a] bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] text-white",
      label: "text-blue-200",
      value: "text-white",
      sub: "text-blue-200/80",
    },
    emerald: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-emerald-700",
      sub: "text-zinc-500",
    },
    yellow: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-[#b8830a]",
      sub: "text-zinc-500",
    },
    zinc: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-zinc-900",
      sub: "text-zinc-500",
    },
  }[tone];
  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-4 shadow-sm ${styles.card}`}
    >
      <div className="flex items-start justify-between">
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${styles.label}`}
        >
          {label}
        </p>
        {Icon && (
          <div className="flex size-7 items-center justify-center rounded-lg bg-white/10">
            <Icon className="size-4" />
          </div>
        )}
      </div>
      <p className={`mt-3 text-2xl font-bold tabular-nums ${styles.value}`}>
        {value}
      </p>
      <p className={`mt-0.5 text-xs ${styles.sub}`}>{sub}</p>
    </div>
  );
}

function BackgroundDeco() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -top-32 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#f4b41a]/10 blur-[100px]" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-[#1a2c4a]/8 blur-[100px]" />
    </div>
  );
}
