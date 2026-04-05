import { useState, useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'

const GOAL_THEME = {
  bulk:     { label: 'Bulk',     icon: 'fitness_center',        text: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/30' },
  lean:     { label: 'Cut',      icon: 'local_fire_department', text: 'text-error',     bg: 'bg-error/10',     border: 'border-error/30' },
  athletic: { label: 'Athletic', icon: 'bolt',                  text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
  maintain: { label: 'Maintain', icon: 'balance',               text: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/30' },
  rehab:    { label: 'Rehab',    icon: 'healing',               text: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30' },
  default:  { label: 'Fitness',  icon: 'fitness_center',        text: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/30' },
}

const EQUIP_LABELS = { full_gym: 'Full Gym', home_basic: 'Home (Basic)', home_equipped: 'Home (Equipped)', bodyweight: 'Bodyweight Only' }
const DIET_LABELS = { no_pref: 'No Preference', vegetarian: 'Vegetarian', vegan: 'Vegan', keto: 'Keto', high_protein: 'High Protein', flexible: 'Flexible' }

export default function MemberProfile() {
  const [showRenewal, setShowRenewal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('6mo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState(null)
  const fileInputRef = useRef(null)

  const [member, setMember] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_member')
      if (saved) {
        const d = JSON.parse(saved)
        setMember({
          name: d.name || 'Member',
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
          onboardedAt: d.onboardedAt || null,
          // Derived
          streak: d.streak || Math.floor(Math.random() * 15) + 3,
          totalSessions: d.totalSessions || Math.floor(Math.random() * 80) + 20,
        })
      }
      // Load profile photo
      const photo = localStorage.getItem('gymos_profile_photo')
      if (photo) setProfilePhoto(photo)
    } catch (e) {
      console.error("Failed to parse member data", e)
    }
  }, [])

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Photo must be under 5MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target.result
      setProfilePhoto(dataUrl)
      localStorage.setItem('gymos_profile_photo', dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const gc = useMemo(() => {
    if (!member) return GOAL_THEME.default
    return GOAL_THEME[member.objective] || GOAL_THEME.default
  }, [member])

  const daysSinceJoin = useMemo(() => {
    if (!member?.onboardedAt) return 0
    return Math.max(1, Math.floor((Date.now() - new Date(member.onboardedAt).getTime()) / 86400000))
  }, [member])

  const bmi = useMemo(() => {
    if (!member?.weight || !member?.height) return null
    const h = member.height / 100
    return (member.weight / (h * h)).toFixed(1)
  }, [member])

  const weightDelta = useMemo(() => {
    if (!member?.weight || !member?.targetWeight) return null
    return member.targetWeight - member.weight
  }, [member])

  const plans = [
    { id: '1mo', label: '1 Month', price: '₹4,999', billing: 'Billed monthly', highlight: false },
    { id: '6mo', label: '6 Months', price: '₹3,999/mo', billing: 'Billed ₹23,994 every 6 months', highlight: true },
    { id: '1yr', label: '12 Months', price: '₹2,999/mo', billing: 'Billed ₹35,988 annually', highlight: false },
  ]

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      setTimeout(() => { setShowRenewal(false); setIsSuccess(false) }, 2500)
    }, 2000)
  }

  // ── Empty State ──
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30" style={{fontVariationSettings: "'FILL' 1"}}>person_off</span>
        <h2 className="text-xl font-headline font-bold text-on-surface">No Profile Yet</h2>
        <p className="text-on-surface-variant text-sm">Complete onboarding to set up your profile and unlock personalized workouts.</p>
        <a href="/onboarding" className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold uppercase tracking-wide text-sm mt-2">Start Onboarding</a>
      </div>
    )
  }

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-500">

      {/* ── Profile Header ── */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative shrink-0">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-full border-[3px] border-primary overflow-hidden relative shadow-lg shadow-primary/20 group cursor-pointer">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
              </div>
            </button>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-on-primary" style={{fontVariationSettings: "'FILL' 1"}}>photo_camera</span>
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight truncate">{member.name}</h1>
            <p className="text-on-surface-variant text-sm font-medium mt-0.5">
              {member.gender && <span className="capitalize">{member.gender} · </span>}
              Age {member.age} · {member.experience || 'Lifter'}
            </p>
            {member.motivation && <p className="text-on-surface italic font-medium mt-1 text-sm line-clamp-2">"{member.motivation}"</p>}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${gc.bg} ${gc.text} border ${gc.border} flex items-center gap-1`}>
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>{gc.icon}</span>
                {gc.label}
              </span>
              {member.equipment && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-surface-container-highest text-on-surface-variant">
                  {EQUIP_LABELS[member.equipment] || member.equipment}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Biometrics Grid ── */}
      <section className="grid grid-cols-4 gap-2">
        {[
          { icon: 'monitor_weight', val: member.weight, unit: 'kg', label: 'Weight' },
          { icon: 'height', val: member.height, unit: 'cm', label: 'Height' },
          { icon: 'speed', val: bmi, unit: 'BMI', label: 'BMI' },
          { icon: 'flag', val: member.targetWeight, unit: 'kg', label: 'Target' },
        ].map(m => (
          <div key={m.label} className="bg-surface-container rounded-2xl p-3 border border-outline-variant/5 text-center shadow-md">
            <span className="material-symbols-outlined text-primary text-base mb-0.5">{m.icon}</span>
            <p className="text-xl font-headline font-black text-on-surface">{m.val || '—'}</p>
            <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest mt-0.5">{m.unit}</p>
          </div>
        ))}
      </section>

      {/* Weight Delta */}
      {weightDelta !== null && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${weightDelta < 0 ? 'bg-error/5 border border-error/15' : weightDelta > 0 ? 'bg-primary/5 border border-primary/15' : 'bg-surface-container-high border border-outline-variant/10'}`}>
          <span className={`material-symbols-outlined text-sm ${weightDelta < 0 ? 'text-error' : 'text-primary'}`}>
            {weightDelta < 0 ? 'trending_down' : weightDelta > 0 ? 'trending_up' : 'check_circle'}
          </span>
          <p className="text-xs text-on-surface font-medium">
            {weightDelta === 0 ? 'At target weight!' : `${Math.abs(weightDelta)} kg to ${weightDelta < 0 ? 'lose' : 'gain'}`}
          </p>
        </div>
      )}

      {/* ── Training Schedule ── */}
      <section className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-md">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
          Training Schedule
        </h3>
        <div className="flex gap-1.5 mb-3">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
            const active = member.workoutDays?.includes(day)
            return (
              <div key={day} className={`flex-1 py-2 rounded-lg text-center text-[10px] font-bold ${active ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/50'}`}>{day}</div>
            )
          })}
        </div>
        <div className="flex gap-3 text-xs text-on-surface-variant">
          {member.workoutTime && (
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">schedule</span><span className="capitalize font-medium">{member.workoutTime}</span></div>
          )}
          {member.sessionLength && (
            <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">timer</span><span className="font-medium">{member.sessionLength} min</span></div>
          )}
          <div className="flex items-center gap-1"><span className="material-symbols-outlined text-sm text-primary">event</span><span className="font-medium">{member.workoutDays?.length || 0} days/wk</span></div>
        </div>
      </section>

      {/* ── Health & Diet ── */}
      <section className="bg-surface-container rounded-2xl p-5 border border-outline-variant/10 shadow-md">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
          Health & Lifestyle
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {member.diet && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Diet</p>
              <p className="text-sm font-bold text-on-surface">{DIET_LABELS[member.diet] || member.diet}</p>
            </div>
          )}
          {member.sleepHours && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Sleep</p>
              <p className="text-sm font-bold text-on-surface">{member.sleepHours} hrs/night</p>
            </div>
          )}
          {member.waterIntake && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Water</p>
              <p className="text-sm font-bold text-on-surface capitalize">{member.waterIntake === 'low' ? '< 2L' : member.waterIntake === 'medium' ? '2-3L' : '3L+'}</p>
            </div>
          )}
          {member.focusAreas?.length > 0 && (
            <div className="bg-surface-container-high rounded-xl p-3">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Focus</p>
              <p className="text-sm font-bold text-on-surface">{member.focusAreas.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Limitations & Conditions */}
        {(member.limitations?.length > 0 && !member.limitations.includes("None — all good")) && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Limitations</p>
            <div className="flex flex-wrap gap-1.5">
              {member.limitations.map(l => (
                <span key={l} className="text-[10px] font-bold px-2 py-1 bg-error/10 text-error rounded-lg border border-error/20">{l}</span>
              ))}
            </div>
          </div>
        )}
        {(member.conditions?.length > 0 && !member.conditions.includes("None")) && (
          <div className="mt-3 pt-3 border-t border-outline-variant/10">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Health Notes</p>
            <div className="flex flex-wrap gap-1.5">
              {member.conditions.map(c => (
                <span key={c} className="text-[10px] font-bold px-2 py-1 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20">{c}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Stats Grid ── */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Streak</span>
          </div>
          <p className="text-3xl font-headline font-black text-on-surface">{member.streak} <span className="text-lg text-on-surface-variant">Days</span></p>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>fitness_center</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Sessions</span>
          </div>
          <p className="text-3xl font-headline font-black text-on-surface">{member.totalSessions}</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>calendar_today</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Member For</span>
          </div>
          <p className="text-2xl font-headline font-black text-on-surface">{daysSinceJoin} <span className="text-sm text-on-surface-variant">day{daysSinceJoin !== 1 ? 's' : ''}</span></p>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Level</span>
          </div>
          <p className="text-xl font-headline font-black text-primary capitalize">{member.experience || 'Beginner'}</p>
        </div>
      </section>

      {/* ── Renewal CTA ── */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">card_membership</span>
              Subscription
            </h3>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-xs">check_circle</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
          </div>
          <button onClick={() => setShowRenewal(true)}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-black py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>autorenew</span>
            RENEW MEMBERSHIP
          </button>
        </div>
      </section>

      {/* ── Renewal Modal ── */}
      {showRenewal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={() => !isProcessing && setShowRenewal(false)} />
          <div className="relative w-full max-w-lg bg-surface-container rounded-t-3xl border-t border-outline-variant/20 shadow-2xl p-6 pb-10 animate-in slide-in-from-bottom-8 duration-500 max-h-[85vh] overflow-y-auto">
            {isSuccess ? (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                  <span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <h2 className="text-2xl font-headline font-black text-on-surface uppercase italic mb-2">Protocol Extended!</h2>
                <p className="text-on-surface-variant text-sm">Your membership has been renewed.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">Renew Membership</h2>
                  <button onClick={() => setShowRenewal(false)} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
                <div className="space-y-3 mb-6">
                  {plans.map(plan => (
                    <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                        selectedPlan === plan.id ? 'border-primary bg-primary/10' : 'border-outline-variant/10 bg-surface-container-highest hover:border-primary/50'
                      }`}>
                      {plan.highlight && (
                        <div className="absolute top-0 right-0 bg-primary text-on-primary text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-bl-lg">Best Value</div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-black font-headline text-lg ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.label}</span>
                        <span className={`font-black font-headline text-xl ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.price}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">{plan.billing}</p>
                    </button>
                  ))}
                </div>
                <button onClick={handlePayment} disabled={isProcessing}
                  className="w-full bg-primary text-on-primary py-5 rounded-full font-black text-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(200,255,0,0.3)] disabled:opacity-50 flex items-center justify-center gap-3 tracking-widest uppercase">
                  {isProcessing ? <><span className="material-symbols-outlined animate-spin">sync</span>Processing...</> : <>Confirm & Pay<span className="material-symbols-outlined">lock</span></>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
