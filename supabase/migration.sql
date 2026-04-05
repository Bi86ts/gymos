-- ============================================
-- GymOS Database Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================

-- ── 1. Profiles (all users) ──
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT CHECK (role IN ('member', 'trainer', 'owner')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 2. Member Data (extended onboarding info) ──
CREATE TABLE IF NOT EXISTS member_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  gender TEXT,
  age INT,
  weight NUMERIC,
  height NUMERIC,
  body_fat NUMERIC,
  target_weight NUMERIC,
  objective TEXT,
  experience TEXT,
  focus_areas TEXT[],
  limitations TEXT[],
  conditions TEXT[],
  health_notes TEXT,
  workout_days TEXT[],
  workout_time TEXT,
  session_length TEXT,
  equipment TEXT,
  diet TEXT,
  sleep_hours NUMERIC,
  water_intake TEXT,
  motivation TEXT,
  onboarded_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── 3. Trainer Assignments ──
CREATE TABLE IF NOT EXISTS trainer_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(trainer_id, member_id)
);

-- ── 4. Trainer Notes ──
CREATE TABLE IF NOT EXISTS trainer_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── 5. Check-ins ──
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT now(),
  workout_type TEXT,
  duration_mins INT
);

-- ── 6. Indexes ──
CREATE INDEX IF NOT EXISTS idx_member_data_user_id ON member_data(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_trainer ON trainer_assignments(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_assignments_member ON trainer_assignments(member_id);
CREATE INDEX IF NOT EXISTS idx_trainer_notes_trainer ON trainer_notes(trainer_id);
CREATE INDEX IF NOT EXISTS idx_trainer_notes_member ON trainer_notes(member_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(checked_in_at);

-- ── 7. Row Level Security (RLS) ──
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles, but only update their own
CREATE POLICY "Anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Member data: owners of the data + their assigned trainer can read
CREATE POLICY "Users read own member data" ON member_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Trainers read assigned member data" ON member_data FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM trainer_assignments ta
    WHERE ta.member_id = member_data.user_id
    AND ta.trainer_id = auth.uid()
  )
);
CREATE POLICY "Users insert own member data" ON member_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own member data" ON member_data FOR UPDATE USING (auth.uid() = user_id);

-- Trainer assignments: trainers can read their own, owners can read all
CREATE POLICY "Trainers read own assignments" ON trainer_assignments FOR SELECT USING (auth.uid() = trainer_id);
CREATE POLICY "Trainers insert assignments" ON trainer_assignments FOR INSERT WITH CHECK (auth.uid() = trainer_id);
CREATE POLICY "Members see their assignment" ON trainer_assignments FOR SELECT USING (auth.uid() = member_id);

-- Trainer notes: only the trainer who wrote them can see
CREATE POLICY "Trainers read own notes" ON trainer_notes FOR SELECT USING (auth.uid() = trainer_id);
CREATE POLICY "Trainers insert notes" ON trainer_notes FOR INSERT WITH CHECK (auth.uid() = trainer_id);

-- Check-ins: users can read/write their own
CREATE POLICY "Users read own check-ins" ON check_ins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert check-ins" ON check_ins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Trainers read assigned member check-ins" ON check_ins FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM trainer_assignments ta
    WHERE ta.member_id = check_ins.user_id
    AND ta.trainer_id = auth.uid()
  )
);

-- ── 8. Auto-create profile on signup ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 9. Updated_at trigger ──
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER member_data_updated_at BEFORE UPDATE ON member_data FOR EACH ROW EXECUTE FUNCTION update_timestamp();
