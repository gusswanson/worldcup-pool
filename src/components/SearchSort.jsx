export default function SearchSort({ search, setSearch, sort, setSort, count, total }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="flex-1 relative">
        <label htmlFor="search-input" className="sr-only">
          Search by team or owner name
        </label>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" aria-hidden="true">
          🔍
        </span>
        <input
          id="search-input"
          type="search"
          className="input pl-9"
          placeholder="Search team or owner…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search teams by name or owner"
        />
      </div>

      {/* Sort */}
      <div className="sm:w-48">
        <label htmlFor="sort-select" className="sr-only">Sort teams</label>
        <select
          id="sort-select"
          className="input"
          value={sort}
          onChange={e => setSort(e.target.value)}
          aria-label="Sort teams"
        >
          <option value="name">Sort: A–Z</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="updated">Recently Updated</option>
          <option value="unowned">Unowned First</option>
        </select>
      </div>

      {/* Count */}
      <div className="sm:self-center text-sm text-gray-500 whitespace-nowrap">
        {count} / {total} teams
      </div>
    </div>
  )
}
