# REDESIGN NOTES — Full Spin v2

Bitácora de decisiones, pendientes y bloqueos durante el rediseño guiado por `CLAUDE.md`.

## Estado por fase

- **Fase 1 — Fundamentos**: en progreso.
  - [x] Paso 1: tokens HSL de marca en `globals.css`.
  - [ ] Paso 2: `tailwind.config.ts` con `colors.brand.*` + `fontFamily.sans`.
  - [ ] Paso 3: `app/layout.tsx` con `Hanken_Grotesk` + `Inter` fallback.
  - [ ] Paso 4: reescribir `components/ui/button.tsx` con 6 variants × 4 estados.
  - [ ] Paso 5: quitar `typescript.ignoreBuildErrors` y arreglar errores.
- **Fase 2 — Layout compartido**: pendiente.
- **Fase 3 — Refactor de Home**: pendiente.
- **Fase 4 — Refactor páginas catálogo**: pendiente.
- **Fase 5 — PDP `/producto/[id]`**: pendiente.
- **Fase 6 — Polish**: pendiente.

## Decisiones tomadas

- Rama de trabajo: `redesign/v2` (creada desde `main`).
- Las utilities `.glass-effect`, `.gradient-text`, `.hover-lift`, `.card-modern` se reescriben **planas** (sin gradientes/blur) en vez de borrarse, para no romper las páginas existentes mientras se refactorizan en fases posteriores.
- Bloque `.dark` removido de `globals.css` porque CLAUDE.md indica desestimar dark mode.
- Tokens shadcn no especificados en CLAUDE.md (`--card`, `--popover`, `--border`, `--input`, `--destructive-foreground`) se completan con valores neutros consistentes con la paleta de marca.

## TODO / pendientes con el dueño

- [ ] **SVG finales del logo** en 3 versiones (full / stacked / isotype). Mientras tanto, placeholders SVG simples cuando lleguemos a Fase 2.
- [ ] **Hero / banner images** finales (¿la diseñadora los renueva o reutilizamos `/public/optimized/`?).
- [ ] **Modal de quick view**: ¿solo PDP o se mantiene el modal como vista rápida opcional? (sugerencia: solo PDP).
- [ ] **`/admin`**: ¿alineación visual mínima (button/input/card con tokens) o se deja tal cual?

## Bloqueos

_(ninguno por ahora)_
