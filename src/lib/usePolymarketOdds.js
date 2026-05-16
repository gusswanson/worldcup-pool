import { useState, useEffect } from 'react'

// Maps Polymarket question text → our team names
// Polymarket uses "Will X win the 2026 FIFA World Cup?"
function extractTeamName(question) {
  const match = question.match(/^Will (.+?) win the 2026 FIFA World Cup/i)
  return match ? match[1].trim() : null
}

// Some Polymarket names differ slightly from ours — normalize them
const NAME_MAP = {
  'USA': 'United States',
  'United States': 'United States',
  'South Korea': 'South Korea',
  'Korea Republic': 'South Korea',
  'Ivory Coast': 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Cote d\'Ivoire': 'Ivory Coast',
  'Iran': 'Iran',
  'Bosnia': 'Bosnia and Herzegovina',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Czechia': 'Czech Republic',
  'Czech Republic': 'Czech Republic',
  'Curacao': 'Curaçao',
  'Curaçao': 'Curaçao',
  'Congo': 'DR Congo',
  'DR Congo': 'DR Congo',
  'Democratic Republic of Congo': 'DR Congo',
  'Cabo Verde': 'Cape Verde',
  'Cape Verde': 'Cape Verde',
  'Turkey': 'Turkey',
  'Türkiye': 'Turkey',
}

function normalizeName(name) {
  return NAME_MAP[name] || name
}

export function usePolymarketOdds() {
  const [odds, setOdds] = useState({}) // { teamName: probability (0-1) }
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchOdds()
    // Refresh every 5 minutes
    const interval = setInterval(fetchOdds, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function fetchOdds() {
    try {
      setError(null)
      // Call our own Vercel serverless proxy to avoid CORS issues
      const res = await fetch('/api/polymarket')
      if (!res.ok) throw new Error(`Proxy error: ${res.status}`)

      const data = await res.json()
      const event = Array.isArray(data) ? data[0] : data

      if (!event || !event.markets) {
        throw new Error('No market data found')
      }

      const oddsMap = {}
      for (const market of event.markets) {
        const teamName = extractTeamName(market.question || '')
        if (!teamName) continue

        // outcomePrices is a JSON string like '["0.15", "0.85"]'
        // First price = Yes (win probability)
        let prob = null
        try {
          const prices = JSON.parse(market.outcomePrices)
          prob = parseFloat(prices[0])
        } catch {
          prob = market.lastTradePrice ? parseFloat(market.lastTradePrice) : null
        }

        if (prob !== null && !isNaN(prob)) {
          const normalized = normalizeName(teamName)
          oddsMap[normalized] = prob
        }
      }

      setOdds(oddsMap)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { odds, loading, error, lastUpdated, refetch: fetchOdds }
}

// Calculate expected value for a team
// EV = pool amount × Polymarket win probability
export function calcEV(probability, listedPrice, totalPool = 2400) {
  if (!probability) return null
  return Math.round(probability * totalPool)
}

// Human-readable EV label
export function evLabel(ev) {
  if (ev === null) return null
  return `$${ev}`
}

// EV colour class — higher expected return is greener
export function evColor(ev, listedPrice) {
  if (ev === null) return 'text-gray-500'
  if (!listedPrice) return 'text-blue-400'
  if (ev >= listedPrice * 1.2) return 'text-emerald-400'
  if (ev >= listedPrice) return 'text-green-400'
  if (ev >= listedPrice * 0.8) return 'text-yellow-400'
  return 'text-red-400'
}
