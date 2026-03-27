import { useState } from 'react'
import { Link } from 'react-router-dom'

const levels = [
  { id: 'beginner', title: 'Beginner', desc: 'New to fitness or returning after a long break. We\'ll start slow and build your foundation.', icon: 'emoji_nature', months: '0-6 months' },
  { id: 'intermediate', title: 'Intermediate', desc: 'You workout regularly and know the basics. Time to optimize and push boundaries.', icon: 'speed', months: '6-24 months' },
  { id: 'advanced', title: 'Advanced', desc: 'Experienced lifter with solid form. Ready for periodized, high-volume programming.', icon: 'military_tech', months: '2+ years' },
]

export default function FitnessLevel() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-surface">
        <Link to="/member/onboarding/goals" className="material-symbols-outlined text-primary active:scale-95 duration-150">arrow_back</Link>
        <h1 className="font-headline font-bold tracking-tight text-xl uppercase text-primary">GymOS</h1>
        <div className="w-6"></div>
      </header>
      <div className="fixed top-[60px] left-0 bg-surface-container-low h-1.5 w-full z-40"></div>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col">
        <section className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <p className="font-label text-primary text-xs font-bold uppercase tracking-widest">Step 02 <span className="text-on-surface-variant font-medium">/ 04</span></p>
            <p className="font-headline text-on-surface-variant text-sm font-medium">Fitness Assessment</p>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full w-2/4 bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"></div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">What's your current <span className="text-primary italic">fitness level?</span></h2>
          <p className="text-on-surface-variant text-lg">Be honest — this helps us calibrate your starting intensity perfectly.</p>
        </section>

        <div className="space-y-4">
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelected(level.id)}
              className={`w-full group relative flex items-start gap-5 p-6 transition-all duration-300 rounded-xl text-left border overflow-hidden active:scale-[0.99] ${
                selected === level.id
                  ? 'bg-surface-container-highest border-primary/30 ring-2 ring-primary/20'
                  : 'bg-surface-container border-outline-variant/10 hover:bg-surface-container-highest'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected === level.id ? 'bg-primary' : 'bg-primary/10'}`}>
                <span className={`material-symbols-outlined text-2xl ${selected === level.id ? 'text-on-primary-fixed' : 'text-primary'}`} style={{fontVariationSettings: "'FILL' 1"}}>{level.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-headline text-xl font-bold">{level.title}</h3>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container-highest px-2 py-1 rounded">{level.months}</span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">{level.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 p-6 flex items-center justify-center bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl w-full">
          <Link
            to="/member/onboarding/schedule"
            className={`w-full py-5 px-8 rounded-full font-headline font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_24px_rgba(243,255,202,0.2)] ${
              selected ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Continue
            <span className="material-symbols-outlined">trending_flat</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
