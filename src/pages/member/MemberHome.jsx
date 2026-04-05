import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlowOrbs from '../../components/effects/GlowOrbs'
import ScrollReveal from '../../components/effects/ScrollReveal'
import AnimatedCounter from '../../components/effects/AnimatedCounter'

export default function MemberHome() {
  const [checkedIn, setCheckedIn] = useState(false)
  const [isRestDay, setIsRestDay] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Ambient glow background */}
      <GlowOrbs variant="subtle" />
      
      {/* Top Section - Coach Presence & Dev Toggle */}
      <ScrollReveal direction="up" delay={0}>
        <div className="flex justify-between items-center gap-2">
          {/* Coach Presence */}
          <div className="flex items-center gap-3 bg-surface-container-low border border-primary/20 px-3 py-1.5 rounded-full flex-1 max-w-[240px] card-hover">
            <div className="relative shrink-0">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=100&auto=format&fit=crop" alt="Coach Sarah" className="w-7 h-7 rounded-full object-cover border border-primary/30" />
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary rounded-full border border-surface shadow-[0_0_5px_rgba(255,94,0,0.5)]"></div>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-on-surface text-xs font-bold leading-none mb-0.5">Coach Sarah</span>
              <span className="text-on-surface-variant text-[9px] leading-target">Checked progress 3h ago</span>
            </div>
          </div>

          {/* Toggle state for demo purposes */}
          <button 
            onClick={() => setIsRestDay(!isRestDay)}
            className="text-[9px] bg-surface-container-highest px-2 py-1.5 rounded-md text-on-surface-variant font-bold uppercase tracking-widest hover:text-primary transition-colors shrink-0"
          >
            Dev
          </button>
        </div>
      </ScrollReveal>

      {/* Daily Status */}
      <ScrollReveal direction="up" delay={0.1}>
        {isRestDay ? (
          <section className="bg-surface-container rounded-xl p-6 relative overflow-hidden border border-outline-variant/10 shadow-lg card-hover">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-dim/10 -mr-16 -mt-16 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <span className="material-symbols-outlined text-6xl text-primary-dim" style={{fontVariationSettings: "'FILL' 1"}}>self_improvement</span>
              <div>
                <h3 className="font-headline text-2xl font-black text-on-surface italic uppercase">Active Recovery</h3>
                <p className="text-on-surface-variant text-sm max-w-[250px] mx-auto mt-2">Muscles grow when you rest. Hydrate, stretch, and let your CNS recover today.</p>
              </div>
            </div>
          </section>
        ) : !checkedIn ? (
          <section className="bg-gradient-to-br from-surface-container-low to-surface-container p-6 rounded-xl relative overflow-hidden group shadow-lg border border-primary/20 card-hover">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 -mr-20 -mt-20 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <h3 className="font-headline text-2xl font-black text-on-surface uppercase italic">Training Day</h3>
                <p className="text-on-surface-variant text-sm font-medium mt-1">The Forge is hot. Your spot is waiting.</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setCheckedIn(true); navigate('/member/checkin') }}
                  className="w-full bg-primary hover:bg-primary-dark transition-all active:scale-95 py-4 pl-4 pr-3 rounded-xl text-on-primary-fixed font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-between"
                >
                  CHECK IN
                  <span className="material-symbols-outlined ml-2">check_circle</span>
                </button>
                <div className="text-center mt-1">
                  <Link
                    to="/member/skip"
                    className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/50 hover:text-on-surface-variant transition-colors"
                  >
                    I need to skip today
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden border border-primary/20 shadow-[0_0_30px_rgba(255,94,0,0.05)]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="material-symbols-outlined text-5xl text-primary drop-shadow-[0_0_10px_rgba(255,94,0,0.5)]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
              </div>
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">You're checked in!</h3>
                <p className="text-primary-dim text-sm font-bold mt-1">Ready to crush it.</p>
              </div>
            </div>
          </section>
        )}
      </ScrollReveal>

      {/* Protocol Card */}
      {!isRestDay && (
        <ScrollReveal direction="up" delay={0.2}>
          <section className="relative">
            <div className="bg-surface-container rounded-3xl overflow-hidden border border-outline-variant/10 shadow-2xl card-hover">
              <div className="h-56 relative bg-gradient-to-br from-surface-container-highest to-surface">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop)' }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/80 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-surface/50 backdrop-blur-md px-3 py-1 rounded-full border border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">timer</span>
                  <span className="text-xs font-bold text-on-surface font-label tracking-widest">75 MIN</span>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-primary text-on-primary-fixed text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded-sm shadow-sm inline-block mb-3">TODAY'S PROTOCOL</span>
                  <h2 className="text-4xl font-black font-headline text-on-surface leading-none tracking-tight">Push Day<br/><span className="italic text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">Hypertrophy</span></h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between">
                    <span className="material-symbols-outlined text-primary mb-2">fitness_center</span>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Volume</p>
                      <p className="text-xl font-headline font-black text-on-surface">
                        <AnimatedCounter to={12.5} decimals={1} suffix="k lbs" />
                      </p>
                    </div>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-2xl flex flex-col justify-between">
                    <span className="material-symbols-outlined text-primary mb-2">list_alt</span>
                    <div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Movements</p>
                      <p className="text-xl font-headline font-black text-on-surface">
                        <AnimatedCounter to={6} suffix=" Exercises" />
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  to="/member/plan"
                  className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-black py-5 rounded-2xl text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>play_circle</span>
                  START SESSION
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* Behavioral Metrics Grid */}
      <ScrollReveal direction="up" delay={0.3}>
        <section className="grid grid-cols-2 gap-4">
          {/* Streak / Momentum */}
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md relative overflow-hidden group flex flex-col justify-between card-hover">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-9xl text-error" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
            </div>
            <div className="relative z-10 w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-sm" style={{fontVariationSettings: "'FILL' 1"}}>local_fire_department</span>
                  <h4 className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest">Momentum</h4>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">
                  <AnimatedCounter to={12} suffix=" Days" />
                </span>
              </div>
              
              {/* Visual 7-day Trailing Heatmap Inline */}
              <div className="flex items-center justify-between gap-1 w-full mt-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <div className={`w-3 h-8 rounded-full ${i === 6 ? 'bg-surface-container-highest border border-outline-variant/20 animate-pulse' : i === 2 ? 'bg-surface-container-highest border border-error/50' : 'bg-error shadow-[0_0_8px_rgba(255,80,80,0.4)]'}`}></div>
                    <span className={`text-[8px] font-bold ${i === 6 ? 'text-on-surface' : 'text-on-surface-variant/50'}`}>{day.charAt(0)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative z-10 mt-4 border-t border-outline-variant/10 pt-3 flex justify-between items-center">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Current Streak</p>
              <p className="text-sm font-headline font-black text-on-surface">
                <AnimatedCounter to={12} suffix=" Days" />
              </p>
            </div>
          </div>
          
          {/* Consistency */}
          <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/5 shadow-md flex flex-col justify-between card-hover">
            <h4 className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Consistency</h4>
            <div className="flex items-center gap-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="12"></circle>
                  <circle className="text-primary drop-shadow-[0_0_8px_rgba(255,94,0,0.4)]" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="30.1" strokeLinecap="round" strokeWidth="12" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-headline font-black text-on-surface">
                    <AnimatedCounter to={88} suffix="%" />
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-primary mb-1">Elite Tier</p>
                <p className="text-[9px] text-on-surface-variant uppercase">+5% / week</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Explore CTA - New Feature */}
      <ScrollReveal direction="up" delay={0.4}>
        <Link to="/member/muscle-select" className="block">
          <section className="bg-gradient-to-br from-surface-container to-surface-container-high rounded-2xl p-5 border border-primary/15 shadow-lg relative overflow-hidden group card-hover">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
              <span className="material-symbols-outlined text-[120px] text-primary" style={{fontVariationSettings: "'FILL' 1"}}>3d_rotation</span>
            </div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">explore</span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface text-sm">AI Muscle Targeting</h3>
                <p className="text-on-surface-variant text-xs mt-0.5">Select muscles on a 3D model → get a custom AI workout</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/50 group-hover:text-primary transition-colors">arrow_forward</span>
            </div>
          </section>
        </Link>
      </ScrollReveal>

    </div>
  )
}
