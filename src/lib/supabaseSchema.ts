/**
 * Supabase / PostgreSQL Database Schema Definitions for IronPath Phase 3
 * Supports relational storage of users, workout_plans, workout_days, plan_exercises, exercise_sets, and custom_exercises.
 */

export const SUPABASE_SQL_SCHEMA = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  experience TEXT DEFAULT 'Intermediate',
  primary_goal TEXT DEFAULT 'Build Muscle',
  physique_target TEXT DEFAULT 'lean_v_taper',
  equipment TEXT DEFAULT 'Commercial Gym',
  training_days INT DEFAULT 4,
  workout_duration TEXT DEFAULT '60 Minutes',
  weight_unit TEXT DEFAULT 'kg',
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  days_per_week INT DEFAULT 3,
  goal TEXT,
  notes TEXT,
  status TEXT CHECK (status IN ('active', 'saved', 'archived')) DEFAULT 'saved',
  is_imported_from_template BOOLEAN DEFAULT FALSE,
  source_template_id TEXT,
  estimated_duration_minutes INT DEFAULT 60,
  last_performed_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user active/saved plans
CREATE INDEX IF NOT EXISTS idx_plans_user_status ON workout_plans(user_id, status);

-- 3. WORKOUT DAYS TABLE
CREATE TABLE IF NOT EXISTS workout_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_order INT NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  focus TEXT DEFAULT 'Hypertrophy Focus',
  scheduled_day TEXT DEFAULT 'Unscheduled',
  is_rest_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_days_plan_order ON workout_days(plan_id, day_order);

-- 4. PLAN EXERCISES TABLE
CREATE TABLE IF NOT EXISTS plan_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_id UUID REFERENCES workout_days(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_order INT NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  primary_muscle TEXT NOT NULL,
  equipment TEXT NOT NULL,
  sets_count INT DEFAULT 3,
  reps_target TEXT DEFAULT '8-12',
  rest_seconds INT DEFAULT 120,
  warmup_sets INT DEFAULT 0,
  target_rir INT DEFAULT 1,
  tempo_notes TEXT,
  weight_tracking_enabled BOOLEAN DEFAULT TRUE,
  notes TEXT,
  is_optional BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exercises_day_order ON plan_exercises(day_id, exercise_order);

-- 5. EXERCISE SETS TABLE (For detailed set configurations or logged workouts)
CREATE TABLE IF NOT EXISTS exercise_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_exercise_id UUID REFERENCES plan_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  set_type TEXT CHECK (set_type IN ('warmup', 'working', 'drop', 'myo_rep')) DEFAULT 'working',
  target_weight NUMERIC(6, 2),
  target_reps INT,
  target_rir INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CUSTOM EXERCISES TABLE (User-created exercises)
CREATE TABLE IF NOT EXISTS custom_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  primary_muscle TEXT NOT NULL,
  secondary_muscles TEXT[] DEFAULT '{}',
  equipment TEXT NOT NULL,
  category TEXT DEFAULT 'compound',
  hypertrophy_tier TEXT DEFAULT 'A Tier',
  setup_instructions TEXT[] DEFAULT '{}',
  execution_instructions TEXT[] DEFAULT '{}',
  cue TEXT,
  default_sets INT DEFAULT 3,
  default_reps TEXT DEFAULT '8-12',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_exercises_user ON custom_exercises(user_id);
`;
