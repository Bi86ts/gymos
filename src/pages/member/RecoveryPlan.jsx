import { Link } from 'react-router-dom'

export default function RecoveryPlan() {
  return (
    <div className="min-h-screen bg-surface flex flex-col p-6 max-w-lg mx-auto pb-8 animate-in slide-in-from-bottom-6 duration-700">
      
      {/* Header */}
      <div className="pt-8 pb-12 flex justify-between items-center">
        <Link to="/member" className="text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined text-2xl">close</span>
        </Link>
        <span className="text-primary font-black tracking-widest uppercase text-[10px] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Recovery Protocol</span>
        <div className="w-8"></div>
      </div>

      <div className="space-y-8 flex-1">
        
        {/* Comeback Message */}
        <div className="bg-surface-container rounded-3xl p-6 border-l-4 border-primary shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-8xl text-primary" style={{fontVariationSettings: "'FILL' 1"}}>format_quote</span>
          </div>
          <div className="flex items-center gap-4 mb-4 relative z-10">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-surface-container object-cover shadow-[0_0_15px_rgba(205,255,24,0.3)]">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200&auto=format&fit=crop" alt="Trainer" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Message from</p>
              <p className="font-headline font-black text-on-surface leading-tight">Coach Sarah</p>
            </div>
          </div>
          <p className="text-on-surface italic text-lg leading-relaxed relative z-10 font-medium">
            "Hey Alex, I noticed you've missed a few sessions. Don't sweat it—life happens. Let's ease back into it today with a lighter load. Focus on form and moving blood."
          </p>
        </div>

        {/* Simplified Plan */}
        <div>
          <h2 className="text-2xl font-black font-headline text-on-surface uppercase italic mb-4">Re-Entry Plan</h2>
          
          <div className="space-y-4">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-primary-dim">directions_walk</span>
                <div>
                  <h4 className="font-bold text-on-surface text-lg">Zone 2 Cardio</h4>
                  <p className="text-xs text-on-surface-variant font-medium tracking-wide">20 mins • Low intensity</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">play_circle</span>
            </div>
            
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-secondary">accessibility_new</span>
                <div>
                  <h4 className="font-bold text-on-surface text-lg">Mobility Flow</h4>
                  <p className="text-xs text-on-surface-variant font-medium tracking-wide">15 mins • Dynamic stretch</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">play_circle</span>
            </div>

            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10 flex items-center justify-between group hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl text-primary font-light">fitness_center</span>
                <div>
                  <h4 className="font-bold text-on-surface text-lg">Light Isolations</h4>
                  <p className="text-xs text-on-surface-variant font-medium tracking-wide">3 Exercises • 2 Sets</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">play_circle</span>
            </div>
          </div>
        </div>

      </div>

      <div className="pt-6 border-t border-surface-container-highest mt-8">
        <button className="w-full bg-primary text-on-primary-fixed py-5 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(205,255,24,0.3)] flex items-center justify-center gap-3 tracking-widest uppercase">
          ACCEPT PROTOCOL
          <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
        </button>
      </div>
      
    </div>
  )
}
