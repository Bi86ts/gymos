import { useState, useEffect } from 'react'

export default function MemberProfile() {
  const [showRenewal, setShowRenewal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('6mo')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Demo member data
  const [member, setMember] = useState({
    name: 'Alex Mercer',
    age: 26,
    weight: 78,
    height: 177,
    goal: 'Bulk',
    goalProgress: 62,
    daysUntilExpiry: 42,
    joinDate: 'Jan 15, 2026',
    streak: 12,
    totalSessions: 84,
  })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('gymos_member')
      if (saved) {
        const data = JSON.parse(saved)
        setMember(prev => ({
          ...prev,
          name: data.name || prev.name,
          age: data.age || prev.age,
          weight: data.weight || prev.weight,
          height: data.height || prev.height,
          goal: data.objective || prev.goal,
        }))
      }
    } catch (e) {
      console.error("Failed to parse member data", e)
    }
  }, [])

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
      setTimeout(() => {
        setShowRenewal(false)
        setIsSuccess(false)
      }, 2500)
    }, 2000)
  }

  const goalColors = {
    Bulk: { text: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30' },
    Lean: { text: 'text-error', bg: 'bg-error/10', border: 'border-error/30' },
    Explosive: { text: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
  }
  const gc = goalColors[member.goal]

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">

      {/* Profile Header */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full border-[3px] border-primary overflow-hidden relative shrink-0 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-gradient-to-br from-surface-container-highest to-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-primary rounded-full border-2 border-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-on-primary-fixed" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline text-on-surface uppercase tracking-tight">{member.name}</h1>
            <p className="text-on-surface-variant text-sm font-medium mt-0.5">Age {member.age} • Member since {member.joinDate}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${gc.bg} ${gc.text} border ${gc.border}`}>
                {member.goal} Track
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Biometrics Grid */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <span className="material-symbols-outlined text-primary mb-1 text-lg">monitor_weight</span>
          <p className="text-2xl font-headline font-black text-on-surface">{member.weight}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">kg</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md">
          <span className="material-symbols-outlined text-primary mb-1 text-lg">height</span>
          <p className="text-2xl font-headline font-black text-on-surface">{member.height}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">cm</p>
        </div>
        <div className="bg-surface-container rounded-2xl p-4 border border-outline-variant/5 text-center shadow-md flex flex-col items-center justify-center">
          <span className="material-symbols-outlined text-primary mb-1 text-lg">fitness_center</span>
          <p className="text-2xl font-headline font-black text-on-surface leading-none mb-1.5">{member.totalSessions}</p>
          <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest leading-tight">Sessions<br/><span className="lowercase font-medium tracking-normal opacity-80 mt-0.5 block">Avg 5.6/wk</span></p>
          <div className="bg-surface-container-low border border-outline-variant/10 text-primary text-[8px] font-black uppercase tracking-widest px-1 py-1 rounded w-full text-center mt-2 group-hover:bg-primary/10 transition-colors">
            Top 12% Rank
          </div>
        </div>
      </section>

      {/* Goal Meter */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm" style={{fontVariationSettings: "'FILL' 1"}}>trending_up</span>
            Goal Progress
          </h3>
          <span className={`text-xs font-black uppercase tracking-widest ${gc.text}`}>{member.goal}</span>
        </div>

        {/* Progress Bar */}
        <div className="relative mb-4">
          <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${member.goalProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-3xl font-headline font-black text-on-surface">{member.goalProgress}<span className="text-lg text-on-surface-variant">%</span></p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">Toward {member.goal} goal</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-primary font-bold">+8% this month</p>
            <p className="text-[10px] text-on-surface-variant uppercase">Trending up</p>
          </div>
        </div>
        
        <div className="bg-surface-container-highest/50 border border-outline-variant/10 rounded-xl p-3 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>speed</span>
          <div>
            <p className="text-sm font-bold text-on-surface leading-snug">Trajectory is locked.</p>
            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">At your current pace, you'll hit your absolute target in exactly <strong className="text-on-surface font-black">3 months</strong>.</p>
          </div>
        </div>
      </section>

      {/* Subscription Card */}
      <section className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-all duration-700"></div>
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

          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-4xl font-headline font-black text-on-surface">{member.daysUntilExpiry}</p>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest mt-0.5">Days remaining</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="10"></circle>
                <circle
                  className="text-primary drop-shadow-[0_0_8px_rgba(205,255,24,0.4)]"
                  cx="50" cy="50" fill="transparent" r="40"
                  stroke="currentColor"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * (member.daysUntilExpiry / 180))}
                  strokeLinecap="round" strokeWidth="10"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                ></circle>
              </svg>
            </div>
          </div>

          <button
            onClick={() => setShowRenewal(true)}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-4 rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>autorenew</span>
            RENEW MEMBERSHIP
          </button>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Streak</span>
          </div>
          <p className="text-3xl font-headline font-black text-on-surface">{member.streak} <span className="text-lg text-on-surface-variant">Days</span></p>
        </div>
        <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span>
            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Rank</span>
          </div>
          <p className="text-xl font-headline font-black text-primary">Elite</p>
          <p className="text-[9px] text-on-surface-variant uppercase tracking-wide mt-0.5">Top 5% this month</p>
        </div>
      </section>

      {/* Renewal Modal Overlay */}
      {showRenewal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div className="absolute inset-0 bg-surface/80 backdrop-blur-md" onClick={() => !isProcessing && setShowRenewal(false)}></div>
          <div className="relative w-full max-w-lg bg-surface-container rounded-t-3xl border-t border-outline-variant/20 shadow-2xl p-6 pb-10 animate-in slide-in-from-bottom-8 duration-500 max-h-[85vh] overflow-y-auto">

            {isSuccess ? (
              <div className="text-center py-12 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 mx-auto relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping"></div>
                  <span className="material-symbols-outlined text-4xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <h2 className="text-2xl font-headline font-black text-on-surface uppercase italic mb-2">Protocol Extended!</h2>
                <p className="text-on-surface-variant text-sm">Your membership has been renewed successfully.</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-headline font-black text-on-surface uppercase tracking-tight">Renew Membership</h2>
                  <button onClick={() => setShowRenewal(false)} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>

                {/* Loss Aversion */}
                <div className="bg-error/5 border border-error/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <span className="material-symbols-outlined text-error shrink-0" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
                  <p className="text-sm text-on-surface leading-relaxed">
                    <span className="font-bold">Don't lose your {member.streak}-day streak!</span> You're in the elite top 5% of consistency this month.
                  </p>
                </div>

                {/* Plans */}
                <div className="space-y-3 mb-6">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${
                        selectedPlan === plan.id
                          ? 'border-primary bg-primary/10'
                          : 'border-outline-variant/10 bg-surface-container-highest hover:border-primary/50'
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute top-0 right-0 bg-primary text-on-primary-fixed text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-bl-lg shadow-sm">
                          Best Value
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-1">
                        <span className={`font-black font-headline text-lg ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.label}</span>
                        <span className={`font-black font-headline text-xl ${selectedPlan === plan.id ? 'text-primary' : 'text-on-surface'}`}>{plan.price}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant font-medium">{plan.billing}</p>
                    </button>
                  ))}
                </div>

                {/* Payment CTA */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-primary text-on-primary-fixed py-5 rounded-full font-black text-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(205,255,24,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3 tracking-widest uppercase"
                >
                  {isProcessing ? (
                    <>
                      <span className="material-symbols-outlined animate-spin" style={{fontVariationSettings: "'FILL' 1"}}>sync</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm & Pay
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>lock</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-on-surface-variant font-medium mt-3 tracking-wide uppercase">Secure encrypted checkout via Razorpay</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
