import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { WORLD_CUP_TEAMS } from '../lib/teams.js'

function formatDate(ts) {
  if (!ts) return '—'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts))
}

export default function TeamDetailPage() {
  const { teamName } = useParams()
  const navigate = useNavigate()
  const decodedName = decodeURIComponent(teamName)

  const teamMeta = WORLD_CUP_TEAMS.find(t => t.name === decodedName)
  const [team, setTeam] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!teamMeta) return
    fetchTeamData()
  }, [decodedName])

  async function fetchTeamData() {
    try {
      setLoading(true)

      const [teamRes, historyRes] = await Promise.all([
        supabase.from('teams').select('*').eq('team_name', decodedName).maybeSingle(),
        supabase
          .from('team_updates')
          .select('*')
          .eq('team_name', decodedName)
          .order('changed_at', { ascending: false })
          .limit(10),
      ])

      if (teamRes.error) throw teamRes.error
      setTeam(teamRes.data)
      setHistory(historyRes.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!teamMeta) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Team not found.</p>
        <Link to="/" className="btn-secondary mt-4 inline-block">
          ← Back to All Teams
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:underline"
      >
        ← All Teams
      </Link>

      {/* Hero card */}
      <section aria-labelledby="team-name" className="card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-5xl" role="img" aria-label={`${teamMeta.name} flag`}>
              {teamMeta.flag}
            </span>
            <h1 id="team-name" className="font-display text-4xl mt-2 text-white">
              {teamMeta.name}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{teamMeta.confederation}</p>
          </div>

          {team?.price && (
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Listed Price</div>
              <div className="font-display text-4xl text-gold-400">
                ${team.price.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-6 space-y-3" aria-busy="true" aria-label="Loading team details">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-5 rounded w-3/4" />
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="mt-4 text-red-400 text-sm bg-red-950 rounded-lg p-3 border border-red-800">
            Error: {error}
          </div>
        ) : team ? (
          <dl className="mt-6 space-y-4">
            <DetailRow label="Owner">
              <span className="font-medium text-white">{team.owner_name || '—'}</span>
            </DetailRow>

            {team.phone && (
              <DetailRow label="Phone">
                <a
                  href={`tel:${team.phone}`}
                  className="text-pitch-400 hover:text-pitch-300 font-mono underline underline-offset-2 transition-colors focus:outline-none focus:ring-1 focus:ring-pitch-500 rounded"
                  aria-label={`Call ${team.owner_name || 'owner'} at ${team.phone}`}
                >
                  {team.phone}
                </a>
              </DetailRow>
            )}

            <DetailRow label="Last Updated">
              <time dateTime={team.updated_at} className="text-gray-400 text-sm">
                {formatDate(team.updated_at)}
              </time>
            </DetailRow>
          </dl>
        ) : (
          <div className="mt-6 text-gray-500 text-sm italic">
            No owner or price listed yet.
          </div>
        )}
      </section>

      {/* Edit button */}
      <Link
        to={`/edit/${encodeURIComponent(teamMeta.name)}`}
        className="btn-primary w-full text-center block"
        aria-label={`Edit listing for ${teamMeta.name}`}
      >
        ✏️ Edit Listing
      </Link>

      {/* Edit History */}
      {history.length > 0 && (
        <section aria-labelledby="history-title" className="card p-5">
          <h2 id="history-title" className="font-display text-xl text-white mb-4">
            Edit History
          </h2>
          <ol className="space-y-3" reversed>
            {history.map((entry, i) => (
              <li
                key={entry.id}
                className="text-sm border-l-2 border-gray-700 pl-3 py-1"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="text-gray-300">
                    {entry.owner_name && <span>Owner: <strong>{entry.owner_name}</strong></span>}
                    {entry.price && (
                      <span className={entry.owner_name ? ' · ' : ''}>
                        Price: <strong className="text-gold-400">${entry.price}</strong>
                      </span>
                    )}
                    {!entry.owner_name && !entry.price && (
                      <span className="text-gray-500 italic">Record cleared</span>
                    )}
                  </div>
                  <time
                    dateTime={entry.changed_at}
                    className="text-gray-600 text-xs whitespace-nowrap shrink-0"
                  >
                    {formatDate(entry.changed_at)}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}

function DetailRow({ label, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
      <dt className="text-xs text-gray-500 uppercase tracking-widest font-mono w-28 shrink-0">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  )
}
