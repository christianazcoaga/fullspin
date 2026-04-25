# REDESIGN NOTES — Full Spin v2

Bitácora de decisiones, pendientes y bloqueos durante el rediseño guiado por `CLAUDE.md`.

## Estado por fase

- **Fase 1 — Fundamentos**: completada.
  - [x] Paso 1: tokens HSL de marca en `globals.css`.
  - [x] Paso 2: `tailwind.config.ts` con `colors.brand.*` + `fontFamily.sans`.
  - [x] Paso 3: `app/layout.tsx` con `Hanken_Grotesk` + `Inter` fallback.
  - [x] Paso 4: reescribir `components/ui/button.tsx` con 6 variants × 4 estados.
  - [x] Paso 5: quitar `typescript.ignoreBuildErrors` y arreglar errores.
- **Fase 2 — Layout compartido**: completada.
  - [x] `Logo.tsx` con 3 variants + responsive + placeholders SVG.
  - [x] `Header.tsx` sticky con nav activo (`usePathname`).
  - [x] `HeaderSearch.tsx` con dropdown debounced (extraído de HomePageClient).
  - [x] `MobileMenu.tsx` con shadcn `Sheet`.
  - [x] `Footer.tsx` con tokens de marca, WhatsApp/email/IG.
  - [x] `SiteChrome.tsx` wrapper que oculta header/footer en `/admin*` y `/login`.
  - [x] `app/layout.tsx` cableado con `<SiteChrome>{children}</SiteChrome>`.
  - [x] Header/footer inline removidos de padel, tenis, tenis-mesa, ofertas, sobre-nosotros, buscar y HomePageClient.
- **Fase 3 — Refactor de Home**: pendiente.
- **Fase 4 — Refactor páginas catálogo**: pendiente.
- **Fase 5 — PDP `/producto/[id]`**: pendiente.
- **Fase 6 — Polish**: pendiente.

## Decisiones tomadas

- Rama de trabajo: `redesign/v2` (creada desde `main`).
- Las utilities `.glass-effect`, `.gradient-text`, `.hover-lift`, `.card-modern` se reescriben **planas** (sin gradientes/blur) en vez de borrarse, para no romper las páginas existentes mientras se refactorizan en fases posteriores.
- Bloque `.dark` removido de `globals.css` porque CLAUDE.md indica desestimar dark mode.
- Tokens shadcn no especificados en CLAUDE.md (`--card`, `--popover`, `--border`, `--input`, `--destructive-foreground`) se completan con valores neutros consistentes con la paleta de marca.
- `Button` mantiene aliases `default`/`secondary`/`destructive` apuntando a colores de marca para no romper admin/category pages durante la migración. Se removerán en Fase 4 cuando esas páginas se refactoren.
- `backend/` excluido del `tsconfig.json` de Next: es un proyecto Express+Sequelize separado sin deps en este `package.json`.
- `SiteChrome` (client wrapper) oculta Header/Footer en `/admin*` y `/login` para no romper esos flujos. Alternativa a route groups, evita mover archivos.
- `HeaderSearch` debounced está extraído al layout. Hasta que llegue el PDP (Fase 5), un click sobre un resultado navega a `/buscar?q=<nombre>` en vez de abrir un modal global.

## TODO / pendientes con el dueño

- [ ] **SVG finales del logo** en 3 versiones (full / stacked / isotype). Mientras tanto, placeholders SVG simples cuando lleguemos a Fase 2.
- [ ] **Hero / banner images** finales (¿la diseñadora los renueva o reutilizamos `/public/optimized/`?).
- [ ] **Modal de quick view**: ¿solo PDP o se mantiene el modal como vista rápida opcional? (sugerencia: solo PDP).
- [ ] **`/admin`**: ¿alineación visual mínima (button/input/card con tokens) o se deja tal cual?

## Bloqueos

_(ninguno por ahora)_
