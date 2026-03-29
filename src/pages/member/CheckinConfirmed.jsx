import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CheckinConfirmed() {
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setShowAnimation(true), 100)
    // Auto redirect back to home after 3s
    const redirectTimer = setTimeout(() => {
      navigate('/member')
    }, 3000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(redirectTimer)
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow effect */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] transition-opacity duration-1000 ${showAnimation ? 'opacity-100 scale-150' : 'opacity-0 scale-50'}`}></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Checkmark ring */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <svg className={`absolute inset-0 w-full h-full text-primary -rotate-90 transition-all duration-[1500ms] ${showAnimation ? 'stroke-dashoffset-0' : 'stroke-dashoffset-[251.2]'}`} viewBox="0 0 100 100">
            <circle className="text-surface-container" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
            <circle className="text-primary drop-shadow-[0_0_15px_rgba(205,255,24,0.6)]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeLinecap="round" strokeWidth="8"></circle>
          </svg>
          <span className={`material-symbols-outlined text-6xl text-primary transition-all duration-700 delay-500 scale-0 ${showAnimation ? 'scale-100 opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} style={{fontVariationSettings: "'FILL' 1"}}>task_alt</span>
        </div>

        <div className={`space-y-4 text-center transition-all duration-700 delay-300 translate-y-8 opacity-0 ${showAnimation ? 'translate-y-0 opacity-100' : ''}`}>
          <h1 className="text-5xl font-black font-headline text-on-surface uppercase tracking-tight italic drop-shadow-md">You're In!</h1>
          <p className="text-on-surface-variant font-medium text-lg">Streak increased to <span className="text-primary font-black ml-1">13 DAYS</span> <span className="material-symbols-outlined text-error align-middle text-xl" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span></p>
        </div>

        {/* Action Buttons */}
        <div className={`w-full max-w-sm mt-12 transition-all duration-700 delay-700 translate-y-8 opacity-0 ${showAnimation ? 'translate-y-0 opacity-100' : ''}`}>
          <button
            onClick={() => navigate('/member')}
            className="w-full bg-surface-container hover:bg-surface-container-highest border border-outline-variant/10 text-on-surface py-4 rounded-2xl font-black text-sm tracking-widest active:scale-95 transition-all text-center uppercase"
          >
            Start Session Now
          </button>
        </div>
      </div>
    </div>
  )
}
