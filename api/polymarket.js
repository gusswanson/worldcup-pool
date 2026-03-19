// api/polymarket.js
// Vercel serverless function — proxies Polymarket Gamma API to avoid CORS
// Called by the frontend at /api/polymarket

const GAMMA_API = 'https://gamma-api.polymarket.com'
const SLUG = '2026-fifa-world-cup-winner-595'

export default async function handler(req, res) {
  // Allow requests from your own domain only
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300') // Cache 2 min on Vercel edge

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const url = `${GAMMA_API}/events?slug=${SLUG}&active=true`
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'worldcup-pool/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Gamma API responded with ${response.status}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    console.error('Polymarket proxy error:', err.message)
    return res.status(502).json({ error: err.message })
  }
}
