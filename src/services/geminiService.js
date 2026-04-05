// Centralized Gemini API service for AI workout generation
import { getExercisesByMuscle } from '../data/exerciseData'

const GEMINI_API_KEY = 'AIzaSyDNdtoVgEG39NHIfdMH0GKPpKpjd1jvErY'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`

/**
 * Generate a personalized workout plan using Gemini AI
 * Supports single or multiple muscle groups (comma-separated)
 */
export async function generateWorkoutPlan(muscleGroups, userProfile = {}, streak = 0) {
  const {
    name = 'Athlete',
    fitnessLevel = 'Intermediate',
    goal = 'Build Muscle',
    equipment = 'Full Gym',
  } = userProfile

  // Support comma-separated muscle groups
  const muscles = typeof muscleGroups === 'string' ? muscleGroups.split(',').map(m => m.trim()) : [muscleGroups]
  const muscleLabel = muscles.join(' + ')

  // Get exercise names from ALL selected muscle groups
  const allExercises = muscles.flatMap(m => getExercisesByMuscle(m))
  const exerciseNames = allExercises.map(e => e.name).join(', ')
  const exCount = muscles.length > 1 ? '6-8' : '5-6'

  const systemPrompt = `You are an elite personal trainer AI inside GymOS. Create personalized, science-backed workout plans.

RULES:
- Generate a workout plan targeting these muscle groups: ${muscleLabel}.
- Tailor for a "${fitnessLevel}" athlete whose goal is "${goal}".
- Equipment available: ${equipment}. Current streak: ${streak} days.
- Include ${exCount} exercises with sets, reps, rest time, and coaching notes.
- Distribute exercises evenly across the selected muscle groups.
- Include a warm-up and cool-down.
- IMPORTANT: Use exercise names from this list when possible: ${exerciseNames}
- Be motivational but concise.

RESPOND WITH ONLY VALID JSON:
{
  "planName": "string",
  "targetMuscle": "string",
  "estimatedDuration": "string",
  "difficulty": "string",
  "warmup": { "description": "string", "duration": "string" },
  "exercises": [
    { "name": "string", "sets": number, "reps": "string", "restSeconds": number, "notes": "string" }
  ],
  "cooldown": { "description": "string", "duration": "string" },
  "motivation": "string"
}`

  const cacheKey = `workout_plan_${muscles.sort().join('_')}`

  // Check cache first
  try {
    const cached = sessionStorage.getItem(cacheKey)
    if (cached) {
      const { plan, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < 30 * 60 * 1000) return plan
    }
  } catch (e) {}

  const reqBody = {
    contents: [{
      parts: [{
        text: `Create a ${muscleLabel} workout plan for ${name}. Level: ${fitnessLevel}. Goal: ${goal}. Equipment: ${equipment}. Streak: ${streak} days.`
      }]
    }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 }
  }

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    })

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`)

    const data = await response.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('Empty response from Gemini')

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No valid JSON in response')

    const plan = JSON.parse(jsonMatch[0])

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ plan, timestamp: Date.now() }))
    } catch (e) {}

    return plan

  } catch (error) {
    console.error('Gemini workout generation failed:', error)
    return getFallbackPlan(muscleLabel, allExercises)
  }
}

function getFallbackPlan(muscleLabel, dbExercises) {
  const selected = dbExercises.slice(0, 6)
  return {
    planName: `${muscleLabel} Power Session`,
    targetMuscle: muscleLabel,
    estimatedDuration: '50 min',
    difficulty: 'Intermediate',
    warmup: { description: '5 min light cardio + dynamic stretches targeting ' + muscleLabel.toLowerCase(), duration: '5 min' },
    exercises: selected.map((ex, i) => ({
      name: ex.name,
      sets: i === 0 ? 4 : 3,
      reps: i < 2 ? '6-8' : '10-12',
      restSeconds: i < 2 ? 90 : 60,
      notes: ex.description.split('.')[0],
    })),
    cooldown: { description: '5 min static stretching + foam rolling', duration: '5 min' },
    motivation: 'Every rep is a step forward. You showed up — now finish strong. 💪',
  }
}

export default { generateWorkoutPlan }
