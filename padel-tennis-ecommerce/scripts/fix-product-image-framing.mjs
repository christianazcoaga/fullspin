/**
 * Fix product image framing.
 *
 * For every product whose image has < THRESHOLD coverage (computed by
 * audit-product-image-framing.mjs), download the source image, crop it to its
 * non-white bounding box, recanvas to a square white background with PADDING
 * relative padding, and either:
 *   - dry-run: write the result to scripts/cropped/<id>.webp for visual review
 *   - apply:   upload to Supabase Storage at images/products/<id>-fixed-<ts>.webp
 *              and UPDATE productos_fullspin.image with a fresh 10-year signed URL.
 *
 * Usage:
 *   node scripts/fix-product-image-framing.mjs              # dry-run
 *   node scripts/fix-product-image-framing.mjs --apply      # actually upload + update
 *   node scripts/fix-product-image-framing.mjs --ids=289,288  # subset
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
 * and SUPABASE_SERVICE_ROLE_KEY.
 */

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

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
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !ANON || !SERVICE) {
  console.error("Falta env: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const args = new Set(process.argv.slice(2))
const APPLY = args.has("--apply")
const idsArg = process.argv.find((a) => a.startsWith("--ids="))
const ONLY_IDS = idsArg ? new Set(idsArg.slice(6).split(",").map(Number)) : null
const COVERAGE_THRESHOLD = 0.85   // re-crop everything below this
const TARGET_PADDING = 0.08       // 8% padding on each side around the bbox
const OUTPUT_SIZE = 1000          // square output (1000x1000 webp)
const WHITE = 238                 // pixel threshold to count as "content"
const BUCKET = "images"
const PATH_PREFIX = "products"
const SIGN_EXPIRES_IN = 60 * 60 * 24 * 365 * 10   // 10 years

const BUCKET_PUBLIC = false        // confirmed: bucket "images" is private

const OUT_DIR = path.resolve("scripts/cropped")
if (!APPLY) fs.mkdirSync(OUT_DIR, { recursive: true })

function readCsv() {
  const p = path.resolve("scripts/product-image-framing.csv")
  if (!fs.existsSync(p)) {
    console.error("No existe scripts/product-image-framing.csv — corré audit-product-image-framing.mjs primero")
    process.exit(1)
  }
  const lines = fs.readFileSync(p, "utf8").trim().split(/\r?\n/)
  const header = lines.shift().split(",")
  // image_url is the last column; name is JSON-encoded so it may contain commas
  // -> parse manually
  return lines.map((line) => {
    // split into 13 fields keeping the JSON-encoded name intact
    const parts = []
    let buf = ""
    let inStr = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '"') { inStr = !inStr; buf += c; continue }
      if (c === "," && !inStr) { parts.push(buf); buf = ""; continue }
      buf += c
    }
    parts.push(buf)
    const row = Object.fromEntries(header.map((h, i) => [h, parts[i]]))
    row.id = Number(row.id)
    row.coverage_max_dim = Number(row.coverage_max_dim)
    row.name = JSON.parse(row.name)
    return row
  })
}

async function cropOne(row) {
  const res = await fetch(row.image_url)
  if (!res.ok) throw new Error(`download ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())

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
  if (maxX < 0) throw new Error("blank image")

  const bboxW = maxX - minX + 1
  const bboxH = maxY - minY + 1

  // We want final canvas square, with bbox occupying (1 - 2*TARGET_PADDING) of
  // the longer dimension of bbox -> compute canvas size such that
  // longer_bbox_dim / canvas = 1 - 2*TARGET_PADDING
  const longBbox = Math.max(bboxW, bboxH)
  const canvas = Math.round(longBbox / (1 - 2 * TARGET_PADDING))

  // Extract bbox, extend with white to canvas size centered.
  // NOTE: sharp's pipeline applies `extend` AFTER `resize`, regardless of
  // call order — so we materialize extract+extend to a buffer first, then
  // start a fresh sharp instance for the resize step.
  const padTop = Math.round((canvas - bboxH) / 2)
  const padLeft = Math.round((canvas - bboxW) / 2)
  const padBottom = canvas - bboxH - padTop
  const padRight = canvas - bboxW - padLeft

  const padded = await sharp(buf)
    .flatten({ background: "#ffffff" })
    .extract({ left: minX, top: minY, width: bboxW, height: bboxH })
    .extend({ top: padTop, bottom: padBottom, left: padLeft, right: padRight, background: "#ffffff" })
    .toBuffer()

  const squared = await sharp(padded)
    .resize(OUTPUT_SIZE, OUTPUT_SIZE, { fit: "contain", background: "#ffffff" })
    .webp({ quality: 88 })
    .toBuffer()

  return {
    buffer: squared,
    sourceWH: [w, h],
    bboxWH: [bboxW, bboxH],
    canvasPx: canvas,
  }
}

async function uploadToStorage(filename, buffer) {
  const objectPath = `${PATH_PREFIX}/${filename}`
  const res = await fetch(`${URL}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "image/webp",
      "x-upsert": "true",
    },
    body: buffer,
  })
  if (!res.ok) throw new Error(`upload ${res.status}: ${await res.text()}`)
  return objectPath
}

async function getUrlForObject(objectPath) {
  if (BUCKET_PUBLIC) {
    return `${URL}/storage/v1/object/public/${BUCKET}/${objectPath}`
  }
  // sign with service role for 10y
  const res = await fetch(`${URL}/storage/v1/object/sign/${BUCKET}/${objectPath}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn: SIGN_EXPIRES_IN }),
  })
  if (!res.ok) throw new Error(`sign ${res.status}: ${await res.text()}`)
  const { signedURL } = await res.json()
  // signedURL is like "/object/sign/images/products/x.webp?token=..." -> prepend
  return `${URL}/storage/v1${signedURL}`
}

async function updateProductImage(id, newUrl) {
  const res = await fetch(`${URL}/rest/v1/productos_fullspin?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SERVICE,
      Authorization: `Bearer ${SERVICE}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ image: newUrl }),
  })
  if (!res.ok) throw new Error(`patch ${res.status}: ${await res.text()}`)
}

;(async () => {
  const rows = readCsv()
  let targets = rows.filter((r) => r.coverage_max_dim < COVERAGE_THRESHOLD)
  if (ONLY_IDS) targets = targets.filter((r) => ONLY_IDS.has(r.id))

  console.log(`${APPLY ? "APPLY" : "DRY-RUN"} — ${targets.length} productos a re-encuadrar (threshold ${COVERAGE_THRESHOLD * 100}%, padding ${TARGET_PADDING * 100}%, output ${OUTPUT_SIZE}px)\n`)

  const ts = Date.now()
  const results = []

  for (let i = 0; i < targets.length; i++) {
    const r = targets[i]
    const tag = `[${i + 1}/${targets.length}] id=${r.id} "${r.name.slice(0, 50)}"`
    try {
      const { buffer, sourceWH, bboxWH, canvasPx } = await cropOne(r)
      const before = (r.coverage_max_dim * 100).toFixed(1)
      const after = (100 * (1 - 2 * TARGET_PADDING)).toFixed(1)

      if (!APPLY) {
        const out = path.join(OUT_DIR, `${r.id}.webp`)
        fs.writeFileSync(out, buffer)
        console.log(`${tag} OK  cov ${before}% -> ~${after}%  src ${sourceWH[0]}x${sourceWH[1]} bbox ${bboxWH[0]}x${bboxWH[1]} -> ${canvasPx}px -> ${OUTPUT_SIZE}px webp  (${(buffer.length / 1024).toFixed(0)} KB)  -> ${path.relative(process.cwd(), out)}`)
        results.push({ id: r.id, name: r.name, before, after, ok: true })
      } else {
        const filename = `${r.id}-fixed-${ts}.webp`
        const objectPath = await uploadToStorage(filename, buffer)
        const newUrl = await getUrlForObject(objectPath)
        await updateProductImage(r.id, newUrl)
        console.log(`${tag} UPLOADED  ${objectPath}`)
        results.push({ id: r.id, name: r.name, before, after, objectPath, newUrl, ok: true })
      }
    } catch (e) {
      console.error(`${tag} FAIL ${e.message}`)
      results.push({ id: r.id, name: r.name, error: e.message, ok: false })
    }
  }

  if (APPLY) {
    const logPath = path.resolve(`scripts/image-fix-${ts}.json`)
    fs.writeFileSync(logPath, JSON.stringify({ ts, threshold: COVERAGE_THRESHOLD, padding: TARGET_PADDING, results }, null, 2))
    console.log(`\nLog: ${logPath}`)
  } else {
    console.log(`\nArchivos generados en ${OUT_DIR}`)
    console.log("Revisalos visualmente. Si están bien, corré:")
    console.log("  node scripts/fix-product-image-framing.mjs --apply")
  }

  const failed = results.filter((r) => !r.ok)
  if (failed.length) {
    console.log(`\n${failed.length} fallaron:`)
    failed.forEach((r) => console.log(`  id=${r.id} ${r.name}: ${r.error}`))
    process.exit(1)
  }
})()
