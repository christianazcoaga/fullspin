# FullSpin Ecommerce

**FullSpin** es una tienda online especializada en equipamiento deportivo para **Padel** y **Tenis de Mesa**. Ofrecemos paletas, mesas, pelotas, ropa y accesorios de las mejores marcas, con una experiencia de compra moderna y responsiva.

## 🚀 Demo

[fullspinarg.com](https://fullspinarg.com)

## Tabla de Contenidos

- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Scripts Disponibles](#scripts-disponibles)
- [SEO y Accesibilidad](#seo-y-accesibilidad)
- [Licencia](#licencia)

---

## Características

- Catálogo de productos de padel y tenis de mesa con filtros, búsqueda y ordenamiento.
- Integración con Supabase para gestión de productos y autenticación.
- Diseño moderno, responsivo y optimizado para SEO.
- Consulta rápida por WhatsApp.
- Panel de administración (privado).
- Login seguro.
- Componentes reutilizables y UI basada en Radix UI y TailwindCSS.

---

## Estructura del Proyecto

```
.
├── app/
│   ├── page.tsx                # Página principal (Inicio)
│   ├── padel/                  # Catálogo de padel
│   ├── tenis-mesa/             # Catálogo de tenis de mesa
│   ├── sobre-nosotros/         # Información de la empresa
│   ├── login/                  # Login de usuarios
│   └── admin/                  # Panel de administración
├── components/                 # Componentes reutilizables y UI
├── lib/
│   ├── products.ts             # Lógica de productos y conexión a Supabase
│   └── supabase/               # Cliente y utilidades de Supabase
├── public/                     # Imágenes y recursos estáticos
├── styles/                     # Estilos globales
├── package.json
└── ...
```

---

## Tecnologías

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Supabase](https://supabase.com/) (Base de datos y autenticación)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React](https://lucide.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## Instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/fullspin-ecommerce.git
   cd fullspin-ecommerce
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configura las variables de entorno:**  
   Crea un archivo `.env.local` y agrega tus claves de Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   ```

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## Variables de Entorno

- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave pública anónima de Supabase.

---

## Scripts Disponibles

- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Compila la aplicación para producción.
- `npm run start` — Inicia la aplicación en modo producción.
- `npm run lint` — Ejecuta el linter.

---

## SEO y Accesibilidad

- Estructura semántica y navegación accesible.
- Optimización para motores de búsqueda y redes sociales.

---

## Licencia

MIT 
