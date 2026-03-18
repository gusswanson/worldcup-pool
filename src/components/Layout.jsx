import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="World Cup 2026 Pool - Home"
          >
            <span className="text-2xl" aria-hidden="true">⚽</span>
            <div>
              <div className="font-display text-xl leading-none text-gradient">
                WC2026 POOL
              </div>
              <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                FIFA World Cup
              </div>
            </div>
          </Link>

          <nav aria-label="Main navigation">
            <Link
              to="/edit"
              className="btn-primary text-sm py-2 px-4"
            >
              + Submit Team
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6" id="main-content">
        <Outlet />
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-600 font-body">
            ⚠️ All listings are public and editable. Only submit phone numbers with permission.
          </p>
          <p className="text-xs text-gray-700 mt-1">
            FIFA World Cup 2026 · Pool Tracker · Not affiliated with FIFA
          </p>
        </div>
      </footer>
    </div>
  )
}
