import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const TOTAL_STEPS = 6

const slideIn = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  exit: { opacity: 0, x: -60, transition: { duration: 0.25 } },
}

// ─── Reusable UI Pieces ─────────────────────────────
function StepHeader({ title, sub }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-on-surface uppercase tracking-tight leading-tight">{title}</h1>
      <p className="text-on-surface-variant text-sm mt-2">{sub}</p>
    </div>
  )
}

function FieldCard({ icon, label, children, className = '' }) {
  return (
    <div className={`bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors ${className}`}>
      <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  )
}

function NumInput({ value, onChange, placeholder, unit }) {
  return (
    <div className="flex items-baseline gap-2">
      <input type="number" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="bg-transparent text-3xl font-headline font-bold text-on-surface outline-none w-full placeholder:text-surface-container-highest" />
      <span className="text-lg text-on-surface-variant font-bold">{unit}</span>
    </div>
  )
}

function OptionGrid({ options, selected, onSelect, columns = 3 }) {
  return (
    <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map(opt => {
        const isActive = selected === opt.id
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)}
            className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center ${
              isActive ? 'border-primary bg-primary/10 shadow-md shadow-primary/10' : 'border-outline-variant/15 bg-surface-container-low hover:border-primary/30'
            }`}>
            {opt.icon && <span className={`material-symbols-outlined text-2xl mb-1.5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
              style={{fontVariationSettings: "'FILL' 1"}}>{opt.icon}</span>}
            <span className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-on-surface'}`}>{opt.label}</span>
            {opt.sub && <span className="text-[9px] text-on-surface-variant mt-0.5">{opt.sub}</span>}
          </button>
        )
      })}
    </div>
  )
}

function ChipSelect({ items, selected, onToggle, exclusive = false }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => {
        const isActive = selected.includes(item)
        return (
          <button key={item} onClick={() => onToggle(item)}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all ${
              isActive ? 'bg-primary/15 border-primary text-primary' : 'bg-surface-container-high border-outline-variant/15 text-on-surface-variant hover:border-primary/30'
            }`}>
            {item}
          </button>
        )
      })}
    </div>
  )
}

// ─── Big Card Selector (for objectives) ─────────────
function BigCardSelect({ options, selected, onSelect }) {
  return (
    <div className="space-y-3">
      {options.map(opt => {
        const isActive = selected === opt.id
        return (
          <button key={opt.id} onClick={() => onSelect(opt.id)}
            className={`w-full text-left p-5 rounded-2xl border-2 transition-all group relative overflow-hidden ${
              isActive ? 'border-primary bg-primary/8 shadow-lg shadow-primary/10' : 'border-outline-variant/15 bg-surface-container-low hover:border-primary/30'
            }`}>
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${isActive ? 'bg-primary/20' : 'bg-surface-container-highest'} transition-colors`}>
                <span className={`material-symbols-outlined text-3xl ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}
                  style={{fontVariationSettings: "'FILL' 1"}}>{opt.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-headline font-bold text-on-surface text-xl uppercase tracking-tight">{opt.label}</div>
                <div className="text-xs text-on-surface-variant mt-0.5">{opt.desc}</div>
              </div>
              {isActive && <span className="material-symbols-outlined text-primary text-2xl shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ═══════════════════════════════════════════════════════
export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  // Step 1: Basic
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')

  // Step 2: Body
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bodyFat, setBodyFat] = useState('')
  const [targetWeight, setTargetWeight] = useState('')

  // Step 3: Goals
  const [objective, setObjective] = useState('')
  const [experience, setExperience] = useState('')
  const [focusAreas, setFocusAreas] = useState([])

  // Step 4: Health
  const [limitations, setLimitations] = useState([])
  const [conditions, setConditions] = useState([])
  const [healthNotes, setHealthNotes] = useState('')

  // Step 5: Lifestyle
  const [workoutDays, setWorkoutDays] = useState([])
  const [workoutTime, setWorkoutTime] = useState('')
  const [sessionLength, setSessionLength] = useState('')
  const [equipment, setEquipment] = useState('')

  // Step 6: Diet & Recovery
  const [diet, setDiet] = useState('')
  const [sleepHours, setSleepHours] = useState('')
  const [waterIntake, setWaterIntake] = useState('')
  const [motivation, setMotivation] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const canProceed = useMemo(() => {
    switch (step) {
      case 1: return name && gender && age
      case 2: return weight && height && targetWeight
      case 3: return objective && experience
      case 4: return limitations.length > 0 && conditions.length > 0
      case 5: return workoutDays.length > 0 && workoutTime && sessionLength && equipment
      case 6: return diet
      default: return false
    }
  }, [step, name, gender, age, weight, height, targetWeight, objective, experience, limitations, conditions, workoutDays, workoutTime, sessionLength, equipment, diet])

  const handleNext = () => {
    if (!canProceed) return
    if (step < TOTAL_STEPS) setStep(s => s + 1)
    else finishOnboarding()
  }

  const handleBack = () => step > 1 ? setStep(s => s - 1) : navigate(-1)

  const toggleList = (list, setList, item, noneValue) => {
    if (item === noneValue) { setList([item]); return }
    let next = list.includes(noneValue) ? [] : [...list]
    next = next.includes(item) ? next.filter(i => i !== item) : [...next, item]
    setList(next)
  }

  const finishOnboarding = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      const data = {
        name, gender, age: Number(age),
        weight: Number(weight), height: Number(height), bodyFat: bodyFat ? Number(bodyFat) : null,
        targetWeight: Number(targetWeight),
        objective, experience, focusAreas,
        limitations, conditions, healthNotes,
        workoutDays, workoutTime, sessionLength, equipment,
        diet, sleepHours: sleepHours ? Number(sleepHours) : null, waterIntake, motivation,
        onboardedAt: new Date().toISOString(),
      }
      localStorage.setItem('gymos_member', JSON.stringify(data))
      setIsSubmitting(false)
      setStep(TOTAL_STEPS + 1)
    }, 1500)
  }

  // Step label descriptions
  const stepLabels = ['Basics', 'Body', 'Goals', 'Health', 'Schedule', 'Lifestyle']

  return (
    <div className="min-h-screen bg-surface flex flex-col max-w-lg mx-auto relative">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Progress Header ─── */}
      {step <= TOTAL_STEPS && (
        <div className="sticky top-0 z-30 bg-surface/90 backdrop-blur-xl px-6 pt-6 pb-4 border-b border-outline-variant/5">
          <div className="flex justify-between items-center mb-3">
            <button onClick={handleBack} className="text-on-surface-variant hover:text-primary transition-colors p-1 -ml-1">
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div className="text-center">
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">{stepLabels[step - 1]}</span>
              <p className="text-[10px] text-on-surface-variant font-bold">{step} of {TOTAL_STEPS}</p>
            </div>
            <div className="w-8" />
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                i < step ? 'bg-primary' : i === step - 1 ? 'bg-primary' : 'bg-surface-container-highest'
              }`} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Content ─── */}
      <div className="flex-1 px-6 py-6">
        <AnimatePresence mode="wait">

          {/* ═══ STEP 1: Basics ═══ */}
          {step === 1 && (
            <motion.div key="s1" {...slideIn} className="space-y-4">
              <StepHeader title="Let's get to know you." sub="Basic info to personalize your experience." />
              <FieldCard icon="person" label="Full Name">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                  className="bg-transparent text-2xl font-headline font-bold text-on-surface outline-none w-full placeholder:text-surface-container-highest" />
              </FieldCard>
              <FieldCard icon="wc" label="Gender">
                <OptionGrid columns={3} selected={gender} onSelect={setGender} options={[
                  { id: 'male', icon: 'male', label: 'Male' },
                  { id: 'female', icon: 'female', label: 'Female' },
                  { id: 'other', icon: 'transgender', label: 'Other' },
                ]} />
              </FieldCard>
              <FieldCard icon="cake" label="Age">
                <NumInput value={age} onChange={setAge} placeholder="26" unit="yrs" />
              </FieldCard>
            </motion.div>
          )}

          {/* ═══ STEP 2: Body ═══ */}
          {step === 2 && (
            <motion.div key="s2" {...slideIn} className="space-y-4">
              <StepHeader title="Your body metrics." sub="We'll track progress from these baselines." />
              <div className="grid grid-cols-2 gap-3">
                <FieldCard icon="monitor_weight" label="Current Weight">
                  <NumInput value={weight} onChange={setWeight} placeholder="78" unit="kg" />
                </FieldCard>
                <FieldCard icon="height" label="Height">
                  <NumInput value={height} onChange={setHeight} placeholder="177" unit="cm" />
                </FieldCard>
              </div>
              <FieldCard icon="flag" label="Target Weight">
                <NumInput value={targetWeight} onChange={setTargetWeight} placeholder="72" unit="kg" />
                {weight && targetWeight && (
                  <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-sm">trending_down</span>
                    {Math.abs(Number(weight) - Number(targetWeight))} kg {Number(targetWeight) < Number(weight) ? 'to lose' : 'to gain'}
                  </p>
                )}
              </FieldCard>
              <FieldCard icon="percent" label="Body Fat % (optional)" className="opacity-80">
                <NumInput value={bodyFat} onChange={setBodyFat} placeholder="18" unit="%" />
              </FieldCard>
            </motion.div>
          )}

          {/* ═══ STEP 3: Goals ═══ */}
          {step === 3 && (
            <motion.div key="s3" {...slideIn} className="space-y-5">
              <StepHeader title="What's your mission?" sub="This shapes your entire protocol." />
              <BigCardSelect selected={objective} onSelect={setObjective} options={[
                { id: 'bulk', icon: 'fitness_center', label: 'Bulk', desc: 'Maximum muscle mass & strength gains' },
                { id: 'lean', icon: 'local_fire_department', label: 'Cut / Lean', desc: 'Shed fat, reveal definition & abs' },
                { id: 'athletic', icon: 'bolt', label: 'Athletic', desc: 'Power, speed & functional performance' },
                { id: 'maintain', icon: 'balance', label: 'Maintain', desc: 'Stay fit, consistent training routine' },
                { id: 'rehab', icon: 'healing', label: 'Rehab', desc: 'Recover from injury, build back strength' },
              ]} />

              <FieldCard icon="fitness_center" label="Experience Level">
                <OptionGrid columns={3} selected={experience} onSelect={setExperience} options={[
                  { id: 'beginner', label: 'Beginner', sub: '< 6 months' },
                  { id: 'intermediate', label: 'Intermediate', sub: '1-3 years' },
                  { id: 'advanced', label: 'Advanced', sub: '3+ years' },
                ]} />
              </FieldCard>

              <FieldCard icon="my_location" label="Focus Areas (optional)">
                <p className="text-[10px] text-on-surface-variant mb-2">Select muscle groups you want to prioritize:</p>
                <ChipSelect items={['Upper Body', 'Lower Body', 'Core', 'Back', 'Arms', 'Full Body']}
                  selected={focusAreas} onToggle={area => {
                    setFocusAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])
                  }} />
              </FieldCard>
            </motion.div>
          )}

          {/* ═══ STEP 4: Health ═══ */}
          {step === 4 && (
            <motion.div key="s4" {...slideIn} className="space-y-5">
              <StepHeader title="Health & safety." sub="We'll adjust your plan to keep you safe." />

              <FieldCard icon="healing" label="Physical Limitations">
                <p className="text-[10px] text-on-surface-variant mb-3">Areas to protect or avoid? <span className="text-primary">Select all that apply.</span></p>
                <ChipSelect items={['Lower Back', 'Knees', 'Shoulders', 'Wrists / Elbows', 'Neck', 'Hips', "None — all good"]}
                  selected={limitations} onToggle={item => toggleList(limitations, setLimitations, item, "None — all good")} />
              </FieldCard>

              <FieldCard icon="favorite" label="Health Conditions">
                <p className="text-[10px] text-on-surface-variant mb-3">Anything that affects your training:</p>
                <ChipSelect items={['Diabetes', 'High Blood Pressure', 'Heart Condition', 'Asthma', 'Thyroid', 'PCOD/PCOS', 'Anxiety/Depression', 'None']}
                  selected={conditions} onToggle={item => toggleList(conditions, setConditions, item, 'None')} />
              </FieldCard>

              {(limitations.some(l => l !== "None — all good") || conditions.some(c => c !== 'None')) && (
                <FieldCard icon="edit_note" label="Additional Notes (optional)">
                  <textarea value={healthNotes} onChange={e => setHealthNotes(e.target.value)} rows={3} placeholder="Any details your trainer should know..."
                    className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/40 outline-none resize-none" />
                </FieldCard>
              )}
            </motion.div>
          )}

          {/* ═══ STEP 5: Schedule ═══ */}
          {step === 5 && (
            <motion.div key="s5" {...slideIn} className="space-y-5">
              <StepHeader title="Plan your week." sub="We'll build your split around these days." />

              <FieldCard icon="calendar_month" label="Training Days">
                <div className="flex gap-2 justify-center flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button key={day} onClick={() => setWorkoutDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                      className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                        workoutDays.includes(day) ? 'bg-primary text-on-primary scale-110 shadow-md shadow-primary/20' : 'bg-surface-container-highest text-on-surface-variant hover:bg-outline-variant/30'
                      }`}>{day}</button>
                  ))}
                </div>
                {workoutDays.length > 0 && (
                  <p className="text-xs text-on-surface-variant text-center mt-3 font-medium">
                    {workoutDays.length} day{workoutDays.length > 1 ? 's' : ''}/week — {
                      workoutDays.length <= 2 ? 'great for beginners' :
                      workoutDays.length <= 4 ? 'the sweet spot for gains' :
                      workoutDays.length <= 6 ? 'advanced territory 💪' : 'warrior mode ⚡'
                    }
                  </p>
                )}
              </FieldCard>

              <FieldCard icon="schedule" label="Preferred Time">
                <OptionGrid columns={3} selected={workoutTime} onSelect={setWorkoutTime} options={[
                  { id: 'morning', icon: 'light_mode', label: 'Morning' },
                  { id: 'afternoon', icon: 'wb_sunny', label: 'Afternoon' },
                  { id: 'evening', icon: 'dark_mode', label: 'Evening' },
                ]} />
              </FieldCard>

              <FieldCard icon="timer" label="Session Length">
                <OptionGrid columns={3} selected={sessionLength} onSelect={setSessionLength} options={[
                  { id: '30', label: '30 min', sub: 'Quick' },
                  { id: '45', label: '45 min', sub: 'Standard' },
                  { id: '60', label: '60 min', sub: 'Full' },
                  { id: '75', label: '75 min', sub: 'Extended' },
                  { id: '90', label: '90 min', sub: 'Pro' },
                  { id: '120', label: '120 min', sub: 'Beast' },
                ]} />
              </FieldCard>

              <FieldCard icon="sports_gymnastics" label="Equipment Access">
                <OptionGrid columns={2} selected={equipment} onSelect={setEquipment} options={[
                  { id: 'full_gym', icon: 'fitness_center', label: 'Full Gym' },
                  { id: 'home_basic', icon: 'home', label: 'Home (Basic)' },
                  { id: 'home_equipped', icon: 'exercise', label: 'Home (Equipped)' },
                  { id: 'bodyweight', icon: 'self_improvement', label: 'Bodyweight Only' },
                ]} />
              </FieldCard>
            </motion.div>
          )}

          {/* ═══ STEP 6: Lifestyle ═══ */}
          {step === 6 && (
            <motion.div key="s6" {...slideIn} className="space-y-5">
              <StepHeader title="Lifestyle & nutrition." sub="Fine-tune your plan with these details." />

              <FieldCard icon="restaurant" label="Diet Preference">
                <OptionGrid columns={2} selected={diet} onSelect={setDiet} options={[
                  { id: 'no_pref', label: 'No Preference' },
                  { id: 'vegetarian', label: 'Vegetarian' },
                  { id: 'vegan', label: 'Vegan' },
                  { id: 'keto', label: 'Keto' },
                  { id: 'high_protein', label: 'High Protein' },
                  { id: 'flexible', label: 'Flexible' },
                ]} />
              </FieldCard>

              <div className="grid grid-cols-2 gap-3">
                <FieldCard icon="bedtime" label="Sleep (hrs/night)">
                  <NumInput value={sleepHours} onChange={setSleepHours} placeholder="7" unit="hrs" />
                </FieldCard>
                <FieldCard icon="water_drop" label="Water Intake">
                  <OptionGrid columns={1} selected={waterIntake} onSelect={setWaterIntake} options={[
                    { id: 'low', label: '< 2L' },
                    { id: 'medium', label: '2-3L' },
                    { id: 'high', label: '3L+' },
                  ]} />
                </FieldCard>
              </div>

              <FieldCard icon="psychology" label="Motivation (optional)">
                <p className="text-[10px] text-on-surface-variant mb-2">Who do you want to become?</p>
                <textarea value={motivation} onChange={e => setMotivation(e.target.value.slice(0, 150))} rows={3}
                  placeholder="e.g. 'I want to be the strongest version of myself'"
                  className="w-full bg-surface-container-high border border-outline-variant/10 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:border-primary/40 outline-none resize-none" />
                <p className="text-[9px] text-on-surface-variant/50 text-right mt-1">{motivation.length}/150</p>
              </FieldCard>
            </motion.div>
          )}

          {/* ═══ SUCCESS ═══ */}
          {step === TOTAL_STEPS + 1 && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
              className="text-center py-12 space-y-6">
              <div className="w-28 h-28 bg-primary/15 rounded-full mx-auto flex items-center justify-center relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                <span className="material-symbols-outlined text-6xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>how_to_reg</span>
              </div>
              <div>
                <h1 className="text-3xl font-headline font-bold text-on-surface uppercase tracking-tight">You're In!</h1>
                <p className="text-on-surface-variant mt-2 max-w-xs mx-auto">Profile saved. Your personalized <span className="text-primary font-bold capitalize">{objective}</span> protocol is ready.</p>
              </div>

              {/* Summary Card */}
              <div className="bg-surface-container rounded-2xl p-5 text-left space-y-2.5 border border-outline-variant/10">
                {[
                  ['Name', name],
                  ['Goal', objective?.charAt(0).toUpperCase() + objective?.slice(1)],
                  ['Current', `${weight}kg → ${targetWeight}kg`],
                  ['Days', workoutDays.join(', ')],
                  ['Time', workoutTime],
                  ['Equipment', equipment?.replace('_', ' ')],
                  ['Diet', diet?.replace('_', ' ')],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-outline-variant/5 last:border-0">
                    <span className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{k}</span>
                    <span className="text-sm font-headline font-bold text-on-surface capitalize">{v}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/member')}
                className="w-full bg-primary text-on-primary py-5 rounded-2xl font-headline font-bold text-lg uppercase tracking-wide active:scale-95 transition-transform shadow-xl shadow-primary/20">
                Enter GymOS
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom CTA ─── */}
      {step <= TOTAL_STEPS && (
        <div className="sticky bottom-0 px-6 py-4 bg-surface/90 backdrop-blur-xl border-t border-outline-variant/5">
          <button onClick={handleNext} disabled={isSubmitting || !canProceed}
            className="w-full bg-primary disabled:bg-surface-container-highest disabled:text-on-surface-variant/50 text-on-primary py-4 rounded-2xl font-headline font-bold text-base uppercase tracking-wide active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:shadow-none flex items-center justify-center gap-2">
            {isSubmitting ? (
              <><span className="material-symbols-outlined animate-spin text-lg">sync</span> Processing...</>
            ) : (
              <>{step === TOTAL_STEPS ? 'Complete Profile' : 'Continue'}
                <span className="material-symbols-outlined text-lg">{step === TOTAL_STEPS ? 'check' : 'arrow_forward'}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
