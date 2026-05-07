/**
 * Schedule Detector — Analyzes messages for schedule/class-related content
 * and extracts day/time/activity info for setting reminders.
 */

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DAY_ABBREVS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const TIME_KEYWORDS = ['morning', 'evening', 'afternoon', 'night', 'am', 'pm', 'tomorrow', 'today', 'tonight']
const SCHEDULE_KEYWORDS = [
  'session', 'class', 'workout', 'training', 'leg day', 'push day', 'pull day',
  'chest day', 'back day', 'arm day', 'shoulder day', 'cardio', 'hiit',
  'yoga', 'stretching', 'warmup', 'meetup', 'meet', 'come in', 'show up',
  'see you', 'be there', 'let\'s do', 'let\'s fix', 'let\'s hit', 'plan for',
  'scheduled', 'slot', 'booking', 'booked', 'skip', 'reschedule'
]

/**
 * Detect if a message contains schedule-related content.
 * Returns { isSchedule, day, activity, reminderText } or { isSchedule: false }
 */
export function detectSchedule(message) {
  if (!message || typeof message !== 'string') return { isSchedule: false }

  const lower = message.toLowerCase()

  // Check for schedule keywords
  const hasScheduleKeyword = SCHEDULE_KEYWORDS.some(kw => lower.includes(kw))

  // Check for day references
  let detectedDay = null
  for (let i = 0; i < DAYS.length; i++) {
    if (lower.includes(DAYS[i]) || lower.includes(DAY_ABBREVS[i])) {
      detectedDay = DAYS[i].charAt(0).toUpperCase() + DAYS[i].slice(1)
      break
    }
  }

  // Check for relative day references
  if (!detectedDay) {
    if (lower.includes('tomorrow')) {
      const tmrw = new Date()
      tmrw.setDate(tmrw.getDate() + 1)
      detectedDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][tmrw.getDay()]
    } else if (lower.includes('today') || lower.includes('tonight')) {
      detectedDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]
    }
  }

  const hasTimeKeyword = TIME_KEYWORDS.some(kw => lower.includes(kw))
  const hasDayReference = detectedDay !== null

  // It's schedule-related if it has both a schedule keyword AND a day/time reference
  const isSchedule = hasScheduleKeyword && (hasDayReference || hasTimeKeyword)

  if (!isSchedule) return { isSchedule: false }

  // Try to extract the activity type
  let activity = 'Session'
  const activityMap = [
    { keywords: ['leg day', 'legs'], label: 'Leg Day' },
    { keywords: ['push day', 'push'], label: 'Push Day' },
    { keywords: ['pull day', 'pull'], label: 'Pull Day' },
    { keywords: ['chest day', 'chest'], label: 'Chest Day' },
    { keywords: ['back day', 'back workout'], label: 'Back Day' },
    { keywords: ['arm day', 'arms'], label: 'Arm Day' },
    { keywords: ['shoulder day', 'shoulders'], label: 'Shoulder Day' },
    { keywords: ['cardio'], label: 'Cardio' },
    { keywords: ['hiit'], label: 'HIIT' },
    { keywords: ['yoga'], label: 'Yoga' },
    { keywords: ['stretching'], label: 'Stretching' },
    { keywords: ['class'], label: 'Class' },
    { keywords: ['training', 'workout', 'session'], label: 'Training Session' },
  ]

  for (const mapping of activityMap) {
    if (mapping.keywords.some(kw => lower.includes(kw))) {
      activity = mapping.label
      break
    }
  }

  const reminderText = detectedDay
    ? `${activity} on ${detectedDay}`
    : `${activity} — check time with trainer`

  return {
    isSchedule: true,
    day: detectedDay,
    activity,
    reminderText,
  }
}

/**
 * Get the next occurrence date for a given day name.
 */
export function getNextDayDate(dayName) {
  const dayIndex = DAYS.indexOf(dayName.toLowerCase())
  if (dayIndex === -1) return new Date()

  const today = new Date()
  const todayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1  // Mon=0 ... Sun=6
  let daysUntil = dayIndex - todayIndex
  if (daysUntil <= 0) daysUntil += 7

  const target = new Date(today)
  target.setDate(today.getDate() + daysUntil)
  target.setHours(9, 0, 0, 0) // Default to 9 AM
  return target
}

/**
 * Save a reminder to localStorage.
 */
export function saveReminder(reminder) {
  const existing = JSON.parse(localStorage.getItem('gymos_reminders') || '[]')
  existing.push({
    ...reminder,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    notified: false,
  })
  localStorage.setItem('gymos_reminders', JSON.stringify(existing))
  return existing
}

/**
 * Get all saved reminders.
 */
export function getReminders() {
  return JSON.parse(localStorage.getItem('gymos_reminders') || '[]')
}
