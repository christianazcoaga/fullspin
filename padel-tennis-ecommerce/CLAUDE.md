# CLAUDE.md — Rediseño de Full Spin (instrucciones para Claude Code)

> Pegá este archivo en la raíz del repo (`/CLAUDE.md`). Claude Code lo lee automáticamente como contexto persistente en cada sesión.

---

## 1. Contexto

Soy el dueño de **Full Spin** ([www.fullspinarg.com](https://www.fullspinarg.com/)), e-commerce argentino de raquetas (padel, tenis, tenis de mesa). Vamos a rediseñar el sitio respetando una identidad de marca ya definida por mi diseñadora. **No inventes colores, tipografías ni estilos por fuera de lo especificado en este archivo.**

El rediseño es **visual y de arquitectura de componentes**. La lógica de negocio (Supabase, autenticación, admin, WhatsApp como checkout, newsletter) **se mantiene tal cual**.

---

## 2. Stack actual (ya auditado, no lo descubras de nuevo)

- **Next.js 16.0.8** con App Router + Turbopack + RSC.
- **React 19** + **TypeScript 5**.
- **Tailwind CSS 3.4.17** con configuración HSL-based (CVA / shadcn).
- **shadcn/ui** (Radix primitives + class-variance-authority). Config en `components.json` (alias `@/components`, `@/lib`, `@/components/ui`).
- **Lucide icons**.
- **Supabase** (auth + tabla `productos_fullspin`). Cliente browser y server ya configurados en `lib/supabase/`.
- **Vercel Analytics** + `next-sitemap`.
- **next-themes** instalado pero **no usado** (no hay dark mode visible) — desestimar dark mode salvo que pida explícitamente.
- WhatsApp como "checkout": `https://wa.me/543705103672` con mensaje pre-armado.

### Esquema de la tabla `productos_fullspin`
```ts
type Product = {
  id: number
  name: string
  marca: string
  category: string         // "padel" | "tenis" | "tenis-mesa"
  subcategory: string      // "palas" | "paletas" | "raquetas" | "zapatillas" | "pelotas" | "bolsos" | "ropa" | "accesorios" | "gomas" | "mesas"
  price: number
  price_usd: number
  image: string            // URL única (no hay galería)
  description: string
  in_stock: boolean
  in_offer: boolean
  offer_percent: number
  coming_soon: boolean
  created_at: string
}
```

### Páginas existentes
- `/` (home) — `app/page.tsx` (SSR) + `components/HomePageClient.tsx` (1.562 líneas, hay que partirlo)
- `/padel`, `/tenis`, `/tenis-mesa` — ~1.008 líneas cada una, **copy-paste casi idéntico**
- `/ofertas` — 692 líneas, mismo patrón
- `/sobre-nosotros` — 567 líneas
- `/buscar` — 339 líneas
- `/login` — 78 líneas (Supabase auth)
- `/admin` — privada, no la toques visualmente salvo lo mínimo (botones, inputs)

---

## 3. Problemas críticos detectados (qué arreglar)

1. **Duplicación masiva**: header, footer, mobile menu, modal de producto, filtros, y bloques `<style jsx global>` están copiados literalmente entre `app/padel/page.tsx`, `app/tenis/page.tsx`, `app/tenis-mesa/page.tsx`, `app/ofertas/page.tsx`. Hay que extraer todo a componentes compartidos.
2. **`HomePageClient.tsx` (1.562 líneas)**: un solo archivo monolítico con header, hero, carrusel, ofertas, categorías, newsletter, footer y modales. Hay que dividirlo.
3. **Tipografía**: `app/layout.tsx` usa `Inter` desde `next/font/google`. Cambiar por **Hanken Grotesk** principal e Inter como fallback.
4. **Colores fuera de marca**: el sitio entero usa `bg-blue-600`, `from-blue-600 via-blue-700`, `from-green-600 to-green-700`, `gradient-text` con violeta/rosa. Nada de eso está en la paleta. Hay que reemplazarlo todo por los tokens de marca.
5. **Logo**: hoy es `<Image src="/fullspin-logo.png" />` 50×50 con `rounded-xl`. Tiene que ser SVG en 3 variantes (full / stacked / isotype) responsivas.
6. **No hay PDP real**: los productos abren modales con la misma URL. Crear `/producto/[id]` (SEO + Schema.org `Product`).
7. **`typescript.ignoreBuildErrors: true`** en `next.config.mjs`. Sacarlo y arreglar los errores.
8. **Constantes duplicadas**: `brandLogos`, `subcategoryNames`, listas de subcategorías están redefinidas en cada `page.tsx`. Centralizarlas en `lib/catalog.ts`.
9. **Mezcla `<img>` y `next/image`** sin criterio. Unificar a `next/image` salvo SVG inline.
10. **Estilos JSX globales repetidos**: keyframes `fade-in`, `scale-in`, `fadeInUp`, clases `glass-effect`, `gradient-text`, `hover-lift`, `card-modern` están duplicadas en cada página. Mover todo a `app/globals.css` (ya existen ahí, solo hay que eliminar las copias).
11. **`components/ui/button.tsx`** es el button shadcn default, no refleja la marca. Hay que reescribir el `cva` con las 6 variants y 4 estados.

---

## 4. Identidad de marca (regla obligatoria)

### 4.1. Paleta — 6 colores oficiales

| Color | HEX | HSL (para CSS vars) | Uso |
|---|---|---|---|
| Negro | `#2D2D2D` | `0 0% 18%` | Texto principal, botones primarios neutros |
| Naranja | `#FD653E` | `13 98% 62%` | **SOLO promociones/ofertas**. No abusar. |
| Crema | `#F9F8F1` | `53 47% 96%` | Fondos claros, botones outline |
| Verde Neón | `#CCFF2E` | `72 100% 59%` | **CTA de compra** (Comprar / Consultar por WhatsApp) |
| Azul Oscuro | `#1381C3` | `204 82% 42%` | Acciones secundarias, links, focus rings |
| Azul Claro | `#5AB3E0` | `202 70% 62%` | Acciones terciarias, acentos |

> **Importante**: el sistema actual de Tailwind usa HSL via CSS variables (`hsl(var(--primary))`). Cargá los nuevos tokens en HSL en `app/globals.css` para que todo el sistema CVA siga funcionando.

### 4.2. Avisos del sistema
- **Error**: rojo `#D92D20` texto / `#FEE4E2` fondo.
- **Success**: verde `#12B76A` texto / `#D1FADF` fondo.
- **Info**: usar `#1381C3` (azul de marca).
- **Warning**: `#F79009` (NO `#FD653E`).

Verificar contraste WCAG AA en todos los pares.

### 4.3. Tipografía — Hanken Grotesk (Inter fallback)

Cargar con `next/font/google` y self-host automático. En `app/layout.tsx`:

```tsx
import { Hanken_Grotesk, Inter } from 'next/font/google'

const hankenGrotesk = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-hanken',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})
```

Aplicar `${hankenGrotesk.variable} ${inter.variable}` en `<html>` y configurar Tailwind:
```ts
fontFamily: {
  sans: ['var(--font-hanken)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
}
```

### 4.4. Escala tipográfica (8pt grid)
Solo estos tamaños: **12, 14, 16, 20, 24, 32, 40, 48, 64 px**.

| Token | Peso | Size | Line-height | Letter-spacing | Uso |
|---|---|---|---|---|---|
| Display/Hero | 800 | 56–72px | 1.05–1.15 | -1% a -2% | Hero, landing |
| H1 | 700 | 40–48px | 1.1–1.2 | -0.5% a -1% | Título de página |
| H2 | 600 | 32–36px | 1.2–1.3 | -0.3% | Secciones |
| H3 | 600 | 24–28px | 1.3 | 0% | Subsecciones |
| H4 | 600 | 18–20px | 1.4 | — | Cards |
| Body Large | 400/500 | 16–18px | 1.5–1.6 | — | Destacado |
| Body | 400 | 14–16px | 1.5–1.7 | — | Base |
| Caption | 400 | 12–13px | 1.4 | — | 60–70% opacidad |
| UI / Button | 500/600 | 13–15px | 1 | +0.2% a +0.5% | Botones, etiquetas |

Mobile: reducir 10–15% (Hero 40–48, H1 32–36, H2 24–28, Body 14–15).
Implementar fluid type con `clamp()`.

### 4.5. Formas — todo redondeado
- Botones / inputs: `rounded-lg` (8–12px).
- Cards / contenedores: `rounded-xl` (12–16px).
- Modales: `rounded-2xl` (16–20px).
- Pills / badges: `rounded-full`.
- **Nada afilado**.

### 4.6. Fotos de producto
- **Fondo blanco sólido**, sin sombras ni efectos.
- Sacar gradientes `bg-gradient-to-br from-slate-50 to-blue-50/30` que envuelven las fotos hoy.
- Aspect-ratio 1:1 consistente.
- Sí mantener `next/image` con WebP/AVIF (ya está en `next.config.mjs`).

### 4.7. Microinteracciones
- Botón hover: color base más claro ("se ilumina"), 150–200ms ease-out.
- Botón active: `scale(0.98)`.
- Card hover: `translateY(-2px)` + sombra suave (NO `translateY(-8px) shadow-2xl` como hoy).
- Input focus: borde `#1381C3` + halo `0 0 0 3px rgba(19,129,195,0.2)`.
- Respetar `@media (prefers-reduced-motion: reduce)`.

### 4.8. Sistema de botones (6 variantes × 4 estados)

Reescribir `components/ui/button.tsx` con `cva` para que tenga:

**Variants**: `black` (default), `orange`, `outline`, `neon`, `blueDark`, `blueLight`, más las shadcn estándar (`ghost`, `link`) si se usan en admin.

**Estados** (todos con transición 150–200ms ease-out):
1. **Default** — color base.
2. **Hover** — versión más clara del base ("iluminado"). Outline → relleno suave.
3. **Active** — `scale(0.98)` + leve oscurecimiento.
4. **Disabled** — opacidad 30–40%, `cursor: not-allowed`, sin hover.

**Reglas de uso**:
- `neon` → "Comprar ahora", "Consultar por WhatsApp" en PDP y cards.
- `orange` → banners promocionales, ribbons "OFERTA".
- `black` → CTAs neutros importantes ("Ver catálogo", "Cargar más").
- `outline` → secundarios.
- `blueDark` / `blueLight` → terciarios, links destacados.

Altura mínima 44px, padding generoso, ícono `→` a la derecha en CTA de avance.

---

## 5. Plan de trabajo (6 fases, ramas y commits)

Trabajá en una rama nueva: `git checkout -b redesign/v2`.

Cada fase = un grupo de commits atómicos con prefijo (`feat:`, `refactor:`, `style:`, `fix:`, `chore:`). Al terminar cada fase, **pausá y mostrame el diff antes de seguir**.

Mantené un archivo `REDESIGN_NOTES.md` en la raíz con decisiones tomadas, pendientes y bloqueos.

### FASE 1 — Fundamentos (tokens + tipografía + button base)

1. **`app/globals.css`**: reemplazar el bloque `:root` con los nuevos tokens HSL de marca. Mantener la estructura HSL para no romper shadcn. Mapeo sugerido:
   ```css
   --background: 53 47% 96%;        /* crema */
   --foreground: 0 0% 18%;          /* negro */
   --primary: 0 0% 18%;             /* negro */
   --primary-foreground: 53 47% 96%;
   --secondary: 204 82% 42%;        /* azul oscuro */
   --secondary-foreground: 0 0% 100%;
   --accent: 72 100% 59%;           /* neón */
   --accent-foreground: 0 0% 18%;
   --destructive: 0 73% 49%;
   --muted: 53 47% 96%;
   --muted-foreground: 0 0% 40%;
   --ring: 204 82% 42%;
   --radius: 0.75rem;
   ```
   Y agregar tokens custom no shadcn:
   ```css
   --brand-black: 0 0% 18%;
   --brand-orange: 13 98% 62%;
   --brand-cream: 53 47% 96%;
   --brand-neon: 72 100% 59%;
   --brand-blue-dark: 204 82% 42%;
   --brand-blue-light: 202 70% 62%;
   ```
   Borrar `.glass-effect`, `.gradient-text`, `.hover-lift`, `.card-modern` (o reescribirlas planas, sin gradientes ni blur).

2. **`tailwind.config.ts`**: agregar al `theme.extend.colors`:
   ```ts
   brand: {
     black: 'hsl(var(--brand-black))',
     orange: 'hsl(var(--brand-orange))',
     cream: 'hsl(var(--brand-cream))',
     neon: 'hsl(var(--brand-neon))',
     'blue-dark': 'hsl(var(--brand-blue-dark))',
     'blue-light': 'hsl(var(--brand-blue-light))',
   }
   ```
   Y `fontFamily.sans` apuntando a las CSS variables de Hanken/Inter.

3. **`app/layout.tsx`**: reemplazar `Inter` por `Hanken_Grotesk` + `Inter` como fallback (ver §4.3). Aplicar variables al `<html>`.

4. **`components/ui/button.tsx`**: reescribir el `cva` con las 6 variants y 4 estados (§4.8). Mantener `forwardRef` y `asChild`.

5. **`next.config.mjs`**: quitar `typescript.ignoreBuildErrors: true` y arreglar los errores de TS que aparezcan (deberían ser pocos).

**Commits sugeridos**:
- `feat(theme): add Full Spin brand tokens to globals.css and tailwind config`
- `feat(fonts): switch from Inter to Hanken Grotesk with Inter fallback`
- `refactor(button): rewrite ui/button with 6 brand variants and 4 states`
- `chore(ts): remove ignoreBuildErrors and fix type errors`

---

### FASE 2 — Layout compartido (Header / Footer / Logo / Nav)

Crear estos componentes nuevos y usarlos en `app/layout.tsx` para que **dejen de estar inlineados** en cada página:

1. **`components/layout/Logo.tsx`** — con prop `variant: "full" | "stacked" | "isotype"` y `color: "dark" | "light"`. SVG inline, usá `currentColor` para que herede color por contexto. Lógica responsive interna:
   ```tsx
   <span className="hidden lg:block"><LogoFull /></span>
   <span className="hidden md:block lg:hidden"><LogoStacked /></span>
   <span className="md:hidden"><LogoIsotype /></span>
   ```
   Mientras no tenga los SVG finales de mi diseñadora, dejá **placeholders SVG simples** (no PNG). Anotá en `REDESIGN_NOTES.md` un TODO claro.

2. **`components/layout/Header.tsx`** — header sticky con:
   - Logo a la izquierda (componente `<Logo />`).
   - Nav desktop con links a `/`, `/padel`, `/tenis`, `/tenis-mesa`, `/ofertas`, `/sobre-nosotros`. Estado activo según `usePathname()`.
   - Buscador inline (extraer la lógica del search del HomePageClient).
   - Botón mobile menu trigger.
   - Sin `glass-effect`, sin `backdrop-blur-xl` agresivo. Fondo crema sólido o blanco con borde sutil.

3. **`components/layout/MobileMenu.tsx`** — usar `<Sheet>` de shadcn (ya está disponible). Mismo nav que desktop.

4. **`components/layout/Footer.tsx`** — extraer footer actual. Mantener WhatsApp `+54 370 510-3672`, email `info@fullspin.com.ar`, IG `@fullspinargentina`. Reemplazar `bg-gray-900` por `bg-brand-black`, links hover en `text-brand-blue-light`.

5. **`app/layout.tsx`** — envolver `{children}` con `<Header />` arriba y `<Footer />` abajo. Eliminar todos los headers/footers inlineados de cada página.

**Commits**:
- `feat(layout): add Logo component with full/stacked/isotype responsive variants`
- `feat(layout): extract Header, MobileMenu and Footer to shared components`
- `refactor(pages): remove inline header/footer from category pages`

---

### FASE 3 — Refactor de Home

`HomePageClient.tsx` (1.562 líneas) → dividir en:

```
components/home/
  HomeHero.tsx            // hero con Display + CTAs
  PromoCarousel.tsx       // carousel promocional actual
  FeaturedCategories.tsx  // sección categorías (padel/tenis/tenis-mesa)
  OffersSection.tsx       // ya existe ProductOfferSection.tsx, reutilizar
  ComingSoonSection.tsx   // próximos lanzamientos
  TrustBlock.tsx          // envíos, garantía, calidad
  NewsletterCTA.tsx       // formulario de suscripción
  GlobalSearch.tsx        // buscador con dropdown de resultados
  ProductQuickView.tsx    // modal compartido (reusable, también en categorías)
```

Cada uno debe:
- Aceptar props mínimas y tipadas.
- Usar las nuevas variants de `Button` (no inline `bg-gradient-to-r ...`).
- Eliminar gradientes y `gradient-text`. Hero plano sobre fondo crema o imagen de fondo con overlay sólido `brand-black/40`.
- "Ver Catálogo" → `Button variant="black"`. "Explorar Ofertas" → `variant="orange"` o `outline`.

Reemplazar el archivo monolítico `HomePageClient.tsx` con un archivo orquestador chico (~80 líneas) que solo importe y componga los sub-componentes.

**Commits sugeridos**: uno por componente extraído + uno final removiendo las partes ya extraídas del archivo original.

---

### FASE 4 — Refactor de páginas de catálogo

Las 4 páginas (`padel`, `tenis`, `tenis-mesa`, `ofertas`) hoy son ~1.000 líneas idénticas. Hay que crear:

1. **`lib/catalog.ts`** — fuente de verdad única para constantes de catálogo:
   ```ts
   export const CATEGORIES = [
     { slug: 'padel', label: 'Padel', subcategories: [...] },
     { slug: 'tenis', label: 'Tenis', subcategories: [...] },
     { slug: 'tenis-mesa', label: 'Tenis de Mesa', subcategories: [...] },
   ] as const;

   export const SUBCATEGORY_LABELS: Record<string, string> = {
     palas: 'Palas', paletas: 'Paletas', raquetas: 'Raquetas',
     zapatillas: 'Zapatillas', pelotas: 'Pelotas', bolsos: 'Bolsos',
     ropa: 'Ropa', accesorios: 'Accesorios', gomas: 'Gomas', mesas: 'Mesas',
   };

   export const BRAND_LOGOS: Record<string, { src: string; alt: string }> = {...};

   export const PRICE_RANGES = [
     { value: 'all', label: 'Todos los precios' },
     { value: '0-50000', label: 'Hasta $50.000' },
     ...
   ];
   ```

2. **`components/catalog/CategoryPage.tsx`** — componente reutilizable que recibe `category: "padel" | "tenis" | "tenis-mesa" | "ofertas"` y resuelve internamente:
   - Hero superior (título + descripción).
   - Filtros (subcategoría, precio, marca, sort).
   - Sheet con filtros mobile.
   - Grid de `<ProductCard />`.
   - "Cargar más" pagination.
   - Modal `<ProductQuickView />`.

3. **`components/catalog/ProductCard.tsx`** — extraer la card que hoy está duplicada 4 veces. Recibe `product: Product` y un `onQuickView` callback. Usa `Button variant="neon"` para el CTA de WhatsApp.

4. **`components/catalog/CategoryFilters.tsx`** — los Selects de subcategoría/precio/marca/sort. Acepta state via props o un store local.

5. **`hooks/useCategoryFilters.ts`** — la lógica de filtrado que hoy está duplicada (búsqueda, subcategoría, precio, marca, sort, ordenamiento por ofertas primero).

Después, las páginas quedan **chiquitas**:

```tsx
// app/padel/page.tsx
import CategoryPage from '@/components/catalog/CategoryPage';
export default function PadelPage() {
  return <CategoryPage category="padel" />;
}
```

(Si necesitan SSR de productos, hacer la fetch en el server component y pasar los productos como prop a `<CategoryPage>` que es client.)

**Commits**: extracción incremental, una página a la vez. Empezá por padel, validá, después tenis, tenis-mesa, ofertas.

---

### FASE 5 — PDP real (`/producto/[id]`)

Crear ruta nueva `app/producto/[id]/page.tsx`:

- Server component que hace fetch del producto por id desde Supabase.
- Galería: con un solo `image` actual, mostrar foto grande con aspect 1:1, fondo blanco sólido, sin sombras. Cuando haya múltiples imágenes a futuro, ya queda la estructura.
- Título H1, marca con logo, descripción, precio (con descuento si aplica).
- CTA principal `Button variant="neon" size="lg"` → "Consultar por WhatsApp".
- Sección "Productos relacionados" (misma categoría, 4 items).
- Schema.org `Product` + `Offer` en `<script type="application/ld+json">`.
- Metadata dinámica (`generateMetadata`) con title, description, OG image apuntando a `product.image`.

Cambiar el modal de quick-view en cards y home: en lugar de abrir modal, navegar a `/producto/[id]`. Mantener el modal opcionalmente como "vista rápida" si querés (decidilo y avisame).

Agregar al `next-sitemap.config.js` la generación de URLs de productos.

---

### FASE 6 — Polish

1. **Metadata por página**: cada `page.tsx` debe exportar `metadata` con title específico ("Padel | Full Spin", etc.) y description.
2. **404** y **error.tsx** estilizados con la marca.
3. **Sacar `<style jsx global>` duplicados** de cada página (ya deberían estar en globals.css).
4. **Unificar `<img>` → `<Image>`** de next/image.
5. **Accesibilidad**: focus-visible en todos los interactivos, `aria-label` en iconbuttons (Heart, Share2, X), `alt` descriptivos.
6. **`prefers-reduced-motion`**: wrappear las animaciones en media query.
7. **Lighthouse**: correr y apuntar a ≥90 en todas las métricas.

---

## 6. Reglas duras (NO hacer)

- ❌ No agregues colores fuera de los 6 de marca + los 4 de sistema.
- ❌ No uses gradientes (`bg-gradient-to-*`). La marca es plana.
- ❌ No uses `gradient-text`, `glass-effect`, `backdrop-blur-xl`. Borralos.
- ❌ No uses `text-blue-600`, `bg-blue-600`, `from-blue-*`, `from-green-*`. Reemplazalos por tokens de marca.
- ❌ No uses fuentes distintas a Hanken Grotesk / Inter.
- ❌ No uses bordes afilados (todo `rounded-*`).
- ❌ No abuses del naranja `#FD653E` — solo promos.
- ❌ No le pongas sombras o gradientes a las fotos de producto.
- ❌ No commitees `node_modules`, `.env*`, `.next/`, secrets.
- ❌ No instales dependencias nuevas sin avisarme primero (excepto si son sub-deps de algo ya instalado).
- ❌ No toques la lógica de Supabase, auth, admin, ni el flujo WhatsApp.
- ❌ No cambies el esquema de la tabla `productos_fullspin`.
- ❌ No remplaces el `Preloader` ni `Vercel Analytics` ni `next-sitemap`.
- ❌ No hagas migración de plataforma. Seguimos en Next.js 16.

## 7. Reglas de proceso

- ✅ Trabajá en `redesign/v2`, no en `main`.
- ✅ Commits atómicos con prefijos convencionales (`feat:`, `refactor:`, `style:`, `fix:`, `chore:`, `docs:`).
- ✅ Al terminar cada fase, **pausá y mostrame diff/resumen antes de seguir**.
- ✅ Mantené `REDESIGN_NOTES.md` con decisiones, pendientes y TODOs (especialmente el TODO de los SVG finales del logo).
- ✅ Si encontrás algo ambiguo, **preguntá** en lugar de asumir.
- ✅ Si una decisión choca con código existente, mostrá las dos opciones y dejame decidir.
- ✅ Si vas a tocar más de 5 archivos en un commit, partilo en commits más chicos.

---

## 8. Cosas que tenés que pedirme cuando las necesites

Solo estas (el resto está resuelto en este archivo):

1. **SVG finales del logo** en sus 3 versiones (full / stacked / isotype) cuando estén listos. Mientras tanto: placeholders.
2. **Banner / hero images** finales si la diseñadora los va a renovar. Si no, reutilizá los actuales en `/public/optimized/`.
3. **Decisión sobre el modal de quick view**: ¿lo mantenemos junto al PDP o solo PDP? (mi sugerencia: solo PDP, modal queda como vista rápida opcional).
4. **¿Mantenemos `/admin` con el diseño actual o lo retocamos también?** (mi inclinación: mínima alineación visual: aplicar tokens al button/input/card y nada más).

---

## 9. Arrancá ahora

Empezá por **Fase 1, paso 1** (tokens en `globals.css`). Hacé los cambios, mostrame el diff, y esperá mi OK antes de seguir con los demás pasos de la fase.

---

## TL;DR (para vos, Claude Code)

Stack: Next 16 + RSC + TS + Tailwind + shadcn + Supabase. No descubras stack de nuevo.
Marca: Hanken Grotesk + 6 colores HSL en tokens, todo redondeado, sin gradientes, fotos blancas planas.
Botón: 6 variants × 4 estados, neón=comprar, naranja=promo, negro=neutro.
Refactor: extraer Header/Footer/Logo a layout, partir HomePageClient (1.5k líneas), unificar 4 páginas catálogo en `<CategoryPage />`, crear PDP `/producto/[id]`.
Rama `redesign/v2`, commits atómicos, pausa después de cada fase.