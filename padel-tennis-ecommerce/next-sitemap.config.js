/** @type {import('next-sitemap').IConfig} */

const SITE_URL = "https://www.fullspinarg.com"

/**
 * Pull product ids from Supabase REST so each /producto/[id] gets a
 * sitemap entry alongside the static routes. Runs at postbuild time.
 *
 * Falls back silently to an empty list if the env vars are not present
 * (e.g. CI builds without DB credentials), so the build never fails
 * because of a missing env var here.
 */
async function fetchProductIds() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.warn(
      "[sitemap] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — skipping product paths."
    )
    return []
  }

  try {
    const endpoint = `${url}/rest/v1/productos_fullspin?select=id&in_stock=eq.true&coming_soon=eq.false`
    const res = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) {
      console.warn(`[sitemap] Supabase responded ${res.status}; skipping product paths.`)
      return []
    }
    const rows = await res.json()
    return Array.isArray(rows) ? rows.map((row) => row.id).filter(Boolean) : []
  } catch (err) {
    console.warn("[sitemap] Failed to fetch product ids:", err)
    return []
  }
}

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ["/admin", "/admin/*", "/login"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/login"] },
    ],
  },
  additionalPaths: async () => {
    const ids = await fetchProductIds()
    return ids.map((id) => ({
      loc: `/producto/${id}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }))
  },
}
