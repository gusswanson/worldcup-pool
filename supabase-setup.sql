-- ============================================================
-- FIFA World Cup 2026 Pool — Supabase Setup Script
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. TEAMS TABLE
-- Stores current state of each team listing
CREATE TABLE IF NOT EXISTS public.teams (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name   text UNIQUE NOT NULL,
  owner_name  text,
  phone       text,
  price       integer,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by team name
CREATE INDEX IF NOT EXISTS teams_team_name_idx ON public.teams (team_name);

-- 2. TEAM_UPDATES TABLE
-- Stores full edit history for every change
CREATE TABLE IF NOT EXISTS public.team_updates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name   text NOT NULL,
  owner_name  text,
  phone       text,
  price       integer,
  changed_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS team_updates_team_name_idx ON public.team_updates (team_name);
CREATE INDEX IF NOT EXISTS team_updates_changed_at_idx ON public.team_updates (changed_at DESC);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_updates ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES — Public read + write (no auth required)

-- teams: anyone can read
CREATE POLICY "Public read teams"
  ON public.teams FOR SELECT
  USING (true);

-- teams: anyone can insert
CREATE POLICY "Public insert teams"
  ON public.teams FOR INSERT
  WITH CHECK (true);

-- teams: anyone can update
CREATE POLICY "Public update teams"
  ON public.teams FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- team_updates: anyone can read
CREATE POLICY "Public read team_updates"
  ON public.team_updates FOR SELECT
  USING (true);

-- team_updates: anyone can insert (history log)
CREATE POLICY "Public insert team_updates"
  ON public.team_updates FOR INSERT
  WITH CHECK (true);

-- 5. PRELOAD ALL 48 TEAMS
-- Inserts team name rows so every team exists in the DB from the start
INSERT INTO public.teams (team_name) VALUES
  ('Argentina'), ('Brazil'), ('Colombia'), ('Ecuador'), ('Uruguay'), ('Venezuela'),
  ('England'), ('France'), ('Germany'), ('Spain'), ('Portugal'), ('Netherlands'),
  ('Belgium'), ('Italy'), ('Croatia'), ('Denmark'), ('Austria'), ('Switzerland'),
  ('Scotland'), ('Serbia'), ('Turkey'), ('Hungary'),
  ('United States'), ('Mexico'), ('Canada'), ('Honduras'), ('Panama'), ('Costa Rica'),
  ('Morocco'), ('Senegal'), ('Nigeria'), ('Egypt'), ('Ivory Coast'), ('Algeria'),
  ('Ghana'), ('Cameroon'), ('South Africa'),
  ('Japan'), ('South Korea'), ('Australia'), ('Iran'), ('Saudi Arabia'), ('Qatar'),
  ('Uzbekistan'), ('Iraq'),
  ('New Zealand'),
  ('Paraguay'), ('Bolivia'), ('Indonesia')
ON CONFLICT (team_name) DO NOTHING;
