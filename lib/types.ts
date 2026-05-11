export type Area = {
  id: number;
  slug: string;
  nombre: string;
  encargado: string | null;
  orden: number;
  color: string | null;
  created_at: string;
};

export type Prioridad = "Alta" | "Media" | "Baja";
export type Estado = "Pendiente" | "En curso" | "Completada" | "Bloqueada";
export type Quarter = "Q1" | "Q2" | "Q3" | "Q4";
export type Horizonte = 2026 | 2027 | 2028;

export type Accion = {
  id: number;
  area_id: number;
  objetivo_estrategico: string;
  plan_accion: string;
  responsable: string | null;
  equipo_apoyo: string | null;
  kpi: string | null;
  prioridad: Prioridad;
  estado: Estado;
  avance: number;
  horizonte_anio: Horizonte | null;
  inicio_quarter: Quarter | null;
  fin_quarter: Quarter | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  orden: number;
  created_at: string;
  updated_at: string;
};

export type AccionConArea = Accion & {
  area: Area;
};

export type Seguimiento = {
  id: number;
  accion_id: number;
  fecha: string;
  nota: string;
  autor: string | null;
  created_at: string;
};
