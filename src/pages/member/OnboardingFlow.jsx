import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [weight, setWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [objective, setObjective] = useState('')
  const [experience, setExperience] = useState('')
  const [motivation, setMotivation] = useState('')
  const [limitations, setLimitations] = useState([])
  const [limitationDetails, setLimitationDetails] = useState('')
  const [conditions, setConditions] = useState([])
  const [conditionDetails, setConditionDetails] = useState('')
  const [workoutDays, setWorkoutDays] = useState(4)
  const [workoutTime, setWorkoutTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleNext = () => {
    if (step === 1 && (!name || !weight || !height || !age)) return
    if (step === 2 && (!objective || !experience || limitations.length === 0 || conditions.length === 0)) return
    if (step === 3 && (!workoutTime || !targetWeight)) return

    if (step < 3) {
      setStep(s => s + 1)
    } else {
      finishOnboarding()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1)
    else navigate(-1)
  }

  const finishOnboarding = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const data = {
        name,
        weight,
        height,
        age,
        objective: objective.charAt(0).toUpperCase() + objective.slice(1),
        targetWeight,
        workoutTime,
        workoutDays,
        limitations,
        limitationDetails,
        conditions,
        conditionDetails
      }
      localStorage.setItem('gymos_member', JSON.stringify(data))
      setStep(4) // Success state
    }, 1500)
  }

  const goHome = () => {
    navigate('/member')
  }

  const canProceed = () => {
    if (step === 1) return name && weight && height && age
    if (step === 2) return objective && experience && limitations.length > 0 && conditions.length > 0
    if (step === 3) return workoutTime && targetWeight
    return false
  }

  const toggleLimitation = (item) => {
    if (item === "None — I'm good to go") {
      setLimitations([item])
      return
    }
    let next = limitations.includes("None — I'm good to go") ? [] : [...limitations]
    if (next.includes(item)) {
      next = next.filter(i => i !== item)
    } else {
      next.push(item)
    }
    setLimitations(next)
  }

  const toggleCondition = (item) => {
    if (item === "None of the above") {
      setConditions([item])
      return
    }
    let next = conditions.includes("None of the above") ? [] : [...conditions]
    if (next.includes(item)) {
      next = next.filter(i => i !== item)
    } else {
      next.push(item)
    }
    setConditions(next)
  }

  const objectives = [
    {
      id: 'bulk',
      icon: 'fitness_center',
      label: 'Bulk',
      desc: 'Maximum muscle mass & strength gains',
      gradient: 'from-primary/20 to-primary-container/10',
    },
    {
      id: 'lean',
      icon: 'local_fire_department',
      label: 'Lean',
      desc: 'Shed fat, reveal definition & abs',
      gradient: 'from-error/20 to-error/5',
    },
    {
      id: 'explosive',
      icon: 'bolt',
      label: 'Explosive',
      desc: 'Power, speed & athletic performance',
      gradient: 'from-secondary/20 to-secondary/5',
    },
  ]

  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 max-w-lg mx-auto pb-8">
      {/* Header / Progress */}
      {step < 4 && (
        <div className="pt-8 pb-10">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handleBack} className="text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Step {step} of 3</span>
            <div className="w-6"></div>
          </div>
          <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center gap-8">

        {/* Step 1: Physicals */}
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface mb-2">Tell us about yourself.</h1>
              <p className="text-on-surface-variant text-sm">We'll use this to build your personalized protocol.</p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-sm">person</span>
                  Full Name
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="bg-transparent text-2xl font-headline font-black text-on-surface outline-none w-full placeholder:text-surface-container-highest"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-sm">monitor_weight</span>
                  Current Weight
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="78"
                    className="bg-transparent text-3xl font-headline font-black text-on-surface outline-none w-full placeholder:text-surface-container-highest"
                  />
                  <span className="text-lg text-on-surface-variant font-bold">kg</span>
                </div>
              </div>

              {/* Height */}
              <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-sm">height</span>
                  Height
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="177"
                    className="bg-transparent text-3xl font-headline font-black text-on-surface outline-none w-full placeholder:text-surface-container-highest"
                  />
                  <span className="text-lg text-on-surface-variant font-bold">cm</span>
                </div>
              </div>

              {/* Age */}
              <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary text-sm">cake</span>
                  Age
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="26"
                    className="bg-transparent text-3xl font-headline font-black text-on-surface outline-none w-full placeholder:text-surface-container-highest"
                  />
                  <span className="text-lg text-on-surface-variant font-bold">yrs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Objective */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface mb-2">Choose your track.</h1>
              <p className="text-on-surface-variant text-sm">This shapes your entire training protocol.</p>
            </div>
            <div className="space-y-3">
              {objectives.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => setObjective(obj.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden group ${
                    objective === obj.id
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                      : 'border-outline-variant/20 bg-surface-container-low hover:border-primary/50'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${obj.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      objective === obj.id ? 'bg-primary/20' : 'bg-surface-container-highest'
                    } transition-colors`}>
                      <span className={`material-symbols-outlined text-3xl ${
                        objective === obj.id ? 'text-primary' : 'text-on-surface-variant'
                      }`} style={{fontVariationSettings: "'FILL' 1"}}>
                        {obj.icon}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-on-surface font-headline text-xl uppercase tracking-tight">{obj.label}</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">{obj.desc}</div>
                    </div>
                    {objective === obj.id && (
                      <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Experience */}
            <div className="mt-8 bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
              <h3 className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">fitness_center</span>
                Experience Level
              </h3>
              <div className="flex flex-col gap-2">
                {['Beginner', 'Some Experience', 'Regular'].map(level => (
                  <button
                    key={level}
                    onClick={() => setExperience(level)}
                    className={`w-full py-4 px-5 text-sm font-bold rounded-xl border transition-all text-left ${
                      experience === level 
                        ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/10' 
                        : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:border-primary/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Motivation */}
            <div className="mt-8 bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
              <h3 className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                  Primary Motivation
                </div>
                <span className="normal-case tracking-normal opacity-70">Optional</span>
              </h3>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value.substring(0, 100))}
                placeholder="e.g. My daughter's wedding in December, or I'm fully done being sedentary."
                rows="3"
                className="w-full bg-transparent border-none text-sm text-on-surface placeholder:text-surface-container-highest focus:outline-none resize-none px-1"
              />
              <div className="text-right text-[10px] text-on-surface-variant border-t border-outline-variant/10 pt-2 mt-2">
                {motivation.length}/100
              </div>
            </div>

            {/* Physical Limitations */}
            <div className="mt-8 bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
              <h3 className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>healing</span>
                Physical limitations
              </h3>
              <p className="text-on-surface-variant text-xs mb-4">Any areas we should avoid in your training? <span className="text-primary/70">Select all that apply.</span></p>
              <div className="flex flex-wrap gap-2">
                {['Lower back', 'Knees', 'Shoulders', 'Wrists / Elbows', 'Neck', "None — I'm good to go"].map(item => (
                  <button
                    key={item}
                    onClick={() => toggleLimitation(item)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
                      limitations.includes(item)
                        ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/10'
                        : 'bg-surface-container-highest border-outline-variant/20 text-on-surface hover:border-primary/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              
              {limitations.length > 0 && !limitations.includes("None — I'm good to go") && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">edit</span> Briefly describe the problem</p>
                  <textarea
                    value={limitationDetails}
                    onChange={(e) => setLimitationDetails(e.target.value)}
                    placeholder="e.g. Sharp pain in right knee when squatting deep."
                    rows="2"
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 text-sm text-on-surface placeholder:text-surface-container-highest focus:border-primary/50 focus:outline-none resize-none transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Health Conditions */}
            <div className="mt-8 bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
              <h3 className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                Health conditions
              </h3>
              <p className="text-on-surface-variant text-xs mb-4 leading-snug">Anything we should know about your health?<br/><span className="text-on-surface-variant/70 text-[10px]">This helps us personalise your diet plan and training intensity.</span></p>
              <div className="flex flex-col gap-2">
                {[
                  'Diabetes (Type 1 or Type 2)',
                  'High blood pressure',
                  'Heart condition',
                  'Thyroid disorder',
                  'PCOD / PCOS',
                  'None of the above'
                ].map(item => (
                  <button
                    key={item}
                    onClick={() => toggleCondition(item)}
                    className={`w-full py-3 px-4 text-xs font-bold rounded-xl border transition-all text-left flex items-center gap-3 ${
                      conditions.includes(item)
                        ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/10'
                        : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:border-primary/40'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${conditions.includes(item) ? 'border-primary bg-primary text-on-primary-fixed' : 'border-outline-variant/50 bg-transparent'}`}>
                      {conditions.includes(item) && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                    </div>
                    {item}
                  </button>
                ))}
              </div>
              
              {conditions.length > 0 && !conditions.includes('None of the above') && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-xs">edit</span> Anything else your trainer should know?</p>
                  <textarea
                    value={conditionDetails}
                    onChange={(e) => setConditionDetails(e.target.value)}
                    placeholder="e.g. 'on medication', 'doctor advised low intensity only'"
                    rows="2"
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-xl p-3 text-sm text-on-surface placeholder:text-surface-container-highest focus:border-primary/50 focus:outline-none resize-none transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Commitment */}
        {step === 3 && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface mb-2">How many days a week?</h1>
              <p className="text-on-surface-variant text-sm">Your commitment level. No excuses.</p>
            </div>

            <div className="bg-surface-container rounded-3xl p-8 relative overflow-hidden border border-outline-variant/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <div className="relative z-10 text-center mb-8">
                <div className="text-7xl font-headline font-black text-primary mb-2">{workoutDays}</div>
                <div className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">
                  {workoutDays === 1 ? 'Day' : 'Days'} per week
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="7"
                value={workoutDays}
                onChange={(e) => setWorkoutDays(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-container-highest rounded-full appearance-none outline-none relative z-10"
              />

              <div className="flex justify-between mt-4 relative z-10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Light</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Moderate</span>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Beast</span>
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant/10 relative z-10">
                <p className="text-xs text-on-surface-variant text-center">
                  {workoutDays <= 2 && '💡 Great for beginners. Quality over quantity.'}
                  {workoutDays >= 3 && workoutDays <= 4 && '🔥 The sweet spot. Enough volume for serious gains.'}
                  {workoutDays >= 5 && workoutDays <= 6 && '💪 Advanced territory. Make sure you recover properly.'}
                  {workoutDays === 7 && '⚡ Full warrior mode. Rest days are built into your protocol.'}
                </p>
              </div>
            </div>

            {/* Preferred Time */}
            <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10">
              <h3 className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                Preferred Workout Time
              </h3>
              <div className="flex gap-2">
                {[
                  { id: 'morning', label: 'Morning', icon: 'light_mode' },
                  { id: 'afternoon', label: 'Afternoon', icon: 'wb_sunny' },
                  { id: 'evening', label: 'Evening', icon: 'dark_mode' }
                ].map(time => (
                  <button
                    key={time.id}
                    onClick={() => setWorkoutTime(time.id)}
                    className={`flex-1 py-4 flex flex-col items-center gap-2 text-xs font-bold rounded-xl border transition-all ${
                        workoutTime === time.id
                          ? 'bg-primary/20 border-primary text-primary shadow-sm shadow-primary/10' 
                          : 'bg-surface-container-low border-outline-variant/20 text-on-surface hover:border-primary/40'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-xl ${workoutTime === time.id ? 'text-primary' : 'text-on-surface-variant'}`} style={{fontVariationSettings: "'FILL' 1"}}>{time.icon}</span>
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Weight */}
            <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 group focus-within:border-primary/40 transition-colors">
              <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-widest flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-sm">flag</span>
                Target Body Weight
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  placeholder="70"
                  className="bg-transparent text-3xl font-headline font-black text-on-surface outline-none w-full placeholder:text-surface-container-highest"
                />
                <span className="text-lg text-on-surface-variant font-bold">kg</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in py-12">
            <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto flex items-center justify-center relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
              <span className="material-symbols-outlined text-6xl text-primary drop-shadow-[0_0_15px_rgba(205,255,24,0.5)]" style={{fontVariationSettings: "'FILL' 1"}}>how_to_reg</span>
            </div>
            <div>
              <h1 className="text-3xl font-black font-headline text-on-surface mb-3 uppercase italic">You're a Member!</h1>
              <p className="text-on-surface-variant max-w-[280px] mx-auto">
                Your profile is locked in. Your personalized {objective === 'bulk' ? 'Bulk' : objective === 'lean' ? 'Lean' : 'Explosive'} protocol is ready.
              </p>
            </div>
            <div className="bg-surface-container rounded-2xl p-5 text-left space-y-3 border border-outline-variant/10">
              <div className="flex justify-between py-1 border-b border-outline-variant/5 pb-2 mb-2">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Name</span>
                <span className="text-sm font-headline font-black text-on-surface truncate max-w-[150px] text-right">{name || 'Member'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Weight</span>
                <span className="text-sm font-headline font-black text-on-surface">{weight} kg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Height</span>
                <span className="text-sm font-headline font-black text-on-surface">{height} cm</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Age</span>
                <span className="text-sm font-headline font-black text-on-surface">{age} yrs</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Track</span>
                <span className="text-sm font-headline font-black text-primary uppercase">{objective}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Goal</span>
                <span className="text-sm font-headline font-black text-primary">{targetWeight} kg</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Days/Week</span>
                <span className="text-sm font-headline font-black text-on-surface">{workoutDays}</span>
              </div>
              <div className="flex justify-between py-1 mt-2 pt-2 border-t border-outline-variant/5">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Time</span>
                <span className="text-sm font-headline font-black text-on-surface capitalize">{workoutTime}</span>
              </div>
            </div>
            <button
              onClick={goHome}
              className="mt-4 w-full bg-primary text-on-primary-fixed py-5 rounded-full font-black text-lg active:scale-95 transition-transform shadow-lg shadow-primary/20"
            >
              ENTER GYMOS
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {step < 4 && (
        <div className="pt-8">
          <button
            onClick={handleNext}
            disabled={isSubmitting || !canProceed()}
            className="w-full bg-primary disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:opacity-50 text-on-primary-fixed py-5 rounded-full font-black text-lg active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">sync</span>
                PROCESSING...
              </>
            ) : (
              <>
                {step === 3 ? 'FINISH SETUP' : 'CONTINUE'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
