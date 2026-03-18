import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { WORLD_CUP_TEAMS } from '../lib/teams.js'

export default function EditTeamPage() {
  const { teamName } = useParams()
  const navigate = useNavigate()
  const decodedName = teamName ? decodeURIComponent(teamName) : ''

  const [form, setForm] = useState({
    team_name: decodedName || '',
    owner_name: '',
    phone: '',
    price: '',
  })
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const [existingRecord, setExistingRecord] = useState(null)

  // Pre-fill form if editing existing
  useEffect(() => {
    if (!form.team_name) return
    fetchExisting(form.team_name)
  }, [form.team_name])

  async function fetchExisting(name) {
    const { data } = await supabase
      .from('teams')
      .select('*')
      .eq('team_name', name)
      .maybeSingle()

    if (data) {
      setExistingRecord(data)
      setForm(f => ({
        ...f,
        owner_name: data.owner_name || '',
        phone: data.phone || '',
        price: data.price?.toString() || '',
      }))
    } else {
      setExistingRecord(null)
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))

    // When team changes, reload existing record
    if (name === 'team_name') {
      setExistingRecord(null)
      setForm(f => ({ ...f, team_name: value, owner_name: '', phone: '', price: '' }))
      if (value) fetchExisting(value)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.team_name) return

    setStatus('loading')
    setErrorMsg('')

    const payload = {
      team_name: form.team_name,
      owner_name: form.owner_name.trim() || null,
      phone: form.phone.trim() || null,
      price: form.price ? parseInt(form.price, 10) : null,
      updated_at: new Date().toISOString(),
    }

    try {
      // Upsert into teams table
      const { error: upsertError } = await supabase
        .from('teams')
        .upsert(payload, { onConflict: 'team_name' })

      if (upsertError) throw upsertError

      // Insert into edit history
      const { error: histError } = await supabase.from('team_updates').insert({
        team_name: form.team_name,
        owner_name: payload.owner_name,
        phone: payload.phone,
        price: payload.price,
        changed_at: payload.updated_at,
      })

      if (histError) console.warn('History insert failed:', histError.message)

      setStatus('success')

      // Navigate to team detail after brief success message
      setTimeout(() => {
        navigate(`/team/${encodeURIComponent(form.team_name)}`)
      }, 1200)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const isUpdate = !!existingRecord

  return (
    <div className="max-w-md mx-auto space-y-5">
      {/* Back */}
      {decodedName ? (
        <Link
          to={`/team/${encodeURIComponent(decodedName)}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:underline"
        >
          ← Back to {decodedName}
        </Link>
      ) : (
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus:underline"
        >
          ← All Teams
        </Link>
      )}

      <section className="card p-6">
        <h1 className="font-display text-3xl text-white mb-1">
          {isUpdate ? 'Update Listing' : 'Submit Listing'}
        </h1>
        <p className="text-gray-500 text-sm mb-6">
          {isUpdate
            ? `Editing existing record for ${form.team_name}`
            : 'Add ownership and price info for a team'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Team selection */}
          <div>
            <label htmlFor="team_name" className="label">
              Team <span className="text-red-400" aria-hidden="true">*</span>
            </label>
            <select
              id="team_name"
              name="team_name"
              required
              className="input"
              value={form.team_name}
              onChange={handleChange}
              aria-required="true"
              disabled={!!decodedName}
            >
              <option value="">— Select a team —</option>
              {WORLD_CUP_TEAMS.map(t => (
                <option key={t.name} value={t.name}>
                  {t.flag} {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Owner name */}
          <div>
            <label htmlFor="owner_name" className="label">Owner Name</label>
            <input
              id="owner_name"
              name="owner_name"
              type="text"
              className="input"
              placeholder="e.g. John Doe"
              value={form.owner_name}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="label">
              Phone Number
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input"
              placeholder="e.g. +1 555 000 0000"
              value={form.phone}
              onChange={handleChange}
              maxLength={30}
              autoComplete="tel"
            />
            <p className="text-xs text-gray-600 mt-1">
              ⚠️ Only submit with the owner&apos;s permission. Phone numbers are publicly visible.
            </p>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="label">
              Listed Price ($)
              <span className="text-gray-500 font-normal ml-1">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono pointer-events-none">$</span>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                max="100000"
                className="input pl-7"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status messages */}
          {status === 'error' && (
            <div role="alert" className="bg-red-950 border border-red-800 text-red-300 rounded-lg p-3 text-sm">
              <strong>Error:</strong> {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div role="status" className="bg-pitch-900/40 border border-pitch-700 text-pitch-400 rounded-lg p-3 text-sm flex items-center gap-2">
              <span aria-hidden="true">✅</span> Saved! Redirecting…
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full text-base py-3"
            disabled={status === 'loading' || status === 'success' || !form.team_name}
            aria-busy={status === 'loading'}
          >
            {status === 'loading'
              ? 'Saving…'
              : isUpdate
              ? '💾 Update Listing'
              : '➕ Submit Listing'}
          </button>
        </form>
      </section>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center">
        All submissions are public. No account required.
      </p>
    </div>
  )
}
