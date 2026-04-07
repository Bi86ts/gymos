import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { addNote } from '../../services/trainerService'

export default function SkipSession() {
  const navigate = useNavigate()
  const [selectedReason, setSelectedReason] = useState(null)
  const [otherReason, setOtherReason] = useState('')

  const reasons = [
    { id: 'tired', icon: 'battery_1_bar', label: 'Too Tired / Sore' },
    { id: 'busy', icon: 'schedule', label: 'Schedule Conflict' },
    { id: 'sick', icon: 'sick', label: 'Illness / Injury' },
    { id: 'travel', icon: 'flight', label: 'Traveling' },
    { id: 'other', icon: 'edit_note', label: 'Other Reason' },
  ]

  const handleSkip = () => {
    if (!selectedReason) return
    
    const reasonObj = reasons.find(r => r.id === selectedReason)
    const finalReason = selectedReason === 'other' ? otherReason : reasonObj.label

    // Register reason in Trainer's notes
    try {
      const memberRaw = localStorage.getItem('gymos_member')
      if (memberRaw) {
        const d = JSON.parse(memberRaw)
        const memberId = 'member_' + (d.name || '').toLowerCase().replace(/\s+/g, '_')
        addNote(memberId, `Workout Skipped: ${finalReason}`)
      }
    } catch (e) {
      console.error('Failed to notify trainer', e)
    }

    navigate('/member')
  }

  const isFormValid = selectedReason && (selectedReason !== 'other' || otherReason.trim().length > 0)

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center px-6 max-w-lg mx-auto pb-16 animate-in fade-in zoom-in-95 duration-500">
      
      <div className="text-center space-y-4 mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 blur-2xl -z-10">
          <span className="material-symbols-outlined text-[200px] text-error">close</span>
        </div>
        <span className="material-symbols-outlined text-6xl text-on-surface-variant font-light mb-2">event_busy</span>
        <h1 className="text-3xl font-black font-headline text-on-surface uppercase tracking-tight">Skipping Today?</h1>
        <p className="text-on-surface-variant text-sm px-4">Help us adjust your protocol by telling us why. Your trainer will be notified.</p>
      </div>

      <div className="space-y-3 mb-8">
        {reasons.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedReason(r.id)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-98 ${
              selectedReason === r.id 
                ? 'border-error text-error bg-error/10' 
                : 'border-outline-variant/10 bg-surface-container hover:border-on-surface-variant/30 text-on-surface'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-2xl">{r.icon}</span>
              <span className="font-bold text-sm tracking-wide">{r.label}</span>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedReason === r.id ? 'border-error' : 'border-outline-variant/30'}`}>
              {selectedReason === r.id && <div className="w-2.5 h-2.5 rounded-full bg-error" />}
            </div>
          </button>
        ))}
      </div>

      {selectedReason === 'other' && (
        <div className="mb-8 animate-in slide-in-from-top-4 duration-300">
          <textarea
            placeholder="Type your reason here..."
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            className="w-full bg-surface-container border-2 border-outline-variant/20 rounded-2xl p-4 text-on-surface text-sm focus:border-error focus:outline-none transition-colors min-h-[100px] font-medium"
          />
        </div>
      )}

      <div className="flex flex-col gap-6">
        <button
          onClick={handleSkip}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-full font-black text-xs tracking-[0.2em] transition-all uppercase shadow-lg ${
            isFormValid 
              ? 'bg-error text-white shadow-error/20 active:scale-95' 
              : 'bg-surface-container-highest text-on-surface-variant/30 cursor-not-allowed opacity-50'
          }`}
        >
          Notify my Trainer
        </button>
        
        <button
          onClick={() => navigate('/member')}
          className="text-on-surface-variant/60 font-black text-[10px] tracking-widest uppercase hover:text-on-surface transition-colors mx-auto"
        >
          Nevermind, I'm going
        </button>
      </div>
      
    </div>
  )
}
