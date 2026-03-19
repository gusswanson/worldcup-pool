import { Link } from 'react-router-dom'
import { CONFEDERATION_COLORS } from '../lib/teams.js'
import { calcEV, evLabel, evColor } from '../lib/usePolymarketOdds.js'

const TOTAL_POOL = 2400

export default function TeamCard({ team, teamMeta, odds, oddsLoading }) {
  const hasOwner = !!team?.owner_name
  const confColor = CONFEDERATION_COLORS[teamMeta?.confederation] || 'bg-gray-800 text-gray-400'

  const probability = odds?.[teamMeta.name]
  const ev = calcEV(probability, team?.price, TOTAL_POOL)
  const evText = evLabel(ev)
  const evClass = evColor(ev)

  return (
    <Link
      to={`/team/${encodeURIComponent(teamMeta.name)}`}
      className="card p-4 flex flex-col gap-2 hover:border-gray-600 hover:bg-gray-800/50 transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-pitch-500 focus:ring-offset-2 focus:ring-offset-gray-950 rounded-xl"
      aria-label={`${teamMeta.name} — ${hasOwner ? `Owner: ${team.owner_name}` : 'No owner'} — ${team?.price ? `$${team.price}` : 'No price'}`}
    >
      {/* Flag + Confederation */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl leading-none" role="img" aria-label={`${teamMeta.name} flag`}>
          {teamMeta.flag}
        </span>
        <span className={`tag ${confColor} shrink-0`}>
          {teamMeta.confederation}
        </span>
      </div>

      {/* Team name */}
      <div className="font-display text-xl leading-tight text-white group-hover:text-pitch-400 transition-colors">
        {teamMeta.name}
      </div>

      {/* Owner */}
      <div className="text-sm text-gray-400 truncate min-h-[1.25rem]">
        {hasOwner ? (
          <span className="flex items-center gap-1">
            <span className="text-gray-500" aria-hidden="true">👤</span>
            {team.owner_name}
          </span>
        ) : (
          <span className="text-gray-600 italic text-xs">Unowned</span>
        )}
      </div>

      {/* Odds pill */}
      <div className="min-h-[1.25rem]">
        {oddsLoading ? (
          <div className="skeleton h-4 w-16 rounded" aria-hidden="true" />
        ) : probability ? (
          <span
            className="text-xs font-mono text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-full"
            title="Polymarket win probability"
            aria-label={`Win probability: ${Math.round(probability * 100)}%`}
          >
            🏆 {(probability * 100) < 1 ? (probability * 100).toFixed(1) : Math.round(probability * 100)}%
          </span>
        ) : null}
      </div>

      {/* Price + EV */}
      <div className="mt-auto pt-2 border-t border-gray-800 flex items-end justify-between gap-1">
        <div>
          {team?.price ? (
            <span className="price-badge text-lg">${team.price.toLocaleString()}</span>
          ) : (
            <span className="text-gray-600 text-sm italic">No price</span>
          )}
        </div>

        {/* Expected Value */}
        {evText && (
          <span
            className={`text-xs font-mono font-medium ${evClass}`}
            title={`Expected Value: ${evText}`}
            aria-label={`Expected value: ${evText}`}
          >
            EV {evText}
          </span>
        )}
      </div>
    </Link>
  )
}
