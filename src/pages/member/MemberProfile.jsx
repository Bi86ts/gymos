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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1A12] via-[#111316] to-[#0F1A24] p-6 border border-outline-variant/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-[100px] -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#3A82F6]/5 rounded-full blur-[80px] -ml-12 -mb-12" />
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative shrink-0">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-full border-[3px] border-primary/30 overflow-hidden relative shadow-2xl group cursor-pointer transition-transform hover:scale-[1.02]">
              {profilePhoto ? (
                <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#111316] to-[#1A1C1E] flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary/40" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
              </div>
            </button>
            <div className="absolute bottom-1 right-1 w-7 h-7 bg-primary rounded-full border-2 border-[#111316] flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-xs text-[#06060B]" style={{fontVariationSettings: "'FILL' 1"}}>photo_camera</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-black font-headline text-white uppercase tracking-tight truncate">{member.name}</h1>
              <span className="bg-[#00FFAA]/10 text-[#00FFAA] text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-[#00FFAA]/20">Active Member</span>
            </div>
            <p className="text-on-surface-variant font-medium text-sm">
              {member.gender && <span className="capitalize">{member.gender} · </span>}
              Age {member.age} · {member.experience || 'Fitness Enthusiast'}
            </p>
            {member.motivation && <p className="text-white/80 italic font-medium mt-2 text-sm leading-relaxed max-w-md line-clamp-2">“{member.motivation}”</p>}
            
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <div className={`px-4 py-1.5 rounded-full ${gc.bg} ${gc.text} border ${gc.border} flex items-center gap-2 shadow-lg shadow-black/20`}>
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>{gc.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{gc.label}</span>
              </div>
              {member.equipment && (
                <div className="px-3 py-1.5 rounded-full bg-[#111316]/80 text-on-surface-variant border border-outline-variant/10 backdrop-blur-sm shadow-md">
                  <span className="text-[10px] font-bold uppercase tracking-widest">{EQUIP_LABELS[member.equipment] || member.equipment}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Biometrics Grid ── */}
      <section className="grid grid-cols-4 gap-3">
        {[
          { icon: 'monitor_weight', val: member.weight, unit: 'kg', label: 'Weight', color: '#FF2D55' },
          { icon: 'height', val: member.height, unit: 'cm', label: 'Height', color: '#3A82F6' },
          { icon: 'speed', val: bmi, unit: 'BMI', label: 'BMI', color: '#00FFAA' },
          { icon: 'flag', val: member.targetWeight, unit: 'kg', label: 'Target', color: '#FFE600' },
        ].map(m => (
          <div key={m.label} className="bg-[#111316] rounded-2xl p-4 border border-outline-variant/5 text-center shadow-lg group hover:border-white/10 transition-all">
            <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: m.color + '15' }}>
              <span className="material-symbols-outlined text-lg transition-all" style={{ color: m.color, fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
            </div>
            <p className="text-xl font-headline font-black text-white">{m.val || '—'}</p>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1 opacity-70">{m.unit}</p>
          </div>
        ))}
      </section>

      {/* Weight Delta Banner */}
      {weightDelta !== null && (
        <div className={`flex items-center justify-between gap-4 px-5 py-3 rounded-2xl ${
          weightDelta < 0 
            ? 'bg-[#FF2D55]/5 border border-[#FF2D55]/15' 
            : weightDelta > 0 
              ? 'bg-[#3A82F6]/5 border border-[#3A82F6]/15' 
              : 'bg-[#00FFAA]/5 border border-[#00FFAA]/15'
        } shadow-sm`}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              weightDelta < 0 ? 'bg-[#FF2D55]/15' : weightDelta > 0 ? 'bg-[#3A82F6]/15' : 'bg-[#00FFAA]/15'
            }`}>
              <span className={`material-symbols-outlined text-sm ${
                weightDelta < 0 ? 'text-[#FF2D55]' : weightDelta > 0 ? 'text-[#3A82F6]' : 'text-[#00FFAA]'
              }`} style={{fontVariationSettings: "'FILL' 1"}}>
                {weightDelta < 0 ? 'trending_down' : weightDelta > 0 ? 'trending_up' : 'verified'}
              </span>
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">
                {weightDelta === 0 
                  ? 'Target reached! Keep maintaining.' 
                  : `${Math.abs(weightDelta)} kg to ${weightDelta < 0 ? 'shred' : 'gain'}`
                }
              </p>
              <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest opactiy-60">Status Check</p>
            </div>
          </div>
          <div className={`text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
            weightDelta < 0 ? 'text-[#FF2D55] bg-[#FF2D55]/10' : weightDelta > 0 ? 'text-[#3A82F6] bg-[#3A82F6]/10' : 'text-[#00FFAA] bg-[#00FFAA]/10'
          }`}>
            {weightDelta === 0 ? 'Perfect' : weightDelta < 0 ? 'Cutting' : 'Bulking'}
          </div>
        </div>
      )}

      {/* ── Training Schedule ── */}
      <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-lg">
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[#3A82F6] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>calendar_month</span>
          Training Schedule
        </h3>
        <div className="flex gap-1.5 mb-4">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
            const active = member.workoutDays?.includes(day)
            return (
              <div key={day} className={`flex-1 py-3 rounded-xl text-center text-[10px] font-black transition-all ${
                active 
                  ? 'bg-[#3A82F6]/10 text-[#3A82F6] border border-[#3A82F6]/30 shadow-[0_0_15px_rgba(58,130,246,0.1)]' 
                  : 'bg-white/[0.03] text-on-surface-variant/40 border border-transparent opacity-60'
              }`}>{day}</div>
            )
          })}
        </div>
        <div className="flex gap-4 text-xs text-on-surface-variant">
          {member.workoutTime && (
            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-outline-variant/5">
              <span className="material-symbols-outlined text-sm text-[#3A82F6]" style={{fontVariationSettings: "'FILL' 1"}}>schedule</span>
              <span className="capitalize font-bold text-white/90">{member.workoutTime}</span>
            </div>
          )}
          {member.sessionLength && (
            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-outline-variant/5">
              <span className="material-symbols-outlined text-sm text-[#00FFAA]" style={{fontVariationSettings: "'FILL' 1"}}>timer</span>
              <span className="font-bold text-white/90">{member.sessionLength} min</span>
            </div>
          )}
          <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-outline-variant/5 ml-auto">
            <span className="material-symbols-outlined text-sm text-[#FF9500]" style={{fontVariationSettings: "'FILL' 1"}}>event</span>
            <span className="font-bold text-white/90">{member.workoutDays?.length || 0} days/wk</span>
          </div>
        </div>
      </section>

      {/* ── Health & Diet ── */}
      <section className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2D55]/5 rounded-full blur-[60px] -mr-16 -mt-16" />
        <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 mb-4 relative z-10">
          <span className="material-symbols-outlined text-[#FF2D55] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
          Health & Lifestyle
        </h3>
        <div className="grid grid-cols-2 gap-3 relative z-10">
          {[
            { label: 'Diet', val: DIET_LABELS[member.diet] || member.diet || 'None', icon: 'restaurant', color: '#FF9500' },
            { label: 'Sleep', val: `${member.sleepHours || 0} hrs/night`, icon: 'bedtime', color: '#3A82F6' },
            { label: 'Water', val: member.waterIntake === 'low' ? '< 2L' : member.waterIntake === 'medium' ? '2-3L' : '3L+', icon: 'water_drop', color: '#00FFAA' },
            { label: 'Focus', val: (member.focusAreas?.slice(0, 2).join(', ')) || 'General', icon: 'target', color: '#FF2D55' },
          ].map(h => (
            <div key={h.label} className="bg-white/[0.03] rounded-xl p-3 border border-outline-variant/5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-xs" style={{ color: h.color, fontVariationSettings: "'FILL' 1" }}>{h.icon}</span>
                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">{h.label}</p>
              </div>
              <p className="text-sm font-bold text-white truncate">{h.val}</p>
            </div>
          ))}
        </div>

        {/* Limitations & Conditions */}
        <div className="flex flex-col gap-3 mt-4 relative z-10">
          {(member.limitations?.length > 0 && !member.limitations.includes("None — all good")) && (
            <div className="pt-4 border-t border-outline-variant/5">
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-error text-xs" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                Physical Limitations
              </p>
              <div className="flex flex-wrap gap-2">
                {member.limitations.map(l => (
                  <span key={l} className="text-[10px] font-bold px-3 py-1 bg-error/10 text-error rounded-lg border border-error/20 shadow-sm">{l}</span>
                ))}
              </div>
            </div>
          )}
          {(member.conditions?.length > 0 && !member.conditions.includes("None")) && (
            <div className={`pt-4 ${member.limitations?.length > 0 ? '' : 'border-t border-outline-variant/5'}`}>
              <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-400 text-xs" style={{fontVariationSettings: "'FILL' 1"}}>medical_services</span>
                Medical Conditions
              </p>
              <div className="flex flex-wrap gap-2">
                {member.conditions.map(c => (
                  <span key={c} className="text-[10px] font-bold px-3 py-1 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20 shadow-sm">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <section className="grid grid-cols-2 gap-3">
        {[
          { icon: 'local_fire_department', label: 'Streak', val: member.streak, unit: 'Days', color: '#FF9500' },
          { icon: 'fitness_center', label: 'Sessions', val: member.totalSessions, unit: 'Total', color: '#00FFAA' },
          { icon: 'calendar_today', label: 'Member For', val: daysSinceJoin, unit: 'Days', color: '#3A82F6' },
          { icon: 'emoji_events', label: 'Experience', val: member.experience || 'Beginner', unit: 'Level', color: '#C8FF00', isText: true },
        ].map(s => (
          <div key={s.label} className="bg-[#111316] rounded-2xl p-5 border border-outline-variant/5 shadow-lg group hover:border-white/10 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-sm" style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">{s.label}</span>
            </div>
            <p className={`font-headline font-black ${s.isText ? 'text-lg text-white' : 'text-3xl text-white'}`}>
              {s.val} {!s.isText && <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest ml-1">{s.unit}</span>}
            </p>
          </div>
        ))}
      </section>

      {/* ── Renewal CTA ── */}
      <section className="bg-[#111316] rounded-3xl p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#00FFAA]/5 rounded-full blur-[80px] -mr-16 -mt-16 transition-opacity group-hover:opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00FFAA] text-sm" style={{fontVariationSettings: "'FILL' 1"}}>card_membership</span>
              Membership Status
            </h3>
            <div className="flex items-center gap-1.5 bg-[#00FFAA]/10 text-[#00FFAA] px-3.5 py-1.5 rounded-full border border-[#00FFAA]/20 shadow-lg shadow-[#00FFAA]/5">
              <span className="material-symbols-outlined text-[10px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Active Protocol</span>
            </div>
          </div>
          
          <div className="bg-white/[0.03] rounded-2xl p-4 mb-6 border border-outline-variant/5">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-xl font-headline font-black text-white">6 Months Premium</p>
              </div>
              <p className="text-xs font-bold text-[#FF9500]">Expires in 142 days</p>
            </div>
          </div>

          <button onClick={() => setShowRenewal(true)}
            className="w-full bg-gradient-to-r from-[#00FFAA] to-[#3A82F6] text-[#06060B] font-black py-4.5 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-[#00FFAA]/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined font-black" style={{fontVariationSettings: "'FILL' 1"}}>autorenew</span>
            Extend Membership Protocol
          </button>
        </div>
      </section>

      {/* ── Renewal Modal ── */}
      {showRenewal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-[#06060B]/80 backdrop-blur-xl" onClick={() => !isProcessing && setShowRenewal(false)} />
          <div className="relative w-full max-w-lg bg-[#111316] rounded-t-[40px] border-t border-outline-variant/20 shadow-2xl p-6 pb-12 animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto">
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6" />
            
            {isSuccess ? (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-[#00FFAA]/15 rounded-full flex items-center justify-center mb-8 mx-auto relative">
                  <div className="absolute inset-0 bg-[#00FFAA]/10 rounded-full animate-ping" />
                  <span className="material-symbols-outlined text-5xl text-[#00FFAA]" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <h2 className="text-3xl font-headline font-black text-white uppercase italic tracking-tight mb-3">Protocol Extended!</h2>
                <p className="text-on-surface-variant font-medium">Your membership has been successfully updated.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8 px-2">
                  <div>
                    <h2 className="text-2xl font-black font-headline text-white uppercase tracking-tight">Renewal Portal</h2>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">Select your next evolution phase</p>
                  </div>
                  <button onClick={() => setShowRenewal(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors border border-outline-variant/10">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  {plans.map(plan => (
                    <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full text-left p-5 rounded-3xl border-2 transition-all relative overflow-hidden group ${
                        selectedPlan === plan.id 
                          ? 'border-[#00FFAA] bg-[#00FFAA]/5 shadow-lg shadow-[#00FFAA]/5' 
                          : 'border-outline-variant/10 bg-white/[0.03] hover:border-white/20'
                      }`}>
                      {plan.highlight && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00FFAA] to-[#3A82F6] text-[#06060B] text-[8px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-bl-2xl shadow-lg">Popular Choice</div>
                      )}
                      <div className="relative z-10 flex justify-between items-center mb-2">
                        <span className={`font-black font-headline text-xl uppercase italic tracking-tight ${selectedPlan === plan.id ? 'text-[#00FFAA]' : 'text-white'}`}>{plan.label}</span>
                        <div className="text-right">
                          <span className={`block font-black font-headline text-2xl ${selectedPlan === plan.id ? 'text-[#00FFAA]' : 'text-white'}`}>{plan.price}</span>
                        </div>
                      </div>
                      <p className={`text-xs font-bold transition-colors ${selectedPlan === plan.id ? 'text-[#00FFAA]/70' : 'text-on-surface-variant opacity-60'}`}>{plan.billing}</p>
                      
                      {selectedPlan === plan.id && (
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#00FFAA]/10 rounded-full blur-2xl" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="px-2 mb-4 flex items-center gap-3 text-on-surface-variant/60">
                  <span className="material-symbols-outlined text-sm">shield</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Secure 256-bit encrypted checkout</p>
                </div>

                <button onClick={handlePayment} disabled={isProcessing}
                  className="w-full bg-white text-[#06060B] py-5 rounded-2xl font-black text-base active:scale-[0.97] transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 tracking-[0.2em] uppercase relative overflow-hidden">
                  {isProcessing ? (
                    <><span className="material-symbols-outlined animate-spin text-xl">sync</span> Processing Protocol...</>
                  ) : (
                    <>Initialize Payment <span className="material-symbols-outlined text-xl">arrow_forward</span></>
                  )}
                  {isProcessing && <div className="absolute bottom-0 left-0 h-1 bg-[#00FFAA] animate-progress-buffer" style={{width: '100%'}} />}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
