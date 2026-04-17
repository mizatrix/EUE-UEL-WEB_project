-- ═══════════════════════════════════════════════════════
-- EUE | UEL Web Dev Hub — Complete Database Schema
-- Run this in: https://supabase.com/dashboard/project/vpktrmqzylgtqlpuqyll/sql
-- ═══════════════════════════════════════════════════════

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor')),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
    ON public.profiles FOR INSERT WITH CHECK (true);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL,
    project_title TEXT NOT NULL,
    team_name TEXT,
    leader_name TEXT NOT NULL,
    leader_id TEXT NOT NULL,
    members TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view teams"
    ON public.teams FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert teams"
    ON public.teams FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own teams"
    ON public.teams FOR UPDATE USING (auth.uid() = user_id);

-- 3. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    live_url TEXT,
    notes TEXT,
    grade INTEGER,
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    graded_at TIMESTAMPTZ
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view submissions"
    ON public.submissions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert submissions"
    ON public.submissions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Instructors can update submissions"
    ON public.submissions FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'instructor'
        )
    );

-- 4. PROJECT IDEAS TABLE (NEW)
CREATE TABLE IF NOT EXISTS public.project_ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    proposed_by UUID REFERENCES public.profiles(id),
    category TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_instructor_idea BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.project_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ideas"
    ON public.project_ideas FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ideas"
    ON public.project_ideas FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Instructors can update ideas"
    ON public.project_ideas FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'instructor'
        )
    );

-- 5. AUTO-CREATE PROFILE TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'student'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
