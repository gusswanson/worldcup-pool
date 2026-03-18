# ⚽ World Cup 2026 Pool Tracker

A mobile-first web app to track team ownership and listed prices for a FIFA World Cup 2026 pool. No authentication required — fully public read/write.

**Stack:** React + Vite · Tailwind CSS · Supabase · Vercel

---

## 📁 Folder Structure

```
worldcup-pool/
├── public/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Header, footer, nav
│   │   ├── TeamCard.jsx        # Card shown in grid
│   │   ├── SearchSort.jsx      # Search input + sort dropdown
│   │   └── SkeletonCard.jsx    # Loading skeletons
│   ├── lib/
│   │   ├── supabase.js         # Supabase client
│   │   └── teams.js            # Static list of all 48 teams
│   ├── pages/
│   │   ├── HomePage.jsx        # Grid of all 48 teams
│   │   ├── TeamDetailPage.jsx  # Single team + edit history
│   │   └── EditTeamPage.jsx    # Public submit/update form
│   ├── App.jsx                 # Routes
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind + custom styles
├── supabase-setup.sql          # Run once in Supabase SQL editor
├── vercel.json                 # SPA routing for Vercel
├── .env.example                # Environment variable template
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🗄️ Step 1 — Supabase Setup

### 1.1 Create a project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**, choose a name (e.g. `worldcup-pool`) and a strong database password
3. Wait ~2 minutes for the project to provision

### 1.2 Run the SQL setup
1. In your project dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the entire contents of `supabase-setup.sql`
4. Click **Run** (or press `Ctrl+Enter`)

This will:
- Create the `teams` table (one row per team, upserted on submit)
- Create the `team_updates` table (full edit history)
- Enable Row Level Security with public read/write policies
- Pre-insert all 48 World Cup teams

### 1.3 Get your API keys
1. In your project, go to **Settings → API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`

---

## ⚙️ Step 2 — Environment Variables

Copy the template and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ Never commit `.env` to git. It's already in `.gitignore`.

---

## 💻 Step 3 — Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Step 4 — Deploy to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Option B: Via Vercel Dashboard (recommended)

1. Push your project to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create worldcup-pool --public --push
   # or push manually to your GitHub
   ```

2. Go to [vercel.com](https://vercel.com) → **Add New Project**

3. Import your GitHub repo

4. Under **Build & Output Settings**, Vercel will auto-detect Vite. No changes needed.

5. Under **Environment Variables**, add:
   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `your-anon-key` |

6. Click **Deploy** 🎉

> The `vercel.json` file handles SPA routing so direct URLs like `/team/Brazil` work correctly.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| **48-team grid** | All FIFA WC 2026 teams, pre-seeded |
| **Live search** | Filter by team name or owner |
| **Sort options** | A–Z, price low/high, recently updated, unowned first |
| **Team detail** | Owner, phone (clickable `tel:` link), price, timestamp |
| **Edit history** | Every submit logged to `team_updates` table |
| **Public form** | No login required — anyone can submit or update |
| **Mobile-first** | 2-col grid on mobile, 3–4 col on desktop |
| **Accessible** | Semantic HTML, ARIA labels, keyboard navigable |

---

## 🔒 Security Notes

- This app uses **no authentication by design**
- All data is publicly readable and writable via the Supabase anon key
- The anon key is safe to expose in the frontend — it can only do what RLS policies allow
- RLS policies allow public SELECT, INSERT, and UPDATE (no DELETE)
- Phone numbers are **publicly visible** — only submit with owner permission

---

## 📝 License

MIT — free to use and modify.
