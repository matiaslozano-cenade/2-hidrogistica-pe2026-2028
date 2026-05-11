import type { AccionConArea, Area } from "@/lib/types";
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

type Props = {
  acciones: AccionConArea[];
  area: Area;
};

export function Resumen({ acciones, area }: Props) {
  const color = area.color ?? "#1a2c4a";
  const total = acciones.length || 1;
  const completadas = acciones.filter((a) => a.estado === "Completada").length;
  const enCurso = acciones.filter((a) => a.estado === "En curso").length;
  const pendientes = acciones.filter((a) => a.estado === "Pendiente").length;
  const bloqueadas = acciones.filter((a) => a.estado === "Bloqueada").length;
  const avancePromedio =
    acciones.reduce((s, a) => s + Number(a.avance), 0) / total;

  const today = new Date();
  const vencidas = acciones.filter((a) => {
    if (!a.fecha_fin || a.estado === "Completada") return false;
    return new Date(a.fecha_fin) < today;
  }).length;

  const cards = [
    {
      label: "Avance del área",
      value: `${Math.round(avancePromedio * 100)}%`,
      sub: `${acciones.length} acciones`,
      Icon: TrendingUp,
      tone: "dark",
    },
    {
      label: "Completadas",
      value: completadas.toString(),
      sub: `${Math.round((completadas / total) * 100)}% del total`,
      Icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "En curso",
      value: enCurso.toString(),
      sub: `${Math.round((enCurso / total) * 100)}% del total`,
      Icon: Clock,
      tone: "yellow",
    },
    {
      label: "Pendientes",
      value: pendientes.toString(),
      sub: `${Math.round((pendientes / total) * 100)}% del total`,
      Icon: ListTodo,
      tone: "zinc",
    },
    {
      label: "Vencidas",
      value: vencidas.toString(),
      sub: bloqueadas > 0 ? `${bloqueadas} bloqueadas` : "sin acciones",
      Icon: AlertTriangle,
      tone: vencidas > 0 ? "red" : "zinc",
    },
  ] as const;

  const toneConfig: Record<
    string,
    {
      card: string;
      label: string;
      value: string;
      sub: string;
      iconBg: string;
      iconColor: string;
    }
  > = {
    dark: {
      card: "border-[#1a2c4a] bg-gradient-to-br from-[#1a2c4a] to-[#0f1d33] text-white",
      label: "text-white/60",
      value: "text-white",
      sub: "text-white/60",
      iconBg: "bg-[#f4b41a]/20 ring-1 ring-[#f4b41a]/30",
      iconColor: "text-[#f4b41a]",
    },
    yellow: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-[#b8830a]",
      sub: "text-zinc-500",
      iconBg: "bg-[#f4b41a]/10",
      iconColor: "text-[#b8830a]",
    },
    emerald: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-emerald-700",
      sub: "text-zinc-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    zinc: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-zinc-900",
      sub: "text-zinc-500",
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-600",
    },
    red: {
      card: "border-zinc-200 bg-white",
      label: "text-zinc-500",
      value: "text-red-700",
      sub: "text-zinc-500",
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
    },
  };

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c, i) => {
        const t = toneConfig[c.tone];
        return (
          <div
            key={c.label}
            className={`group relative overflow-hidden rounded-xl border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up ${t.card}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="flex items-start justify-between">
              <p
                className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${t.label}`}
              >
                {c.label}
              </p>
              <div
                className={`flex size-8 items-center justify-center rounded-lg ${t.iconBg}`}
              >
                <c.Icon className={`size-4 ${t.iconColor}`} />
              </div>
            </div>
            <p className={`mt-3 text-2xl font-bold tabular-nums ${t.value}`}>
              {c.value}
            </p>
            <p className={`mt-0.5 text-xs ${t.sub}`}>{c.sub}</p>
          </div>
        );
      })}
      <PorObjetivo acciones={acciones} color={color} />
    </div>
  );
}

function PorObjetivo({
  acciones,
  color,
}: {
  acciones: AccionConArea[];
  color: string;
}) {
  const map = new Map<string, AccionConArea[]>();
  acciones.forEach((a) => {
    if (!map.has(a.objetivo_estrategico))
      map.set(a.objetivo_estrategico, []);
    map.get(a.objetivo_estrategico)!.push(a);
  });
  const objetivos = Array.from(map.entries());

  return (
    <div className="col-span-2 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:col-span-3 lg:col-span-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          Avance por objetivo estratégico
        </p>
        <p className="text-xs text-zinc-500">
          {objetivos.length} objetivos · {acciones.length} acciones
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {objetivos.map(([objetivo, items]) => {
          const total = items.length;
          const avance =
            total === 0
              ? 0
              : items.reduce((s, a) => s + Number(a.avance), 0) / total;
          const pct = Math.round(avance * 100);
          return (
            <div key={objetivo}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="line-clamp-2 text-sm font-medium text-zinc-800">
                  {objetivo}
                </span>
                <span className="shrink-0 rounded-md bg-zinc-100 px-1.5 text-xs font-semibold tabular-nums text-zinc-700">
                  {total}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full transition-[width] duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span
                  className="w-12 shrink-0 text-right text-xs font-semibold tabular-nums"
                  style={{ color }}
                >
                  {pct}%
                </span>
              </div>
            </div>
          );
        })}
        {objetivos.length === 0 && (
          <p className="text-xs text-zinc-400">
            No hay acciones que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}
