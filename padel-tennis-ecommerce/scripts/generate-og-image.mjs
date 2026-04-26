// One-off script: generate /public/og-image.png from the white-on-transparent
// brand SVG composited on a brand-blue-dark canvas at 1200x630 (the size
// WhatsApp / Twitter / Open Graph fetchers prefer).
//
// Run with:  node scripts/generate-og-image.mjs

import sharp from "sharp"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

const ROOT = process.cwd()
const SVG_IN = resolve(ROOT, "public/images/LOGOS/FullSpin-Web-01.svg")
const PNG_OUT = resolve(ROOT, "public/og-image.png")

const WIDTH = 1200
const HEIGHT = 630
const BG = "#1381C3" // brand-blue-dark
const LOGO_TARGET_W = 800 // logo width after trimming transparent padding
const LOGO_TARGET_H = 380 // logo height cap (so it fits inside the 630 canvas)

const svgBuffer = await readFile(SVG_IN)

// 1. Render at high density so the trimmed result is sharp.
// 2. .trim() removes the transparent padding around the actual paths
//    (the SVG's 500x500 viewBox is much larger than the visible logo).
// 3. Final resize fits the trimmed logo inside the OG-friendly box.
const logoPng = await sharp(svgBuffer, { density: 300 })
  .resize({ width: 1500 })
  .trim()
  .resize({
    width: LOGO_TARGET_W,
    height: LOGO_TARGET_H,
    fit: "inside",
    withoutEnlargement: false,
  })
  .png()
  .toBuffer()

const ogPng = await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: BG,
  },
})
  .composite([{ input: logoPng, gravity: "center" }])
  .png({ quality: 90 })
  .toBuffer()

await writeFile(PNG_OUT, ogPng)
console.log(`✓ Wrote ${PNG_OUT}`)
