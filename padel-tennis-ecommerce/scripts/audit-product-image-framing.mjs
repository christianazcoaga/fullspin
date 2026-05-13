/**
 * Audit product image framing.
 *
 * Downloads every product image from Supabase, computes the bounding box of
 * non-white content, and reports which products have the product occupying
 * significantly less of the canvas than the average — those are the ones that
 * look "smaller" in the grid.
 *
 * Usage: node scripts/audit-product-image-framing.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY in .env(.local).
 */

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

// Manual .env(.local) loader so we don't depend on dotenv.
function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const p = path.resolve(process.cwd(), file)
    if (!fs.existsSync(p)) continue
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      if (!process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "")
    }
  }
}
loadEnv()

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!URL || !KEY) {
  console.error("Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en .env")
  process.exit(1)
}

// White threshold — any channel below this counts as "content".
const WHITE = 238
const CONCURRENCY = 6

async function fetchProducts() {
  const res = await fetch(
    `${URL}/rest/v1/productos_fullspin?select=id,name,marca,category,subcategory,image&order=id.asc`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } }
  )
  if (!res.ok) throw new Error(`Supabase: ${res.status} ${await res.text()}`)
  return res.json()
}

async function measure(url) {
  const res = await fetch(url)
  if (!res.ok) return { error: `HTTP ${res.status}` }
  const buf = Buffer.from(await res.arrayBuffer())

  // Force RGB, drop alpha (treat transparent as white).
  const img = sharp(buf).flatten({ background: "#ffffff" })
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h, channels } = info

  let minX = w, minY = h, maxX = -1, maxY = -1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * channels
      if (data[i] < WHITE || data[i + 1] < WHITE || data[i + 2] < WHITE) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0) return { error: "blank image" }

  const bboxW = maxX - minX + 1
  const bboxH = maxY - minY + 1
  // Coverage = how much of the canvas's longer dimension the product spans.
  // Using max(bboxW/w, bboxH/h) approximates how big it'll look inside an
  // aspect-square object-contain box.
  const coverage = Math.max(bboxW / w, bboxH / h)

  return {
    w, h,
    bboxW, bboxH,
    coverageMaxDim: coverage,
    coverageW: bboxW / w,
    coverageH: bboxH / h,
    paddingTop: minY / h,
    paddingBottom: (h - 1 - maxY) / h,
    paddingLeft: minX / w,
    paddingRight: (w - 1 - maxX) / w,
  }
}

async function runPool(items, fn, concurrency) {
  const results = new Array(items.length)
  let i = 0
  const workers = Array.from({ length: concurrency }, async () => {
    while (true) {
      const idx = i++
      if (idx >= items.length) return
      try {
        results[idx] = await fn(items[idx], idx)
      } catch (e) {
        results[idx] = { error: e.message }
      }
    }
  })
  await Promise.all(workers)
  return results
}

;(async () => {
  const products = await fetchProducts()
  console.log(`Analizando ${products.length} productos…`)

  const measured = await runPool(
    products,
    async (p, idx) => {
      if (!p.image) return { product: p, error: "sin imagen" }
      process.stdout.write(`\r[${idx + 1}/${products.length}] ${p.name.slice(0, 60).padEnd(60)}`)
      const m = await measure(p.image)
      return { product: p, ...m }
    },
    CONCURRENCY
  )
  process.stdout.write("\n")

  const ok = measured.filter((r) => !r.error && r.coverageMaxDim != null)
  const failed = measured.filter((r) => r.error)

  if (!ok.length) {
    console.error("No se pudo medir ninguna imagen.")
    return
  }

  const avg = ok.reduce((s, r) => s + r.coverageMaxDim, 0) / ok.length
  ok.sort((a, b) => a.coverageMaxDim - b.coverageMaxDim)

  console.log(`\nPromedio de cobertura (lado más largo): ${(avg * 100).toFixed(1)}%\n`)
  console.log(
    "Fotos con producto MÁS chico que el promedio (top 25 — re-exportar éstas primero):\n"
  )
  console.log(
    "  cov%   paddingT/B/L/R         id   marca         subcat       nombre"
  )
  console.log("  ────────────────────────────────────────────────────────────────────────")

  for (const r of ok.slice(0, 25)) {
    const p = r.product
    const cov = (r.coverageMaxDim * 100).toFixed(1).padStart(5)
    const pad = `${(r.paddingTop * 100).toFixed(0)}/${(r.paddingBottom * 100).toFixed(0)}/${(r.paddingLeft * 100).toFixed(0)}/${(r.paddingRight * 100).toFixed(0)}`.padEnd(20)
    const id = String(p.id).padStart(4)
    const marca = (p.marca || "-").padEnd(12).slice(0, 12)
    const sub = (p.subcategory || "-").padEnd(11).slice(0, 11)
    console.log(`  ${cov}%  ${pad} ${id}  ${marca}  ${sub}  ${p.name}`)
  }

  // Also dump full CSV for reference.
  const csvPath = path.resolve("scripts/product-image-framing.csv")
  const rows = [
    "id,name,marca,category,subcategory,coverage_max_dim,coverage_w,coverage_h,pad_top,pad_bottom,pad_left,pad_right,image_url",
    ...ok.map((r) => {
      const p = r.product
      return [
        p.id,
        JSON.stringify(p.name),
        p.marca,
        p.category,
        p.subcategory,
        r.coverageMaxDim.toFixed(4),
        r.coverageW.toFixed(4),
        r.coverageH.toFixed(4),
        r.paddingTop.toFixed(4),
        r.paddingBottom.toFixed(4),
        r.paddingLeft.toFixed(4),
        r.paddingRight.toFixed(4),
        p.image,
      ].join(",")
    }),
  ].join("\n")
  fs.writeFileSync(csvPath, rows)
  console.log(`\nCSV completo en: ${csvPath}`)

  if (failed.length) {
    console.log(`\n${failed.length} imágenes fallaron:`)
    for (const r of failed) console.log(`  - ${r.product?.id} ${r.product?.name}: ${r.error}`)
  }
})()
