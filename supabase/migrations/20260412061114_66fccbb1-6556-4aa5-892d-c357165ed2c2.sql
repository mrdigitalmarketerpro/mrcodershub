
-- Platform profiles: linked coding accounts
CREATE TABLE public.platform_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('leetcode', 'gfg', 'hackerrank')),
  handle TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'failed')),
  sync_error TEXT,
  problems_solved INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  contests_attended INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  contribution_score INTEGER DEFAULT 0,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

ALTER TABLE public.platform_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view platform profiles"
  ON public.platform_profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own platform profiles"
  ON public.platform_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own platform profiles"
  ON public.platform_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own platform profiles"
  ON public.platform_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_platform_profiles_updated_at
  BEFORE UPDATE ON public.platform_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Platform snapshots: historical data for trend charts
CREATE TABLE public.platform_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL,
  problems_solved INTEGER DEFAULT 0,
  contest_rating INTEGER DEFAULT 0,
  contests_attended INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  raw_payload JSONB,
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own snapshots"
  ON public.platform_snapshots FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "System can insert snapshots"
  ON public.platform_snapshots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Sync jobs: tracks background sync requests
CREATE TABLE public.sync_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'success', 'failed')),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.sync_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync jobs"
  ON public.sync_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sync jobs"
  ON public.sync_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User scores: computed ranking data
CREATE TABLE public.user_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_problems_solved INTEGER NOT NULL DEFAULT 0,
  total_contest_rating INTEGER NOT NULL DEFAULT 0,
  total_contests_attended INTEGER NOT NULL DEFAULT 0,
  weighted_score NUMERIC(12,2) NOT NULL DEFAULT 0,
  global_rank INTEGER,
  college_rank INTEGER,
  rank_change INTEGER DEFAULT 0,
  platforms_linked INTEGER NOT NULL DEFAULT 0,
  last_computed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view user scores"
  ON public.user_scores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own score"
  ON public.user_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own score"
  ON public.user_scores FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_scores_updated_at
  BEFORE UPDATE ON public.user_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update profiles table: add gfg and hackerrank handle columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gfg_handle TEXT,
  ADD COLUMN IF NOT EXISTS hackerrank_handle TEXT;

-- Enable realtime for leaderboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_scores;
