import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// ─── Auth Helpers ───
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/auth/callback',
    },
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Profile Helpers ───
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertProfile(profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Member Data Helpers ───
export async function getMemberData(userId) {
  const { data, error } = await supabase
    .from('member_data')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertMemberData(memberData) {
  const { data, error } = await supabase
    .from('member_data')
    .upsert(memberData, { onConflict: 'user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Trainer Helpers ───
export async function getTrainerMembers(trainerId) {
  const { data, error } = await supabase
    .from('trainer_assignments')
    .select(`
      member_id,
      assigned_at,
      profiles!trainer_assignments_member_id_fkey (id, name, email, avatar_url, role),
      member_data!trainer_assignments_member_id_fkey (*)
    `)
    .eq('trainer_id', trainerId)
  if (error) throw error
  return data
}

export async function assignMemberToTrainer(trainerId, memberId) {
  const { data, error } = await supabase
    .from('trainer_assignments')
    .upsert({ trainer_id: trainerId, member_id: memberId }, { onConflict: 'trainer_id,member_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Trainer Notes ───
export async function getTrainerNotes(trainerId, memberId) {
  const { data, error } = await supabase
    .from('trainer_notes')
    .select('*')
    .eq('trainer_id', trainerId)
    .eq('member_id', memberId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addTrainerNote(trainerId, memberId, noteText) {
  const { data, error } = await supabase
    .from('trainer_notes')
    .insert({ trainer_id: trainerId, member_id: memberId, note_text: noteText })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Check-ins ───
export async function logCheckIn(userId, workoutType, durationMins) {
  const { data, error } = await supabase
    .from('check_ins')
    .insert({ user_id: userId, workout_type: workoutType, duration_mins: durationMins })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getCheckIns(userId, limit = 30) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('checked_in_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

// ─── Realtime Subscriptions ───
export function subscribeToMemberUpdates(trainerId, callback) {
  return supabase
    .channel('trainer-member-updates')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'trainer_assignments', filter: `trainer_id=eq.${trainerId}` },
      callback
    )
    .subscribe()
}

export function subscribeToCheckIns(callback) {
  return supabase
    .channel('check-ins')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'check_ins' },
      callback
    )
    .subscribe()
}
