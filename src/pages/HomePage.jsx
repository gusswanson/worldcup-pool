import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { WORLD_CUP_TEAMS } from '../lib/teams.js'
import TeamCard from '../components/TeamCard.jsx'
import SearchSort from '../components/SearchSort.jsx'
import { SkeletonGrid } from '../components/SkeletonCard.jsx'

const TOTAL_POOL = 2400

export default function HomePage() {
  const [dbTeams, setDbTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('name')

  useEffect(() => {
    fetchTeams()
  }, [])

  async function fetchTeams() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teams')
        .select('*')

      if (error) throw error
      setDbTeams(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Merge static team list with DB data
  const mergedTeams = useMemo(() => {
    const dbMap = {}
    dbTeams.forEach(t => { dbMap[t.team_name] = t })
    return WORLD_CUP_TEAMS.map(meta => ({
      meta,
      db: dbMap[meta.name] || null,
    }))
  }, [dbTeams])

  // Stats
  const totalValue = dbTeams.reduce((sum, t) => sum + (t.price || 0), 0)
  const ownedCount = dbTeams.filter(t => t.owner_name).length
  const listedCount = dbTeams.filter(t => t.price).length

  // Filter + sort
  const filtered = useMemo(() => {
    let list = mergedTeams.filter(({ meta, db }) => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        meta.name.toLowerCase().includes(q) ||
        (db?.owner_name || '').toLowerCase().includes(q)
      )
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return (a.db?.price || 0) - (b.db?.price || 0)
        case 'price_desc':
          return (b.db?.price || 0) - (a.db?.price || 0)
        case 'updated':
          return new Date(b.db?.updated_at || 0) - new Date(a.db?.updated_at || 0)
        case 'unowned':
          return (!a.db?.owner_name ? -1 : 1) - (!b.db?.owner_name ? -1 : 1)
        default:
          return a.meta.name.localeCompare(b.meta.name)
      }
    })

    return list
  }, [mergedTeams, search, sort])

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section aria-labelledby="pool-title">
        <div className="card p-5 md:p-7 bg-gradient-to-br from-gray-900 to-gray-900 border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 id="pool-title" className="font-display text-4xl md:text-5xl text-white leading-none">
                WORLD CUP
                <span className="block text-gradient">2026 POOL</span>
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-body">
                Track team ownership &amp; listed prices
              </p>
            </div>

            {/* Total Pool Value */}
            <div className="card p-4 text-center min-w-[140px] border-gold-600/30 bg-gold-500/5">
              <div className="text-xs text-gold-500/70 uppercase tracking-widest font-mono mb-1">
                Total Pool
              </div>
              <div className="font-display text-3xl text-gold-400">
                ${TOTAL_POOL.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">fixed value</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-800">
            <Stat label="Teams" value={WORLD_CUP_TEAMS.length} />
            <Stat label="Owned" value={ownedCount} />
            <Stat label="Listed" value={listedCount} accent />
          </div>
        </div>
      </section>

      {/* Search + Sort */}
      <SearchSort
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        count={filtered.length}
        total={WORLD_CUP_TEAMS.length}
      />

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="bg-red-950 border border-red-800 text-red-300 rounded-xl p-4 text-sm"
        >
          <strong>Error loading teams:</strong> {error}
          <br />
          <span className="text-red-400 text-xs mt-1 block">
            Check your Supabase environment variables.
          </span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-4xl mb-3" aria-hidden="true">🔍</div>
          <p className="font-body">No teams match &ldquo;{search}&rdquo;</p>
          <button
            className="btn-secondary mt-4 text-sm"
            onClick={() => setSearch('')}
          >
            Clear search
          </button>
        </div>
      ) : (
        <section aria-label="Team listings">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(({ meta, db }) => (
              <TeamCard key={meta.name} team={db} teamMeta={meta} />
            ))}
          </div>
        </section>
      )}

      {/* Disclaimer */}
      <div
        role="note"
        className="text-xs text-gray-600 text-center pb-2 border-t border-gray-800 pt-4"
      >
        ⚠️ All listings are public and editable. Only submit phone numbers with permission.
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className={`font-display text-2xl ${accent ? 'text-pitch-400' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  )
}
