import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GlowOrbs from '../components/effects/GlowOrbs'
import ScrollReveal from '../components/effects/ScrollReveal'
import AnimatedCounter from '../components/effects/AnimatedCounter'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

const FEATURES = [
  { icon: 'psychology', label: 'AI-Powered', desc: 'Gemini AI generates personalized workout plans tailored to your goals, level, and equipment' },
  { icon: 'monitoring', label: 'Churn Prediction', desc: 'ML-based member risk scoring identifies at-risk members before they leave' },
  { icon: 'diversity_3', label: 'Multi-Role', desc: 'One platform for members, trainers, and gym owners — each with purpose-built tools' },
  { icon: '3d_rotation', label: '3D Muscle Map', desc: 'Interactive anatomy model for precise muscle targeting and AI workout generation' },
  { icon: 'auto_graph', label: 'Real-Time Analytics', desc: 'Revenue tracking, retention dashboards, and renewal pipelines — live' },
  { icon: 'auto_awesome', label: '160+ Exercises', desc: 'Full exercise library with GIF demos, descriptions, and coaching instructions' },
]

const STATS = [
  { value: 160, suffix: '+', label: 'Exercises with GIFs' },
  { value: 8, suffix: '', label: 'Muscle Groups' },
  { value: 3, suffix: '', label: 'User Roles' },
  { value: 99, suffix: '%', label: 'Uptime' },
]

const ROLES = [
  {
    title: 'Member',
    tagline: 'Your personal fitness command center',
    icon: 'fitness_center',
    color: '#C8FF00',
    path: '/member',
    features: [
      'AI-powered workout generation',
      '3D muscle targeting with interactive model',
      'Exercise library with GIF demonstrations',
      'Weekly plans & streak tracking',
      'Trainer messaging & recovery tools',
    ],
  },
  {
    title: 'Trainer',
    tagline: 'Retention-driven coaching tools',
    icon: 'monitoring',
    color: '#00D4FF',
    path: '/trainer',
    features: [
      'At-risk member action queue',
      'Member directory with risk scores',
      'Schedule & session management',
      'One-tap outreach & messaging',
      'Client progress tracking',
    ],
  },
  {
    title: 'Owner',
    tagline: 'Business intelligence dashboard',
    icon: 'analytics',
    color: '#A855F7',
    path: '/owner',
    features: [
      'Real-time retention dashboard',
      'Churn risk list with AI scoring',
      'Renewal pipeline management',
      'Revenue analytics & forecasting',
      'Promotional offer engine',
    ],
  },
]

const HOW_IT_WORKS = [
  { step: '01', icon: 'person_add', title: 'Sign Up', desc: 'Create your profile, set your goals, and choose your equipment' },
  { step: '02', icon: 'touch_app', title: 'Select Muscles', desc: 'Use the 3D anatomy model or buttons to pick target muscle groups' },
  { step: '03', icon: 'bolt', title: 'AI Generates Plan', desc: 'Gemini AI creates a personalized workout with perfect exercise matching' },
  { step: '04', icon: 'play_circle', title: 'Train & Track', desc: 'Follow your plan with GIF demos, log progress, build streaks' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface overflow-hidden">

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            <span className="font-headline text-xl font-black text-primary uppercase italic tracking-tight">GYMOS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Features</a>
            <a href="#roles" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">Roles</a>
            <a href="#how-it-works" className="text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors">How It Works</a>
          </div>
          <Link
            to="/onboarding"
            className="bg-primary hover:bg-primary-dim text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <GlowOrbs variant="hero" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">AI-Powered Gym Operating System</span>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal direction="up" delay={0.1}>
            <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-black uppercase italic leading-[0.9] tracking-tight mb-6">
              <span className="text-on-surface">Predict.</span><br />
              <span className="text-primary">Retain.</span><br />
              <span className="text-on-surface">Grow.</span>
            </h1>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal direction="up" delay={0.2}>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              GymOS is the complete operating system for modern gyms. AI-powered workouts for <span className="text-on-surface font-bold">members</span>, retention tools for <span className="text-on-surface font-bold">trainers</span>, and business intelligence for <span className="text-on-surface font-bold">owners</span>.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dim text-white font-black uppercase tracking-wider px-8 py-4 rounded-2xl text-sm shadow-2xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
                Start Free
              </Link>
              <a
                href="#roles"
                className="w-full sm:w-auto bg-surface-container hover:bg-surface-container-high border border-outline-variant/20 text-on-surface font-bold uppercase tracking-wider px-8 py-4 rounded-2xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">arrow_downward</span>
                Explore Roles
              </a>
            </div>
          </ScrollReveal>

          {/* Stats bar */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto bg-surface-container/50 backdrop-blur-md rounded-2xl border border-outline-variant/10 p-6">
              {STATS.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-headline text-3xl font-black text-primary">
                    <AnimatedCounter to={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <span className="material-symbols-outlined text-on-surface-variant/30 text-2xl">expand_more</span>
        </div>
      </section>

      {/* ═══════════════════ FEATURES GRID ═══════════════════ */}
      <section id="features" className="relative py-24 px-6">
        <GlowOrbs variant="section" />
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 inline-block">Platform Features</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface uppercase italic">Everything You Need</h2>
              <p className="text-on-surface-variant mt-4 max-w-lg mx-auto">One platform replacing five — workouts, retention, analytics, messaging, and scheduling.</p>
            </div>
          </ScrollReveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="bg-surface-container rounded-2xl p-6 border border-outline-variant/10 hover:border-primary/20 transition-all group card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>{f.icon}</span>
                </div>
                <h3 className="font-headline font-bold text-on-surface text-lg mb-2">{f.label}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 3 ROLES ═══════════════════ */}
      <section id="roles" className="relative py-24 px-6">
        <GlowOrbs variant="subtle" />
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 inline-block">Built For Everyone</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface uppercase italic">Three Roles, One Platform</h2>
              <p className="text-on-surface-variant mt-4 max-w-lg mx-auto">Purpose-built experiences for every person in your gym.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ROLES.map((role, i) => (
              <ScrollReveal key={role.title} direction="up" delay={i * 0.12}>
                <Link
                  to={role.path}
                  className="group block bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-primary/20 overflow-hidden transition-all card-hover h-full"
                >
                  {/* Color accent bar */}
                  <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${role.color}, ${role.color}60)` }} />

                  <div className="p-6 md:p-8">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}15` }}>
                        <span className="material-symbols-outlined text-xl" style={{ color: role.color, fontVariationSettings: "'FILL' 1" }}>{role.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-headline text-2xl font-black text-on-surface uppercase">{role.title}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{role.tagline}</p>
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="space-y-3 mb-6">
                      {role.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-sm mt-0.5 shrink-0" style={{ color: role.color, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          <span className="text-on-surface-variant text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all" style={{ color: role.color }}>
                      <span>Enter as {role.title}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 inline-block">Getting Started</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black text-on-surface uppercase italic">How It Works</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.1}>
                <div className="relative bg-surface-container rounded-2xl p-6 border border-outline-variant/10 text-center group card-hover">
                  {/* Step number */}
                  <span className="text-6xl font-black text-primary/10 font-headline absolute top-3 right-4">{step.step}</span>
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary text-xl" style={{fontVariationSettings: "'FILL' 1"}}>{step.icon}</span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface text-lg mb-2">{step.title}</h3>
                    <p className="text-on-surface-variant text-sm">{step.desc}</p>
                  </div>
                  {/* Connector line (hidden on last) */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-primary/20" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="relative py-24 px-6">
        <GlowOrbs variant="hero" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <ScrollReveal direction="up">
            <h2 className="font-headline text-4xl md:text-6xl font-black text-on-surface uppercase italic leading-tight mb-6">
              Ready to<br /><span className="text-primary">Transform</span> Your Gym?
            </h2>
            <p className="text-on-surface-variant text-lg mb-10 max-w-md mx-auto">
              Join the future of gym management. Start with any role — free, no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/onboarding"
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-dim text-white font-black uppercase tracking-wider px-10 py-5 rounded-2xl text-base shadow-2xl shadow-primary/30 hover:shadow-primary/50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>rocket_launch</span>
                Start Free Now
              </Link>
            </div>

            {/* Quick role links */}
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {ROLES.map(r => (
                <Link
                  key={r.title}
                  to={r.path}
                  className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors text-sm font-bold"
                >
                  <span className="material-symbols-outlined text-sm" style={{ color: r.color, fontVariationSettings: "'FILL' 1" }}>{r.icon}</span>
                  {r.title}
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-outline-variant/10 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
            <span className="font-headline font-black text-primary uppercase italic text-sm">GYMOS</span>
            <span className="text-on-surface-variant/30 text-xs ml-2">by Kinetic Forge</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/member" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Member</Link>
            <Link to="/trainer" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Trainer</Link>
            <Link to="/owner" className="text-on-surface-variant text-xs hover:text-primary transition-colors">Owner</Link>
          </div>
          <p className="text-on-surface-variant/30 text-xs">© 2026 Kinetic Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
