import { Link } from 'react-router-dom'
import { calcEV, evLabel, evColor } from '../lib/usePolymarketOdds.js'

const TOTAL_POOL = 2400

const MEDAL = ['🥇', '🥈', '🥉']

export default function LeaderboardView({ teams, odds, oddsLoading, search }) {
  // Sort by win probability descending, teams with no odds go to bottom
  const ranked = [...teams].sort((a, b) => {
    const probA = odds[a.meta.name] ?? -1
    const probB = odds[b.meta.name] ?? -1
    return probB - probA
  })

  if (oddsLoading) {
    return (
      <div className="space-y-2" aria-busy="true" aria-label="Loading leaderboard">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="card p-4 flex items-center gap-4">
            <div className="skeleton w-8 h-5 rounded" />
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
            <div className="skeleton h-5 w-16 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (ranked.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600">
        <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
        <p>No teams match &ldquo;{search}&rdquo;</p>
      </div>
    )
  }

  return (
    <section aria-label="Leaderboard — teams ranked by win probability">
      {/* Column headers */}
      <div className="grid grid-cols-[2rem_1fr_auto_auto] sm:grid-cols-[2rem_1fr_auto_auto_auto] gap-x-4 px-4 pb-2 text-xs text-gray-600 uppercase tracking-widest font-mono">
        <span>#</span>
        <span>Team</span>
        <span className="hidden sm:block text-right">Price</span>
        <span className="text-right">Odds</span>
        <span className="text-right">EV</span>
      </div>

      <ol className="space-y-1.5">
        {ranked.map(({ meta, db }, index) => {
          const prob = odds[meta.name]
          const ev = calcEV(prob, db?.price, TOTAL_POOL)
          const evText = evLabel(ev)
          const evClass = evColor(ev)
          const rank = index + 1

          return (
            <li key={meta.name}>
              <Link
                to={`/team/${encodeURIComponent(meta.name)}`}
                className="card grid grid-cols-[2rem_1fr_auto_auto] sm:grid-cols-[2rem_1fr_auto_auto_auto] gap-x-4 items-center px-4 py-3 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-pitch-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-xl"
                aria-label={`#${rank} ${meta.name}${prob ? ` — ${(prob * 100).toFixed(1)}% to win` : ''}${db?.price ? ` — $${db.price}` : ''}${evText ? ` — EV ${evText}` : ''}`}
              >
                {/* Rank */}
                <div className="font-mono text-sm font-medium">
                  {rank <= 3 ? (
                    <span aria-hidden="true">{MEDAL[rank - 1]}</span>
                  ) : (
                    <span className="text-gray-600">{rank}</span>
                  )}
                </div>

                {/* Flag + Name + Owner */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-2xl leading-none shrink-0" role="img" aria-label={`${meta.name} flag`}>
                    {meta.flag}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-lg leading-tight text-white truncate">
                      {meta.name}
                    </div>
                    {db?.owner_name ? (
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                        <span aria-hidden="true">👤</span> {db.owner_name}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-700 italic">Unowned</div>
                    )}
                  </div>
                </div>

                {/* Price — hidden on mobile */}
                <div className="hidden sm:block text-right">
                  {db?.price ? (
                    <span className="price-badge">${db.price.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-700 text-xs">—</span>
                  )}
                </div>

                {/* Odds */}
                <div className="text-right">
                  {prob ? (
                    <span className="text-sm font-mono text-blue-400">
                      {(prob * 100) < 1
                        ? (prob * 100).toFixed(1)
                        : Math.round(prob * 100)}%
                    </span>
                  ) : (
                    <span className="text-gray-700 text-xs font-mono">—</span>
                  )}
                </div>

                {/* EV */}
                <div className="text-right">
                  {evText ? (
                    <span className={`text-sm font-mono font-medium ${evClass}`}>
                      {evText}
                    </span>
                  ) : (
                    <span className="text-gray-700 text-xs">—</span>
                  )}
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600 justify-center pt-3 border-t border-gray-800">
        <span>🏆 Odds = Polymarket win probability</span>
        <span>EV = expected return minus listed price</span>
      </div>
    </section>
  )
}
