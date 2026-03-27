import { Link } from 'react-router-dom'

export default function OnboardingComplete() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-surface">
        <div className="w-6"></div>
        <h1 className="font-headline font-bold tracking-tight text-xl uppercase text-primary">GymOS</h1>
        <div className="w-6"></div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        {/* Progress Complete */}
        <section className="w-full mb-12">
          <div className="flex justify-between items-end mb-4">
            <p className="font-label text-primary text-xs font-bold uppercase tracking-widest">Step 04 <span className="text-on-surface-variant font-medium">/ 04</span></p>
            <p className="font-headline text-on-surface-variant text-sm font-medium">Complete</p>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-primary to-primary-container rounded-full"></div>
          </div>
        </section>

        {/* Celebration */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-primary text-5xl" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight leading-none mb-4">You're <span className="text-primary italic">locked in.</span></h2>
          <p className="text-on-surface-variant text-lg max-w-md mx-auto">Your personalized training plan has been generated. Your first session starts now.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 w-full mb-12">
          <div className="bg-surface-container p-4 rounded-xl text-center">
            <span className="material-symbols-outlined text-primary mb-2">fitness_center</span>
            <p className="font-headline font-bold text-lg">Push/Pull</p>
            <p className="text-[10px] text-on-surface-variant uppercase">Program</p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl text-center">
            <span className="material-symbols-outlined text-secondary mb-2">calendar_month</span>
            <p className="font-headline font-bold text-lg">3 Days</p>
            <p className="text-[10px] text-on-surface-variant uppercase">Per Week</p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl text-center">
            <span className="material-symbols-outlined text-primary-dim mb-2">schedule</span>
            <p className="font-headline font-bold text-lg">75 min</p>
            <p className="text-[10px] text-on-surface-variant uppercase">Sessions</p>
          </div>
        </div>

        {/* Trainer Assignment */}
        <div className="w-full bg-surface-container-low p-6 rounded-xl border border-outline-variant/5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant">Your assigned trainer</p>
              <p className="font-headline font-bold text-lg">Coach Marcus</p>
            </div>
            <span className="ml-auto material-symbols-outlined text-primary">verified</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 p-6 flex items-center justify-center bg-surface/80 backdrop-blur-xl">
        <div className="max-w-2xl w-full flex flex-col gap-3">
          <Link
            to="/member"
            className="w-full py-5 px-8 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_4px_24px_rgba(243,255,202,0.2)]"
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            Enter The Forge
          </Link>
        </div>
      </div>
    </div>
  )
}
