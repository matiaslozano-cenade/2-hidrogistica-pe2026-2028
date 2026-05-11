# 2-hidrogistica-pe2026-2028

Panel de seguimiento del **Plan Estratégico 2026-2028 de Hidrogistica**. La pantalla inicial es un hub con 3 botones (uno por área) para que cada responsable gestione su propio plan: ver acciones, asignar responsables, registrar avance, fechas, KPIs y bitácora de seguimientos.

## Stack

- **Next.js 16** (App Router, Server Components, Server Actions, Turbopack)
- **TypeScript** + **Tailwind CSS v4**
- **Supabase** (Postgres + RLS)
- **Vercel** para deploy
- `lucide-react` (íconos), `date-fns` (fechas)

## Estructura de rutas

| Ruta | Descripción |
|---|---|
| `/` | Hub con tarjetas de las 3 áreas + KPIs globales |
| `/servicio-mercado-del-agua` | Panel del área Servicio Mercado del Agua |
| `/cadena-de-suministro` | Panel del área Cadena de Suministro |
| `/operacion-logistica` | Panel del área Operación Logística |

Cada panel de área tiene tabla de acciones, filtros (objetivo, responsable, año, prioridad, estado), resumen por objetivo estratégico y CRUD completo (crear/editar/eliminar acción, agregar/eliminar seguimientos).

## Estructura de archivos

```
app/
  page.tsx              Hub con 3 botones de área + KPIs globales
  [slug]/page.tsx       Panel de un área (carga datos por slug)
  actions.ts            Server actions: crear/actualizar/eliminar acción, agregar/eliminar seguimiento
  layout.tsx
  globals.css
components/
  PanelArea.tsx         Estado, filtros, orquestación y botón "Nueva acción"
  Filtros.tsx           Búsqueda + selects (objetivo, responsable, año, prioridad, estado)
  Resumen.tsx           Cards con KPIs y avance por objetivo estratégico
  TablaAcciones.tsx     Tabla principal con click → drawer
  AccionDetalle.tsx     Drawer con form completo, bitácora y botón eliminar acción
  NuevaAccion.tsx       Modal para crear una nueva acción
lib/
  supabase/             Clientes browser y server
  types.ts
  utils.ts              Cálculo de días, formatos, semáforos
```

## Modelo de datos

Proyecto Supabase: `wjbwccacjdkuejcriode`. Tablas con prefijo `2_hidrogistica_pe2026_`:

| Tabla | Descripción |
|---|---|
| `2_hidrogistica_pe2026_areas` | Las 3 áreas del plan (Servicio Mercado del Agua, Cadena de Suministro, Operación Logística) con slug, color y orden |
| `2_hidrogistica_pe2026_acciones` | Acciones del plan (73 iniciales, editable): area, objetivo_estrategico (texto libre), plan_accion, responsable, equipo, KPI, prioridad, estado, avance, horizonte_anio (2026/2027/2028), quarter inicio/fin, fechas |
| `2_hidrogistica_pe2026_seguimientos` | Bitácora por acción: fecha, nota, autor |

RLS habilitado con políticas abiertas (MVP sin auth). El campo `objetivo_estrategico` es texto libre — la jerarquía área→objetivo→acción del Excel original se preserva pero los objetivos no son una tabla aparte, lo que permite editarlos directamente desde la UI.

## Identidad visual

- Acento: amarillo Hidrogistica `#f4b41a`
- Header: gradiente navy `#0f1d33 → #1a2c4a → color del área`
- Por área:
  - Servicio Mercado del Agua → azul claro `#0ea5e9`
  - Cadena de Suministro → amarillo Hidrogistica `#f4b41a`
  - Operación Logística → verde `#10b981`

## Desarrollo local

```bash
git clone https://github.com/matiaslozano-cenade/2-hidrogistica-pe2026-2028
cd 2-hidrogistica-pe2026-2028
npm install
# .env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Deploy

Desplegado en Vercel team `matiaslozano-cenades-projects` como proyecto `2-hidrogistica-pe2026-2028`. Variables `NEXT_PUBLIC_SUPABASE_*` configuradas en Production / Preview / Development.

## Origen de datos

Carga inicial desde `Hidrogistica_Plan_Estrategico_2026-2028.xlsx`: 73 acciones distribuidas en 3 áreas, 9 objetivos estratégicos. Sin responsables ni avances al inicio — se completan desde la UI.
