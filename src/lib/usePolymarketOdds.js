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
  'Ivory Coast': 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Iran': 'Iran',
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
// EV = (win probability × total pool prize) - listed price
export function calcEV(probability, listedPrice, totalPool = 2400) {
  if (!probability || !listedPrice) return null
  return Math.round(probability * totalPool - listedPrice)
}

// Human-readable EV label
export function evLabel(ev) {
  if (ev === null) return null
  if (ev > 0) return `+$${ev}`
  return `-$${Math.abs(ev)}`
}

// EV colour class
export function evColor(ev) {
  if (ev === null) return 'text-gray-500'
  if (ev >= 50) return 'text-emerald-400'
  if (ev > 0) return 'text-green-400'
  if (ev >= -50) return 'text-yellow-400'
  return 'text-red-400'
}
