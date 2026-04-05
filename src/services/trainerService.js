/**
 * GymOS Trainer Service — Shared data layer for all trainer pages
 * Manages member roster, trainer profile, notes, and schedule via localStorage
 */

const TRAINER_KEY = 'gymos_trainer_profile'
const MEMBERS_KEY = 'gymos_trainer_members'
const NOTES_KEY = 'gymos_trainer_notes'
const MEMBER_KEY = 'gymos_member'  // single onboarded member

// ─── Default Trainer ───
const DEFAULT_TRAINER = {
  name: 'Coach Sarah',
  role: 'Head Trainer',
  gym: 'GYMOS',
  activeSince: '2024-01-15',
  specializations: ['Strength & Conditioning', 'Weight Loss', 'HIIT'],
  certifications: ['NASM-CPT', 'CrossFit L2', 'Precision Nutrition'],
}

// ─── Seed Members (shown when no real members exist yet) ───
const SEED_MEMBERS = [
  { id: 'seed_1', name: 'Alex Turner', gender: 'male', age: 28, weight: 82, height: 178, targetWeight: 85, objective: 'bulk', experience: 'Advanced', focusAreas: ['Chest', 'Back'], limitations: [], conditions: [], equipment: 'full_gym', diet: 'high_protein', workoutDays: ['Mon','Tue','Wed','Thu','Fri'], sessionLength: '75', motivation: 'I want to compete in powerlifting next year.', onboardedAt: new Date(Date.now() - 30*86400000).toISOString(), streak: 12, totalSessions: 45, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'seed_2', name: 'Priya Sharma', gender: 'female', age: 24, weight: 62, height: 165, targetWeight: 56, objective: 'lean', experience: 'Intermediate', focusAreas: ['Core', 'Legs'], limitations: [], conditions: [], equipment: 'full_gym', diet: 'vegetarian', workoutDays: ['Mon','Wed','Fri','Sat'], sessionLength: '60', motivation: 'Feel confident and strong in my own skin.', onboardedAt: new Date(Date.now() - 20*86400000).toISOString(), streak: 8, totalSessions: 22, lastActive: new Date().toISOString() },
  { id: 'seed_3', name: 'Jordan Blake', gender: 'male', age: 32, weight: 90, height: 183, targetWeight: 88, objective: 'athletic', experience: 'Advanced', focusAreas: ['Full Body'], limitations: ['Lower back pain'], conditions: [], equipment: 'full_gym', diet: 'flexible', workoutDays: ['Mon','Tue','Thu','Fri','Sat'], sessionLength: '90', motivation: 'Train like a warrior, recover like a monk.', onboardedAt: new Date(Date.now() - 45*86400000).toISOString(), streak: 15, totalSessions: 62, lastActive: new Date().toISOString() },
  { id: 'seed_4', name: 'Riley Kim', gender: 'female', age: 22, weight: 55, height: 160, targetWeight: 58, objective: 'bulk', experience: 'Beginner', focusAreas: ['Glutes', 'Shoulders'], limitations: [], conditions: [], equipment: 'home_basic', diet: 'no_pref', workoutDays: ['Tue','Thu','Sat'], sessionLength: '45', motivation: 'Build the body I dream about.', onboardedAt: new Date(Date.now() - 10*86400000).toISOString(), streak: 5, totalSessions: 8, lastActive: new Date(Date.now() - 2*86400000).toISOString() },
  { id: 'seed_5', name: 'Marcus Thorne', gender: 'male', age: 35, weight: 95, height: 188, targetWeight: 88, objective: 'lean', experience: 'Intermediate', focusAreas: ['Chest', 'Arms', 'Core'], limitations: ['Knee issue'], conditions: ['Hypertension'], equipment: 'full_gym', diet: 'keto', workoutDays: ['Mon','Wed','Fri'], sessionLength: '60', motivation: 'Get back to my college weight.', onboardedAt: new Date(Date.now() - 60*86400000).toISOString(), streak: 2, totalSessions: 30, lastActive: new Date(Date.now() - 5*86400000).toISOString() },
]

// ─── Trainer Profile ───
export function getTrainerProfile() {
  try {
    const saved = localStorage.getItem(TRAINER_KEY)
    return saved ? { ...DEFAULT_TRAINER, ...JSON.parse(saved) } : { ...DEFAULT_TRAINER }
  } catch { return { ...DEFAULT_TRAINER } }
}

export function saveTrainerProfile(data) {
  localStorage.setItem(TRAINER_KEY, JSON.stringify(data))
}

// ─── Member Roster ───
export function getMembers() {
  try {
    const saved = localStorage.getItem(MEMBERS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.length > 0) return parsed
    }
  } catch {}
  // Return seed + any real onboarded member
  const members = [...SEED_MEMBERS]
  syncCurrentMember(members)
  return members
}

export function getMemberById(id) {
  const members = getMembers()
  return members.find(m => m.id === id) || null
}

export function saveMembers(members) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(members))
}

/**
 * Sync the currently onboarded member into the trainer's roster.
 * Called automatically — if a new member onboarded, they get added.
 */
export function syncCurrentMember(existingMembers) {
  try {
    const raw = localStorage.getItem(MEMBER_KEY)
    if (!raw) return existingMembers || getMembers()
    const d = JSON.parse(raw)
    if (!d.name) return existingMembers || getMembers()

    let members = existingMembers || getMembers()
    const memberId = 'member_' + (d.name || '').toLowerCase().replace(/\s+/g, '_')
    const exists = members.some(m => m.id === memberId)

    if (!exists) {
      const newMember = {
        id: memberId,
        name: d.name,
        gender: d.gender || '',
        age: d.age || 0,
        weight: d.weight || 0,
        height: d.height || 0,
        bodyFat: d.bodyFat || null,
        targetWeight: d.targetWeight || 0,
        objective: d.objective || '',
        experience: d.experience || '',
        focusAreas: d.focusAreas || [],
        limitations: d.limitations || [],
        conditions: d.conditions || [],
        healthNotes: d.healthNotes || '',
        workoutDays: d.workoutDays || [],
        workoutTime: d.workoutTime || '',
        sessionLength: d.sessionLength || '',
        equipment: d.equipment || '',
        diet: d.diet || '',
        sleepHours: d.sleepHours || null,
        waterIntake: d.waterIntake || '',
        motivation: d.motivation || '',
        onboardedAt: d.onboardedAt || new Date().toISOString(),
        isNew: true,
        streak: 0,
        totalSessions: 0,
        lastActive: d.onboardedAt || new Date().toISOString(),
      }
      members = [newMember, ...members]
      saveMembers(members)
    } else {
      // Update existing with latest onboarding data
      members = members.map(m => {
        if (m.id !== memberId) return m
        return { ...m, weight: d.weight || m.weight, targetWeight: d.targetWeight || m.targetWeight, objective: d.objective || m.objective, focusAreas: d.focusAreas || m.focusAreas, limitations: d.limitations || m.limitations, conditions: d.conditions || m.conditions, diet: d.diet || m.diet, equipment: d.equipment || m.equipment, motivation: d.motivation || m.motivation }
      })
      saveMembers(members)
    }
    return members
  } catch { return existingMembers || getMembers() }
}

// ─── Trainer Notes ───
export function getNotes(memberId) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
    return all[memberId] || []
  } catch { return [] }
}

export function addNote(memberId, text) {
  try {
    const all = JSON.parse(localStorage.getItem(NOTES_KEY) || '{}')
    if (!all[memberId]) all[memberId] = []
    all[memberId].unshift({ text, timestamp: new Date().toISOString() })
    localStorage.setItem(NOTES_KEY, JSON.stringify(all))
  } catch {}
}

// ─── Helpers ───
export const GOAL_LABELS = { bulk: 'Bulk', lean: 'Cut / Lean', athletic: 'Athletic', maintain: 'Maintain', rehab: 'Rehab' }
export const GOAL_COLORS = { bulk: 'text-primary', lean: 'text-error', athletic: 'text-cyan-400', maintain: 'text-emerald-400', rehab: 'text-amber-400' }
export const EQUIP_LABELS = { full_gym: 'Full Gym', home_basic: 'Home', home_equipped: 'Home+', bodyweight: 'Bodyweight' }

export function daysSince(isoDate) {
  if (!isoDate) return 999
  return Math.max(0, Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000))
}

export function memberStatus(member) {
  const inactive = daysSince(member.lastActive || member.onboardedAt)
  if (member.isNew && inactive < 3) return 'new'
  if (inactive > 14) return 'at-risk'
  if (inactive > 5) return 'watch'
  return 'active'
}
