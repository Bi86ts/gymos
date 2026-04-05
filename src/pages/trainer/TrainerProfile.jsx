import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getTrainerProfile, saveTrainerProfile, getMembers, syncCurrentMember } from '../../services/trainerService'

export default function TrainerProfile() {
  const [trainer, setTrainer] = useState(null)
  const [trainerPhoto, setTrainerPhoto] = useState(null)
  const [members, setMembers] = useState([])
  const [notifications, setNotifications] = useState({ urgentAlerts: true, dailySummary: true, memberCheckins: false, renewalAlerts: true })
  const fileInputRef = useRef(null)

  useEffect(() => {
    setTrainer(getTrainerProfile())
    setMembers(syncCurrentMember())
    const photo = localStorage.getItem('gymos_trainer_photo')
    if (photo) setTrainerPhoto(photo)
    const notifs = localStorage.getItem('gymos_trainer_notifs')
    if (notifs) setNotifications(JSON.parse(notifs))
  }, [])

  const toggleNotif = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] }
    setNotifications(updated)
    localStorage.setItem('gymos_trainer_notifs', JSON.stringify(updated))
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5MB'); return }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setTrainerPhoto(ev.target.result)
      localStorage.setItem('gymos_trainer_photo', ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const retention = members.length > 0 ? Math.round((members.filter(m => {
    const d = Math.floor((Date.now() - new Date(m.lastActive || m.onboardedAt).getTime()) / 86400000)
    return d < 14
  }).length / members.length) * 100) : 0

  if (!trainer) return null

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative shrink-0">
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="w-20 h-20 rounded-full border-[3px] border-primary overflow-hidden relative shadow-lg shadow-primary/20 group cursor-pointer">
              {trainerPhoto ? (
                <img src={trainerPhoto} alt="Trainer" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">sports</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full">
                <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
              </div>
            </button>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-on-primary">photo_camera</span>
            </div>
          </div>
          <div>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tight">{trainer.name}</h2>
            <p className="text-on-surface-variant text-sm font-medium">{trainer.role} · {trainer.gym}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">Active since {new Date(trainer.activeSince).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-2xl text-on-surface">{members.length}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Members</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-2xl text-primary">{retention}%</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Retention</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <p className="font-headline font-black text-2xl text-on-surface">{members.reduce((s, m) => s + (m.totalSessions || 0), 0)}</p>
          <p className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Sessions</p>
        </div>
      </section>

      {/* Specializations */}
      {trainer.specializations?.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">workspace_premium</span>Specializations
          </h3>
          <div className="flex flex-wrap gap-2">
            {trainer.specializations.map(s => (
              <span key={s} className="text-xs font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {trainer.certifications?.length > 0 && (
        <section>
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">verified</span>Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {trainer.certifications.map(c => (
              <span key={c} className="text-xs font-bold px-3 py-1.5 bg-surface-container-highest text-on-surface rounded-full border border-outline-variant/10">{c}</span>
            ))}
          </div>
        </section>
      )}

      {/* Notification Settings */}
      <section>
        <h3 className="font-headline text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">notifications</span>Notifications
        </h3>
        <div className="space-y-2">
          {[
            { key: 'urgentAlerts', label: 'Urgent Risk Alerts', desc: 'When a member reaches HIGH risk' },
            { key: 'dailySummary', label: 'Daily Summary', desc: 'Morning briefing of today\'s queue' },
            { key: 'memberCheckins', label: 'Member Check-ins', desc: 'When assigned members check in' },
            { key: 'renewalAlerts', label: 'Renewal Alerts', desc: 'Approaching renewal dates' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-surface-container rounded-xl border border-outline-variant/5">
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-[10px] text-on-surface-variant">{item.desc}</p>
              </div>
              <button onClick={() => toggleNotif(item.key)}
                className={`w-12 h-6 rounded-full flex items-center transition-all ${
                  notifications[item.key] ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
                }`}>
                <div className={`w-5 h-5 rounded-full mx-0.5 transition-colors ${notifications[item.key] ? 'bg-on-primary' : 'bg-on-surface-variant'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <h3 className="font-headline text-sm font-black uppercase tracking-widest mb-4">Settings</h3>
        <div className="space-y-2">
          {[
            { icon: 'edit', label: 'Edit Profile' },
            { icon: 'description', label: 'Message Templates' },
            { icon: 'fitness_center', label: 'Workout Templates' },
            { icon: 'help', label: 'Help & Support' },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-4 p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-all text-left border border-outline-variant/5">
              <span className="material-symbols-outlined text-on-surface-variant">{item.icon}</span>
              <span className="font-medium text-sm flex-1">{item.label}</span>
              <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      {/* Switch Role */}
      <Link to="/" className="w-full flex items-center justify-center gap-2 p-4 bg-surface-container rounded-xl text-error font-bold text-sm uppercase tracking-widest hover:bg-error/5 transition-colors border border-error/10">
        <span className="material-symbols-outlined text-sm">logout</span>
        Switch Role
      </Link>
    </div>
  )
}
